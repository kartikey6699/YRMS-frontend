import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaCalendarAlt, 
  FaUserTie, 
  FaUsers, 
  FaCode, 
  FaClipboardList, 
  FaLightbulb,
  FaBook,
  FaHistory,
  FaSyncAlt,
  FaCheckCircle,
  FaHourglassHalf
} from 'react-icons/fa';
import { format } from 'date-fns';
import { fetchProgramDetails } from '../../../../features/program/programAction';

const TrainingDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data: program, loading, error } = useSelector(state => state.program.programDetails);

  useEffect(() => {
    dispatch(fetchProgramDetails(id));
  }, [id, dispatch]);

  // Helper function to get status details
  const getStatusDetails = (status) => {
    switch(status) {
      case '1': // Running
        return { text: 'Running', icon: <FaSyncAlt className="text-blue-500" />, color: 'bg-blue-100 text-blue-800' };
      case '2': // Completed
        return { text: 'Completed', icon: <FaCheckCircle className="text-green-500" />, color: 'bg-green-100 text-green-800' };
      case '3': // Upcoming
        return { text: 'Upcoming', icon: <FaHourglassHalf className="text-yellow-500" />, color: 'bg-yellow-100 text-yellow-800' };
      default:
        return { text: 'Unknown', icon: null, color: 'bg-gray-100 text-gray-800' };
    }
  };

  // Helper function to get type details
  const getTypeDetails = (type) => {
    switch(type) {
      case '1': // Training
        return { text: 'Training', icon: <FaBook className="text-purple-500" /> };
      case '2': // Project
        return { text: 'Project', icon: <FaCode className="text-indigo-500" /> };
      default:
        return { text: 'Unknown', icon: null };
    }
  };

  // Helper function to get requester details
  const getRequesterDetails = (requester) => {
    switch(requester) {
      case '1': // Engineering Team
        return { text: 'Engineering Team', icon: <FaCode className="text-blue-500" /> };
      case '2': // HR Team
        return { text: 'HR Team', icon: <FaUserTie className="text-green-500" /> };
      case '3': // Management
        return { text: 'Management', icon: <FaUsers className="text-purple-500" /> };
      default:
        return { text: 'Unknown', icon: null };
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
      <p>Error loading program details: {error}</p>
    </div>
  );

  if (!program) return null;

  const statusDetails = getStatusDetails(program.status);
  const typeDetails = getTypeDetails(program.type);
  const requesterDetails = getRequesterDetails(program.requester);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{program.programName}</h1>
              <div className="flex items-center mt-2">
                <span className="flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 mr-3">
                  {typeDetails.icon}
                  <span className="ml-1">{typeDetails.text}</span>
                </span>
                <span className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusDetails.color}`}>
                  {statusDetails.icon}
                  <span className="ml-1">{statusDetails.text}</span>
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-semibold">{program.participantCount} Participants</div>
              <div className="text-sm opacity-80">Competency: {program.competencyName}</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FaClipboardList className="mr-2 text-blue-500" />
                  Program Details
                </h2>
                <div className="space-y-3">
                  <div className="flex">
                    <span className="w-1/3 font-medium text-gray-500">Technology:</span>
                    <span className="w-2/3 flex items-center">
                      <FaCode className="mr-2 text-gray-500" />
                      {program.technology}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-1/3 font-medium text-gray-500">Duration:</span>
                    <span className="w-2/3">{program.duration} days</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/3 font-medium text-gray-500">Requester:</span>
                    <span className="w-2/3 flex items-center">
                      {requesterDetails.icon}
                      <span className="ml-2">{requesterDetails.text}</span>
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-1/3 font-medium text-gray-500">Trainer:</span>
                    <span className="w-2/3 flex items-center">
                      <FaUserTie className="mr-2 text-gray-500" />
                      {program.trainerName}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FaCalendarAlt className="mr-2 text-blue-500" />
                  Schedule
                </h2>
                <div className="space-y-3">
                  <div className="flex">
                    <span className="w-1/3 font-medium text-gray-500">Start Date:</span>
                    <span className="w-2/3">
                      {format(new Date(program.startDate), 'MMMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-1/3 font-medium text-gray-500">End Date:</span>
                    <span className="w-2/3">
                      {format(new Date(program.endDate), 'MMMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-1/3 font-medium text-gray-500">Created:</span>
                    <span className="w-2/3">
                      {format(new Date(program.createdAt), 'MMMM d, yyyy h:mm a')}
                    </span>
                  </div>
                  {program.updatedAt && (
                    <div className="flex">
                      <span className="w-1/3 font-medium text-gray-500">Last Updated:</span>
                      <span className="w-2/3">
                        {format(new Date(program.updatedAt), 'MMMM d, yyyy h:mm a')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FaLightbulb className="mr-2 text-blue-500" />
                  Description
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {program.projectDescription || 'No description provided'}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FaHistory className="mr-2 text-blue-500" />
                  Purpose
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {program.purpose || 'No purpose specified'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingDetail;