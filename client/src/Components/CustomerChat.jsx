import { useEffect, useState, useRef } from "react";

export default function CustomerChat({ user }) {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);

  // Polling every 2s
  useEffect(() => {
    const fetchChats = async () => {
      const res = await fetch(`http://localhost:5000/chat/customer/${user._id}`);
      const data = await res.json();
      if (data.success) {
        if (messages.length < data.chats.length) audioRef.current.play();
        setMessages(data.chats);
      }
    };
    fetchChats();
    const interval = setInterval(fetchChats, 2000);
    return () => clearInterval(interval);
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!msg.trim()) return;
    await fetch("http://localhost:5000/chat/send", {
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
        <div className="fixed bottom-33 right-5 w-80 h-96 bg-white shadow-lg rounded-lg flex flex-col z-100">
          <div className="bg-green-600 text-white p-2 flex justify-between">
            <span>Live Chat</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="flex-1 p-2 overflow-y-auto">
            {messages.map((m, i) => (
              <div key={i} className={m.from === "customer" ? "text-right" : "text-left"}>
                <span className="bg-gray-200 px-2 py-1 rounded">{m.message}</span>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>
          <div className="p-2 flex gap-2 border-t">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              className="flex-1 border rounded px-2"
              placeholder="Type a message..."
            />
            <button onClick={sendMessage} className="bg-green-600 text-white px-3 rounded">
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
