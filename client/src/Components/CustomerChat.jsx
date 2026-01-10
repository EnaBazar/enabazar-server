import { useEffect, useState, useRef, useContext } from "react";
import { fetchDataFromApi, postData } from "../utils/api";
import { MyContext } from "../App";

export default function CustomerChat({ user }) {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);

  const context = useContext(MyContext);

  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  const chatBoxRef = useRef(null);

  const PRIMARY = "#FC8934";
  const WHATSAPP_GREEN = "#25D366";

  const token = localStorage.getItem("accesstoken");

  /* ---------------- OPEN CHAT ---------------- */
  const handleOpenChat = () => {
    if (!user || !user._id) {
      context.openAlertBox("error", "চ্যাট করতে হলে আগে লগইন করুন");
      window.location.href = "/login";
      return;
    }
    setOpen(true);
  };

  /* ---------------- CLICK OUTSIDE TO CLOSE ---------------- */
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (chatBoxRef.current && !chatBoxRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [open]);

  /* ---------------- FETCH CHATS ---------------- */
  useEffect(() => {
    if (!open || !user?._id) return;

    const fetchChats = async () => {
      try {
        const res = await fetchDataFromApi(`/chat/customer/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.success) setMessages(res.chats || []);
      } catch (err) {
        console.error("Chat fetch error:", err);
      }
    };

    fetchChats();
    const interval = setInterval(fetchChats, 2000);
    return () => clearInterval(interval);
  }, [open, user?._id]);

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------------- NOTIFICATION SOUND ---------------- */
  useEffect(() => {
    if (!messages.length) return;
    const last = messages[messages.length - 1];
    if (last.from === "admin") {
      audioRef.current?.play();
    }
  }, [messages]);

  /* ---------------- MARK AS READ ---------------- */
  useEffect(() => {
    if (!open || !messages.length || !user?._id) return;

    const markRead = async () => {
      try {
        await fetch(`https://api.goroabazar.com/chat/read/${user._id}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reader: "customer" }),
        });
      } catch (err) {
        console.error("Read error:", err);
      }
    };

    markRead();
  }, [open, messages.length, user?._id]);

  /* ---------------- SEND MESSAGE ---------------- */
  const sendMessage = async () => {
    if (!msg.trim() || !user?._id) return;

    try {
      const res = await postData(
        `/chat/send`,
        {
          customerId: user._id,
          customerName: user.name,
          from: "customer",
          message: msg,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.success) setMsg("");
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/notification.mp3" />

      {/* Floating Button */}
      <button
        onClick={handleOpenChat}
        className="fixed bottom-16 right-5 w-14 h-14 rounded-full text-white text-[26px] shadow-lg z-[100]
        flex items-center justify-center active:scale-95 transition"
        style={{ backgroundColor: PRIMARY }}
      >
        💬
      </button>

      {/* CHAT BOX */}
      {open && (
        <div
          ref={chatBoxRef}
          className="fixed bottom-28 right-5 w-[90vw] max-w-[400px] h-[45vh]
          sm:w-80 sm:h-[480px] bg-white shadow-xl rounded-xl flex flex-col z-[100] border"
        >
          {/* Header */}
          <div
            className="p-3 text-white flex justify-between items-center rounded-t-xl"
            style={{ backgroundColor: PRIMARY }}
          >
            <span className="font-semibold text-sm">
              যে কোন প্রয়োজনে চ্যাট করুন!
            </span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-[#FFF7F2]">
            {messages.map((m) => (
              <div
                key={m._id}
                className={m.from === "customer" ? "text-right" : "text-left"}
              >
                <span
                  className={`inline-block px-3 py-2 rounded-lg max-w-[75%] break-words text-sm
                  ${
                    m.from === "customer"
                      ? "text-white rounded-br-none"
                      : "bg-white text-gray-800 border rounded-bl-none"
                  }`}
                  style={
                    m.from === "customer"
                      ? { backgroundColor: PRIMARY }
                      : {}
                  }
                >
                  {m.message}
                </span>

                <div className="text-[10px] text-gray-500 mb-2">
                  {new Date(m.createdAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-2 border-t flex gap-2 bg-white">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-[#25D366]"
            />
            <button
              onClick={sendMessage}
              className="text-white px-4 py-2 rounded-lg text-sm
              hover:opacity-90 active:scale-95 transition"
              style={{ backgroundColor: WHATSAPP_GREEN }}
            >
              Send
            </button>
          </div>

          <span className="text-[9px] p-2 text-end text-gray-500">
            Powered by Enabazar's
          </span>
        </div>
      )}
    </>
  );
}
