import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await signInWithEmailAndPassword(auth, email, password);

            const uid = res.user.uid;
            const snap = await getDoc(doc(db, "users", uid));
            const data = snap.data();

             if (data?.role === "admin") {
  navigate(`/admin`);
} else {
  navigate(`/notAuthorized`);
}

    } catch (e) {
            alert(e.message);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-200">

                {/* Logo or Title */}
                <h1 className="text-3xl font-bold text-secondary mb-2 text-center">
                    Welcome Back
                </h1>
                <p className="text-gray-500 text-center mb-8">
                    Login to continue your account
                </p>

                {/* Email */}
                <label className="text-gray-800 font-medium mb-1">Email</label>
                <input
                    type="email"
                    className="w-full mb-4 px-4 py-3 border rounded-xl border-gray-300 
                       focus:ring-2 focus:outline-none transition"
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/* Password */}
                <label className="text-gray-800 font-medium mb-1">Password</label>
                <input
                    type="password"
                    className="w-full mb-6 px-4 py-3 border rounded-xl border-gray-300 
                       focus:ring-2 focus:outline-none transition"
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                {/* Button */}
                <button
                    onClick={handleLogin}
                    className="w-full py-3 bg-secondary text-white font-semibold
                       rounded-xl transition transform active:scale-95"
                >
                    Login
                </button>

                {/* Bottom text */}
                <p className="text-sm text-gray-600 mt-6 text-center">
                    Don’t have an account?
                    <span
                        onClick={() => navigate("/signup")}
                        className="text-secondary font-medium cursor-pointer hover:underline ml-1"
                    >
                        Create account
                    </span>
                </p>
            </div>
        </div>
    );
}
