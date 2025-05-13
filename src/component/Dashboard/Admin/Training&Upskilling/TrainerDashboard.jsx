import React from "react";
import AssignTraining from "./AssignTraining";
import ProfileCard from "../../../helper/ProfileCard";

const TrainerDashboard = () => {
    const userId = sessionStorage.getItem('userId');


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Card at the top */}
        <ProfileCard publicId={userId} />
        
        {/* AssignTraining component below */}
        <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-200">
          <AssignTraining />
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;