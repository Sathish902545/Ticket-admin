import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  getDoc
} from "firebase/firestore";
import { db } from "../firebase";
import { FiSend } from "react-icons/fi";
import { AiFillMessage } from "react-icons/ai";

export default function UserChat() {
  const { uid } = useParams();
  const [userData, setUserData] = useState({});
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const chatEndRef = useRef(null);

  const detectIntent = (text) => {
    text = text.toLowerCase();

    if (
      text.includes("billing") ||
      text.includes("payment") ||
      text.includes("invoice")
    ) {
      return { type: "billing", message: "💳 Billing issue detected. Creating a ticket..." };
    }

    if (
      text.includes("not working") ||
      text.includes("error") ||
      text.includes("bug") ||
      text.includes("issue") ||
      text.includes("crash") ||
      text.includes("fail") ||
      text.includes("problem")
    ) {
      return { type: "technical", message: "🛠️ Technical issue detected. Creating a ticket..." };
    }

    if (text.includes("password") || text.includes("reset")) {
      return { type: "password", message: "🔐 Password issue detected. Creating a ticket..." };
    }

    return { type: "general", message: "Thank you! Our support team will reply shortly." };
  };

  useEffect(() => {
    const fetchUser = async () => {
      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);
      if (snap.exists()) setUserData(snap.data());
    };
    fetchUser();
  }, [uid]);

  useEffect(() => {
    const q = query(
      collection(db, "chatRooms", uid, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, async (snapshot) => {
      let data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

      setMessages(data);

      if (data.length === 0) {
        await addDoc(collection(db, "chatRooms", uid, "messages"), {
          text: "👋 Hello! How can I assist you today?",
          sender: "admin",
          createdAt: serverTimestamp()
        });
        return;
      }
    });

    return unsub;
  }, [uid]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendReply = async () => {
    if (!reply.trim()) return;

    await addDoc(collection(db, "chatRooms", uid, "messages"), {
      text: reply.trim(),
      sender: "admin",
      createdAt: serverTimestamp()
    });

    setReply("");
  };

  return (
    <div className="w-full h-[530px] bg-[var(--color-primary)] rounded-3xl shadow-xl flex flex-col overflow-hidden">

  {/* HEADER */}
  <div className="flex items-center justify-between px-6 py-4 bg-[var(--color-primary)] shadow-sm">
    <div className="flex items-center gap-4">
      <div className="bg-[var(--color-secondary)] text-white p-3 rounded-full shadow">
        <AiFillMessage className="text-2xl" />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900">Chat with {userData.username}</h2>
        <p className="text-sm text-gray-500">{userData.email}</p>
      </div>
    </div>
  </div>

  {/* CHAT AREA */}
  <div className="flex-1 overflow-y-auto p-5 bg-white space-y-4">
    {messages.map((msg) => (
      <div key={msg.id} className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}>
        <div className={`max-w-[70%] px-4 py-3 rounded-2xl shadow-sm text-[15px] leading-relaxed
          ${msg.sender === "admin"
            ? "bg-[var(--color-secondary)] text-white rounded-br-none shadow-md"
            : "bg-white border border-gray-300 text-gray-900 rounded-bl-none font-semibold"
          }`}
        >
          {msg.text}
        </div>
      </div>
    ))}
    <div ref={chatEndRef}></div>
  </div>

  {/* INPUT SECTION */}
  <div className="p-4 bg-white shadow-inner flex items-center gap-3">
    <input
      value={reply}
      onChange={(e) => setReply(e.target.value)}
      placeholder="Type your message..."
      className="flex-1 px-4 py-3 rounded-xl border border-gray-300 bg-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-secondary)] outline-none text-gray-900 shadow-sm"
    />

    <button
      onClick={sendReply}
      className="bg-[var(--color-secondary)] hover:bg-blue-700 transition text-white p-3 rounded-xl shadow-md"
    >
      <FiSend className="text-xl" />
    </button>
  </div>
</div>

  );
}
