import React, { useState } from 'react';
import {
  FaTools,
  FaUserTie,
  FaUserPlus,
  FaCalendarAlt,
  FaClipboardList,
  FaChalkboardTeacher,
  FaArrowRight,
  FaPlus,
  FaSearch,
  FaCheck,
  FaTimes,
  FaHourglassHalf,
  FaPause,
  FaEdit,
  FaEye,
  FaDownload,
  FaCommentAlt,
  FaChartBar,
  FaSort,
  FaSortUp,
  FaSortDown
} from 'react-icons/fa';
import {
  FiEdit2,
  FiEye,
  FiDownload,
  FiCalendar,
  FiUserCheck,
  FiClipboard,
  FiBarChart2
} from 'react-icons/fi';

import { fetchProgramList } from '../../../../features/program/programAction'; // Adjust path as needed
import AttendanceDetailsModal from './AttendanceDetailsModal';
import ViewAttendanceModal from './ViewAttendanceModal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import AddTraining from './AddTraining';
import ParticipantDetailsModal from './ParticipantDetailsModal';
import TrainingFeedback from './TrainingFeedback';
import UpskillingDetailModal from './UpskillingDetailModal';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

const AssignTraining = () => {
  const dispatch = useDispatch();
  const { programs, loading, error } = useSelector((state) => state.program);
  
  const [activeTab, setActiveTab] = useState('training');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStatus, setEditingStatus] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const [showAttendanceDetails, setShowAttendanceDetails] = useState(false);
  const [showViewAttendance, setShowViewAttendance] = useState(false);
  const [showParticipantDetails, setShowParticipantDetails] = useState(false);
  const [showUpskillingDetails, setShowUpskillingDetails] = useState(false); // New state for UpskillingDetailModal
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [showAddTraining, setShowAddTraining] = useState(false);
  const [showAddUpskilling, setShowAddUpskilling] = useState(false);
  const [trainingData, setTrainingData] = useState([]);
  const [upskillingData, setUpskillingData] = useState([]);

  const statusOptions = [
    { value: 'Hold', label: 'Hold', icon: <FaPause className="inline mr-1" />, color: 'bg-yellow-100 text-yellow-800' },
    { value: 'Pending', label: 'Pending', icon: <FaHourglassHalf className="inline mr-1" />, color: 'bg-red-100 text-red-800' },
    { value: 'Running', label: 'Running', icon: <FaArrowRight className="inline mr-1" />, color: 'bg-orange-100 text-orange-800' },
    { value: 'Completed', label: 'Completed', icon: <FaCheck className="inline mr-1" />, color: 'bg-green-100 text-green-800' }
  ];

  // Add this useEffect to fetch programs on component mount
  useEffect(() => {
    dispatch(fetchProgramList());
  }, [dispatch]);

// Add this useEffect to process the fetched data
useEffect(() => {
  if (programs) {
    const training = programs.filter(p => p.type === 'Training');
    const upskilling = programs.filter(p => p.type === 'Upskilling');
    setTrainingData(training);
    setUpskillingData(upskilling);
  }
}, [programs]);

