import React, { useEffect, useState } from 'react';
import { FaPlus, FaSort, FaSearch, FaCalendarAlt, FaSortUp, FaSortDown } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router';
import { useDispatch, useSelector } from "react-redux";
import { fetchInterns, updateIntern } from '../../../../features/intern/internAction';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import InternDetail from './InternDetail';
import YRMSLoader from '../../../helper/loader';
import { ErrorToast, SuccessToast } from '../../../helper/ResourceToast';

const InternList = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {interns, loading } = useSelector((state) => state.intern);
    const [editingStatusId, setEditingStatusId] = useState(null);
    const [editingStatus, setEditingStatus] = useState(null);
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const statusOptions = ["Complete", "Running", "Pending", "Hold"];

    useEffect(() => {
        dispatch(fetchInterns());
    }, [dispatch, interns]);

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
        setSearchTerms(searchTerms => ({ ...searchTerms, [key]: value }));
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleDateChange = (key, date) => {
        setSearchTerms({
            ...searchTerms,
            [key]: date,
        });
    };

    // Filter interns based on search values
    const filteredInterns = (interns || []).filter((intern) => {
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

    // Sort filtered resources
    const sortedInterns = [...filteredInterns].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const valueA = a[sortConfig.key] || "";
        const valueB = b[sortConfig.key] || "";
        return sortConfig.direction === "ascending"
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
    });

    const handleUpdateStatus = async (e, event, publicId) => {
        setIsSubmitting(true);
        try {
            console.log(":", formData)
            setToast(<YRMSLoader message="Updating status..." />);

            const internData = {
                status: event.target.value
            };
            console.log(":::", internData)

            const updateResult = await dispatch(updateIntern({
                publicId: publicId,
                internData
            }));
            console.log(updateResult.payload?.publicId)

            if (updateResult.payload?.publicId) {
                setToast(<SuccessToast message="status updated successfully!" onClose={() => setToast(null)} />);
                setIsEditing(false);
                dispatch(fetchInterns())
            } else {
                throw new Error("Failed to update intern");
            }
        } catch (err) {
            setToast(<ErrorToast message={err.message || "Failed to update status"} onClose={() => setToast(null)} />);
        } finally {
            setIsSubmitting(false);
        }
        console.log("interns: ",interns)
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

    return (
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg">
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
                                {/* Search input for each column (except S.No) */}
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
                    </tr>
                </thead>
                <tbody>
                    {sortedInterns.map((intern, index) => (
                        <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors`}>
                            <td className="p-3 text-gray-700 text-sm text-center border-r border-gray-200">{index + 1}</td>
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
                            <td className="p-3 text-gray-700 text-sm border-r border-gray-200">{new Date(intern.startDate).toLocaleDateString()}</td>
                            <td className="p-3 text-gray-700 text-sm border-r border-gray-200">{new Date(intern.endDate).toLocaleDateString()}</td>
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
                                                // Create a synthetic event with the current value
                                                const syntheticEvent = {
                                                    target: {
                                                        name: 'status',
                                                        value: e.target.value
                                                    }
                                                };
                                                handleUpdateStatus(e, syntheticEvent, intern.publicId);
                                                setEditingStatusId(null); // Close dropdown after selection
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
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedInterns && (
                <InternDetail
                    key={selectedInterns}
                    publicId={selectedInterns}
                    onClose={() => {
                        dispatch(fetchInterns()); // Refresh intern list
                        setSelectedInterns(null)
                    }}
                />
            )}
        </div>
    );
};

export default InternList;