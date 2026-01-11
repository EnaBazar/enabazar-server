import { useEffect, useState, useRef, useContext } from "react";
import { fetchDataFromApi, postData } from "../utils/api";
import { MyContext } from "../App";

export default function CustomerChat({ user }) {
  const context = useContext(MyContext);

  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const messagesEndRef = useRef(null);
  const chatBoxRef = useRef(null);
  const notifyAudioRef = useRef(null);

  const token = localStorage.getItem("accesstoken");

  const PRIMARY = "#25D366";
  const HEADER = "#075E54";

  const DEMO_USER_IMAGE = "https://i.pravatar.cc/40";
  const DEMO_ADMIN_IMAGE =
    "https://cdn-icons-png.flaticon.com/512/1995/1995550.png";

  /* ================= CHECK UNREAD ================= */
  useEffect(() => {
    if (!user?._id) return;

    const checkUnread = async () => {
      const res = await fetchDataFromApi(`/chat/customer/${user._id}`);
      if (res?.success) {
        const unread = res.chats.some(
          (c) => c.from === "admin" && !c.read
        );
        setHasUnread(unread);
      }
    };

    checkUnread();
    const i = setInterval(checkUnread, 3000);
    return () => clearInterval(i);
  }, [user?._id]);

  /* ================= OPEN CHAT ================= */
  const handleOpenChat = () => {
    if (!user?._id || !token) {
      context.openAlertBox("error", "চ্যাট করতে হলে আগে লগইন করুন");
      context.setOpenLoginPanel(true);
      return;
    }
    setOpen(true);
    setHasUnread(false);
  };

  /* ================= FETCH CHATS ================= */
  useEffect(() => {
    if (!open || !user?._id) return;

    const loadChats = async () => {
      const res = await fetchDataFromApi(`/chat/customer/${user._id}`);
      if (res?.success) setMessages(res.chats || []);
    };

    loadChats();
    const i = setInterval(loadChats, 2000);
    return () => clearInterval(i);
  }, [open, user?._id]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= NOTIFY SOUND ================= */
  useEffect(() => {
    if (!messages.length) return;
    const last = messages[messages.length - 1];
    if (last.from === "admin") notifyAudioRef.current?.play();
  }, [messages]);

  /* ================= SEND TEXT ================= */
  const sendText = async () => {
    if (!msg.trim()) return;

    await postData("/chat/send", {
      customerId: user._id,
      customerName: user.name,
      mobile: user.mobile,
      from: "customer",
      type: "text",
      message: msg,
    });

    setMsg("");
  };

  /* ================= START RECORD ================= */
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
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();

        reader.onloadend = async () => {
          await postData("/chat/send", {
            customerId: user._id,
            customerName: user.name,
            mobile: user.mobile,
            from: "customer",
            type: "audio",
            audio: reader.result,
          });
        };

        reader.readAsDataURL(blob);
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic error:", err);
    }
  };

  /* ================= STOP RECORD ================= */
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <>
      <audio ref={notifyAudioRef} src="/notification.mp3" />

      {/* Floating Button */}
      {(hasUnread || !open) && (
        <button
          onClick={handleOpenChat}
          className="fixed bottom-16 right-5 w-16 h-16 rounded-full text-white text-3xl shadow-lg z-[100]
          flex items-center justify-center active:scale-95"
          style={{ backgroundColor: PRIMARY }}
        >
          💬
        </button>
      )}

      {/* CHAT BOX */}
      {open && (
        <div
          ref={chatBoxRef}
          className="fixed bottom-16 right-5 w-[90vw] max-w-[380px] h-[70vh]
          bg-white shadow-xl rounded-xl flex flex-col z-[100]"
        >
          {/* HEADER */}
          <div
            className="p-3 flex justify-between items-center text-white text-sm font-semibold"
            style={{ backgroundColor: HEADER }}
          >
            <span>Live Chat Support</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 p-3 overflow-y-auto bg-[#ECE5DD] space-y-3">
            {messages.map((m) => {
              const isMe = m.from === "customer";
              const time = new Date(m.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={m._id}
                  className={`flex gap-2 ${
                    isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isMe && (
                    <img
                      src={DEMO_ADMIN_IMAGE}
                      className="w-8 h-8 rounded-full"
                    />
                  )}

                  <div className="max-w-[75%]">
                    {m.type === "audio" ? (
                      <audio controls src={m.audio} className="w-full" />
                    ) : (
                      <div
                        className={`px-3 py-2 rounded-lg text-sm ${
                          isMe
                            ? "text-white rounded-br-none"
                            : "bg-white border rounded-bl-none"
                        }`}
                        style={isMe ? { backgroundColor: PRIMARY } : {}}
                      >
                        {m.message}
                      </div>
                    )}
                    <div className="text-[11px] text-gray-500 mt-1 text-right">
                      {time}
                    </div>
                  </div>

                  {isMe && (
                    <img
                      src={user?.avatar || DEMO_USER_IMAGE}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div className="p-2 border-t flex items-center gap-2">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendText()}
              placeholder="Type a message"
              className="flex-1 border rounded-full px-4 py-2 text-sm"
            />

            <button
              onClick={sendText}
              className="px-4 py-2 rounded-full text-white"
              style={{ backgroundColor: PRIMARY }}
            >
              Send
            </button>

            {/* MIC */}
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

          <div className="text-[9px] p-2 text-right text-gray-400">
            Powered by Enabazar
          </div>
        </div>
      )}
    </>
  );
}
