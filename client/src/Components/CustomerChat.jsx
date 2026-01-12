import { useEffect, useState, useRef, useContext } from "react";
import { MyContext } from "../App";
import io from "socket.io-client";

const SOCKET_URL = "https://api.goroabazar.com"; // তোমার সার্ভারের URL
let socket;

export default function CustomerChat({ user }) {
  const context = useContext(MyContext);

  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const messagesEndRef = useRef(null);
  const chatBoxRef = useRef(null);
  const notifyAudioRef = useRef(null);
  const audioRefs = useRef({});

  const token = localStorage.getItem("accesstoken");

  const PRIMARY = "#25D366";
  const HEADER = "#075E54";
  const DEMO_USER_IMAGE = "https://i.pravatar.cc/40";
  const DEMO_ADMIN_IMAGE =
    "https://cdn-icons-png.flaticon.com/512/1995/1995550.png";

  /* ================== SOCKET SETUP ================== */
  useEffect(() => {
    if (!user?._id) return;

    socket = io(SOCKET_URL);

    // join customer room
    socket.emit("join", user._id);

    // listen for new messages
    socket.on("newMessage", (chat) => {
      setMessages((prev) => [...prev, chat]);
      if (chat.from === "admin") notifyAudioRef.current?.play();
    });

    return () => {
      socket.disconnect();
    };
  }, [user?._id]);

  /* ================== FETCH INITIAL MESSAGES ================== */
  useEffect(() => {
    if (!user?._id || !open) return;

    const fetchChats = async () => {
      const res = await fetch(`https://api.goroabazar.com/chat/customer/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data?.success) setMessages(data.chats || []);
    };

    fetchChats();
  }, [user?._id, open, token]);

  /* ================== AUTO SCROLL ================== */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================== OPEN CHAT ================== */
  const handleOpenChat = () => {
    if (!user?._id || !token) {
      context.openAlertBox("error", "চ্যাট করতে হলে আগে লগইন করুন");
      context.setOpenLoginPanel(true);
      return;
    }
    setOpen(true);
    setHasUnread(false);
  };

  /* ================== SEND TEXT ================== */
  const sendText = () => {
    if (!msg.trim()) return;

    const chatData = {
      customerId: user._id,
      customerName: user.name,
      mobile: user.mobile,
      from: "customer",
      type: "text",
      message: msg,
    };

    // send to socket
    socket.emit("sendMessage", chatData);

    setMessages((prev) => [...prev]);
    setMsg("");
  };

  /* ================== AUDIO RECORDING ================== */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          const chatData = {
            customerId: user._id,
            customerName: user.name,
            mobile: user.mobile,
            from: "customer",
            type: "audio",
            audio: reader.result,
          };
          socket.emit("sendMessage", chatData);
          setMessages((prev) => [...prev]);
        };
        reader.readAsDataURL(blob);
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic error:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  /* ================== CLOSE CHAT ON OUTSIDE CLICK ================== */
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

  /* ================== FORMAT DATETIME ================== */
  const formatDateTime = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  return (
    <>
      <audio ref={notifyAudioRef} src="/notification.mp3" />

      {/* Floating Button */}
      {(hasUnread || !open) && (
        <button
          onClick={handleOpenChat}
          className="fixed bottom-16 right-5 w-16 h-16 rounded-full text-white text-3xl shadow-lg z-[100]
          flex items-center justify-center active:scale-95"
          style={{ backgroundColor: PRIMARY }}
        >
          💬
        </button>
      )}

      {/* CHAT BOX */}
      {open && (
        <div
          ref={chatBoxRef}
          className="fixed bottom-16 right-5 w-[90vw] max-w-[380px] h-[70vh]
          bg-white shadow-xl rounded-xl flex flex-col z-[100]"
        >
          {/* HEADER */}
          <div
            className="p-3 flex justify-between items-center text-white text-sm font-semibold"
            style={{ backgroundColor: HEADER }}
          >
            <span>Live Chat Support</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 p-3 overflow-y-auto bg-[#ECE5DD] space-y-3">
            {messages.map((m, idx) => {
              const isMe = m.from === "customer";
              return (
                <div
                  key={idx}
                  className={`flex gap-2 ${isMe ? "justify-end" : "justify-start"}`}
                >
                  {!isMe && (
                    <img src={DEMO_ADMIN_IMAGE} className="w-8 h-8 rounded-full" />
                  )}

                  <div className="max-w-[70%] flex flex-col gap-1">
                    {m.type === "text" ? (
                      <div
                        className={`px-3 py-2 rounded-lg text-sm ${
                          isMe
                            ? "text-white rounded-br-none"
                            : "bg-white border rounded-bl-none"
                        }`}
                        style={isMe ? { backgroundColor: PRIMARY } : {}}
                      >
                        {m.message}
                      </div>
                    ) : (
                      <audio
                        ref={(el) => (audioRefs.current[idx] = el) }
                        src={m.audio}
                        controls
                        
                      />
                    )}
                    <div className="flex justify-between items-center text-[11px] text-gray-500 !mb-3">
                      <span>{formatDateTime(m.createdAt || new Date())}</span>
                    </div>
                  </div>

                  {isMe && (
                    <img
                      src={user?.avatar || DEMO_USER_IMAGE}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
         <div className="flex flex md:flex-row gap-2 !mt-2">
              <input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendText()}
                placeholder="Type a message"
                className="flex-1 px-4 py-2 rounded-full border w-[56%]"
              />
              <div className="flex  gap-2">
                <button
  onMouseDown={(e) => {
    e.preventDefault();      // input focus আটকাবে
    e.stopPropagation();
  }}
  onTouchStart={(e) => {
    e.preventDefault();      // mobile keyboard / text select আটকাবে
    e.stopPropagation();
  }}
  onClick={sendText}         // আসল কাজ এখানেই হবে
  className="px-4 py-2 rounded-full text-white bg-green-500 active:scale-95"
>
  Send
</button>

              <button
  onMouseDown={(e) => {
    e.preventDefault(); // prevent text input selection
    e.stopPropagation(); // stop event bubbling
    startRecording();
  }}
  onMouseUp={(e) => {
    e.preventDefault();
    e.stopPropagation();
    stopRecording();
  }}
  onTouchStart={(e) => {
    e.preventDefault();
    e.stopPropagation();
    startRecording();
  }}
  onTouchEnd={(e) => {
    e.preventDefault();
    e.stopPropagation();
    stopRecording();
  }}
  className={`w-10 h-10 rounded-full text-white ${
    isRecording ? "bg-red-500" : "bg-green-500"
  }`}
>
  🎤
</button>

              </div>
            </div>

          <div className="text-[9px] p-2 text-right text-gray-400 ">
            Powered by Enabazar
          </div>
        </div>
      )}
    </>
  );
}