const handleStatusChange = async (id, newStatus, isTraining) => {
  try {
    // Dispatch an API call to update status if needed
    // await dispatch(updateProgramStatus({ id, status: newStatus }));
    
    // Local state update (temporary until API is implemented)
    if (isTraining) {
      setTrainingData(trainingData.map(item =>
        item.id === id ? { ...item, status: newStatus } : item
      ));
    } else {
      setUpskillingData(upskillingData.map(item =>
        item.id === id ? { ...item, status: newStatus } : item
      ));
    }
    setEditingStatus(null);
  } catch (err) {
    console.error('Failed to update status:', err);
  }
};

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredTrainingData = trainingData.filter(item =>
    item.programName.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valueA = a[sortConfig.key] || "";
    const valueB = b[sortConfig.key] || "";
    return sortConfig.direction === 'ascending'
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });

  const filteredUpskillingData = upskillingData.filter(item =>
    item.programName.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valueA = a[sortConfig.key] || "";
    const valueB = b[sortConfig.key] || "";
    return sortConfig.direction === 'ascending'
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });

  const getStatusBadge = (status) => {
    const statusObj = statusOptions.find(opt => opt.value === status);
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusObj.color}`}>
        {statusObj.icon} {statusObj.label}
      </span>
    );
  };

  const columns = [
    { key: 'sno', label: 'S.No', sortable: false },
    { key: 'programName', label: 'Program Name', sortable: true },
    { key: 'startDate', label: 'Duration', sortable: true },
    { key: 'trainerName', label: 'Trainer', sortable: true },
    { key: 'requester', label: 'Requester', sortable: true },
    { key: 'competency', label: 'Competency', sortable: true },
    { key: 'participantCount', label: 'Participants', sortable: true },
    { key: 'attendance', label: 'Attendance', sortable: false },
    { key: 'feedback', label: 'Feedback', sortable: true },
    { key: 'status', label: 'Status', sortable: true }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4 md:p-8">
      <div className="mx-auto px-2 sm:px-6 lg:px-8 max-w-screen-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-purple-800">
            <FaTools className="inline mr-2" />
            Training & Upskilling
          </h2>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => {
                setActiveTab('training');
                setSearchTerm('');
                setSortConfig({ key: null, direction: 'ascending' });
              }}
              className={`px-6 py-3 text-sm font-medium rounded-l-lg focus:outline-none transition-colors ${activeTab === 'training'
                ? 'bg-purple-600 text-white shadow-purple'
                : 'bg-white text-purple-600 hover:bg-purple-50 border border-purple-200'
                }`}
            >
              <FaChalkboardTeacher className="inline mr-2" />
              Training Programs
            </button>
            <button
              onClick={() => {
                setActiveTab('upskilling');
                setSearchTerm('');
                setSortConfig({ key: null, direction: 'ascending' });
              }}
              className={`px-6 py-3 text-sm font-medium rounded-r-lg focus:outline-none transition-colors ${activeTab === 'upskilling'
                ? 'bg-purple-600 text-white shadow-purple'
                : 'bg-white text-purple-600 hover:bg-purple-50 border border-purple-200'
                }`}
            >
              <FaUserPlus className="inline mr-2" />
              Upskilling Programs
            </button>
          </div>
        </div>

        {/* Search and Add New Button Row */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={`Search ${activeTab === 'training' ? 'Training' : 'Upskilling'} by name...`}
              className="block w-full pl-10 pr-3 py-2 border border-purple-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => activeTab === 'training' ? setShowAddTraining(true) : setShowAddUpskilling(true)}
            className="w-full sm:w-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors whitespace-nowrap"
          >
            <FaPlus className="mr-2" />
            Add New {activeTab === 'training' ? 'Training' : 'Upskilling'}
            <FaArrowRight className="ml-2" />
          </button>
        </div>

        {/* Training Table */}
        {activeTab === 'training' && (
          <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-purple-50 to-blue-50 text-gray-800">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`p-2 text-left font-semibold text-sm border-b border-gray-200 ${column.key === 'startDate' ? 'w-[180px]' : ''
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{column.label}</span>
                        {column.sortable && (
                          <button
                            onClick={() => handleSort(column.key)}
                            className="ml-2 focus:outline-none"
                          >
                            {sortConfig.key === column.key ? (
                              sortConfig.direction === 'ascending' ? (
                                <FaSortUp className="text-purple-600" />
                              ) : (
                                <FaSortDown className="text-purple-600" />
                              )
                            ) : (
                              <FaSort className="text-gray-400 hover:text-purple-600" />
                            )}
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTrainingData.map((training, index) => (
                  <tr key={training.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="p-2 text-gray-700 text-sm border-r border-gray-200 text-center">
                      {index + 1}
                    </td>
                    <td className="p-2 text-purple-600 text-sm border-r border-gray-200">
                      <div className="font-medium">{training.programName}</div>
                    </td>
                    <td className="p-2 text-gray-700 text-sm border-r border-gray-200">
                      <div className="space-y-1.5">
                        <div className="flex items-center border border-gray-200 rounded px-2 py-1 bg-white">
                          <span className="text-xs text-gray-500 mr-1.5 whitespace-nowrap">Start:</span>
                          <span className="text-xs font-medium text-gray-800 truncate">
                            {new Date(training.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center border border-gray-200 rounded px-2 py-1 bg-white">
                          <span className="text-xs text-gray-500 mr-1.5 whitespace-nowrap">End:</span>
                          <span className="text-xs font-medium text-gray-800 truncate">
                            {new Date(training.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center border border-gray-200 rounded px-2 py-1 bg-white">
                          <span className="text-xs text-gray-500 mr-1.5 whitespace-nowrap">Duration:</span>
                          <span className="inline-block bg-purple-50 text-purple-700 text-[11px] px-1.5 py-0.5 rounded-full">
                            {Math.ceil(
                              (new Date(training.endDate) - new Date(training.startDate)) /
                              (1000 * 60 * 60 * 24)
                            ) + 1} Days
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-2 text-gray-700 text-sm border-r border-gray-200">
                      {training.trainerName}
                    </td>
                    <td className="p-2 text-gray-700 text-sm border-r border-gray-200">
                      {training.requester}
                    </td>
                    <td className="p-2 text-gray-700 text-sm border-r border-gray-200">
                      {training.competency}
                    </td>
                    <td
                      className="p-2 text-gray-700 text-sm border-r border-gray-200 text-center cursor-pointer hover:bg-purple-50 transition-colors"
                      onClick={() => {
                        setSelectedTraining(training);
                        setShowParticipantDetails(true);
                      }}
                    >
                      <span className="font-medium text-purple-600">
                        {training.participantCount}
                      </span>
                      <div className="text-xs text-gray-500">
                        ({training.inAttendance} attended)
                      </div>
                    </td>
                    <td className="p-2 text-gray-700 text-sm border-r border-gray-200">
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => {
                            setSelectedTraining(training);
                            setShowAttendanceDetails(true);
                          }}
                          className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors group relative"
                          title="Attendance Details"
                        >
                          <FiUserCheck className="w-4 h-4" />
                          <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Edit Attendance
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTraining(training);
                            setShowViewAttendance(true);
                          }}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors group relative"
                          title="View Attendance"
                        >
                          <FiEye className="w-4 h-4" />
                          <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            View Attendance
                          </span>
                        </button>
                        <button
                          className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors group relative"
                          title="Download Report"
                        >
                          <FiDownload className="w-4 h-4" />
                          <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Download Report
                          </span>
                        </button>
                      </div>
                    </td>
                    <td className="p-2 text-gray-700 text-sm border-r border-gray-200 text-center">
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() => {
                            setSelectedTraining(training);
                            setShowFeedbackModal(true);
                          }}
                          className="text-purple-600 hover:text-purple-800 transition-colors"
                        >
                          <FaCommentAlt className="inline mr-1" /> {training.feedback}
                        </button>
                      </div>
                    </td>
                    <td className="p-2 text-gray-700 text-sm w-24">
                      {editingStatus === training.id ? (
                        <select
                          className="border border-purple-300 rounded p-1 text-sm focus:ring-purple-500 focus:border-purple-500 w-full"
                          value={training.status}
                          onChange={(e) => handleStatusChange(training.id, e.target.value, true)}
                          autoFocus
                          onBlur={() => setEditingStatus(null)}
                        >
                          {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <button
                          onClick={() => setEditingStatus(training.id)}
                          className="hover:bg-purple-100 rounded p-1 transition-colors w-full text-center truncate"
                        >
                          {getStatusBadge(training.status)}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTrainingData.length === 0 && (
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
                <h3 className="text-lg font-medium text-gray-700">No training programs found</h3>
                <p className="text-gray-500 mt-1">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        )}

        {/* Upskilling Table */}
        {activeTab === 'upskilling' && (
          <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-purple-50 to-blue-50 text-gray-800">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`p-2 text-left font-semibold text-sm border-b border-gray-200 ${column.key === 'startDate' ? 'w-[180px]' : ''
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{column.label}</span>
                        {column.sortable && (
                          <button
                            onClick={() => handleSort(column.key)}
                            className="ml-2 focus:outline-none"
                          >
                            {sortConfig.key === column.key ? (
                              sortConfig.direction === 'ascending' ? (
                                <FaSortUp className="text-purple-600" />
                              ) : (
                                <FaSortDown className="text-purple-600" />
                              )
                            ) : (
                              <FaSort className="text-gray-400 hover:text-purple-600" />
                            )}
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUpskillingData.map((upskilling, index) => (
                  <tr key={upskilling.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="p-2 text-gray-700 text-sm border-r border-gray-200 text-center">
                      {index + 1}
                    </td>
                    <td className="p-2 text-purple-600 text-sm border-r border-gray-200">
                      <div className="font-medium">{upskilling.programName}</div>
                    </td>
                    <td className="p-2 text-gray-700 text-sm border-r border-gray-200">
                      <div className="space-y-1.5">
                        <div className="flex items-center border border-gray-200 rounded px-2 py-1 bg-white">
                          <span className="text-xs text-gray-500 mr-1.5 whitespace-nowrap">Start:</span>
                          <span className="text-xs font-medium text-gray-800 truncate">
                            {new Date(upskilling.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center border border-gray-200 rounded px-2 py-1 bg-white">
                          <span className="text-xs text-gray-500 mr-1.5 whitespace-nowrap">End:</span>
                          <span className="text-xs font-medium text-gray-800 truncate">
                            {new Date(upskilling.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center border border-gray-200 rounded px-2 py-1 bg-white">
                          <span className="text-xs text-gray-500 mr-1.5 whitespace-nowrap">Duration:</span>
                          <span className="inline-block bg-purple-50 text-purple-700 text-[11px] px-1.5 py-0.5 rounded-full">
                            {Math.ceil(
                              (new Date(upskilling.endDate) - new Date(upskilling.startDate)) /
                              (1000 * 60 * 60 * 24) + 1
                            )} Days
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-2 text-gray-700 text-sm border-r border-gray-200">
                      {upskilling.trainerName}
                    </td>
                    <td className="p-2 text-gray-700 text-sm border-r border-gray-200">
                      {upskilling.requester}
                    </td>
                    <td className="p-2 text-gray-700 text-sm border-r border-gray-200">
                      {upskilling.competency}
                    </td>
                    <td
                      className="p-2 text-gray-700 text-sm border-r border-gray-200 text-center cursor-pointer hover:bg-purple-50 transition-colors"
                      onClick={() => {
                        setSelectedTraining(upskilling);
                        setShowUpskillingDetails(true); // Open UpskillingDetailModal
                      }}
                    >
                      <span className="font-medium text-purple-600">
                        {upskilling.participantCount}
                      </span>
                      <div className="text-xs text-gray-500">
                        ({upskilling.inAttendance} attended)
                      </div>
                    </td>
                    <td className="p-2 text-gray-700 text-sm border-r border-gray-200">
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => {
                            setSelectedTraining(upskilling);
                            setShowAttendanceDetails(true);
                          }}
                          className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors group relative"
                          title="Attendance Details"
                        >
                          <FiUserCheck className="w-4 h-4" />
                          <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Edit Attendance
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTraining(upskilling);
                            setShowViewAttendance(true);
                          }}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors group relative"
                          title="View Attendance"
                        >
                          <FiEye className="w-4 h-4" />
                          <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            View Attendance
                          </span>
                        </button>
                        <button
                          className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors group relative"
                          title="Download Report"
                        >
                          <FiDownload className="w-4 h-4" />
                          <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Download Report
                          </span>
                        </button>
                      </div>
                    </td>
                    <td className="p-2 text-gray-700 text-sm border-r border-gray-200 text-center">
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() => {
                            setSelectedTraining(upskilling);
                            setShowFeedbackModal(true);
                          }}
                          className="text-purple-600 hover:text-purple-800 transition-colors"
                        >
                          <FaCommentAlt className="inline mr-1" /> {upskilling.feedback}
                        </button>
                      </div>
                    </td>
                    <td className="p-2 text-gray-700 text-sm w-24">
                      {editingStatus === upskilling.id ? (
                        <select
                          className="border border-purple-300 rounded p-1 text-sm focus:ring-purple-500 focus:border-purple-500 w-full"
                          value={upskilling.status}
                          onChange={(e) => handleStatusChange(upskilling.id, e.target.value, false)}
                          autoFocus
                          onBlur={() => setEditingStatus(null)}
                        >
                          {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <button
                          onClick={() => setEditingStatus(upskilling.id)}
                          className="hover:bg-purple-100 rounded p-1 transition-colors w-full text-center truncate"
                        >
                          {getStatusBadge(upskilling.status)}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUpskillingData.length === 0 && (
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
                <h3 className="text-lg font-medium text-gray-700">No upskilling programs found</h3>
                <p className="text-gray-500 mt-1">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        )}

        {/* Attendance Details Modal */}
        {showAttendanceDetails && (
          <AttendanceDetailsModal
            onClose={() => setShowAttendanceDetails(false)}
            training={selectedTraining}
          />
        )}

        {/* View Attendance Modal */}
        {showViewAttendance && (
          <ViewAttendanceModal
            onClose={() => setShowViewAttendance(false)}
            trainingId={selectedTraining.id} // Pass training id to ViewAttendanceModal
          />
        )}

        {/* Participant Details Modal (for Training tab) */}
        {showParticipantDetails && (
          <ParticipantDetailsModal
            onClose={() => setShowParticipantDetails(false)}
            training={selectedTraining}
          />
        )}

        {/* Upskilling Details Modal (for Upskilling tab) */}
        {showUpskillingDetails && (
          <UpskillingDetailModal
            onClose={() => setShowUpskillingDetails(false)}
            training={selectedTraining}
          />
        )}

        {/* Training Feedback Modal */}
        {showFeedbackModal && (
          <TrainingFeedback
            training={selectedTraining}
            onClose={() => setShowFeedbackModal(false)}
            onSave={(updatedEmployees, feedbackCols, scoreCols) => {
              console.log('Saved feedback data:', {
                employees: updatedEmployees,
                feedbackColumns: feedbackCols,
                scoreColumns: scoreCols
              });
              setShowFeedbackModal(false);
            }}
          />
        )}

        {/* Add Training Modal */}
        {showAddTraining && (
          <AddTraining
            isUpskilling={false} // Pass prop to indicate this is for training
            onClose={() => setShowAddTraining(false)}
            onSave={(newTraining) => {
              setTrainingData(prev => [...prev, {
                ...newTraining,
                id: Math.max(...prev.map(t => t.id), 0) + 1,
                inAttendance: 0,
                feedback: 0,
                score: 0
              }]);
            }}
          />
        )}

        {/* Add Upskilling Modal */}
        {showAddUpskilling && (
          <AddTraining
            isUpskilling={true} // Pass prop to indicate this is for upskilling
            onClose={() => setShowAddUpskilling(false)}
            onSave={(newUpskilling) => {
              setUpskillingData(prev => [...prev, {
                ...newUpskilling,
                id: Math.max(...prev.map(u => u.id), 0) + 1,
                inAttendance: 0,
                feedback: 0,
                score: 0
              }]);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AssignTraining;