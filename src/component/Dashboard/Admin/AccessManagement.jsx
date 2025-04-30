import React from "react";
import { FaUsersCog, FaUserLock, FaKey } from "react-icons/fa";

const AccessManagement = ({ activeSection, setActiveSection }) => {
    return (
        <div>
            {activeSection === "view" ? (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
                            <FaUsersCog className="mr-2 text-blue-500" /> Access Management
                        </h3>
                        <button 
                            onClick={() => setActiveSection("add")}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                            Add New Access Rule
                        </button>
                    </div>
                    
                    {/* Placeholder for access management content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg bg-blue-50">
                            <FaUserLock className="text-blue-600 text-2xl mb-2" />
                            <h4 className="font-medium">Role Management</h4>
                            <p className="text-sm text-gray-600">Manage user roles and permissions</p>
                        </div>
                        <div className="p-4 border rounded-lg bg-purple-50">
                            <FaKey className="text-purple-600 text-2xl mb-2" />
                            <h4 className="font-medium">Permission Sets</h4>
                            <p className="text-sm text-gray-600">Configure detailed access controls</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-6">Add New Access Rule</h3>
                    {/* Form for adding new access rule would go here */}
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="text-gray-700">Access rule creation form would appear here</p>
                    </div>
                    <div className="mt-4 flex justify-end space-x-3">
                        <button 
                            onClick={() => setActiveSection("view")}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                            Save Access Rule
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccessManagement;