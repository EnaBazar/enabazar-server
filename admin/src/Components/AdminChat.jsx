import { useEffect, useState, useRef } from "react";
import { postData } from "../utils/api";

export default function AdminChat() {
  const [messages, setMessages] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [msg, setMsg] = useState("");
  const [showList, setShowList] = useState(true);
  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const messagesEndRef = useRef(null);
  const notifyAudioRef = useRef(null);
  const PRIMARY = "#FF8904";
  const HEADER = "#075E54";
  /* ---------------- FETCH ALL CHATS ---------------- */
  const fetchChats = async () => {
    try {
      const res = await fetch("https://api.goroabazar.com/chat/admin/all");
      const data = await res.json();
      if (!data.success) return;

      setMessages(data.chats || []);

      // Customers map with unread count
      const map = new Map();
      data.chats.forEach((m) => {
        if (!map.has(m.customerId)) {
          map.set(m.customerId, {
            id: m.customerId,
            name: m.customerName,
            mobile: m.mobile || "",
            unread: 0,
            image: m.avatar || "/user.png",
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
    setShowList(false);

    // Mark messages as read
    await fetch(`https://api.goroabazar.com/chat/read/${customer.id}`, {
      method: "POST",
    });

    // Update local state
    setMessages((prev) =>
      prev.map((m) =>
        m.customerId === customer.id ? { ...m, read: true } : m
      )
    );

    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customer.id ? { ...c, unread: 0 } : c
      )
    );
  };

  /* ---------------- SEND TEXT ---------------- */
  const sendMessage = async () => {
    if (!msg.trim() || !selectedCustomer) return;

    const res = await postData("/chat/send", {
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      mobile: selectedCustomer.mobile,
      from: "admin",
      type: "text",
      message: msg,
    });

    if (res?.success) {
      setMsg("");
      fetchChats();
    }
  };

  /* ---------------- SEND AUDIO ---------------- */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        if (!selectedCustomer) return;

        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();

        reader.onloadend = async () => {
          await postData("/chat/send", {
            customerId: selectedCustomer.id,
            customerName: selectedCustomer.name,
            mobile: selectedCustomer.mobile,
            from: "admin",
            type: "audio",
            audio: reader.result,
          });
          fetchChats();
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

  /* ---------------- FILTERED MESSAGES ---------------- */
  const filteredMessages = selectedCustomer
    ? messages.filter((m) => m.customerId === selectedCustomer.id)
    : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // Notify sound for new customer messages
    if (!filteredMessages.length) return;
    const last = filteredMessages[filteredMessages.length - 1];
    if (last.from === "customer") notifyAudioRef.current?.play();
  }, [filteredMessages]);

  const formatTime = (date) =>
    new Date(date).toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });



      const deleteMessage = async (id) => {
        try {
          const res = await fetchDataFromApi(`/chat/delete/${id}`, { method: "DELETE" });
          if (res?.success) setMessages((prev) => prev.filter((m) => m._id !== id));
        } catch (err) {
          console.error("Delete error:", err);
        }
      };
    
      /* ================= TOGGLE AUDIO PLAY ================= */
      const toggleAudio = (id) => {
        const audio = audioRefs.current[id];
        if (!audio) return;
    
        if (playingAudioId && playingAudioId !== id) {
          const prevAudio = audioRefs.current[playingAudioId];
          prevAudio?.pause();
        }
    
        if (audio.paused) {
          audio.play();
          setPlayingAudioId(id);
        } else {
          audio.pause();
          setPlayingAudioId(null);
        }
      };
    
      /* ================= FORMAT DATETIME ================= */
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
    <div className="h-[calc(100vh-100px)] bg-gray-100 flex overflow-hidden">
      <audio ref={notifyAudioRef} src="/notification.mp3" />

      {/* ---------------- CUSTOMER LIST ---------------- */}
      <div
        className={`bg-white border-r w-full md:w-1/4 absolute md:relative z-20 transition-all duration-300
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
              className={`w-full px-3 py-2 border-b flex items-center gap-2 hover:bg-gray-100 ${
                selectedCustomer?.id === c.id ? "bg-gray-200" : ""
              }`}
            >
              <img
                src={c.image}
                alt={c.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col text-left">
                <span className="font-medium">{c.name}</span>
                <span className="text-xs text-gray-500">Mobile: {c.mobile}</span>
              </div>
              {c.unread > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 rounded-full ml-auto">
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
        <div className="p-3 flex items-center gap-2 shadow-lg bg-orange-400 rounded-md">
          <button
            className="md:hidden text-xl"
            onClick={() => setShowList(true)}
          >
            <img
              src="/user.png"
              alt={selectedCustomer ? selectedCustomer.name : "Guest"}
              className="w-10 h-10 rounded-full object-cover"
            />
          </button>
          <div className="flex flex-col">
            <span className="flex flex-col font-semibold mb-1">
              {selectedCustomer ? selectedCustomer.name : "Select a customer"}
            </span>
            <span className="text-xs text-white">
              Mobile: {selectedCustomer ? selectedCustomer.mobile : "No Mobile"}
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredMessages.map((m) => (
            <div
              key={m._id}
              className={`flex ${m.from === "admin" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm shadow ${
                  m.from === "admin"
                    ? "bg-blue-500 text-white rounded-br-sm"
                    : "bg-white rounded-bl-sm"
                }`}
              >
                {m.type === "audio" ? (
                  <audio controls src={m.audio} className="w-full" />
                ) : (
                  <p>{m.message}</p>
                )}
              <div className="flex justify-between items-center text-[11px] text-white-500 mt-2">
                      <span>{formatDateTime(m.createdAt)}</span>
                      <button
                        onClick={() => deleteMessage(m._id)}
                        className="text-red-500 ml-2"
                      >
                        Delete
                      </button>
                    </div>
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
      className="flex-1 border rounded-full w-[60%] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    {/* SEND BUTTON */}
    <button
      onClick={sendMessage}
      onMouseDown={(e) => e.preventDefault()}   // prevent input focus on click
      onTouchStart={(e) => e.preventDefault()}  // prevent input focus on touch
      className="px-4 py-2 rounded-full text-white transition-transform duration-200 hover:opacity-90 hover:scale-105 active:scale-95"
      style={{ backgroundColor: PRIMARY }}
    >
      Send
    </button>

    {/* MIC BUTTON */}
    <button
      onMouseDown={(e) => e.preventDefault()}   // prevent input focus on click
      onTouchStart={(e) => e.preventDefault()}  // prevent input focus on touch
      onMouseDownCapture={startRecording}       // start recording
      onMouseUpCapture={stopRecording}         // stop recording
      onTouchStartCapture={startRecording}     // start recording
      onTouchEndCapture={stopRecording}        // stop recording
      className={`w-10 h-10 rounded-full text-white flex items-center justify-center ${
        isRecording ? "bg-red-500 animate-pulse" : "bg-green-500"
      }`}
    >
      🎤
    </button>
  </div>
)}

      </div>
    </div>
  );
}
