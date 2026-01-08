import { useEffect, useState, useRef } from "react";

export default function CustomerChat({ user, adminName = "Support" }) {
  if (!user || !user._id) return null;

  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);
  const [lastMsgCount, setLastMsgCount] = useState(0);

  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);

  const PRIMARY = "#FC8934"; // Theme color

  // 🔁 Fetch + Polling
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch(
          `https://api.goroabazar.com/chat/customer/${user._id}`
        );
        const data = await res.json();
        if (data.success) {
          // নতুন মেসেজে অডিও
          if (data.chats.length > lastMsgCount) {
            audioRef.current?.play().catch(() => {});
            setLastMsgCount(data.chats.length);
          }
          setMessages(data.chats || []);
        }
      } catch (err) {
        console.error("Chat fetch error:", err);
      }
    };

    fetchChats();
    const interval = setInterval(fetchChats, 2000);
    return () => clearInterval(interval);
  }, [user._id, lastMsgCount]);

  // ⬇️ Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 👁️ Mark as read
  useEffect(() => {
    if (messages.length === 0) return;

    fetch(`https://api.goroabazar.com/chat/read/${user._id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reader: "customer" })
    });
  }, [messages.length, user._id]);

  // ✉️ Send message
  const sendMessage = async () => {
    if (!msg.trim()) return;

    try {
      await fetch("https://api.goroabazar.com/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: user._id,
          customerName: user.name,
          from: "customer",
          message: msg
        })
      });
      setMsg("");
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  // ✅ Format date to "Today / Yesterday / MMM D, YYYY, HH:MM AM/PM"
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const time = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });

    if (isToday) return `Today, ${time}`;
    if (isYesterday) return `Yesterday, ${time}`;

    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  return (
    <>
      <audio ref={audioRef} src="/notification.mp3" />

      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-18 right-5 w-14 h-14 rounded-full text-white shadow-lg !z-100"
        style={{ backgroundColor: PRIMARY }}
      >
        💬
      </button>

      {open && (
        <div className="fixed bottom-32 right-5 w-80 h-[500px] bg-white shadow-xl rounded-xl flex flex-col !z-100 border">

          {/* Header with Admin Name */}
          <div
            className="p-3 text-white flex justify-between items-center rounded-t-xl"
            style={{ backgroundColor: PRIMARY }}
          >
            <span className="font-semibold">{adminName}</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-100">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${
                  m.from === "customer" ? "items-end" : "items-start"
                }`}
              >
                {/* Message bubble */}
                <div
                  className={`px-4 py-2 rounded-lg max-w-[75%] break-words ${
                    m.from === "customer"
                      ? "text-white rounded-br-none"
                      : "bg-white text-gray-800 border rounded-bl-none"
                  }`}
                  style={m.from === "customer" ? { backgroundColor: PRIMARY } : {}}
                >
                  {m.message}
                </div>

                {/* Time */}
                <span className="text-xs text-gray-500 mt-1">
                  {formatDate(m.createdAt)}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2 bg-white">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2"
              style={{ focusRingColor: PRIMARY }}
            />
            <button
              onClick={sendMessage}
              className="text-white px-4 rounded-full"
              style={{ backgroundColor: PRIMARY }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
