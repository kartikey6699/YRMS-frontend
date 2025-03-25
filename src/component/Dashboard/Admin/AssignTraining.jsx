import React from 'react';
import { FaTools } from 'react-icons/fa';

const AssignTraining = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-8">
      <h2 className="text-3xl font-bold text-indigo-800 mb-6">Assign Training</h2>
      <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
        <FaTools className="text-indigo-500 text-6xl mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Coming Soon</h3>
        <p className="text-gray-600 text-center">
          We are working hard to bring you the best training assignment experience. Stay tuned for updates!
        </p>
      </div>
    </div>
  );
};

export default AssignTraining;
