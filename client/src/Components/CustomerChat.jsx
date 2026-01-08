import { useEffect, useState, useRef } from "react";

export default function CustomerChat({ user }) {
  // 🔐 user না থাকলে কিছুই render হবে না
  if (!user || !user._id) return null;

  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);

  // ✅ Fetch + Polling (every 2s)
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch(
          `https://api.goroabazar.com/chat/customer/${user._id}`
        );
        const data = await res.json();

        if (data.success) {
          setMessages(data.chats || []);
        }
      } catch (err) {
        console.error("Chat fetch error:", err);
      }
    };

    fetchChats();
    const interval = setInterval(fetchChats, 2000);

    return () => clearInterval(interval);
  }, [user._id]);

  // ✅ Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Mark messages as read
  useEffect(() => {
    if (messages.length === 0) return;

    fetch(`https://api.goroabazar.com/chat/read/${user._id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reader: "customer" })
    });
  }, [messages.length, user._id]);

  // ✅ Send message
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
      console.error("Send message error:", err);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/notification.mp3" />

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-18 right-5 w-14 h-14 rounded-full bg-green-600 text-white"
      >
        💬
      </button>

      {open && (
        <div className="fixed bottom-33 right-5 w-80 h-96 bg-white shadow-lg rounded-lg flex flex-col z-50">
          {/* Header */}
          <div className="bg-green-600 text-white p-2 flex justify-between">
            <span>Live Chat</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-2 overflow-y-auto space-y-1">
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.from === "customer" ? "text-right" : "text-left"}
              >
                <span className="inline-block bg-gray-200 px-2 py-1 rounded">
                  {m.message}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-2 flex gap-2 border-t">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              className="flex-1 border rounded px-2"
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-green-600 text-white px-3 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
