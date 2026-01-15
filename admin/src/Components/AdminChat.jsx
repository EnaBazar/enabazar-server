import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { MicrophoneIcon } from "@heroicons/react/24/solid";

const SOCKET_URL = "https://api.goroabazar.com";
let socket;

export default function AdminChat() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const messagesEndRef = useRef(null);
  const notifyAudioRef = useRef(null);
const [token, setToken] = useState(null);




  /* ================= LOAD TOKEN (REFRESH SAFE) ================= */
  useEffect(() => {
    const savedToken = localStorage.getItem("accesstoken");
    if (savedToken) setToken(savedToken);
  }, []);

  /* ================= FETCH CUSTOMERS (REUSABLE) ================= */
  const fetchCustomers = async () => {
    if (!token) return;

    setLoadingCustomers(true);

    try {
      const res = await fetch(`${SOCKET_URL}/chat/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success) {
        const map = {};

        data.chats.forEach((chat) => {
          if (!map[chat.customerId]) {
            map[chat.customerId] = {
              _id: chat.customerId,
              name: chat.customerName,
              mobile: chat.mobile,
              hasUnread: false,
            };
          }

          if (chat.from === "customer" && chat.read === false) {
            map[chat.customerId].hasUnread = true;
          }
        });

        setCustomers(Object.values(map));
      }
    } catch (err) {
      console.error("Fetch customers error:", err);
    }

    setLoadingCustomers(false);
  };

  /* ================= INITIAL FETCH ================= */
  useEffect(() => {
    fetchCustomers();
  }, [token]);

  /* ================= SOCKET (AUTO RECONNECT + REFRESH) ================= */
  useEffect(() => {
    if (!token) return;

    socket = io(SOCKET_URL, { reconnection: true });

    socket.emit("join", "admin");

    socket.on("connect", () => {
      console.log("🟢 Socket connected");
      fetchCustomers(); // 🔁 AUTO REFRESH
    });

    socket.on("newMessage", (chat) => {
      if (chat.from === "admin") return;

      if (selectedCustomer?._id === chat.customerId) {
        setMessages((prev) => [...prev, chat]);
        notifyAudioRef.current?.play();

        fetch(`${SOCKET_URL}/chat/read/${chat.customerId}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        setCustomers((prev) =>
          prev.map((c) =>
            c._id === chat.customerId
              ? { ...c, hasUnread: true }
              : c
          )
        );
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [token, selectedCustomer]);

  /* ================= NETWORK RECONNECT ================= */
  useEffect(() => {
    const handleOnline = () => {
      console.log("🌐 Network back online");
      fetchCustomers();
    };

    window.addEventListener("online", handleOnline);

    return () => window.removeEventListener("online", handleOnline);
  }, [token]);

  /* ================= SELECT CUSTOMER ================= */
  const selectCustomer = async (customer) => {
    setSelectedCustomer(customer);

    setCustomers((prev) =>
      prev.map((c) =>
        c._id === customer._id ? { ...c, hasUnread: false } : c
      )
    );

    const res = await fetch(
      `${SOCKET_URL}/chat/customer/${customer._id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = await res.json();
    if (data.success) setMessages(data.chats || []);

    socket.emit("join", customer._id);

    await fetch(`${SOCKET_URL}/chat/read/${customer._id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  /* ================= SEND MESSAGE ================= */
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

    socket.emit("sendMessage", chatData);
    setMessages((prev) => [...prev, chatData]);
    setMsg("");
  };

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= AUDIO ================= */
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    audioChunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size) audioChunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
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

        socket.emit("sendMessage", chatData);
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
  /* ================= UI ================= */
  return (
    <div className="flex h-[100dvh] bg-gray-100">
      <audio ref={notifyAudioRef} src="/notification.mp3" />

      {/* ========== CUSTOMER LIST ========== */}
      <div
        className={`w-full md:w-1/3 bg-white border-r
        ${selectedCustomer ? "hidden md:flex" : "flex"}
        flex-col`}
      >
        <div className="p-4 font-semibold border-b">Customers</div>

        <div className="flex-1 overflow-y-auto">
          {loadingCustomers ? (
            <div className="p-4 text-center text-gray-400">
              Loading customers...
            </div>
          ) : customers.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              No customers
            </div>
          ) : (
            customers.map((c) => (
              <div
                key={c._id}
                onClick={() => selectCustomer(c)}
                className="px-4 py-3 border-b cursor-pointer hover:bg-gray-50 flex justify-between"
              >
                <div>
                  <div className="font-medium text-sm">{c.name}</div>
                  {c.hasUnread && (
                    <span className="text-xs text-red-500">
                      New message
                    </span>
                  )}
                </div>

                {c.hasUnread && (
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ========== CHAT AREA ========== */}
      <div
        className={`flex-1 flex flex-col
        ${selectedCustomer ? "flex" : "hidden md:flex"}`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-3 bg-white border-b">
          <button
            className="md:hidden text-green-600 text-lg"
            onClick={() => setSelectedCustomer(null)}
          >
            ←
          </button>
          <div>
            <div className="font-semibold">
              {selectedCustomer?.name || "Chat"}
            </div>
            <div className="text-xs text-gray-400">
              {selectedCustomer?.mobile}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 bg-[#ECE5DD]">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex mb-2 ${
                m.from === "admin" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-3 py-2 rounded-xl text-sm max-w-[75%]
                ${
                  m.from === "admin"
                    ? "bg-green-500 text-white rounded-br-none"
                    : "bg-white rounded-bl-none"
                }`}
              >
                {m.type === "text" ? (
                  m.message
                ) : (
                  <audio src={m.audio} controls />
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {selectedCustomer && (
          <div className="p-2 bg-white flex gap-2 items-center">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendText()}
              placeholder="Type message"
              className="flex-1 border rounded-full px-4 py-2 text-sm"
            />
            <button
              onClick={sendText}
              className="bg-green-500 text-white px-4 py-2 rounded-full text-sm"
            >
              Send
            </button>
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={`w-11 h-11 rounded-full flex items-center justify-center text-white ${
                isRecording ? "bg-red-500" : "bg-green-500"
              }`}
            >
              <MicrophoneIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
