import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { MicrophoneIcon } from "@heroicons/react/24/solid";
import { MyContext } from "../App";
import { useContext } from "react";

const SOCKET_URL = "https://api.goroabazar.com";

export default function AdminChat() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [token, setToken] = useState(null);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const notifyAudioRef = useRef(null);
  const context = useContext(MyContext);

  /* ================= LOAD TOKEN ================= */
  useEffect(() => {
    const savedToken = localStorage.getItem("accesstoken");
    if (savedToken) setToken(savedToken);
  }, []);

  /* ================= FETCH CUSTOMERS ================= */
  const fetchCustomers = async () => {
    if (!token) return;

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
  };

  useEffect(() => {
    fetchCustomers();
  }, [token]);

  /* ================= SOCKET CONNECT ================= */
  useEffect(() => {
    if (!token) return;

    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit("join", "admin");

    return () => socketRef.current.disconnect();
  }, [token]);

  /* ================= SOCKET MESSAGE ================= */
  useEffect(() => {
    if (!socketRef.current) return;

    const handleNewMessage = async (chat) => {
      if (chat.from === "admin") return;

      const isActive = selectedCustomer?._id === chat.customerId;

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
          context.setChatUnreadCount(prev => prev + 1);
        setMessages((prev) => [...prev, chat]);
        notifyAudioRef.current?.play();

        await fetch(`${SOCKET_URL}/chat/read/${chat.customerId}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
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
      prev.map((c) =>
    
        c._id === customer._id ? { ...c, unreadCount: 0 } : c
    
      )

    );


    const res = await fetch(
      `${SOCKET_URL}/chat/customer/${customer._id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    if (data.success) setMessages(data.chats || []);

    socketRef.current.emit("join", customer._id);

    await fetch(`${SOCKET_URL}/chat/read/${customer._id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  };

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

  /* ================= AUDIO ================= */
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    mediaRecorderRef.current = recorder;
    audioChunksRef.current = [];

    recorder.ondataavailable = (e) =>
      e.data.size && audioChunksRef.current.push(e.data);

    recorder.onstop = () => {
      const blob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        const chatData = {
          customerId: selectedCustomer._id,
          customerName: selectedCustomer.name,
          from: "admin",
          type: "audio",
          audio: reader.result,
          createdAt: new Date(),
        };
        socketRef.current.emit("sendMessage", chatData);
        setMessages((prev) => [...prev, chatData]);
      };
      reader.readAsDataURL(blob);
    };

    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  /* ================= AUTOSCROLL ================= */
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

 useEffect(() => {
        fetchCustomers();
    const interval = setInterval(fetchCustomers, 500);
    return () => clearInterval(interval);
  }, [token]);


  /* ================= UI ================= */
  return (
    <div className="h-[100dvh] mt-12 flex bg-gray-100 overflow-hidden">
      <audio ref={notifyAudioRef} src="/notification.mp3" />

      {/* CUSTOMER LIST */}
      <aside
        className={`w-full mt-12  md:w-[320px] bg-white border-r flex flex-col
          ${selectedCustomer ? "hidden md:flex" : "flex"}`}
      >
        <div className="h-14 px-4 flex items-center font-semibold border-b">
          Customers
        </div>

        <div className="flex-1 overflow-y-auto">
          {customers.map((c) => (
            <div
              key={c._id}
              onClick={() => selectCustomer(c)}
              className="px-4 py-3 border-b cursor-pointer hover:bg-gray-50 flex justify-between"
            >
              <div>
                <div className="font-medium text-sm">{c.name}</div>
                {c.unreadCount > 0 && (
                  <span className="text-[10px] text-red-600">
                    {c.unreadCount} টি নতুন বার্তা
                  </span>
                )}
              </div>

              {c.unreadCount > 0 && (
                <span className="min-w-[18px] h-[18px] bg-red-600 text-white text-[10px]
                  rounded-full flex items-center justify-center">
                  {c.unreadCount}
                </span>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* CHAT */}
      <section
        className={`flex-1 flex flex-col overflow-hidden bg-[#ECE5DD]
          ${selectedCustomer ? "flex" : "hidden md:flex"}`}
      >
        {/* HEADER */}
        <div className="h-15 bg-white  border-b flex items-center gap-3 px-2 shrink-0 mt-15 z-100">
          <button
            className="md:hidden text-green-600"
            onClick={() => setSelectedCustomer(null)}
          >
            ←
          </button>
          <div>
            <div className="font-semibold text-sm">
              {selectedCustomer?.name || "Chat"}
            </div>
            <div className="text-xs text-gray-400">
              {selectedCustomer?.mobile}
            </div>
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.from === "admin"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`px-3 py-2 rounded-xl text-sm 
                  ${
                    m.from === "admin"
                      ? "bg-gray-500 text-white rounded-br-none"
                      : "bg-white rounded-bl-none"
                  }`}
              >
                {m.type === "text" ? (
                  m.message
                ) : (
                  <audio src={m.audio} controls className="w-[60vw]"/>
                )}
                <div className="text-[10px] opacity-70 text-right mt-1">
                  {formatDateTime(m.createdAt)}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        {selectedCustomer && (
          <div className="h-16 bg-white border-t px-2 flex items-center gap-2 shrink-0">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendText()}
              placeholder="Type message"
              className="flex-1 border rounded-full px-4 py-2 text-sm w-[56%]"
            />

            <button
              onClick={sendText}
              className="bg-green-500 text-white px-4 py-2 rounded-full"
            >
              Send
            </button>

            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={`w-11 h-11 rounded-full flex items-center justify-center text-white
                ${isRecording ? "bg-red-500" : "bg-gray-500"}`}
            >
              <MicrophoneIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
