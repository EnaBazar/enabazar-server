import { useEffect, useState, useRef, useContext } from "react";
import io from "socket.io-client";
import { MyContext } from "../App";

const SOCKET_URL = "https://api.goroabazar.com";

export default function AdminChat() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [token, setToken] = useState(null);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const notifyAudioRef = useRef(null);
  const context = useContext(MyContext);

  const DEMO_USER_IMAGE = "https://i.pravatar.cc/40";
  const PRIMARY = "#25D366"; // WhatsApp green

  useEffect(() => {
    const savedToken = localStorage.getItem("accesstoken");
    if (savedToken) setToken(savedToken);
  }, []);

  useEffect(() => {
    if (!token) return;
    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit("join", "admin");
    return () => socketRef.current.disconnect();
  }, [token]);

  const fetchCustomers = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${SOCKET_URL}/chat/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        let totalUnread = 0;
        const map = {};
        data.chats.forEach((chat) => {
          if (!map[chat.customerId]) {
            map[chat.customerId] = {
              _id: chat.customerId,
              name: chat.customerName,
              mobile: chat.mobile,
              unreadCount: 0,
            };
          }
          if (chat.from === "customer" && chat.read === false) {
            map[chat.customerId].unreadCount += 1;
            totalUnread += 1;
          }
        });
        setCustomers(Object.values(map));
        context.setChatUnreadCount(totalUnread);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCustomers();
    const interval = setInterval(fetchCustomers, 2000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (!socketRef.current) return;
    const handleNewMessage = async (chat) => {
      if (chat.from === "admin") return;
      const isActive = selectedCustomer?._id === chat.customerId;

      setCustomers((prev) =>
        prev.map((c) =>
          c._id === chat.customerId
            ? { ...c, unreadCount: isActive ? 0 : c.unreadCount + 1 }
            : c
        )
      );

      if (isActive) {
        setMessages((prev) => [...prev, chat]);
        notifyAudioRef.current?.play();
        await fetch(`${SOCKET_URL}/chat/read/${chat.customerId}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    };
    socketRef.current.on("newMessage", handleNewMessage);
    return () => socketRef.current.off("newMessage", handleNewMessage);
  }, [selectedCustomer, token]);

  const selectCustomer = async (customer) => {
    setSelectedCustomer(customer);
    setCustomers((prev) =>
      prev.map((c) => (c._id === customer._id ? { ...c, unreadCount: 0 } : c))
    );
    socketRef.current.emit("join", customer._id);
  };

  useEffect(() => {
    if (!selectedCustomer || !token) return;
    const fetchChat = async () => {
      try {
        const res = await fetch(
          `${SOCKET_URL}/chat/customer/${selectedCustomer._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (data.success) setMessages(data.chats || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchChat();
    const interval = setInterval(fetchChat, 1000);
    return () => clearInterval(interval);
  }, [selectedCustomer, token]);

  const sendText = () => {
    if (!msg.trim() || !selectedCustomer) return;
    const chatData = {
      customerId: selectedCustomer._id,
      customerName: selectedCustomer.name,
      from: "admin",
      type: "text",
      message: msg,
      createdAt: new Date(),
    };
    socketRef.current.emit("sendMessage", chatData);
    setMessages((prev) => [...prev, chatData]);
    setMsg("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    <div className="h-[100dvh] mt-12 flex bg-gray-100 overflow-hidden">
      <audio ref={notifyAudioRef} src="/notification.mp3" />

      {/* CUSTOMER LIST */}
      <aside className="w-full md:w-[300px] bg-white border-r flex flex-col">
        <div className="h-14 px-4 flex items-center font-semibold border-b">
          Customers
        </div>
        <div className="flex-1 overflow-y-auto">
          {customers.map((c) => (
            <div
              key={c._id}
              onClick={() => selectCustomer(c)}
              className={`px-4 py-3 border-b cursor-pointer flex justify-between items-center transition-colors duration-200
                ${selectedCustomer?._id === c._id ? "bg-green-100" : "hover:bg-gray-50"}`}
            >
              <div>
                <div className="font-medium">{c.name}</div>
                {c.unreadCount > 0 && (
                  <span className="text-xs text-red-600">
                    {c.unreadCount} টি নতুন বার্তা
                  </span>
                )}
              </div>
              {c.unreadCount > 0 && (
                <span className="min-w-[20px] h-[20px] bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                  {c.unreadCount}
                </span>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* CHAT AREA */}
      <section className="flex-1 flex flex-col">
        {/* HEADER */}
        <div className="h-16 bg-white border-b flex items-center px-4 shadow-sm">
          {selectedCustomer && (
            <>
              <button className="md:hidden text-green-600 mr-2" onClick={() => setSelectedCustomer(null)}>
                ←
              </button>
              <div>
                <div className="font-semibold">{selectedCustomer.name}</div>
                <div className="text-xs text-gray-400">{selectedCustomer.mobile}</div>
              </div>
            </>
          )}
        </div>

        {/* MESSAGES */}
        <div className="flex-1 p-4 overflow-y-auto bg-[#E5DDD5] space-y-3">
          {messages.map((m, idx) => {
            const isMe = m.from === "customer";
            return (
              <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                {!isMe && <img src={DEMO_USER_IMAGE} className="w-8 h-8 rounded-full mr-2" />}
                <div className={`px-4 py-2 rounded-lg max-w-[70%] text-sm break-words
                  ${isMe ? "bg-green-500 text-white rounded-br-none" : "bg-white text-gray-800 rounded-bl-none"}`}>
                  {m.message}
                  <div className="text-[10px] text-gray-400 mt-1 text-right">{formatDateTime(m.createdAt)}</div>
                </div>
                {isMe && <img src={DEMO_USER_IMAGE} className="w-8 h-8 rounded-full ml-2" />}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        {selectedCustomer && (
          <div className="h-16 bg-white border-t px-4 flex items-center gap-2">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendText()}
              placeholder="Type a message..."
              className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button onClick={sendText} className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition">
              Send
            </button>
          </div>
        )}
      </section>
    </div>
  );
}