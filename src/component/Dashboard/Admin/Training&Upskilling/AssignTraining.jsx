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

const AssignTraining = () => {
  const [activeTab, setActiveTab] = useState('training');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStatus, setEditingStatus] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  // Enhanced training data with new columns
  const [trainingData, setTrainingData] = useState([
    {
      id: 1,
      name: 'React Fundamentals',
      startDate: '2023-06-15',
      endDate: '2023-06-17',
      trainer: 'John Smith',
      requester: 'HR Department',
      competency: 'JavaScript',
      participants: 15,
      inAttendance: 12,
      feedback: 4.5,
      score: 87,
      status: 'running'
    },
    // ... other training data
  ]);

  // Enhanced upskilling data with new columns
  const [upskillingData, setUpskillingData] = useState([
    {
      id: 1,
      name: 'Leadership Skills',
      startDate: '2023-06-18',
      endDate: '2023-06-20',
      trainer: 'Emma Wilson',
      requester: 'Management',
      competency: 'Soft Skills',
      participants: 12,
      inAttendance: 10,
      feedback: 4.3,
      score: 88,
      status: 'hold'
    },
    // ... other upskilling data
  ]);

  const statusOptions = [
    { value: 'hold', label: 'Hold', icon: <FaPause className="inline mr-1" />, color: 'bg-yellow-100 text-yellow-800' },
    { value: 'pending', label: 'Pending', icon: <FaHourglassHalf className="inline mr-1" />, color: 'bg-blue-100 text-blue-800' },
    { value: 'running', label: 'Running', icon: <FaArrowRight className="inline mr-1" />, color: 'bg-green-100 text-green-800' },
    { value: 'completed', label: 'Completed', icon: <FaCheck className="inline mr-1" />, color: 'bg-purple-100 text-purple-800' }
  ];

  const handleStatusChange = (id, newStatus, isTraining) => {
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
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredTrainingData = trainingData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valueA = a[sortConfig.key] || "";
    const valueB = b[sortConfig.key] || "";
    return sortConfig.direction === 'ascending'
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });

  const filteredUpskillingData = upskillingData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
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
    { key: 'name', label: 'Program Name', sortable: true },
    { key: 'dates', label: 'Dates', sortable: false },
    { key: 'trainer', label: 'Trainer', sortable: true },
    { key: 'requester', label: 'Requester', sortable: true },
    { key: 'competency', label: 'Competency', sortable: true },
    { key: 'participants', label: 'Participants', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
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
              className={`px-6 py-3 text-sm font-medium rounded-l-lg focus:outline-none transition-colors ${
                activeTab === 'training'
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
              className={`px-6 py-3 text-sm font-medium rounded-r-lg focus:outline-none transition-colors ${
                activeTab === 'upskilling'
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
          <button className="w-full sm:w-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors whitespace-nowrap">
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
                      className="p-2 text-left font-semibold text-sm border-b border-gray-200"
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
                      <div className="font-medium">{training.name}</div>
                    </td>
                    <td className="p-2 text-gray-700 text-sm border-r border-gray-200">
                      <div className="text-sm">{training.startDate}</div>
                      <div className="text-xs text-gray-500">to</div>
                      <div className="text-sm">{training.endDate}</div>
                    </td>
                    <td className="p-2 text-gray-700 text-sm border-r border-gray-200">
                      {training.trainer}
                    </td>
                    <td className="p-2 text-gray-700 text-sm border-r border-gray-200">
                      {training.requester}
                    </td>
                    <td className="p-2 text-gray-700 text-sm border-r border-gray-200">
                      {training.competency}
                    </td>
                    <td className="p-2 text-gray-700 text-sm border-r border-gray-200 text-center">
                      <span className="font-medium text-purple-600">
                        {training.participants}
                      </span>
                      <div className="text-xs text-gray-500">
                        ({training.inAttendance} attended)
                      </div>
                    </td>
                    <td className="p-2 text-gray-700 text-sm border-r border-gray-200">
                      <div className="flex space-x-2 justify-center">
                        <button className="text-purple-600 hover:text-purple-800 transition-colors">
                          <FaEdit />
                        </button>
                        <button className="text-purple-600 hover:text-purple-800 transition-colors">
                          <FaEye />
                        </button>
                        <button className="text-purple-600 hover:text-purple-800 transition-colors">
                          <FaDownload />
                        </button>
                      </div>
                    </td>
                    <td className="p-2 text-gray-700 text-sm border-r border-gray-200 text-center">
                      <div className="flex flex-col items-center">
                        <button className="text-purple-600 hover:text-purple-800 transition-colors">
                          <FaCommentAlt className="inline mr-1" /> {training.feedback}
                        </button>
                        <span className="text-xs text-gray-500 mt-1">
                          {training.score}% score
                        </span>
                      </div>
                    </td>
                    <td className="p-2 text-gray-700 text-sm">
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
                          className="hover:bg-purple-100 rounded p-1 transition-colors w-full text-center"
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
                      className="p-2 text-left font-semibold text-sm border-b border-gray-200"
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
                      <div className="font-medium">{upskilling.name}</div>
                    </td>
                    <td className="p-2 text-gray-700 text-sm border-r border-gray-200">
                      <div className="text-sm">{upskilling.startDate}</div>
                      <div className="text-xs text-gray-500">to</div>
                      <div className="text-sm">{upskilling.endDate}</div>
                    </td>
                    <td className="p-2 text-gray-700 text-sm border-r border-gray-200">
                      {upskilling.trainer}
                    </td>
                    <td className="p-2 text-gray-700 text-sm border-r border-gray-200">
                      {upskilling.requester}
                    </td>
                    <td className="p-2 text-gray-700 text-sm border-r border-gray-200">
                      {upskilling.competency}
                    </td>
                    <td className="p-2 text-gray-700 text-sm border-r border-gray-200 text-center">
                      <span className="font-medium text-purple-600">
                        {upskilling.participants}
                      </span>
                      <div className="text-xs text-gray-500">
                        ({upskilling.inAttendance} attended)
                      </div>
                    </td>
                    <td className="p-2 text-gray-700 text-sm border-r border-gray-200">
                      <div className="flex space-x-2 justify-center">
                        <button className="text-purple-600 hover:text-purple-800 transition-colors">
                          <FaEdit />
                        </button>
                        <button className="text-purple-600 hover:text-purple-800 transition-colors">
                          <FaEye />
                        </button>
                        <button className="text-purple-600 hover:text-purple-800 transition-colors">
                          <FaDownload />
                        </button>
                      </div>
                    </td>
                    <td className="p-2 text-gray-700 text-sm border-r border-gray-200 text-center">
                      <div className="flex flex-col items-center">
                        <button className="text-purple-600 hover:text-purple-800 transition-colors">
                          <FaCommentAlt className="inline mr-1" /> {upskilling.feedback}
                        </button>
                        <span className="text-xs text-gray-500 mt-1">
                          {upskilling.score}% score
                        </span>
                      </div>
                    </td>
                    <td className="p-2 text-gray-700 text-sm">
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
                          className="hover:bg-purple-100 rounded p-1 transition-colors w-full text-center"
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
      </div>
    </div>
  );
};

export default AssignTraining;