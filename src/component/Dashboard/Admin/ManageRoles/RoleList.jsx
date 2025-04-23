import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaSort, FaSortUp, FaSortDown, FaEdit, FaTrash } from 'react-icons/fa';
import DeleteConfirmationModal from '../../../helper/DeleteConfirmationModal';

const RoleList = ({ roles, setActiveSection, onDelete, onEdit, onSort, sortConfig }) => {
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, roleId: null, roleName: "" });
    const [searchTerm, setSearchTerm] = useState("");

    // Columns configuration
    const columns = [
        { key: "sno", label: "S.No" },
        { key: "role", label: "Role Name" },
        { key: "features", label: "Features" }
    ];

    // Filter roles based on search term
    const filteredRoles = roles.filter(role =>
        role.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle delete confirmation
    const handleDeleteConfirm = () => {
        onDelete(deleteModal.roleId);
        setDeleteModal({ isOpen: false, roleId: null, roleName: "" });
    };

    return (
        <div className="p-6 bg-gradient-to-r overscroll-none from-blue-50 to-purple-50 rounded-xl shadow-lg">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-3xl font-bold text-blue-800">Roles Management</h2>
                    <Link
                        className="btn px-6 py-3 rounded-lg font-semibold text-lg flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
                        onClick={() => {setActiveSection('add')}}
                    >
                        <FaPlus className="mr-2" />
                        Add Role
                    </Link>
                </div>
                
                {/* Global Search */}
                <div className="mb-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search roles or features..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="absolute right-3 top-3 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`overflow-x-auto rounded-lg shadow-lg border border-gray-200 ${deleteModal.isOpen ? 'filter blur-sm' : ''}`}>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-800">
                            {columns.map(column => (
                                <th
                                    key={column.key}
                                    className="p-3 text-left font-semibold text-sm border-b border-gray-200"
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{column.label}</span>
                                        {column.key !== "sno" && column.key !== "features" && (
                                            <button
                                                onClick={() => onSort(column.key)}
                                                className="ml-2 focus:outline-none"
                                            >
                                                {sortConfig.key === column.key ? (
                                                    sortConfig.direction === "ascending" ? (
                                                        <FaSortUp className="text-blue-600" />
                                                    ) : (
                                                        <FaSortDown className="text-blue-600" />
                                                    )
                                                ) : (
                                                    <FaSort className="text-gray-400 hover:text-blue-600" />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </th>
                            ))}
                            <th className="p-3 text-left font-semibold text-sm border-b border-gray-200">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRoles.map((role, index) => (
                            <tr key={role.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors`}>
                                <td className="p-3 text-gray-700 text-sm text-center border-r border-gray-200">
                                    {index + 1}
                                </td>
                                <td className="p-3 text-blue-600 text-sm font-medium border-r border-gray-200">
                                    {role.role}
                                </td>
                                <td className="p-3 text-gray-700 text-sm border-r border-gray-200">
                                    <div className="flex flex-wrap gap-2">
                                        {role.features.map(feature => (
                                            <span 
                                                key={feature.id}
                                                className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full"
                                            >
                                                {feature.name}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-3 text-gray-700 text-sm">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => onEdit(role)}
                                            className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                            title="Edit"
                                        >
                                            <FaEdit size={14} />
                                        </button>
                                        <button
                                            onClick={() => setDeleteModal({ 
                                                isOpen: true, 
                                                roleId: role.id, 
                                                roleName: role.role 
                                            })}
                                            className="flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                            title="Delete"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredRoles.length === 0 && (
                    <div className="text-center py-8 bg-white">
                        <div className="text-gray-500 mb-4">
                            <svg
                                className="w-16 h-16 mx-auto"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-700">No roles found</h3>
                        <p className="text-gray-500 mt-1">
                            {searchTerm ? "Try adjusting your search" : "Create your first role by clicking 'Add Role'"}
                        </p>
                    </div>
                )}
            </div>

            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, roleId: null, roleName: "" })}
                onConfirm={handleDeleteConfirm}
                resourceName={deleteModal.roleName}
                resourceType="role"
            />
        </div>
    );
};

export default RoleList;