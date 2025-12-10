import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./pages/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import UserChat from "./pages/UserChat";
import Tickets from "./pages/Tickets";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SignupWithFirebase from './pages/SignupWithFirebase'
import NotAuthorized from "./pages/NotAuthorized";

export default function App() {
  return (
    <Routes>

      {/* Login & Signup */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signupWithFirebase" element={<SignupWithFirebase />} />
      <Route path="/NotAuthorized" element={<NotAuthorized />} />
     


      {/* Redirect root → login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="users/:uid/chat" element={<UserChat />} />
        <Route path="tickets" element={<Tickets />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>
    </Routes>
  );
}



/* View all tickets with filters for status, priority, and user.

Respond to user messages in real-time.

Close or resolve tickets efficiently.

Analytics: monitor ticket counts, average response time, and satisfaction.

Collect detailed ticket information: category, description, and priority. */