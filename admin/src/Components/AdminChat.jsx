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
  const [token, setToken] = useState(null);
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const notifyAudioRef = useRef(null);

  /* Load token */
  useEffect(() => {
    const savedToken = localStorage.getItem("accesstoken");
    if (savedToken) setToken(savedToken);
  }, []);

  /* Fetch initial customer list */
  const fetchCustomers = async () => {
    if (!token) return;
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
  };

  useEffect(() => {
    fetchCustomers();
  }, [token]);

  /* ================= SOCKET SETUP ================= */
  useEffect(() => {
    if (!token) return;

    socket = io(SOCKET_URL);
    socket.emit("join", "admin");

    socket.on("newMessage", async (chat) => {
      if (chat.from === "admin") return;

      // Update customer list: add new customer if not exists
      setCustomers((prev) => {
        const exists = prev.find((c) => c._id === chat.customerId);
        if (exists) {
          return prev.map((c) =>
            c._id === chat.customerId ? { ...c, hasUnread: true } : c
          );
        } else {
          return [
            ...prev,
            {
              _id: chat.customerId,
              name: chat.customerName,
              mobile: chat.mobile,
              hasUnread: true,
            },
          ];
        }
      });

      // Active chat open: show message + mark read
      if (selectedCustomer?._id === chat.customerId) {
        setMessages((prev) => [...prev, chat]);
        notifyAudioRef.current?.play();

        await fetch(`${SOCKET_URL}/chat/read/${chat.customerId}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });

        // clear unread
        setCustomers((prev) =>
          prev.map((c) =>
            c._id === chat.customerId ? { ...c, hasUnread: false } : c
          )
        );
      }
    });

    return () => socket.disconnect();
  }, [token, selectedCustomer]);

  /* ================= SELECT CUSTOMER ================= */
  const selectCustomer = async (customer) => {
    setSelectedCustomer(customer);

    setCustomers((prev) =>
      prev.map((c) =>
        c._id === customer._id ? { ...c, hasUnread: false } : c
      )
    );

    const res = await fetch(`${SOCKET_URL}/chat/customer/${customer._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setMessages(data.chats || []);

    socket.emit("join", customer._id);

    await fetch(`${SOCKET_URL}/chat/read/${customer._id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  /* ================= SEND TEXT ================= */
  const sendText = async () => {
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

  /* ================= AUDIO RECORD ================= */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
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
    } catch (err) {
      console.error("Mic error:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatDateTime = (date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, "0")}-${(
      d.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${d.getFullYear()} ${d
      .getHours()
      .toString()
      .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  /* ================= UI ================= */
  return (
    <div className="flex h-[100dvh] bg-gray-100">
      <audio ref={notifyAudioRef} src="/notification.mp3" />

      {/* Customer List */}
      <div
        className={`md:w-1/3 w-full bg-white rounded-xl shadow flex flex-col ${
          selectedCustomer ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="p-4 font-semibold border-b">Customers</div>
        <div className="flex-1 overflow-y-auto">
          {customers.map((c) => (
            <div
              key={c._id}
              onClick={() => selectCustomer(c)}
              className="px-4 py-3 border-b cursor-pointer hover:bg-gray-50 flex justify-between"
            >
              <div>
                <div className="font-medium text-sm">{c.name}</div>
                {c.hasUnread && (
                  <span className="text-xs text-red-500">New message</span>
                )}
              </div>
              {c.hasUnread && <span className="w-2 h-2 bg-red-500 rounded-full mt-2" />}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={`flex-1 flex flex-col ${
          selectedCustomer ? "flex" : "hidden md:flex"
        }`}
      >
        <div className="flex items-center gap-3 p-3 bg-white border-b">
          <button
            className="md:hidden text-green-600 text-lg"
            onClick={() => setSelectedCustomer(null)}
          >
            ←
          </button>
          <div>
            <div className="font-semibold">{selectedCustomer?.name || "Chat"}</div>
            <div className="text-xs text-gray-400">{selectedCustomer?.mobile}</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 bg-[#ECE5DD]">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex mb-2 ${
                m.from === "admin" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-3 py-2 rounded-xl text-sm max-w-[75%] ${
                  m.from === "admin"
                    ? "bg-x-500 text-white rounded-br-none"
                    : "bg-white rounded-bl-none"
                }`}
              >
                {m.type === "text" ? m.message : <audio src={m.audio} controls  className="w-[56vw]"/>}
                <div className="text-[10px] text-gray-500 text-right mt-1">
                  {formatDateTime(m.createdAt)}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

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
          className={`relative w-11 h-11 rounded-full flex items-center justify-center text-white
            ${isRecording ? "bg-red-500 scale-110" : "bg-green-500"}
          `}
        >
          {isRecording && (
            <span className="absolute inset-0 rounded-full bg-red-400 animate-ping" />
          )}
          <MicrophoneIcon className="w-5 h-5 relative z-10" />
        </button>
          </div>
        )}
      </div>
    </div>
  );
}
