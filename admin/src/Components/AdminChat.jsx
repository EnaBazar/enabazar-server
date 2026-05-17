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
  const PRIMARY = "#FC8934";

  /* ================= TOKEN LOAD ================= */
  useEffect(() => {
    const savedToken = localStorage.getItem("accesstoken");
    if (savedToken) setToken(savedToken);
  }, []);

  /* ================= SOCKET CONNECT ================= */
  useEffect(() => {
    if (!token) return;

    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit("join", "admin");

    return () => socketRef.current.disconnect();
  }, [token]);

  /* ================= FETCH CUSTOMERS ================= */
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
      console.error("Customer fetch error:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
    const interval = setInterval(fetchCustomers, 2000); // প্রতি 2 সেকেন্ডে
    return () => clearInterval(interval);
  }, [token]);

  /* ================= SOCKET MESSAGE ================= */
/* ================= SOCKET MESSAGE ================= */
useEffect(() => {
  if (!socketRef.current) return;

  const handleNewMessage = async (chat) => {
    if (chat.from === "admin") return;

    const isActive = selectedCustomer?._id === chat.customerId;

    // Customer list update
    setCustomers((prev) =>
      prev.map((c) =>
        c._id === chat.customerId
          ? {
              ...c,
              unreadCount: isActive ? 0 : c.unreadCount + 1,
            }
          : c
      )
    );

    if (isActive) {
      // এখানে শুধু chat list-এ push করছিলো
      setMessages((prev) => [...prev, chat]);
      notifyAudioRef.current?.play();

      await fetch(`${SOCKET_URL}/chat/read/${chat.customerId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      // যদি current chat active না থাকে, unread count update কর
      context.setChatUnreadCount(prev => prev + 1); // ✅ এখানে বসবে
    }
  };

  socketRef.current.on("newMessage", handleNewMessage);
  return () =>
    socketRef.current.off("newMessage", handleNewMessage);
}, [selectedCustomer, token]);

  /* ================= SELECT CUSTOMER ================= */
  const selectCustomer = async (customer) => {
    setSelectedCustomer(customer);

    setCustomers((prev) =>
      prev.map((c) => (c._id === customer._id ? { ...c, unreadCount: 0 } : c))
    );

    socketRef.current.emit("join", customer._id);
  };

  /* ================= FETCH CHAT POLLING ================= */
  useEffect(() => {
    if (!selectedCustomer || !token) return;

    const fetchChat = async () => {
      try {
        const res = await fetch(`${SOCKET_URL}/chat/customer/${selectedCustomer._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setMessages(data.chats || []);
      } catch (error) {
        console.error("Chat fetch error:", error);
      }
    };

    fetchChat(); // প্রথমবার
    const interval = setInterval(fetchChat, 1000); // প্রতি 1 সেকেন্ডে
    return () => clearInterval(interval);
  }, [selectedCustomer, token]);

  /* ================= SEND TEXT ================= */
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

  /* ================= AUTOSCROLL ================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= FORMAT DATE ================= */
  const formatDateTime = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  /* ================= UI ================= */
  return (
    <div className="h-[100dvh] mt-12 flex bg-gray-100 overflow-hidden">
      <audio ref={notifyAudioRef} src="/notification.mp3" />

      {/* CUSTOMER LIST */}
      <aside className={`w-full md:w-[320px] bg-white border-r flex flex-col ${selectedCustomer ? "hidden md:flex" : "flex"}`}>
        <div className="h-14 px-4 flex items-center font-semibold border-b">Customers</div>
        <div className="flex-1 overflow-y-auto">
          {customers.map((c) => (
            <div key={c._id} onClick={() => selectCustomer(c)} className="px-4 py-3 border-b cursor-pointer hover:bg-gray-50 flex justify-between">
              <div>
                <div className="font-medium text-sm">{c.name}</div>
                {c.unreadCount > 0 && <span className="text-[10px] text-red-600">{c.unreadCount} টি নতুন বার্তা</span>}
              </div>
              {c.unreadCount > 0 && <span className="min-w-[18px] h-[18px] bg-red-600 text-white text-[10px] rounded-full flex items-center justify-center">{c.unreadCount}</span>}
            </div>
          ))}
        </div>
      </aside>

      {/* CHAT */}
      <section className={`flex-1 flex flex-col overflow-hidden bg-[#ECE5DD] ${selectedCustomer ? "flex" : "hidden md:flex"}`}>
        {/* HEADER */}
        <div className="h-15 bg-white border-b flex items-center gap-3 px-2 shrink-0 mt-15 z-100">
          <button className="md:hidden text-green-600" onClick={() => setSelectedCustomer(null)}>←</button>
          <div>
            <div className="font-semibold text-sm">{selectedCustomer?.name || "Chat"}</div>
            <div className="text-xs text-gray-400">{selectedCustomer?.mobile}</div>
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 p-3 overflow-y-auto bg-[#ECE5DD] space-y-3">
          {messages.map((m, idx) => {
            const isMe = m.from === "customer";
            return (
              <div key={idx} className={`flex gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
                {!isMe && <img src={DEMO_USER_IMAGE} className="w-8 h-8 rounded-full" />}
                <div className="max-w-[70%] flex flex-col gap-1">
                  <div className={`px-3 py-2 rounded-lg text-sm ${isMe ? "text-white rounded-br-none" : "bg-gray-400 border rounded-bl-none"}`} style={isMe ? { backgroundColor: PRIMARY } : {}}>{m.message}</div>
                  <div className="flex justify-between items-center text-[11px] text-gray-500 !mb-3"><span>{formatDateTime(m.createdAt || new Date())}</span></div>
                </div>
                {isMe && <img src={DEMO_USER_IMAGE} className="w-8 h-8 rounded-full" />}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        {selectedCustomer && (
          <div className="h-16 bg-white border-t px-2 flex items-center gap-2 shrink-0">
            <input value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendText()} placeholder="Type message" className="flex-1 border rounded-full px-4 py-2 text-sm w-[56%]" />
            <button onClick={sendText} className="bg-green-500 text-white px-4 py-2 rounded-full">Send</button>
          </div>
        )}
      </section>
    </div>
  );
}