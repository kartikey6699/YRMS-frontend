import React, { useState, useEffect } from 'react';
import { 
  FaTimes, FaSearch, FaUserTie, FaEnvelope, 
  FaMapMarkerAlt, FaUserCheck, FaUserTimes 
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchParticipantsDetails } from '../../../../features/program/programAction';

const ParticipantDetailsModal = ({ onClose, training }) => {
  const dispatch = useDispatch();
  const { data: participants, totalCount, loading, error } = useSelector(
    (state) => state.program.participantsDetails
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [localParticipants, setLocalParticipants] = useState([]);

  useEffect(() => {
    if (training?.id) {
      dispatch(fetchParticipantsDetails(training.id));
    }
  }, [dispatch, training?.id]);

  useEffect(() => {
    if (participants) {
      setLocalParticipants(participants.map(participant => ({
        ...participant,
        status: participant.status === "1" ? "Joined" : "Not Joined"
      })));
    }
  }, [participants]);

  const handleStatusChange = (employeeId, newStatus) => {
    setLocalParticipants(prev => 
      prev.map(p => 
        p.employeeId === employeeId 
          ? { ...p, status: newStatus } 
          : p
      )
    );
  };

  const filteredParticipants = localParticipants.filter(participant => 
    participant.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    participant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <p>Loading participants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <p className="text-red-500">Error: {error}</p>
          <button 
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col border-2 border-purple-100">
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
              <span className="font-bold text-purple-600">{totalCount}</span>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredParticipants.map((participant, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-purple-600">
                      {participant.employeeId}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {participant.employeeName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaEnvelope className="mr-1 text-gray-400" />
                        {participant.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-1 text-gray-400" />
                        {participant.location}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="relative">
                        <select
                          value={participant.status}
                          onChange={(e) => handleStatusChange(participant.employeeId, e.target.value)}
                          className={`appearance-none pl-8 pr-4 py-1 text-xs leading-5 font-semibold rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors cursor-pointer ${
                            participant.status === 'Joined' 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          <option value="Joined">Joined</option>
                          <option value="Not Joined">Not Joined</option>
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
            Showing {filteredParticipants.length} of {totalCount} participants
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