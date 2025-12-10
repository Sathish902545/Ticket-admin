import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Query users where role is not admin
    const q = query(collection(db, "users"), where("role", "!=", "admin"));
    const unsub = onSnapshot(q, (snap) => {
      const userList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setUsers(userList);
    });
    return unsub;
  }, []);

  return (
    <div className="">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Users</h1>
        <div className="text-gray-500 text-sm">Total Users: {users.length}</div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((u) => (
          <div
            key={u.uid || u.id}
            className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition flex flex-col justify-between"
          >
            {/* Profile Section */}
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                style={{
                  background: `linear-gradient(135deg, #${Math.floor(
                    Math.random() * 16777215
                  ).toString(16)}, #${Math.floor(Math.random() * 16777215).toString(16)})`,
                }}
              >
                {(u.username || u.email || "").charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {u.username || u.email}
                </h2>
                <p className="text-sm text-gray-500">{u.email}</p>
              </div>
            </div>

            {/* Role */}
            <div className="mb-4">
              <p className="text-sm text-gray-400">Role: {u.role || "User"}</p>
            </div>

            {/* Chat Button */}
            <Link
              to={`/admin/users/${u.uid || u.id}/chat`}
              state={{ uid: u.uid || u.id }}
              className="mt-auto px-5 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition text-center font-medium"
            >
              Open Chat
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
