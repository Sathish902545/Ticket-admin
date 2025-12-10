import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email || !password || !username) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await createUserWithEmailAndPassword(auth, email, password);
      const uid = res.user.uid;

      await setDoc(doc(db, "users", uid), {
        uid,
        email: res.user.email,
        username,
        role: "user",
      });

      alert("Signup successful");
      navigate("/signupWithFirebase");

    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-200">

        {/* Title */}
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-2">
          Create Account
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Sign up to continue
        </p>

        {/* Username */}
        <label className="text-gray-700 font-medium text-sm">Username</label>
        <input
          type="text"
          className="w-full px-4 py-3 mb-4 rounded-xl border border-gray-300 
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          placeholder="Enter username"
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Email */}
        <label className="text-gray-700 font-medium text-sm">Email</label>
        <input
          type="email"
          className="w-full px-4 py-3 mb-4 rounded-xl border border-gray-300 
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <label className="text-gray-700 font-medium text-sm">Password</label>
        <input
          type="password"
          className="w-full px-4 py-3 mb-6 rounded-xl border border-gray-300 
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className={`w-full py-3 bg-blue-600 text-white rounded-xl font-semibold 
          transition transform active:scale-95 
          ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"}`}
        >
          {loading ? "Creating account..." : "Signup"}
        </button>

        {/* Bottom */}
        <p className="text-center mt-6 text-gray-600">
          Already have an account?
          <span
            onClick={() => navigate("/")}
            className="text-blue-600 cursor-pointer font-semibold hover:underline ml-1"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
