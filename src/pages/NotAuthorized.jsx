import React from "react";
import { AiOutlineStop } from "react-icons/ai";

const NotAuthorized = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">

      <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-lg w-[90%] animate-fadeIn">
        
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-5 rounded-full shadow">
            <AiOutlineStop className="text-red-600 text-5xl" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Access Denied
        </h1>

        <p className="text-gray-500 text-lg">
          You do not have permission to view this page.
        </p>

      </div>

      {/* Animation CSS */}
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

export default NotAuthorized;
