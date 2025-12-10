import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const SignupWithFirebase = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">

      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-xl w-[90%] text-center animate-fadeIn">

        <div className="flex justify-center mb-5">
          <AiOutlineLoading3Quarters className="text-yellow-500 text-5xl animate-spin" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Waiting for Super Admin Approval
        </h1>

        <p className="text-gray-600 text-lg">
          Your account is pending.  
          Once the Super Admin grants permission, you’ll get full access.
        </p>

        <div className="mt-6 text-yellow-500 font-medium text-lg tracking-widest animate-pulse">
          • • •
        </div>
      </div>

      {/* Animation for fade-in */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </div>
  );
};

export default SignupWithFirebase;
