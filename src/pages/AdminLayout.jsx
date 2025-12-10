import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  FiUsers,
  FiHome,
  FiMessageSquare,
  FiBarChart2,
  FiMenu,
  FiX
} from "react-icons/fi";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Dashboard", icon: <FiHome size={18} />, to: "/admin" },
    { name: "Users", icon: <FiUsers size={18} />, to: "/admin/users" },
    { name: "Tickets", icon: <FiMessageSquare size={18} />, to: "/admin/tickets" },
    { name: "Analytics", icon: <FiBarChart2 size={18} />, to: "/admin/analytics" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans text-gray-800">

      {/* Mobile Top Bar */}
      <div className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-white shadow-sm fixed top-0 left-0 z-40">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <button onClick={() => setOpen(true)}>
          <FiMenu size={26} />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 bg-white border-r border-gray-200 shadow-sm z-50 
        transform transition-transform duration-300 
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Sidebar Header */}
        <div className="p-6  flex justify-between lg:justify-center items-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Admin Panel
          </h1>

          {/* Close Button (Mobile Only) */}
          <button className="lg:hidden " onClick={() => setOpen(false)}>
            <FiX size={25} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg text-gray-800 text-base transition-all ${
                  isActive
                    ? "bg-blue-50 border-l-4 border-blue-600 font-semibold shadow-sm"
                    : "hover:bg-gray-100"
                }`
              }
              onClick={() => setOpen(false)} // Close menu on mobile
            >
              {link.icon} {link.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 mt-14 lg:mt-0">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 lg:mb-10">
          <div>
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">
              Welcome, Admin
            </h2>
            <p className="text-sm lg:text-base text-gray-500">
              Manage users, tickets & insights
            </p>
          </div>
        </header>

        {/* Outlet Content Box */}
        <div className="bg-white rounded-2xl shadow p-4 lg:p-6 min-h-[70vh]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
