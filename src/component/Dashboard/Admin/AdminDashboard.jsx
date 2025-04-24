import React, { useState, useRef, useEffect } from "react";
import { FaBox, FaTags, FaUsers } from "react-icons/fa";
import UserList from "./ManageUsers/UserList";
import AddResource from "./ManageUsers/AddResources";
import AddRole from "./ManageRoles/AddRole";
import RolesPage from "./ManageRoles/ManageRole";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles } from "../../../features/role/roleAction";

const AdminDashboard = () => {
    const dispatch = useDispatch()    
    const [selectedSection, setSelectedSection] = useState("");
    const [activeSection, setActiveSection] = useState("view"); // 'view' or 'add'
    const contentRef = useRef(null);
    const [selectedRole, setSelectedRole] = useState(null); 

    useEffect(() => {
        dispatch(fetchRoles());
    }, [dispatch])
    
    const handleSectionClick = (section) => {
        setSelectedSection(section);
        setActiveSection("view"); // Reset to view mode when switching sections
        if (contentRef.current) {
            contentRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
            <div className="max-w-6xl w-full mx-auto">
                <div>
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6 text-center">
                        Admin Dashboard
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  ">
                        <button
                            onClick={() => handleSectionClick("user")}
                            className={`flex flex-col items-center px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${selectedSection === "user"
                                ? "py-4 scale-[0.98] bg-gradient-to-br from-emerald-100 to-teal-100 border-2 border-emerald-200"
                                : "py-6 bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-emerald-200"
                                }`}
                        >
                            <div className="p-4 mb-3 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md">
                                <FaTags size={24} />
                            </div>
                            <span className="text-lg font-semibold text-gray-700">User Management</span>
                            <span className="text-sm text-emerald-600 mt-1">Manage Users</span>
                        </button>
                        <button
                            onClick={() => handleSectionClick("role")}
                            className={`flex flex-col items-center px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${selectedSection === "role"
                                ? "py-4 scale-[0.98] bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-blue-200"
                                : "py-6 bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-blue-200"
                                }`}
                        >
                            <div className="p-4 mb-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
                                <FaBox size={24} />
                            </div>
                            <span className="text-lg font-semibold text-gray-700">Role Management</span>
                            <span className="text-sm text-blue-600 mt-1">Manage Rols</span>
                        </button>
                        <button
                            onClick={() => handleSectionClick("competency")}
                            className={`flex flex-col items-center px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${selectedSection === "competency"
                                ? "py-4 scale-[0.98] bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-200"
                                : "py-6 bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-purple-200"
                                }`}
                        >
                            <div className="p-4 mb-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md">
                                <FaUsers size={24} />
                            </div>
                            <span className="text-lg font-semibold text-gray-700">Competencies Management</span>
                            <span className="text-sm text-purple-600 mt-1">Manage system Competencies</span>
                        </button>
                    </div>
                </div>
                <div
                    ref={contentRef}
                    className="mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-200 transition-all duration-300"
                >
                    {selectedSection === "user" && (
                        <>
                            {activeSection === "view" ? (
                                <UserList setActiveSection={setActiveSection} />
                            ) : (
                                <AddResource
                                    setActiveSection={setActiveSection}
                                    onSuccess={() => setActiveSection("view")}
                                />
                            )}
                        </>
                    )}

                    {selectedSection === "role" && (
                        <>
                            {activeSection === "view" ? (
                                <RolesPage setActiveSection={setActiveSection} setSelectedRole={setSelectedRole} />
                            ) : (
                                <AddRole
                                    setActiveSection={setActiveSection}
                                    selectedRole={selectedRole}
                                    onSuccess={() => setActiveSection("view")}
                                />
                            )}
                        </>
                    )}
                    {selectedSection === "competency"}
                    {!selectedSection && (
                        <div className="text-center py-12">
                            <div className="inline-block p-4 mb-4 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100">
                                <FaUsers className="text-indigo-500 text-2xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                Welcome to Admin Dashboard
                            </h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                Select a section above to manage your eCommerce store.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;