import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

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
      if (selectedCustomer?._id === chat.customerId) {
        setMessages((prev) => [...prev, chat]);
        notifyAudioRef.current?.play();
      } else {
        setCustomers((prev) =>
          prev.map((c) =>
            c._id === chat.customerId ? { ...c, hasUnread: true } : c
          )
        );
      }
    });

    return () => socket.disconnect();
  }, []);

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
    setMessages((prev) => [...prev, chatData]); // ✅ FIX
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
          setMessages((prev) => [...prev, chatData]); // ✅ FIX
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
    <div className="flex flex-col md:flex-row h-[90vh] gap-2 p-2 md:p-4">
      <audio ref={notifyAudioRef} src="/notification.mp3" />

      {/* CUSTOMER LIST */}
      <div className="md:w-1/3 border rounded p-2 bg-white overflow-y-auto">
        <h3 className="text-lg font-bold mb-2">Customers</h3>
        {customers.map((c) => (
          <div
            key={c._id}
            className={`p-2 rounded mb-1 cursor-pointer flex justify-between ${
              selectedCustomer?._id === c._id
                ? "bg-green-100"
                : "hover:bg-gray-100"
            }`}
            onClick={() => selectCustomer(c)}
          >
            <span>{c.name || c._id}</span>
            {c.hasUnread && <span className="text-red-500 font-bold">●</span>}
          </div>
        ))}
      </div>

      {/* CHAT BOX */}
      <div
        ref={chatBoxRef}
        className="flex-1 flex flex-col bg-[#ECE5DD] rounded p-2"
      >
        {selectedCustomer ? (
          <>
            <div className="flex-1 overflow-y-auto p-2">
              {messages.map((m, idx) => {
                const isAdmin = m.from === "admin";
                return (
                  <div
                    key={idx}
                    className={`flex ${
                      isAdmin ? "justify-end" : "justify-start"
                    } mb-2`}
                  >
                    <div className="max-w-[70%]">
                      {m.type === "text" ? (
                        <div
                          className={`px-3 py-2 rounded-lg text-sm ${
                            isAdmin
                              ? "text-white rounded-br-none"
                              : "bg-white border rounded-bl-none"
                          }`}
                          style={isAdmin ? { backgroundColor: PRIMARY } : {}}
                        >
                          {m.message}
                        </div>
                      ) : (
                        <audio src={m.audio} controls />
                      )}
                      <div className="text-[10px] text-gray-500 text-right">
                        {formatDateTime(m.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="flex gap-2 mt-2">
              <input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendText()}
                placeholder="Type a message"
                className="flex-1 px-4 py-2 rounded-full border"
              />

              <button
                onClick={sendText}
                className="px-4 py-2 rounded-full text-white bg-green-500"
              >
                Send
              </button>

              <button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                className={`w-10 h-10 rounded-full text-white ${
                  isRecording ? "bg-red-500" : "bg-green-500"
                }`}
              >
                🎤
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a customer to start chat
          </div>
        )}
      </div>
    </div>
  );
}
