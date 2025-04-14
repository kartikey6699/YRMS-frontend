import React, { useState } from 'react';
import { 
  FaTimes, FaSearch, FaUserTie, FaEnvelope, FaCode, 
  FaProjectDiagram, FaMapMarkerAlt, FaUserCheck, FaUserTimes 
} from 'react-icons/fa';

const ParticipantDetailsModal = ({ onClose, training }) => {
  // Sample participant data with state
  const [participants, setParticipants] = useState([
    {
      empId: 'EMP001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      skill: 'React, Node.js',
      project: 'HR Portal',
      currentLocation: 'Bangalore',
      status: 'Joined'
    },
    {
      empId: 'EMP002',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      skill: 'Angular, Java',
      project: 'Customer Dashboard',
      currentLocation: 'Hyderabad',
      status: 'Joined'
    },
    {
      empId: 'EMP003',
      name: 'Robert Johnson',
      email: 'robert.j@example.com',
      skill: 'Python, Data Science',
      project: 'Analytics Platform',
      currentLocation: 'Pune',
      status: 'Joined'
    },
  ].slice(0, training?.participants || 3));

  const [searchTerm, setSearchTerm] = useState('');

  // Handle status change
  const handleStatusChange = (index, newStatus) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index].status = newStatus;
    setParticipants(updatedParticipants);
  };

  // Filter participants based on search term
  const filteredParticipants = participants.filter(participant => 
    participant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    participant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-t-lg flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">
            <FaUserTie className="inline mr-2" />
            Participant Details for {training?.name}
          </h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-purple-200 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="p-4 overflow-y-auto flex-grow">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-600">Total Participants: </span>
              <span className="font-bold text-purple-600">{training?.participants}</span>
            </div>
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search participants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-4 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emp ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredParticipants.map((participant, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-purple-600">{participant.empId}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{participant.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaEnvelope className="mr-1 text-gray-400" />
                        {participant.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaCode className="mr-1 text-gray-400" />
                        {participant.skill}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaProjectDiagram className="mr-1 text-gray-400" />
                        {participant.project}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-1 text-gray-400" />
                        {participant.currentLocation}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="relative">
                        <select
                          value={participant.status}
                          onChange={(e) => handleStatusChange(index, e.target.value)}
                          className={`appearance-none pl-8 pr-4 py-1 text-xs leading-5 font-semibold rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors cursor-pointer ${
                            participant.status === 'Joined' 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          <option value="Joined" className="bg-green-100 text-green-800">Joined</option>
                          <option value="Not Joined" className="bg-red-100 text-red-800">Not Joined</option>
                        </select>
                        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          {participant.status === 'Joined' ? (
                            <FaUserCheck className="text-green-700" />
                          ) : (
                            <FaUserTimes className="text-red-700" />
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Modal Footer */}
        <div className="bg-gray-50 px-4 py-3 rounded-b-lg flex justify-between items-center border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing {filteredParticipants.length} of {training?.participants} participants
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center">
              <FaUserCheck className="mr-2" />
              Export to CSV
            </button>
            <button 
              onClick={onClose}
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 flex items-center"
            >
              <FaTimes className="mr-2" />
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantDetailsModal;