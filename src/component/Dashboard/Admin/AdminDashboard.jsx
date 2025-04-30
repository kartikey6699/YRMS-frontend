import React, { useState, useRef } from "react";
import { FaLock, FaChalkboardTeacher, FaUserShield, FaGraduationCap } from "react-icons/fa";
import AccessManagement from "./AccessManagement";
import TrainingManagement from "./TrainingManagement";

const AdminDashboard = () => {
    const [selectedSection, setSelectedSection] = useState("");
    const [activeSection, setActiveSection] = useState("view");
    const contentRef = useRef(null);

    const handleSectionClick = (section) => {
        setSelectedSection(section);
        setActiveSection("view"); // Reset to view mode when switching sections
        if (contentRef.current) {
            contentRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8 mt-15">
            <div className="max-w-6xl w-full mx-auto">
                <div>
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6 text-center">
                        Admin Dashboard
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button
                            onClick={() => handleSectionClick("access")}
                            className={`flex flex-col items-center px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${selectedSection === "access"
                                ? "py-4 scale-[0.98] bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-blue-200"
                                : "py-6 bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-blue-200"
                                }`}
                        >
                            <div className="p-4 mb-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
                                <FaLock size={24} />
                            </div>
                            <span className="text-lg font-semibold text-gray-700">Access Management</span>
                            <span className="text-sm text-blue-600 mt-1">Manage roles and permissions</span>
                        </button>
                        <button
                            onClick={() => handleSectionClick("training")}
                            className={`flex flex-col items-center px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${selectedSection === "training"
                                ? "py-4 scale-[0.98] bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-200"
                                : "py-6 bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-purple-200"
                                }`}
                        >
                            <div className="p-4 mb-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md">
                                <FaChalkboardTeacher size={24} />
                            </div>
                            <span className="text-lg font-semibold text-gray-700">Training Management</span>
                            <span className="text-sm text-purple-600 mt-1">Manage trainers and sessions</span>
                        </button>
                    </div>
                </div>
                <div
                    ref={contentRef}
                    className="mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-200 transition-all duration-300"
                >
                    {selectedSection === "access" && (
                        <AccessManagement 
                            activeSection={activeSection} 
                            setActiveSection={setActiveSection} 
                        />
                    )}

                    {selectedSection === "training" && (
                        <TrainingManagement 
                            activeSection={activeSection} 
                            setActiveSection={setActiveSection} 
                        />
                    )}

                    {!selectedSection && (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center p-4 mb-4 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100">
                                <FaUserShield className="text-indigo-500 text-2xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                Welcome to Admin Dashboard
                            </h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                Select a section above to manage access controls or training programs.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;