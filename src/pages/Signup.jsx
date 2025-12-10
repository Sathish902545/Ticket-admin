import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [username, setUsername] = useState(""); // ⬅ NEW
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const uid = res.user.uid;

      await setDoc(doc(db, "users", uid), {
        uid: uid,
        email: res.user.email,
        username: username, // ⬅ SAVE USERNAME
        role: "user",
      });

      alert("Signup successful");
      navigate("/signupWithFirebase");

    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-200">

        <h1 className="text-3xl font-bold text-secondary text-center mb-2">Create Account</h1>
        <p className="text-gray-500 text-center mb-8">Sign up to continue</p>

        {/* Username */}
        <label className="text-gray-700 font-medium">Username</label>
        <input
          type="text"
          className="w-full px-4 py-3 mb-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary"
          placeholder="Enter username"
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Email */}
        <label className="text-gray-700 font-medium">Email</label>
        <input
          type="email"
          className="w-full px-4 py-3 mb-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <label className="text-gray-700 font-medium">Password</label>
        <input
          type="password"
          className="w-full px-4 py-3 mb-6 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className="w-full py-3 bg-secondary text-white rounded-xl font-semibold hover:bg-secondary transition"
        >
          Signup
        </button>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-secondary cursor-pointer font-semibold"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
