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

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const messagesEndRef = useRef(null);
  const audioRefs = useRef({});
  const chatBoxRef = useRef(null);
  const notifyAudioRef = useRef(null);

  const token = localStorage.getItem("accesstoken");
  const PRIMARY = "#25D366";

  /* ================= SOCKET SETUP ================= */
  useEffect(() => {
 socket = io(SOCKET_URL); // socket.io নিজে handle করবে


    socket.emit("join", "admin");

    socket.on("newMessage", (chat) => {
        if (chat.from === "admin") return;
      if ( selectedCustomer && selectedCustomer?._id === chat.customerId) {
        setMessages((prev) => [...prev,chat]);
        notifyAudioRef.current?.play();

         fetch(`${SOCKET_URL}/chat/read/${chat.customerId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
      } else {
        setCustomers((prev) =>
          prev.map((c) =>
            c._id === chat.customerId ? { ...c, hasUnread: true } : c
          )
        );
      }
    });

    return () => socket.disconnect();
  }, [selectedCustomer]);

  /* ================= FETCH CUSTOMERS ================= */
  useEffect(() => {
    const fetchCustomers = async () => {
      const res = await fetch(`${SOCKET_URL}/chat/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        const uniqueCustomers = Array.from(
          new Map(data.chats.map((c) => [c.customerId, c])).values()
        ).map((c) => ({
          _id: c.customerId,
          name: c.customerName,
          hasUnread: false,
        }));
        setCustomers(uniqueCustomers);
      }
    };
    fetchCustomers();
  }, [token]);

  /* ================= SELECT CUSTOMER ================= */
  const selectCustomer = async (customer) => {
    setSelectedCustomer(customer);

    setCustomers((prev) =>
      prev.map((c) =>
        c._id === customer._id ? { ...c, hasUnread: true } : c
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
    setMessages((prev) => [...prev,chatData]); // ✅ FIX
    setMsg("");
  };

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
          setMessages((prev) => [...prev,chatData]); // ✅ FIX
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

  /* ================= FORMAT DATE ================= */
  const formatDateTime = (date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${d.getFullYear()} ${d
      .getHours()
      .toString()
      .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  /* ================= OUTSIDE CLICK ================= */
  useEffect(() => {
    if (!selectedCustomer) return;

    const handleOutsideClick = (e) => {
      if (chatBoxRef.current && !chatBoxRef.current.contains(e.target)) {
        setSelectedCustomer(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [selectedCustomer]);

  return (
    <div className="flex h-[90vh] bg-gray-100 p-2 md:p-4 gap-2">
  <audio ref={notifyAudioRef} src="/notification.mp3" />

  {/* ================= CUSTOMER LIST ================= */}
  <div
    className={`
      md:w-1/3 w-full bg-white rounded-xl shadow
      flex flex-col overflow-hidden
      ${selectedCustomer ? "hidden md:flex" : "flex"}
    `}
  >
    {/* Header */}
    <div className="px-4 py-3 border-b font-semibold text-gray-700">
      Customers
    </div>

    {/* List */}
    <div className="flex-1 overflow-y-auto">
      {customers.map((c) => (
        <div
          key={c._id}
          onClick={() => selectCustomer(c)}
          className={`px-4 py-3 cursor-pointer flex justify-between items-center
            border-b last:border-b-0
            ${
              selectedCustomer?._id === c._id
                ? "bg-green-50"
                : "hover:bg-gray-50"
            }
          `}
        >
          <div className="flex flex-col">
            <span className="font-medium text-sm text-gray-800">
              {c.name || c._id}
            </span>
            {c.hasUnread && (
              <span className="text-xs text-red-500">New message</span>
            )}
          </div>

          {c.hasUnread && (
            <span className="w-2 h-2 rounded-full bg-red-500" />
          )}
        </div>
      ))}
    </div>
  </div>

  {/* ================= CHAT AREA ================= */}
  <div
    ref={chatBoxRef}
    className={`
      flex-1 bg-[#ECE5DD] rounded-xl shadow
      flex flex-col overflow-hidden
      ${selectedCustomer ? "flex" : "hidden md:flex"}
    `}
  >
    {/* Chat Header */}
    <div className="flex items-center gap-3 px-4 py-3 bg-white border-b">
      <button
        className="md:hidden text-green-600 text-lg"
        onClick={() => setSelectedCustomer(null)}
      >
        ←
      </button>

      <div className="flex flex-col">
        <span className="font-semibold text-gray-800">
          {selectedCustomer?.name || "Chat"}
        </span>
        <span className="text-xs text-gray-400">
          Admin Support
        </span>
      </div>
    </div>

    {/* Messages */}
    <div className="flex-1 overflow-y-auto px-3 py-2">
      {selectedCustomer ? (
        messages.map((m, idx) => {
          const isAdmin = m.from === "admin";
          return (
            <div
              key={idx}
              className={`flex mb-2 ${
                isAdmin ? "justify-end" : "justify-start"
              }`}
            >
              <div className="max-w-[75%]">
                {m.type === "text" ? (
                  <div
                    className={`px-3 py-2 rounded-xl text-sm shadow-sm
                      ${
                        isAdmin
                          ? "bg-green-500 text-white rounded-br-none"
                          : "bg-white rounded-bl-none"
                      }
                    `}
                  >
                    {m.message}
                  </div>
                ) : (
                  <audio
                    src={m.audio}
                    controls
                    className="w-[65vw] md:w-[260px]"
                  />
                )}

                <div className="text-[10px] text-gray-500 text-right mt-1">
                  {formatDateTime(m.createdAt)}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="h-full flex items-center justify-center text-gray-400">
          Select a customer to start chat
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>

    {/* Input Bar */}
    {selectedCustomer && (
      <div className="px-3 py-2 bg-white border-t flex gap-2 items-center">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendText()}
          placeholder="Type a message"
          className="flex-1 px-4 py-2 rounded-full border w-[56%] text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <button
          onClick={sendText}
          className="px-4 py-2 rounded-full bg-green-500 text-white text-sm"
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
