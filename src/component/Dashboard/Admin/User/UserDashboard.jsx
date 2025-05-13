import React, { useState, useRef } from "react";
import { FaUserShield } from "react-icons/fa";
import UserTrainings from "./UserTrainings";
import ProfileCard from "../../../helper/ProfileCard";
const UserDashboard = () => {
    const contentRef = useRef(null);
    const userId = sessionStorage.getItem('userId');

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8 mt-15">
            <div className="max-w-6xl w-full mx-auto">
                {/* Profile Card at the top */}
                <ProfileCard publicId={userId} />
                
                {/* Directly show UserTrainings below */}
                <div
                    ref={contentRef}
                    className="mt-6 p-6 bg-white rounded-xl shadow-lg border border-gray-200 transition-all duration-300"
                >
                    <UserTrainings />
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;