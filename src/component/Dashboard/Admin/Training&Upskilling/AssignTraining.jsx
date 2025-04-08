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
  FaPause
} from 'react-icons/fa';

const AssignTraining = () => {
  const [activeTab, setActiveTab] = useState('training');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStatus, setEditingStatus] = useState(null);

  // Enhanced training data with status
  const [trainingData, setTrainingData] = useState([
    {
      id: 1,
      name: 'React Fundamentals',
      description: 'Learn core React concepts and best practices',
      time: '10:00 AM - 12:00 PM',
      trainer: 'John Smith',
      date: '2023-06-15',
      status: 'running'
    },
    {
      id: 2,
      name: 'Advanced Python',
      description: 'Deep dive into Python advanced features',
      time: '2:00 PM - 4:00 PM',
      trainer: 'Sarah Johnson',
      date: '2023-06-16',
      status: 'pending'
    },
    {
      id: 3,
      name: 'DevOps Essentials',
      description: 'Introduction to CI/CD pipelines',
      time: '9:00 AM - 11:00 AM',
      trainer: 'Mike Chen',
      date: '2023-06-17',
      status: 'completed'
    }
  ]);

  // Enhanced upskilling data with status
  const [upskillingData, setUpskillingData] = useState([
    {
      id: 1,
      name: 'Leadership Skills',
      description: 'Developing leadership qualities for tech leads',
      time: '3:00 PM - 5:00 PM',
      trainer: 'Emma Wilson',
      date: '2023-06-18',
      status: 'hold'
    },
    {
      id: 2,
      name: 'Effective Communication',
      description: 'Improving workplace communication',
      time: '11:00 AM - 1:00 PM',
      trainer: 'David Brown',
      date: '2023-06-19',
      status: 'running'
    },
    {
      id: 3,
      name: 'Agile Methodologies',
      description: 'Mastering Scrum and Kanban',
      time: '10:00 AM - 12:00 PM',
      trainer: 'Lisa Wong',
      date: '2023-06-20',
      status: 'pending'
    }
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

  const filteredTrainingData = trainingData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUpskillingData = upskillingData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const statusObj = statusOptions.find(opt => opt.value === status);
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusObj.color}`}>
        {statusObj.icon} {statusObj.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4 md:p-8">
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
      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-grow max-w-md">
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
        <button className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors whitespace-nowrap">
          <FaPlus className="mr-2" />
          Add New {activeTab === 'training' ? 'Training' : 'Upskilling'}
          <FaArrowRight className="ml-2" />
        </button>
      </div>

      {/* Training Table */}
      {activeTab === 'training' && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-purple-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-purple-200">
              <thead className="bg-purple-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">SNO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                    Training Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                    <FaCalendarAlt className="inline mr-1" /> Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                    <FaUserTie className="inline mr-1" /> Trainer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-purple-100">
                {filteredTrainingData.map((training, index) => (
                  <tr key={training.id} className="hover:bg-purple-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-purple-700">{training.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{training.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-800">{training.time}</div>
                      <div className="text-sm text-gray-500">{training.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{training.trainer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingStatus === training.id ? (
                        <select
                          className="border border-purple-300 rounded p-1 text-sm focus:ring-purple-500 focus:border-purple-500"
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
                          className="hover:bg-purple-100 rounded p-1 transition-colors"
                        >
                          {getStatusBadge(training.status)}
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-purple-600 hover:text-purple-800 mr-4 transition-colors">
                        <FaClipboardList className="inline mr-1" /> Attendance
                      </button>
                      <button className="text-purple-600 hover:text-purple-800 transition-colors">
                        <FaUserPlus className="inline mr-1" /> Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upskilling Table */}
      {activeTab === 'upskilling' && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-purple-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-purple-200">
              <thead className="bg-purple-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">SNO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                    Upskilling Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                    <FaCalendarAlt className="inline mr-1" /> Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                    <FaUserTie className="inline mr-1" /> Trainer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-purple-100">
                {filteredUpskillingData.map((upskilling, index) => (
                  <tr key={upskilling.id} className="hover:bg-purple-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-purple-700">{upskilling.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{upskilling.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-800">{upskilling.time}</div>
                      <div className="text-sm text-gray-500">{upskilling.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{upskilling.trainer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingStatus === upskilling.id ? (
                        <select
                          className="border border-purple-300 rounded p-1 text-sm focus:ring-purple-500 focus:border-purple-500"
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
                          className="hover:bg-purple-100 rounded p-1 transition-colors"
                        >
                          {getStatusBadge(upskilling.status)}
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-purple-600 hover:text-purple-800 mr-4 transition-colors">
                        <FaClipboardList className="inline mr-1" /> Attendance
                      </button>
                      <button className="text-purple-600 hover:text-purple-800 transition-colors">
                        <FaUserPlus className="inline mr-1" /> Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignTraining;