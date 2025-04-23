import React, { useEffect, useState, useMemo } from 'react';
import { FaPlus, FaSort, FaSearch, FaCalendarAlt, FaSortUp, FaSortDown, FaTrash, FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router';
import { useDispatch, useSelector } from "react-redux";
import { fetchInterns, updateIntern, deleteIntern } from '../../../../features/intern/internAction';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import InternDetail from './InternDetail';
import YRMSLoader from '../../../helper/loader';
import { ErrorToast, SuccessToast } from '../../../helper/ResourceToast';
import DeleteConfirmationModal from '../../../helper/DeleteConfirmationModal';

const InternList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { interns, loading, error } = useSelector((state) => state.intern);
    const [editingStatusId, setEditingStatusId] = useState(null);
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        internId: null,
        internName: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const statusOptions = ["Complete", "Running", "Pending", "Hold"];

    useEffect(() => {
        dispatch(fetchInterns())
    }, [dispatch]);

    const [searchTerms, setSearchTerms] = useState({
        name: '',
        mentor: '',
        status: '',
        startDate: null,
        endDate: null,
    });
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'ascending'
    });
    const [selectedInterns, setSelectedInterns] = useState(null);

    const handleSearchChange = (key, value) => {
        setSearchTerms(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1); // Reset to first page on new search
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleDateChange = (key, date) => {
        setSearchTerms(prev => ({
            ...prev,
            [key]: date,
        }));
        setCurrentPage(1);
    };

    // Filter interns based on search values
    const filteredInterns = useMemo(() => {
        return (interns || []).filter((intern) => {
            const matchesName = intern.name?.toLowerCase().includes(searchTerms.name.toLowerCase()) ?? true;
            const matchesMentor = intern.mentor?.toLowerCase().includes(searchTerms.mentor.toLowerCase()) ?? true;
            const matchesStatus = searchTerms.status ? intern.status?.toLowerCase() === searchTerms.status.toLowerCase() : true;

            // Date filtering
            let matchesDate = true;
            if (searchTerms.startDate) {
                const internDate = intern.startDate ? new Date(intern.startDate) : null;
                if (internDate) {
                    matchesDate =
                        internDate.getDate() === searchTerms.startDate.getDate() &&
                        internDate.getMonth() === searchTerms.startDate.getMonth() &&
                        internDate.getFullYear() === searchTerms.startDate.getFullYear();
                }
            }

            return matchesName && matchesMentor && matchesStatus && matchesDate;
        });
    }, [interns, searchTerms]);

    // Sort filtered resources
    const sortedInterns = useMemo(() => {
        return [...filteredInterns].sort((a, b) => {
            if (!sortConfig.key) return 0;
            const valueA = a[sortConfig.key] || "";
            const valueB = b[sortConfig.key] || "";
            return sortConfig.direction === "ascending"
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
        });
    }, [filteredInterns, sortConfig]);

    // Pagination Logic
    const totalPages = Math.ceil(sortedInterns.length / itemsPerPage);
    const paginatedInterns = sortedInterns.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Delete functionality
    const handleDeleteClick = (intern) => {
        setDeleteModal({
            isOpen: true,
            internId: intern.publicId,
            internName: intern.name,
        });
    };

    const handleDeleteConfirm = async () => {
        try {
          await dispatch(deleteIntern(deleteModal.internId));
          setToast(
            <SuccessToast 
              message="Intern deleted successfully!" 
              onClose={() => setToast(null)} 
            />
          );
          setDeleteModal({ isOpen: false, internId: null, internName: "" });
          dispatch(fetchInterns());
        } catch (error) {
          setToast(<ErrorToast message={error.message || "Failed to delete intern"} onClose={() => setToast(null)} />);
        }
      };

    const handleUpdateStatus = async (e, event, publicId) => {
        setIsSubmitting(true);
        try {
            setToast(<YRMSLoader message="Updating status..." />);

            const internData = {
                status: event.target.value
            };

            const updateResult = await dispatch(updateIntern({
                publicId: publicId,
                internData
            }));

            if (updateResult.payload?.publicId) {
                setToast(<SuccessToast message="status updated successfully!" onClose={() => setToast(null)} />);
                dispatch(fetchInterns())
            } else {
                throw new Error("Failed to update intern");
            }
        } catch (err) {
            setToast(<ErrorToast message={err.message || "Failed to update status"} onClose={() => setToast(null)} />);
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns = [
        { key: "sno", label: "S.No" },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'mentor', label: 'Mentored By' },
        { key: 'startDate', label: 'Start Date' },
        { key: 'endDate', label: 'End Date' },
        { key: 'status', label: 'Status' }
    ];

    if (loading) return <div className="text-center py-8">Loading interns...</div>;
    if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>;

    return (
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg">
            {toast}
            
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-3xl font-bold text-blue-800">Interns Details</h2>
                    <Link
                        className="btn px-6 py-3 rounded-lg font-semibold text-lg flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
                        to='/interns/add'
                    >
                        <FaPlus className="mr-2" />
                        Add Intern
                    </Link>
                </div>
            </div>

            <div className={`overflow-x-auto rounded-lg shadow-lg border border-gray-200 ${deleteModal.isOpen ? 'filter blur-sm' : ''}`}>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-800">
                            {columns.map(column => (
                                <th
                                    key={column.key}
                                    className="p-1 text-left font-semibold text-sm border-b border-gray-200"
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{column.label}</span>
                                        {column.key !== "sno" && (
                                            <button
                                                onClick={() => handleSort(column.key)}
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
                                    {column.key !== "sno" && column.key !== "email" && column.key !== "endDate" && (
                                        <div className="relative mt-1">
                                            {column.key === "startDate" ? (
                                                <div className="relative">
                                                    <DatePicker
                                                        selected={searchTerms.startDate}
                                                        onChange={(date) => handleDateChange(column.key, date)}
                                                        dateFormat="MM/dd/yyyy"
                                                        placeholderText="Select date"
                                                        className="w-full px-2 py-1 pr-6 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                    <FaCalendarAlt className="absolute right-2 top-2 text-gray-400 text-xs" />
                                                </div>
                                            ) : column.key === "status" ? (
                                                <select
                                                    value={searchTerms.status}
                                                    onChange={(e) => handleSearchChange("status", e.target.value)}
                                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                >
                                                    <option value="">All Status</option>
                                                    {statusOptions.map((option) => (
                                                        <option key={option} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder={`Search ${column.label}`}
                                                        value={searchTerms[column.key] || ""}
                                                        onChange={(e) => handleSearchChange(column.key, e.target.value)}
                                                        className="w-full px-2 py-1 pr-6 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                    <FaSearch className="absolute right-2 top-2 text-gray-400 text-xs" />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </th>
                            ))}
                            <th className="p-1 text-left font-semibold text-sm border-b border-gray-200">
                                Actions
                                <div className="mt-1 h-8"></div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedInterns.map((intern, index) => (
                            <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors`}>
                                <td className="p-3 text-gray-700 text-sm text-center border-r border-gray-200">
                                    {(currentPage - 1) * itemsPerPage + index + 1}
                                </td>
                                <td
                                    className="p-3 text-blue-600 text-sm border-r border-gray-200 cursor-pointer hover:underline"
                                    onClick={() => setSelectedInterns(intern)}
                                >
                                    {intern.name.charAt(0).toUpperCase() + intern.name.slice(1)}
                                </td>
                                <td className="p-3 text-gray-700 text-sm border-r border-gray-200">
                                    {intern.email}
                                </td>
                                <td className="p-3 text-gray-700 text-sm border-r border-gray-200">
                                    {intern.mentor.charAt(0).toUpperCase() + intern.mentor.slice(1)}
                                </td>
                                <td className="p-3 text-gray-700 text-sm border-r border-gray-200">
                                    {new Date(intern.startDate).toLocaleDateString()}
                                </td>
                                <td className="p-3 text-gray-700 text-sm border-r border-gray-200">
                                    {new Date(intern.endDate).toLocaleDateString()}
                                </td>
                                <td className="p-3 text-gray-700 text-sm border-r border-gray-200 relative">
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingStatusId(editingStatusId === intern.publicId ? null : intern.publicId);
                                        }}
                                        className="cursor-pointer"
                                    >
                                        <span className={`px-2 py-1 rounded-full text-xs ${intern.status === 'Running' ? 'bg-blue-100 text-blue-800' :
                                            intern.status === 'Complete' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {!intern.status ? "Running" : intern.status.charAt(0).toUpperCase() + intern.status.slice(1)}
                                        </span>
                                    </div>

                                    {editingStatusId === intern.publicId && (
                                        <div className="absolute z-10 mt-1 bg-white shadow-lg rounded-md border border-gray-200">
                                            <select
                                                autoFocus
                                                name='status'
                                                className="w-full p-1 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                                value={intern.status || 'Running'}
                                                onChange={(e) => {
                                                    const syntheticEvent = {
                                                        target: {
                                                            name: 'status',
                                                            value: e.target.value
                                                        }
                                                    };
                                                    handleUpdateStatus(e, syntheticEvent, intern.publicId);
                                                    setEditingStatusId(null);
                                                }}
                                                onBlur={() => setTimeout(() => setEditingStatusId(null), 200)}
                                            >
                                                {statusOptions.map((option) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </td>
                                <td className="p-3 text-gray-700 text-sm">
                                    <div className="flex space-x-1 relative">
                                        <div className="relative group">
                                            <button
                                                className="flex items-center justify-center w-7 h-7 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                                                onClick={() => handleDeleteClick(intern)}
                                            >
                                                <FaTrash size={12} />
                                            </button>
                                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                Delete
                                                <div className="absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45 -bottom-1"></div>
                                            </span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                {sortedInterns.length > 0 && (
                    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                            <span className="font-medium">
                                {Math.min(currentPage * itemsPerPage, sortedInterns.length)}
                            </span>{" "}
                            of <span className="font-medium">{sortedInterns.length}</span> results
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                            >
                                <FaAngleDoubleLeft />
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                            >
                                <FaAngleLeft />
                            </button>
                            
                            {/* Dynamic Page Numbers */}
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`w-10 h-10 rounded-md ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-50'}`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                            >
                                <FaAngleRight />
                            </button>
                            <button
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                            >
                                <FaAngleDoubleRight />
                            </button>
                        </div>
                    </div>
                )}

                {selectedInterns && (
                    <InternDetail
                        key={selectedInterns}
                        publicId={selectedInterns}
                        onClose={() => {
                            dispatch(fetchInterns());
                            setSelectedInterns(null)
                        }}
                    />
                )}

                {sortedInterns.length === 0 && (
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
                        <h3 className="text-lg font-medium text-gray-700">No interns found</h3>
                        <p className="text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>

            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, internId: null, internName: "" })}
                onConfirm={handleDeleteConfirm}
                resourceName={deleteModal.internName}
            />
        </div>
    );
};

export default InternList;