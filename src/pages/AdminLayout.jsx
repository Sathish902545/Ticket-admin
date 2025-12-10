import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { FiUsers, FiHome, FiMessageSquare, FiBarChart2 } from "react-icons/fi";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 text-gray-900 shadow-lg">
        <div className="p-6">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-wide">
            Admin Panel
          </h1>
        </div>

        <nav className="p-4 space-y-3">
          {/* Dashboard */}
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              isActive
                ? "block px-5 py-3 rounded-lg bg-indigo-600 text-white font-semibold text-lg"
                : "block px-5 py-3 rounded-lg hover:bg-indigo-700 hover:text-white transition-all text-lg"
            }
          >
            <div className="flex items-center gap-3">
              <FiHome size={20} /> Dashboard
            </div>
          </NavLink>

          {/* Users */}
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              isActive
                ? "block px-5 py-3 rounded-lg bg-indigo-600 text-white font-semibold text-lg"
                : "block px-5 py-3 rounded-lg hover:bg-indigo-700 hover:text-white transition-all text-lg"
            }
          >
            <div className="flex items-center gap-3">
              <FiUsers size={20} /> Users
            </div>
          </NavLink>

          {/* Tickets */}
          <NavLink
            to="/admin/tickets"
            className={({ isActive }) =>
              isActive
                ? "block px-5 py-3 rounded-lg bg-indigo-600 text-white font-semibold text-lg"
                : "block px-5 py-3 rounded-lg hover:bg-indigo-700 hover:text-white transition-all text-lg"
            }
          >
            <div className="flex items-center gap-3">
              <FiMessageSquare size={20} /> Tickets
            </div>
          </NavLink>

          {/* Analytics */}
          <NavLink
            to="/admin/analytics"
            className={({ isActive }) =>
              isActive
                ? "block px-5 py-3 rounded-lg bg-indigo-600 text-white font-semibold text-lg"
                : "block px-5 py-3 rounded-lg hover:bg-indigo-700 hover:text-white transition-all text-lg"
            }
          >
            <div className="flex items-center gap-3">
              <FiBarChart2 size={20} /> Analytics
            </div>
          </NavLink>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 bg-gray-50">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome, Admin</h2>
            <p className="text-base text-gray-600">
              Manage users, tickets & insights
            </p>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}
