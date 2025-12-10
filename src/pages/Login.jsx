import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            const res = await signInWithEmailAndPassword(auth, email, password);
            const uid = res.user.uid;

            const snap = await getDoc(doc(db, "users", uid));
            const data = snap.data();

            if (data?.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/notAuthorized");
            }

        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-200">

                {/* Title */}
                <h1 className="text-3xl font-semibold text-gray-900 mb-2 text-center">
                    Welcome Back
                </h1>
                <p className="text-gray-500 text-center mb-8">
                    Login to continue your dashboard
                </p>

                {/* Email */}
                <label className="text-gray-800 font-medium text-sm mb-1">Email</label>
                <input
                    type="email"
                    className="w-full mb-5 px-4 py-3 border rounded-xl border-gray-300 
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       outline-none transition"
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/* Password */}
                <label className="text-gray-800 font-medium text-sm mb-1">Password</label>
                <input
                    type="password"
                    className="w-full mb-6 px-4 py-3 border rounded-xl border-gray-300 
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       outline-none transition"
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                {/* Button */}
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className={`w-full py-3 bg-blue-600 text-white font-semibold
                       rounded-xl transition transform active:scale-95
                       ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"}`}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                {/* Register */}
                <p className="text-sm text-gray-600 mt-6 text-center">
                    Don’t have an account?
                    <span
                        onClick={() => navigate("/signup")}
                        className="text-blue-600 font-medium cursor-pointer hover:underline ml-1"
                    >
                        Create account
                    </span>
                </p>
            </div>
        </div>
    );
}
