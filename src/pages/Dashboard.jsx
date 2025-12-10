import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { FiUsers, FiFileText, FiRefreshCw } from "react-icons/fi";

export default function Dashboard() {
  const [counts, setCounts] = useState({ users: 0, tickets: 0 });
  const [loading, setLoading] = useState(false);

  // Function to fetch counts from Firestore
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

  // Load counts on mount
  useEffect(() => {
    fetchCounts();
  }, []);

  // Card component for reusability
  const StatCard = ({ title, value, icon, color }) => (
    <div className={`p-6 rounded-2xl shadow-lg border border-gray-200 flex items-center gap-4 hover:shadow-xl transition bg-white`}>
      <div className={`p-4 rounded-lg ${color} text-white text-2xl`}>
        {icon}
      </div>
      <div>
        <div className="text-sm text-gray-400 uppercase">{title}</div>
        <div className="text-3xl font-bold text-gray-900 mt-1">{loading ? "..." : value}</div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Users" value={counts.users} icon={<FiUsers />} color="bg-blue-600" />
        <StatCard title="Tickets" value={counts.tickets} icon={<FiFileText />} color="bg-green-600" />

        {/* Quick Actions Card */}
        <div className="p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col justify-between bg-white">
          <div className="text-sm text-gray-400 uppercase">Quick Actions</div>
          <button
            onClick={fetchCounts}
            disabled={loading}
            className="mt-4 flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl font-medium shadow hover:bg-indigo-700 transition disabled:opacity-50"
          >
            <FiRefreshCw />
            {loading ? "Refreshing..." : "Refresh Counts"}
          </button>
        </div>
      </div>
    </div>
  );
}
