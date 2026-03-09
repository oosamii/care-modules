import React from "react";
import { Pill, Clock } from "lucide-react";

const Pharmacy = () => {
  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-50 px-4">
      <div className="bg-white border rounded-2xl shadow-sm p-10 text-center max-w-md w-full">
        
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-5 rounded-full">
            <Pill size={40} className="text-blue-600" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Pharmacy Module
        </h2>

        {/* Subtitle */}
        <p className="text-gray-500 text-sm mb-6">
          This feature is currently under development.
        </p>

        {/* Coming Soon Badge */}
        <div className="flex items-center justify-center gap-2 text-blue-600 font-medium text-sm bg-blue-50 px-4 py-2 rounded-full">
          <Clock size={16} />
          Coming Soon
        </div>
      </div>
    </div>
  );
};

export default Pharmacy;