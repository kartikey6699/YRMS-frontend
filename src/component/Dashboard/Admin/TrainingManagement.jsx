import React from "react";
import { FaChalkboardTeacher, FaCalendarAlt, FaUserGraduate } from "react-icons/fa";

const TrainingManagement = ({ activeSection, setActiveSection }) => {
    return (
        <div>
            {activeSection === "view" ? (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
                            <FaChalkboardTeacher className="mr-2 text-purple-500" /> Training Management
                        </h3>
                        <div className="space-x-3">
                            <button 
                                onClick={() => setActiveSection("addTrainer")}
                                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
                            >
                                Add Trainer
                            </button>
                            <button 
                                onClick={() => setActiveSection("addSession")}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                            >
                                Schedule Session
                            </button>
                        </div>
                    </div>
                    
                    {/* Placeholder for training management content */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border rounded-lg bg-purple-50">
                            <FaChalkboardTeacher className="text-purple-600 text-2xl mb-2" />
                            <h4 className="font-medium">Trainers</h4>
                            <p className="text-sm text-gray-600">Manage training staff</p>
                        </div>
                        <div className="p-4 border rounded-lg bg-green-50">
                            <FaCalendarAlt className="text-green-600 text-2xl mb-2" />
                            <h4 className="font-medium">Sessions</h4>
                            <p className="text-sm text-gray-600">View scheduled training</p>
                        </div>
                        <div className="p-4 border rounded-lg bg-blue-50">
                            <FaUserGraduate className="text-blue-600 text-2xl mb-2" />
                            <h4 className="font-medium">Participants</h4>
                            <p className="text-sm text-gray-600">Manage trainees</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                        {activeSection === "addTrainer" ? "Add New Trainer" : "Schedule Training Session"}
                    </h3>
                    
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="text-gray-700">
                            {activeSection === "addTrainer" 
                                ? "Trainer registration form would appear here" 
                                : "Session scheduling form would appear here"}
                        </p>
                    </div>
                    
                    <div className="mt-4 flex justify-end space-x-3">
                        <button 
                            onClick={() => setActiveSection("view")}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition">
                            {activeSection === "addTrainer" ? "Save Trainer" : "Schedule Session"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrainingManagement;