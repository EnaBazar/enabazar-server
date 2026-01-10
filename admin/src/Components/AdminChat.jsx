import { useEffect, useState, useRef } from "react";
import { postData } from "../utils/api";

export default function AdminChat() {
  const [messages, setMessages] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [msg, setMsg] = useState("");
  const [showList, setShowList] = useState(true); // 📱 mobile toggle

  const messagesEndRef = useRef(null);

  /* ---------------- FETCH ALL CHATS ---------------- */
  const fetchChats = async () => {
    try {
      const res = await fetch("https://api.goroabazar.com/chat/admin/all");
      const data = await res.json();
      if (!data.success) return;

      setMessages(data.chats || []);

      const map = new Map();
      data.chats.forEach((m) => {
        if (!map.has(m.customerId)) {
          map.set(m.customerId, {
            id: m.customerId,
            name: m.customerName,
            unread: 0,
          });
        }
        if (m.from === "customer" && !m.read) {
          map.get(m.customerId).unread += 1;
        }
      });

      setCustomers([...map.values()]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 2000);
    return () => clearInterval(interval);
  }, []);

  /* ---------------- SELECT CUSTOMER ---------------- */
  const handleSelectCustomer = async (customer) => {
    setSelectedCustomer(customer);
    setShowList(false); // 📱 hide list on mobile

    await fetch(`https://api.goroabazar.com/chat/read/${customer.id}`, {
      method: "POST",
    });

    setMessages((prev) =>
      prev.map((m) =>
        m.customerId === customer.id ? { ...m, read: true } : m
      )
    );
  };

  /* ---------------- SEND MESSAGE ---------------- */
  const sendMessage = async () => {
    if (!msg.trim() || !selectedCustomer) return;

    const res = await postData("/chat/send", {
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      from: "admin",
      message: msg,
    });

    if (res?.success) {
      setMsg("");
      fetchChats();
    }
  };

  /* ---------------- FILTERED MESSAGES ---------------- */
  const filteredMessages = selectedCustomer
    ? messages.filter((m) => m.customerId === selectedCustomer.id)
    : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [filteredMessages]);

  const formatTime = (date) =>
    new Date(date).toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <div className="h-[calc(100vh-70px)] bg-gray-100 flex overflow-hidden">
      {/* ---------------- CUSTOMER LIST ---------------- */}
      <div
        className={`bg-white border-r w-full h-[60px] md:w-1/4 absolute md:relative z-20 transition-all duration-300
        ${showList ? "left-0" : "-left-full"} md:left-0`}
      >
        <div className="p-3 font-semibold border-b flex justify-between">
          Customers
          <button
            className="md:hidden text-sm text-blue-600"
            onClick={() => setShowList(false)}
          >
            Close
          </button>
        </div>

        <div className="overflow-y-auto h-full">
          {customers.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelectCustomer(c)}
              className={`w-full px-3 py-3 border-b flex justify-between items-center hover:bg-gray-100 ${
                selectedCustomer?.id === c.id ? "bg-gray-200" : ""
              }`}
            >
              <span className="font-medium">{c.name}</span>
              {c.unread > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 rounded-full">
                  {c.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ---------------- CHAT AREA ---------------- */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b p-3 flex items-center gap-2">
          <button
            className="md:hidden text-xl"
            onClick={() => setShowList(true)}
          >
            ☰
          </button>
          <span className="font-semibold">
            {selectedCustomer
              ? selectedCustomer.name
              : "Select a customer"}
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredMessages.map((m) => (
            <div
              key={m._id}
              className={`flex ${
                m.from === "admin" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm shadow
                ${
                  m.from === "admin"
                    ? "bg-blue-500 text-white rounded-br-sm"
                    : "bg-white rounded-bl-sm"
                }`}
              >
                <p>{m.message}</p>
                <p className="text-[10px] opacity-70 text-right mt-1">
                  {formatTime(m.createdAt)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {selectedCustomer && (
          <div className="bg-white p-3 border-t flex gap-2">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type message…"
              className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-5 rounded-full text-sm"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
