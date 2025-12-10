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

  // Update ticket status
  const updateStatus = async (id, newStatus) => {
    await updateDoc(doc(db, "tickets", id), { status: newStatus });

    if (selectedTicket?.id === id) {
      setSelectedTicket({ ...selectedTicket, status: newStatus });
    }
  };

  // Get username
  const getUsername = (userId) => {
    const user = users.find((u) => u.id === userId || u.uid === userId);
    return user ? user.username || user.email : "Unknown User";
  };

  // Filter tickets
  const filteredTickets = tickets.filter((t) => {
    const statusMatch = filterStatus === "all" || t.status === filterStatus;
    const priorityMatch = filterPriority === "all" || (t.priority || "") === filterPriority;
    const userMatch = filterUser === "all" || t.userId === filterUser;
    return statusMatch && priorityMatch && userMatch;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 bg-gray-100 min-h-screen">

      {/* LEFT PANEL */}
      <div className="col-span-1 bg-white shadow-xl rounded-3xl p-5 border border-gray-200">

        {/* Title */}
        <h2 className="text-xl font-bold mb-5 flex items-center gap-3 text-gray-900">
          <FiFilter className="text-indigo-600 text-2xl" /> Tickets
        </h2>

        {/* Filters */}
        <div className="flex flex-col gap-4 mb-5">
          {/* Status */}
          <div>
            <label className="block text-gray-600 text-sm mb-1 font-medium">Status</label>
            <select
              className="w-full p-3 border rounded-2xl text-sm bg-white shadow-sm focus:ring-2 focus:ring-indigo-400"
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

          {/* Priority */}
          <div>
            <label className="block text-gray-600 text-sm mb-1 font-medium">Priority</label>
            <select
              className="w-full p-3 border rounded-2xl text-sm bg-white shadow-sm focus:ring-2 focus:ring-indigo-400"
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
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {filteredTickets.length === 0 ? (
            <p className="text-gray-500 text-center py-10 text-sm">No tickets found</p>
          ) : (
            filteredTickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className={`p-4 rounded-2xl shadow-md cursor-pointer transition hover:shadow-xl ${
                  selectedTicket?.id === t.id ? "bg-indigo-50 border-indigo-400" : "bg-white"
                }`}
              >
                <h3 className="font-semibold text-gray-900 text-base">{getUsername(t.userId)}</h3>

                <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                  <FiTag className="text-indigo-500" /> {t.category || "General"}
                </p>

                <div className="flex justify-between items-center mt-3 text-xs">
                  <span className="text-gray-600">
                    Priority: <strong>{t.priority}</strong>
                  </span>

                  <span
                    className={`px-2 py-1 rounded-full font-semibold ${
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
            ))
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="col-span-2 bg-white shadow-xl rounded-3xl border border-gray-200 flex flex-col">

        {selectedTicket ? (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-indigo-50 p-5 border-b rounded-t-3xl gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedTicket.title || "Ticket Details"}
                </h2>
                <p className="flex items-center gap-2 text-gray-600 mt-1 text-sm">
                  <FiUser className="text-indigo-600" /> {getUsername(selectedTicket.userId)}
                </p>
              </div>

              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => updateStatus(selectedTicket.id, "closed")}
                  className="px-4 py-2 rounded-2xl bg-red-100 text-red-700 font-semibold text-sm hover:bg-red-200"
                >
                  <FiXCircle className="inline" /> Close
                </button>

                <button
                  onClick={() => updateStatus(selectedTicket.id, "resolved")}
                  className="px-4 py-2 rounded-2xl bg-green-100 text-green-700 font-semibold text-sm hover:bg-green-200"
                >
                  <FiCheckCircle className="inline" /> Resolve
                </button>
              </div>
            </div>

            {/* Chat Box */}
            <div className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-y-auto space-y-4">
              {(selectedTicket.messages || []).map((msg, index) => (
                <div
                  key={index}
                  className={`max-w-[80%] px-4 py-3 rounded-3xl shadow-md text-sm ${
                    msg.sender === "user"
                      ? "bg-indigo-100 text-indigo-900"
                      : "bg-gray-200 text-gray-800 ml-auto"
                  }`}
                >
                  <p>{msg.message}</p>
                  <p className="text-[10px] text-gray-500 mt-1 text-right">
                    {new Date(msg.time).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Reply Input */}
            <div className="p-4 sm:p-5 border-t bg-white flex gap-3 rounded-b-3xl">
              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your reply..."
                className="flex-1 p-3 text-sm rounded-2xl border shadow-sm focus:ring-2 focus:ring-indigo-400"
              />

              <button
                onClick={sendReply}
                className="px-5 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-semibold hover:bg-indigo-700 flex items-center gap-2"
              >
                <FiMessageSquare /> Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-sm sm:text-lg">
            Select a ticket to view details
          </div>
        )}
      </div>
    </div>
  );
}
