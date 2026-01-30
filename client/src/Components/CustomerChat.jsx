import { useEffect, useState, useRef, useContext } from "react";
import { MyContext } from "../App";
import io from "socket.io-client";

const SOCKET_URL = "https://api.goroabazar.com";
let socket;

export default function CustomerChat({ user }) {
  const context = useContext(MyContext);

  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(0);
  const [chatHeight, setChatHeight] = useState(window.innerHeight * 0.8);

  const messagesEndRef = useRef(null);
  const chatBoxRef = useRef(null);

  const token = localStorage.getItem("accesstoken");

  const PRIMARY = "#FC8934";
  const DEMO_USER_IMAGE = "https://i.pravatar.cc/40";
  const DEMO_ADMIN_IMAGE =
    "https://cdn-icons-png.flaticon.com/512/1995/1995550.png";

  /* ================= SOCKET SETUP ================= */
  useEffect(() => {
    if (!user?._id) return;

    socket = io(SOCKET_URL);
    socket.emit("join", user._id);

    socket.on("newMessage", (chat) => {
      setMessages((prev) => [...prev, chat]);
      if (!open) setHasUnread((prev) => prev + 1);
      scrollToBottom();
    });

    return () => socket.disconnect();
  }, [user?._id, open]);

  /* ================= FETCH INITIAL CHATS ================= */
  useEffect(() => {
    if (!user?._id || !open) return;

    const fetchChats = async () => {
      const res = await fetch(
        `https://api.goroabazar.com/chat/customer/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data?.success) setMessages(data.chats || []);
      scrollToBottom();
    };

    fetchChats();
  }, [user?._id, open, token]);

  /* ================= SCROLL TO BOTTOM ================= */
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  /* ================= OPEN CHAT ================= */
  const handleOpenChat = () => {
    if (!user?._id || !token) {
      context.openAlertBox("error", "চ্যাট করতে হলে আগে লগইন করুন");
      context.setOpenLoginPanel(true);
      return;
    }
    setOpen(true);
    setHasUnread(0);
  };

  /* ================= SEND TEXT ================= */
  const sendText = () => {
    if (!msg.trim()) return;

    const chatData = {
      customerId: user._id,
      customerName: user.name,
      mobile: user.mobile,
      from: "customer",
      type: "text",
      message: msg,
      createdAt: new Date(),
    };

    socket.emit("sendMessage", chatData);
    setMessages((prev) => [...prev, chatData]);
    setMsg("");
    scrollToBottom();
  };

  /* ================= CLOSE CHAT ON OUTSIDE CLICK ================= */
  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (e) => {
      if (chatBoxRef.current && !chatBoxRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [open]);

  /* ================= MOBILE KEYBOARD ADJUST ================= */
  useEffect(() => {
    const adjustHeight = () => {
      const vh = window.visualViewport?.height || window.innerHeight;
      setChatHeight(vh * 0.8);
      scrollToBottom();
    };

    window.visualViewport?.addEventListener("resize", adjustHeight);
    window.addEventListener("resize", adjustHeight);

    return () => {
      window.visualViewport?.removeEventListener("resize", adjustHeight);
      window.removeEventListener("resize", adjustHeight);
    };
  }, []);

  /* ================= FORMAT DATE + TIME ================= */
  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  /* ================= GROUP MESSAGES BY DATE ================= */
  const groupedMessages = messages.reduce((acc, msg) => {
    const date = formatDate(msg.createdAt || new Date());
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});

  const dates = Object.keys(groupedMessages).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  /* ================= EMOJI DETECTION ================= */
  const isOnlyEmoji = (text) => /^\p{Emoji}+$/u.test(text.trim());

  return (
    <>
      {/* Floating Button */}
    {/* Floating Button */}
<button
  onClick={handleOpenChat}
  className="fixed bottom-16 right-5 w-16 h-16 rounded-full text-white text-3xl shadow-lg z-[100] flex items-center justify-center active:scale-95 "
  style={{ backgroundColor: PRIMARY, position: "fixed" }}
>
  💬
  {hasUnread > 0 && (
    <span
      className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2
                 bg-red-500 text-white text-[12px] font-bold w-5 h-5 rounded-full 
                 flex items-center justify-center z-[120]"
    >
      {hasUnread}
    </span>
  )}
</button>

{/* Chat Box */}
 {open && (
        <div
          ref={chatBoxRef}
          className="fixed bottom-16 right-5 w-[90vw] max-w-[380px] bg-white shadow-xl rounded-xl flex flex-col !z-[100]"
          style={{ height: `${chatHeight}px` }}
        >
          {/* HEADER */}
          <div
            className="p-3 flex justify-between items-center text-white text-sm font-semibold"
            style={{ backgroundColor: PRIMARY }}
          >
            <span>Live Chat Support</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 p-3 overflow-y-auto bg-[#ECE5DD] space-y-3">
            {dates.map((date) => (
              <div key={date}>
                <div className="flex justify-center my-2">
                  <span className="text-[11px] text-white bg-gray-500 px-2 py-1 rounded-md">
                    {date}
                  </span>
                </div>

                {groupedMessages[date].map((m, idx) => {
                  const isMe = m.from === "customer";
                  const onlyEmoji = isOnlyEmoji(m.message);

                  return (
                    <div
                      key={idx}
                      className={`flex gap-2 ${
                        isMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isMe && (
                        <img
                          src={DEMO_ADMIN_IMAGE}
                          className="w-6 h-6 rounded-full"
                        />
                      )}

                      <div className="max-w-[70%] flex flex-col gap-1 !mb-2">
                        <div
                          className={`px-3 py-0 rounded-lg text-[11px] ${
                            isMe
                              ? "text-white rounded-br-none"
                              : "rounded-bl-none"
                          }`}
                          style={
                            onlyEmoji
                              ? { backgroundColor: "transparent",
                                 padding: "0" ,
                                  fontSize: "2.5rem", // emoji বড় করা
                                   lineHeight: "1", // compact spacing
                                
                                }
                              : isMe
                              ? { backgroundColor: PRIMARY }
                              : { backgroundColor: "#d1d5db" } // gray-300
                          }
                        >
                          {m.message}
                        </div>

                        <span className="text-[10px] text-gray-500 self-end">
                          {formatTime(m.createdAt || new Date())}
                        </span>
                      </div>

                      {isMe && (
                        <img
                          src={user?.avatar || DEMO_USER_IMAGE}
                          className="w-6 h-6 rounded-full"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div className="p-2 flex gap-2">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendText()}
              onFocus={() =>
                setTimeout(() => {
                  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                }, 300)
              }
              placeholder="Type a message"
              className="flex-1 px-4 py-2 rounded-full border"
            />

            <button
              onClick={sendText}
              className="px-4 py-2 rounded-full text-white active:scale-95"
              style={{ backgroundColor: PRIMARY }}
            >
              Send
            </button>
          </div>

          <div className="text-[9px] p-2 text-right text-gray-400">
            Powered by Enabazar
          </div>
        </div>
 )}
        </>
      );
      }