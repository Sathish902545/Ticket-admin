import React, { useEffect, useState } from "react";
import { collection, query, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import {
  FiFilter,
  FiMessageSquare,
  FiXCircle,
  FiCheckCircle,
  FiUser,
  FiTag,
} from "react-icons/fi";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterUser, setFilterUser] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [reply, setReply] = useState("");

  // Load users
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  // Load tickets
  useEffect(() => {
    const q = query(collection(db, "tickets"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTickets(list);
    });
    return unsubscribe;
  }, []);

  // Send admin reply
  const sendReply = async () => {
    if (!reply.trim() || !selectedTicket) return;
    const ticketRef = doc(db, "tickets", selectedTicket.id);
    const updatedMessages = selectedTicket.messages ? [...selectedTicket.messages] : [];
    updatedMessages.push({
      sender: "admin",
      message: reply,
      time: new Date().toISOString(),
    });
    await updateDoc(ticketRef, { messages: updatedMessages });
    setReply("");
    setSelectedTicket({ ...selectedTicket, messages: updatedMessages });
  };

  // Update status
  const updateStatus = async (id, newStatus) => {
    await updateDoc(doc(db, "tickets", id), { status: newStatus });
    if (selectedTicket?.id === id) {
      setSelectedTicket({ ...selectedTicket, status: newStatus });
    }
  };

  // Helper: get username from userId
  const getUsername = (userId) => {
    const user = users.find((u) => u.id === userId || u.uid === userId);
    return user ? user.username || user.email : "Unknown User";
  };

  // Filter tickets
  const filteredTickets = tickets.filter((t) => {
    const statusMatch = filterStatus === "all" || t.status.toLowerCase() === filterStatus.toLowerCase();
    const priorityMatch = filterPriority === "all" || (t.priority || "").toLowerCase() === filterPriority.toLowerCase();
    const userMatch = filterUser === "all" || t.userId === filterUser;
    return statusMatch && priorityMatch && userMatch;
  });

  return (
    <div className="grid grid-cols-3 gap-6 p-5 bg-gray-100 min-h-screen">

      {/* LEFT PANEL */}
      <div className="col-span-1 bg-white shadow-2xl rounded-3xl p-6 border border-gray-200">
  {/* Title */}
  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-900">
    <FiFilter className="text-indigo-600 text-2xl" /> Tickets
  </h2>

  {/* Filters */}
  <div className="flex flex-col sm:flex-row gap-3 mb-6">
    {/* Status Filter */}
    <div className="flex-1">
      <label className="block text-gray-600 text-sm mb-1 font-medium">Status</label>
      <select
        className="w-full p-3 border border-gray-300 rounded-2xl bg-white shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
      >
        <option value="all">All Status</option>
        <option value="open">Open</option>
        <option value="in-progress">In Progress</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
      </select>
    </div>

    {/* Priority Filter */}
    <div className="flex-1">
      <label className="block text-gray-600 text-sm mb-1 font-medium">Priority</label>
      <select
        className="w-full p-3 border border-gray-300 rounded-2xl bg-white shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
        value={filterPriority}
        onChange={(e) => setFilterPriority(e.target.value)}
      >
        <option value="all">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
    
  </div>

  {/* Ticket List */}
  <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
    {filteredTickets.length === 0 && (
      <p className="text-gray-500 text-center py-10">No tickets found</p>
    )}

    {filteredTickets.map((t) => (
      <div
        key={t.id}
        onClick={() => setSelectedTicket(t)}
        className={`p-5 rounded-2xl border shadow-lg transition cursor-pointer hover:scale-105 hover:shadow-2xl
          ${selectedTicket?.id === t.id ? "bg-indigo-50 border-indigo-400" : "bg-white border-gray-200"}`}
      >
        {/* Username */}
        <h3 className="font-semibold text-gray-900 text-lg">{getUsername(t.userId)}</h3>

        {/* Category */}
        <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
          <FiTag className="text-indigo-500" /> {t.category || "General"}
        </p>

        {/* Priority & Status */}
        <div className="flex justify-between items-center mt-3">
          <span className="text-gray-600 text-sm">
            Priority: <span className="font-medium text-gray-800">{t.priority}</span>
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              t.status === "open"
                ? "bg-green-100 text-green-700"
                : t.status === "closed"
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {t.status}
          </span>
        </div>
      </div>
    ))}
  </div>
</div>


      {/* RIGHT PANEL */}
<div className="col-span-2 flex flex-col bg-white shadow-2xl rounded-3xl border border-gray-200 overflow-hidden">

  {selectedTicket ? (
    <>
      {/* Header */}
      <div className="flex justify-between items-center bg-indigo-50 p-5 border-b rounded-t-3xl">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{selectedTicket.title || "Ticket Details"}</h2>
          <p className="flex items-center gap-2 text-gray-600 mt-1">
            <FiUser className="text-indigo-600" /> {getUsername(selectedTicket.userId)}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => updateStatus(selectedTicket.id, "closed")}
            className="px-5 py-2 rounded-2xl bg-red-100 text-red-700 font-semibold flex items-center gap-2 hover:bg-red-200 transition"
          >
            <FiXCircle /> Close
          </button>

          <button
            onClick={() => updateStatus(selectedTicket.id, "resolved")}
            className="px-5 py-2 rounded-2xl bg-green-100 text-green-700 font-semibold flex items-center gap-2 hover:bg-green-200 transition"
          >
            <FiCheckCircle /> Resolve
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto space-y-4">
        {(selectedTicket.messages || []).map((msg, i) => (
          <div
            key={i}
            className={`max-w-[70%] px-5 py-3 rounded-3xl shadow-md
              ${msg.sender === "user"
                ? "bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-900"
                : "bg-gray-200 text-gray-800 ml-auto"
              }`}
          >
            <p className="text-sm">{msg.message}</p>
            <p className="text-xs text-gray-500 mt-1 text-right">{new Date(msg.time).toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Reply Box */}
      <div className="p-5 border-t bg-white flex gap-4 rounded-b-3xl shadow-inner">
        <input
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Type your reply..."
          className="flex-1 p-4 rounded-2xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
        />
        <button
          onClick={sendReply}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-2xl shadow hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <FiMessageSquare /> Send
        </button>
      </div>
    </>
  ) : (
    <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
      Select a ticket to view details
    </div>
  )}
</div>

    </div>
  );
}
