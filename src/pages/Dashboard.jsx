import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { FiUsers, FiFileText, FiRefreshCw } from "react-icons/fi";

export default function Dashboard() {
  const [counts, setCounts] = useState({ users: 0, tickets: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCounts = async () => {
    setLoading(true);
    try {
      const [usersSnap, ticketsSnap] = await Promise.all([
        getDocs(collection(db, "users")),
        getDocs(collection(db, "tickets")),
      ]);

      setCounts({
        users: usersSnap.size,
        tickets: ticketsSnap.size,
      });
    } catch (err) {
      console.error("Error fetching counts:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <div className="p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3 hover:shadow-md transition bg-white">
      <div className={`p-3 rounded-lg ${color} text-white text-xl`}>
        {icon}
      </div>

      <div>
        <div className="text-xs text-gray-400 uppercase tracking-wide">{title}</div>
        <div className="text-xl font-semibold text-gray-900 mt-0.5">
          {loading ? "..." : value}
        </div>
      </div>
    </div>
  );

  return (
    <div className="">
      
      {/* Header */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">
        Dashboard
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard title="Users" value={counts.users} icon={<FiUsers />} color="bg-blue-600" />
        <StatCard title="Tickets" value={counts.tickets} icon={<FiFileText />} color="bg-green-600" />

        {/* Quick Actions */}
        <div className="p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between bg-white hover:shadow-md transition">
          <div className="text-xs text-gray-400 uppercase tracking-wide">
            Quick Actions
          </div>

          <button
            onClick={fetchCounts}
            disabled={loading}
            className="mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm shadow hover:bg-indigo-700 transition disabled:opacity-50"
          >
            <FiRefreshCw className="text-sm" />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>
    </div>
  );
}
