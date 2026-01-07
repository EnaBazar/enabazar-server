import { useEffect, useState, useRef } from "react";

export default function AdminChat() {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [userInteracted, setUserInteracted] = useState(false);

  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);

  /* -------------------- AUDIO -------------------- */
  const playAudio = () => {
    if (!userInteracted) return;
    audioRef.current?.play().catch(() => {});
  };

  /* -------------------- FETCH ALL CHATS -------------------- */
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch(
          "https://api.goroabazar.com/chat/admin/all"
        );
        const data = await res.json();

        if (data.success) {
          if (data.chats.length > messages.length) {
            playAudio();
          }
          setMessages(data.chats);
        }
      } catch (err) {
        console.log("Error fetching chats:", err);
      }
    };

    fetchChats();
    const interval = setInterval(fetchChats, 2000);
    return () => clearInterval(interval);
  }, [userInteracted]); // ✅ no messages dependency

  /* -------------------- SELECT CUSTOMER (MARK READ) -------------------- */
  const handleSelectCustomer = async (customer) => {
    setSelectedCustomer(customer);

    try {
      // backend read mark
      await fetch(
        `https://api.goroabazar.com/chat/read/${customer.id}`,
        { method: "POST" }
      );

      // frontend sync
      setMessages((prev) =>
        prev.map((m) =>
          m.customerId === customer.id
            ? { ...m, read: true }
            : m
        )
      );
    } catch (err) {
      console.log("Read update failed:", err);
    }
  };

  /* -------------------- CUSTOMERS + UNREAD COUNT -------------------- */
  const customersMap = new Map();

  messages.forEach((m) => {
    if (!customersMap.has(m.customerId)) {
      customersMap.set(m.customerId, {
        id: m.customerId,
        name: m.customerName,
        unread: 0
      });
    }

    if (
      m.from === "customer" &&
      m.read === false &&
      (!selectedCustomer || selectedCustomer.id !== m.customerId)
    ) {
      customersMap.get(m.customerId).unread += 1;
    }
  });

  const customers = Array.from(customersMap.values());

  /* -------------------- FILTERED MESSAGES -------------------- */
  const filteredMessages = selectedCustomer
    ? messages.filter((m) => m.customerId === selectedCustomer.id)
    : [];

  /* -------------------- AUTO SCROLL -------------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [filteredMessages]);

  /* -------------------- SEND MESSAGE -------------------- */
  const sendMessage = async () => {
    if (!msg.trim() || !selectedCustomer) return;

    try {
      await fetch("https://api.goroabazar.com/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: selectedCustomer.id,
          customerName: selectedCustomer.name,
          from: "admin",
          message: msg
        })
      });

      setMsg("");

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.log("Error sending message:", err);
    }
  };

  return (
    <div
      className="p-4 max-w-4xl mx-auto"
      onClick={() => setUserInteracted(true)}
    >
      {/* AUDIO */}
      <audio ref={audioRef} src="/notification.mp3" />

      <h2 className="text-2xl font-bold mb-4 text-center">
        Admin Chat Dashboard
      </h2>

      <div className="flex flex-col md:flex-row gap-4">
        {/* ---------------- CUSTOMER LIST ---------------- */}
        <div className="md:w-1/4 border p-2 rounded overflow-y-auto h-56">
          <h3 className="font-semibold mb-2">Customers</h3>

          {customers.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelectCustomer(c)}
              className={`w-full flex justify-between items-center px-2 py-1 mb-1 rounded text-left ${
                selectedCustomer?.id === c.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              <span>{c.name}</span>
              {c.unread > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 rounded-full">
                  {c.unread}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ---------------- CHAT WINDOW ---------------- */}
        <div className="md:w-3/4 flex flex-col border rounded h-96">
          <div className="flex-1 p-2 overflow-y-auto">
            {filteredMessages.map((m, i) => (
              <div
                key={i}
                className={`mb-1 flex ${
                  m.from === "admin"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <span
                  className={`inline-block px-3 py-1 rounded ${
                    m.from === "admin"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {m.message}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* ---------------- INPUT ---------------- */}
          <div className="flex gap-2 p-2 border-t">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Type message..."
              className="flex-1 border rounded px-2 py-1"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 rounded"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
