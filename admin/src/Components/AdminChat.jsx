import { useEffect, useState, useRef } from "react";

export default function AdminChat() {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [unreadCount, setUnreadCount] = useState({});
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);

  // Fetch chats every 2 seconds
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch("https://api.goroabazar.com/chat/admin/all");
        const data = await res.json();
        if (data.success) {
          setMessages(data.chats);

          // Calculate unread count
          const counts = { ...unreadCount }; // previous state

          data.chats.forEach((m) => {
            if (m.from === "customer") {
              if (!selectedCustomer || selectedCustomer.id !== m.customerId) {
                counts[m.customerId] = (counts[m.customerId] || 0) + 1;
              }
            }
          });

          // Reset selected customer's unread count
          if (selectedCustomer) counts[selectedCustomer.id] = 0;

          setUnreadCount(counts);

          // Play notification if new message arrived
          if (messages.length < data.chats.length) audioRef.current.play();
        }
      } catch (err) {
        console.log("Error fetching chats:", err);
      }
    };

    fetchChats();
    const interval = setInterval(fetchChats, 2000);
    return () => clearInterval(interval);
  }, [selectedCustomer]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedCustomer]);

  // Send message
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
          message: msg,
        }),
      });
      setMsg("");
    } catch (err) {
      console.log("Error sending message:", err);
    }
  };

  // Unique customers
  const customers = [
    ...new Map(
      messages.map((m) => [
        m.customerId,
        { id: m.customerId, name: m.customerName },
      ])
    ).values(),
  ];

  // Messages for selected customer
  const filteredMessages = selectedCustomer
    ? messages.filter((m) => m.customerId === selectedCustomer.id)
    : [];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <audio ref={audioRef} src="/notification.mp3" />

      {/* Sidebar: Customer List */}
      <div className="md:w-1/4 w-full md:h-full h-32 overflow-y-auto bg-white border-r">
        <h2 className="font-bold text-lg p-4 border-b">Customers</h2>
        {customers.length === 0 && (
          <p className="p-4 text-gray-400">No customers yet</p>
        )}
        {customers.map((c) => (
          <div
            key={c.id}
            onClick={() => setSelectedCustomer(c)}
            className={`flex justify-between items-center cursor-pointer p-3 border-b hover:bg-gray-100 ${
              selectedCustomer?.id === c.id ? "bg-blue-100" : ""
            }`}
          >
            <span className="font-medium">{c.name}</span>
            {unreadCount[c.id] > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount[c.id]}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Chat Box */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto">
          {selectedCustomer ? (
            filteredMessages.length > 0 ? (
              filteredMessages.map((m, i) => (
                <div
                  key={i}
                  className={`mb-2 flex ${
                    m.from === "admin" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg max-w-xs break-words ${
                      m.from === "admin"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {m.message}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center mt-20">No messages yet</p>
            )
          ) : (
            <p className="text-gray-400 text-center mt-20">
              Select a customer to view messages
            </p>
          )}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Input Box */}
        {selectedCustomer && (
          <div className="p-4 border-t flex gap-2 bg-white">
            <input
              type="text"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Type message..."
              className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
