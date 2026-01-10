import { useEffect, useState, useRef, useContext } from "react";
import { fetchDataFromApi, postData } from "../utils/api";
import { MyContext } from "../App";

export default function CustomerChat({ user }) {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);
  const [chatHeight, setChatHeight] = useState(window.innerHeight * 0.8);
  const context = useContext(MyContext);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);

  const PRIMARY = "#FC8934";
  const token = localStorage.getItem("accesstoken");

  const handleOpenChat = () => {
    if (!user || !user._id) {
      context.openAlertBox("error", "চ্যাট করতে হলে আগে লগইন করুন");
      window.location.href = "/login";
      return;
    }
    setOpen((prev) => !prev);
  };

  // Adjust chat height on mobile keyboard open
  useEffect(() => {
    const handleResize = () => {
      setChatHeight(window.innerHeight * 0.8); // 80% of visible viewport
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch chats
  useEffect(() => {
    if (!open || !user?._id) return;
    const fetchChats = async () => {
      if (!user?._id || !token) return;
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

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Notification sound
  useEffect(() => {
    if (!messages.length) return;
    const last = messages[messages.length - 1];
    if (last.from === "admin") audioRef.current?.play();
  }, [messages]);

  // Mark as read
  useEffect(() => {
    if (!open || !messages.length || !user?._id) return;
    const markRead = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;
        await fetch(`https://api.goroabazar.com/chat/read/${user._id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ reader: "customer" }),
        });
      } catch (err) {
        console.error("Mark as read error:", err);
      }
    };
    markRead();
  }, [open, messages.length, user?._id]);

  // Send message
  const sendMessage = async () => {
    if (!msg.trim() || !user?._id || !token) return;
    try {
      const res = await postData(
        `/chat/send`,
        { customerId: user._id, customerName: user.name, from: "customer", message: msg },
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
        className="fixed bottom-16 right-5 w-14 h-14 rounded-full text-white text-[28px] shadow-lg z-[100] flex items-center justify-center sm:w-16 sm:h-16 md:w-20 md:h-20"
        style={{ backgroundColor: PRIMARY }}
      >
        💬
      </button>

      {open && user?._id && (
        <div
          className="fixed bottom-0 right-0 w-[90vw] max-w-[400px] bg-white shadow-xl rounded-t-xl flex flex-col z-[100] border"
          style={{ height: chatHeight }}
        >
          {/* Header */}
          <div
            className="p-3 text-white flex justify-between items-center"
            style={{ backgroundColor: PRIMARY }}
          >
            <span className="font-semibold text-sm sm:text-base">যে কোন প্রয়োজনে চ্যাট করুন!</span>
            <button onClick={() => setOpen(false)} className="text-lg sm:text-xl">✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-[#FFF7F2]">
            {messages.map((m) => (
              <div key={m._id} className={m.from === "customer" ? "text-right" : "text-left"}>
                <span
                  className={`inline-block px-3 py-2 rounded-lg max-w-[75%] break-words text-sm sm:text-base ${
                    m.from === "customer" ? "text-white rounded-br-none" : "bg-white text-gray-800 border rounded-bl-none"
                  }`}
                  style={m.from === "customer" ? { backgroundColor: PRIMARY } : {}}
                >
                  {m.message}
                </span>
                <div className="text-[10px] sm:text-xs text-gray-500 !mb-3">
                  {new Date(m.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
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
          <div className="p-2 sm:p-3 border-t flex gap-2 bg-white">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#FC8934]"
            />
            <button
              onClick={sendMessage}
              className="text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base"
              style={{ backgroundColor: PRIMARY }}
            >
              Send
            </button>
          </div>

          <span className="text-[8px] sm:text-[9px] p-2 !mb-1 text-end">
            Power By Enabazar's
          </span>
        </div>
      )}
    </>
  );
}
