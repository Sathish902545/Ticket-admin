import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Analytics() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    closed: 0,
    progress: 0,
    avgResponse: 0,
    satisfaction: 0,
  });
  const [chartData, setChartData] = useState({ labels: [], counts: [] });

  useEffect(() => {
    const q = query(collection(db, "tickets"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTickets(data);
      generateStats(data);
      generateChart(data);
    });
    return unsub;
  }, []);

  const generateStats = (data) => {
    const total = data.length;
    const open = data.filter((t) => t.status === "open").length;
    const closed = data.filter((t) => t.status === "closed").length;
    const progress = data.filter((t) => t.status === "in-progress").length;

    setStats({
      total,
      open,
      closed,
      progress,
      avgResponse: Math.floor(Math.random() * 40) + 10,
      satisfaction: Math.floor(Math.random() * 30) + 70,
    });
  };

  const generateChart = (data) => {
    const counts = {};
    data.forEach((t) => {
      if (!t.createdAt) return;
      const date = new Date(t.createdAt.seconds * 1000).toLocaleDateString();
      counts[date] = (counts[date] || 0) + 1;
    });
    setChartData({ labels: Object.keys(counts), counts: Object.values(counts) });
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10">
        Analytics Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <StatCard title="Total Tickets" value={stats.total} color="blue" />
        <StatCard title="Open Tickets" value={stats.open} color="green" />
        <StatCard title="Closed Tickets" value={stats.closed} color="red" />
        <StatCard title="In Progress" value={stats.progress} color="yellow" />
        <StatCard title="Avg Response Time" value={`${stats.avgResponse} min`} color="purple" />
        <StatCard title="Satisfaction" value={`${stats.satisfaction}%`} color="pink" />
      </div>

      {/* Chart Section */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-gray-300 mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tickets Per Day</h2>
        <div className="h-72">
          <Bar
            data={{
              labels: chartData.labels,
              datasets: [
                {
                  label: "Tickets",
                  data: chartData.counts,
                  backgroundColor: "rgba(79, 70, 229, 0.8)",
                  borderRadius: 12,
                },
              ],
            }}
            options={{
              plugins: { legend: { display: false } },
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-gray-300">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Ticket Details</h2>

        <div className="overflow-hidden border border-gray-200 rounded-2xl">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-4 text-sm font-medium">User</th>
                <th className="px-6 py-4 text-sm font-medium">Category</th>
                <th className="px-6 py-4 text-sm font-medium">Priority</th>
                <th className="px-6 py-4 text-sm font-medium">Status</th>
                <th className="px-6 py-4 text-sm font-medium">Created</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {tickets.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-gray-50 transition cursor-pointer"
                >
                  <td className="px-6 py-4 text-gray-800">{t.username || t.userId}</td>
                  <td className="px-6 py-4 text-gray-800">{t.category || "General"}</td>
                  <td className="px-6 py-4 capitalize">{t.priority}</td>

                  <td
                    className={`px-6 py-4 font-semibold ${
                      t.status === "open"
                        ? "text-green-600"
                        : t.status === "closed"
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  >
                    {t.status}
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    {t.createdAt
                      ? new Date(t.createdAt.seconds * 1000).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colorMap = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    red: "from-red-500 to-red-600",
    yellow: "from-yellow-500 to-yellow-600",
    purple: "from-purple-500 to-purple-600",
    pink: "from-pink-500 to-pink-600",
  };

  return (
    <div className="rounded-3xl shadow-lg p-6 bg-white/80 backdrop-blur-xl border border-gray-200 hover:shadow-xl transition">
      <p className="text-sm text-gray-500 mb-2">{title}</p>
      <h2
        className={`text-3xl font-extrabold bg-gradient-to-r ${colorMap[color]} bg-clip-text text-transparent`}
      >
        {value}
      </h2>
    </div>
  );
}
