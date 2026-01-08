import { useEffect, useState, useRef } from "react";

export default function CustomerChat({ user, adminName = "Support" }) {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);
  const [lastMsgCount, setLastMsgCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);

  const PRIMARY = "#FC8934"; // Theme color
  const API = import.meta.env.VITE_API_URL;

  if (!user || !user._id) return null;

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/chat/customer/${user._id}`, { cache: "no-store" });
        const data = await res.json();
        if (data.success) {
          setMessages(data.chats || []);
          if (data.chats.length > lastMsgCount) {
            audioRef.current?.play().catch(() => {});
            setLastMsgCount(data.chats.length);
          }
        }
      } catch (err) {
        console.error("Chat fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
    const interval = setInterval(fetchChats, 2000);
    return () => clearInterval(interval);
  }, [user._id, lastMsgCount, API]);

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (messages.length === 0) return;
    fetch(`${API}/chat/read/${user._id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }).catch((err) => console.error("Mark as read error:", err));
  }, [messages.length, user._id, API]);

  const sendMessage = async () => {
    if (!msg.trim()) return;
    try {
      await fetch(`${API}/chat/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: user._id,
          customerName: user.name,
          from: "customer",
          message: msg,
        }),
      });
      setMsg("");
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();
    const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    if (isToday) return `Today, ${time}`;
    if (isYesterday) return `Yesterday, ${time}`;
    return date.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true });
  };

  return (
    <>
      <audio ref={audioRef} src="/notification.mp3" />
      <button onClick={() => setOpen(!open)} className="fixed bottom-5 right-5 w-14 h-14 rounded-full text-white shadow-lg z-50" style={{ backgroundColor: PRIMARY }}>💬</button>
      {open && (
        <div className="fixed bottom-20 right-5 w-80 h-[500px] bg-white shadow-xl rounded-xl flex flex-col z-50 border">
          <div className="p-3 text-white flex justify-between items-center rounded-t-xl" style={{ backgroundColor: PRIMARY }}>
            <span className="font-semibold">{adminName}</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-100">
            {loading ? <p className="text-center text-gray-500 mt-10">Loading...</p>
            : messages.length === 0 ? <p className="text-center text-gray-500 mt-10">No messages yet.</p>
            : messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.from==="customer"?"items-end":"items-start"}`}>
                <div className={`px-4 py-2 rounded-lg max-w-[75%] break-words ${m.from==="customer"?"text-white rounded-br-none":"bg-white text-gray-800 border rounded-bl-none"}`} style={m.from==="customer"?{backgroundColor:PRIMARY}:{}}>
                  {m.message}
                </div>
                <span className="text-xs text-gray-500 mt-1">{formatDate(m.createdAt)}</span>
              </div>
            ))}
            <div ref={messagesEndRef}/>
          </div>
          <div className="p-3 border-t flex gap-2 bg-white">
            <input value={msg} onChange={(e)=>setMsg(e.target.value)} onKeyDown={(e)=>e.key==="Enter" && sendMessage()} placeholder="Type a message..." className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2"/>
            <button onClick={sendMessage} className="text-white px-4 rounded-full" style={{backgroundColor:PRIMARY}}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}
