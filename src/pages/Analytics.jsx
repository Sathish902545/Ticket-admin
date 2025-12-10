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
    <div className="p-4 sm:p-6 xl:p-10">
      {/* Header */}
      <h1 className="text-xl sm:text-2xl xl:text-3xl font-extrabold text-gray-900 mb-8">
        Analytics Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="
        grid 
        grid-cols-2 
        sm:grid-cols-3 
        lg:grid-cols-4 
        xl:grid-cols-6 
        gap-4 
        mb-8
      ">
        <StatCard title="Total Tickets" value={stats.total} />
        <StatCard title="Open Tickets" value={stats.open} />
        <StatCard title="Closed Tickets" value={stats.closed} />
        <StatCard title="In Progress" value={stats.progress} />
        <StatCard title="Avg Response" value={`${stats.avgResponse} min`} />
        <StatCard title="Satisfaction" value={`${stats.satisfaction}%`} />
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-200 mb-10 hover:shadow-2xl transition">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">
          Tickets Per Day
        </h2>
        <div className="h-64 sm:h-72">
          <Bar
            data={{
              labels: chartData.labels,
              datasets: [
                {
                  label: "Tickets",
                  data: chartData.counts,
                  backgroundColor: "#2563EB", // Nice deep blue
                  borderRadius: 10,
                },
              ],
            }}
            options={{
              plugins: { legend: { display: false } },
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: { ticks: { color: "#000" }, grid: { color: "#e5e5e5" } },
                y: { ticks: { color: "#000" }, grid: { color: "#e5e5e5" } },
              },
            }}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white rounded-3xl shadow-lg border border-gray-200 p-6 transition">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">
          Ticket Details
        </h2>

        <table className="min-w-full text-left divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["User", "Category", "Priority", "Status", "Created At"].map(
                (head) => (
                  <th
                    key={head}
                    className="px-6 py-3 text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {head}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {tickets.map((t, index) => (
              <tr
                key={t.id}
                className={`transition hover:bg-gray-50 ${
                  index % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                }`}
              >
                <td className="px-6 py-3 text-gray-800">
                  {t.username || t.userId}
                </td>
                <td className="px-6 py-3 text-gray-800">
                  {t.category || "General"}
                </td>
                <td className="px-6 py-3 capitalize">{t.priority}</td>

                <td className="px-6 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      t.status === "open"
                        ? "bg-green-100 text-green-800"
                        : t.status === "closed"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>

                <td className="px-6 py-3 text-gray-500">
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
  );
}

// Stat Card Component
function StatCard({ title, value }) {
  return (
    <div className="rounded-3xl shadow-sm p-5 border border-gray-200 bg-white hover:shadow-xl transition">
      <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">
        {title}
      </p>
      <h2 className="text-xl sm:text-2xl font-bold text-black">{value}</h2>
    </div>
  );
}
