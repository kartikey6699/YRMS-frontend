import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  FaHourglassHalf,
  FaEdit,
  FaSave,
  FaTimes,
  FaArrowLeft,
  FaTrash,
  FaDownload,
  FaChartBar
} from 'react-icons/fa';
import { format, parseISO } from 'date-fns';
import { fetchProgramDetails, updateProgramDetails } from '../../../../features/program/programAction';
import TextareaAutosize from 'react-textarea-autosize';
import { SuccessToast, ErrorToast } from '../../../helper/ResourceToast';

const TrainingDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: program, loading, error } = useSelector(state => state.program.programDetails);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    dispatch(fetchProgramDetails(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (program) {
      setEditedData({
        programName: program.programName,
        projectDescription: program.projectDescription,
        purpose: program.purpose,
        technology: program.technology,
        duration: program.duration,
        startDate: program.startDate,
        endDate: program.endDate
      });
    }
  }, [program]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    dispatch(updateProgramDetails({ id, data: editedData }))
      .unwrap()
      .then(() => {
        setSuccessMessage('Program updated successfully!');
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
        setIsEditing(false);
        dispatch(fetchProgramDetails(id));
      })
      .catch(err => {
        setErrorMessage(err.message || 'Failed to update program');
        setShowErrorToast(true);
        setTimeout(() => setShowErrorToast(false), 3000);
      });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({
      programName: program.programName,
      projectDescription: program.projectDescription,
      purpose: program.purpose,
      technology: program.technology,
      duration: program.duration,
      startDate: program.startDate,
      endDate: program.endDate
    });
  };

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

  const getTypeDetails = (type) => {
    switch(type) {
      case '1': // Training
        return { text: 'Training', icon: <FaBook className="text-purple-500" />, color: 'bg-purple-100 text-purple-800' };
      case '2': // Project
        return { text: 'Project', icon: <FaCode className="text-indigo-500" />, color: 'bg-indigo-100 text-indigo-800' };
      default:
        return { text: 'Unknown', icon: null, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getRequesterDetails = (requester) => {
    switch(requester) {
      case '1': // Engineering Team
        return { text: 'Engineering Team', icon: <FaCode className="text-blue-500" />, color: 'bg-blue-100 text-blue-800' };
      case '2': // HR Team
        return { text: 'HR Team', icon: <FaUserTie className="text-green-500" />, color: 'bg-green-100 text-green-800' };
      case '3': // Management
        return { text: 'Management', icon: <FaUsers className="text-purple-500" />, color: 'bg-purple-100 text-purple-800' };
      default:
        return { text: 'Unknown', icon: null, color: 'bg-gray-100 text-gray-800' };
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-8">
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md" role="alert">
        <p className="font-bold">Error loading program details</p>
        <p>{error}</p>
        <button 
          onClick={() => dispatch(fetchProgramDetails(id))}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    </div>
  );

  if (!program) return null;

  const statusDetails = getStatusDetails(program.status);
  const typeDetails = getTypeDetails(program.type);
  const requesterDetails = getRequesterDetails(program.requester);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-purple-700 hover:text-purple-900 transition-colors mr-4"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-purple-800">
            {isEditing ? (
              <input
                type="text"
                name="programName"
                value={editedData.programName}
                onChange={handleInputChange}
                className="bg-transparent border-b-2 border-purple-300 focus:border-purple-600 focus:outline-none w-full max-w-md"
              />
            ) : (
              program.programName
            )}
          </h1>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-purple-100">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex flex-wrap items-center gap-3 mb-4 md:mb-0">
                <span className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${typeDetails.color}`}>
                  {typeDetails.icon}
                  <span className="ml-1">{typeDetails.text}</span>
                </span>
                <span className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusDetails.color}`}>
                  {statusDetails.icon}
                  <span className="ml-1">{statusDetails.text}</span>
                </span>
                <span className="flex items-center px-3 py-1 rounded-full text-sm font-medium  bg-opacity-20">
                  <FaUserTie className="mr-1" />
                  {program.trainerName}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-xl font-semibold">{program.participantCount} Participants</div>
                  <div className="text-sm opacity-90">Competency: {program.competencyName}</div>
                </div>
                <div className="flex space-x-2">
                  {isEditing ? (
                    <>
                      <button 
                        onClick={handleSave}
                        className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition shadow-md text-sm"
                      >
                        <FaSave className="mr-2" />
                        Save
                      </button>
                      <button 
                        onClick={handleCancel}
                        className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition shadow-md text-sm"
                      >
                        <FaTimes className="mr-2" />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={handleEditToggle}
                        className="flex items-center px-4 py-2 bg-white text-purple-700 hover:bg-purple-50 rounded-lg transition shadow-md text-sm"
                      >
                        <FaEdit className="mr-2" />
                        Edit
                      </button>
                      <button className="flex items-center px-4 py-2 bg-purple-700 hover:bg-purple-800 rounded-lg transition shadow-md text-sm">
                        <FaDownload className="mr-2" />
                        Export
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div>
                <div className="mb-8">
                  <div className="flex items-center mb-4 border-b border-purple-100 pb-2">
                    <FaClipboardList className="text-purple-600 mr-2" />
                    <h2 className="text-xl font-semibold text-purple-800">Program Details</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row">
                      <span className="w-full sm:w-1/3 font-medium text-purple-700 mb-1 sm:mb-0">Technology:</span>
                      {isEditing ? (
                        <input
                          type="text"
                          name="technology"
                          value={editedData.technology}
                          onChange={handleInputChange}
                          className="w-full sm:w-2/3 px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      ) : (
                        <span className="w-full sm:w-2/3 flex items-center">
                          <FaCode className="mr-2 text-purple-500" />
                          {program.technology}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row">
                      <span className="w-full sm:w-1/3 font-medium text-purple-700 mb-1 sm:mb-0">Duration:</span>
                      {isEditing ? (
                        <input
                          type="number"
                          name="duration"
                          value={editedData.duration}
                          onChange={handleInputChange}
                          className="w-full sm:w-2/3 px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      ) : (
                        <span className="w-full sm:w-2/3">{program.duration} days</span>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row">
                      <span className="w-full sm:w-1/3 font-medium text-purple-700 mb-1 sm:mb-0">Requester:</span>
                      <span className="w-full sm:w-2/3 flex items-center">
                        {requesterDetails.icon}
                        <span className="ml-2">{requesterDetails.text}</span>
                      </span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row">
                      <span className="w-full sm:w-1/3 font-medium text-purple-700 mb-1 sm:mb-0">Competency:</span>
                      <span className="w-full sm:w-2/3 flex items-center">
                        <FaChartBar className="mr-2 text-purple-500" />
                        {program.competencyName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex items-center mb-4 border-b border-purple-100 pb-2">
                    <FaCalendarAlt className="text-purple-600 mr-2" />
                    <h2 className="text-xl font-semibold text-purple-800">Schedule</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row">
                      <span className="w-full sm:w-1/3 font-medium text-purple-700 mb-1 sm:mb-0">Start Date:</span>
                      {isEditing ? (
                        <input
                          type="date"
                          name="startDate"
                          value={editedData.startDate ? editedData.startDate.split('T')[0] : ''}
                          onChange={handleInputChange}
                          className="w-full sm:w-2/3 px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      ) : (
                        <span className="w-full sm:w-2/3">
                          {format(parseISO(program.startDate), 'MMMM d, yyyy')}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row">
                      <span className="w-full sm:w-1/3 font-medium text-purple-700 mb-1 sm:mb-0">End Date:</span>
                      {isEditing ? (
                        <input
                          type="date"
                          name="endDate"
                          value={editedData.endDate ? editedData.endDate.split('T')[0] : ''}
                          onChange={handleInputChange}
                          className="w-full sm:w-2/3 px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      ) : (
                        <span className="w-full sm:w-2/3">
                          {format(parseISO(program.endDate), 'MMMM d, yyyy')}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row">
                      <span className="w-full sm:w-1/3 font-medium text-purple-700 mb-1 sm:mb-0">Created:</span>
                      <span className="w-full sm:w-2/3">
                        {format(parseISO(program.createdAt), 'MMMM d, yyyy h:mm a')}
                      </span>
                    </div>
                    
                    {program.updatedAt && (
                      <div className="flex flex-col sm:flex-row">
                        <span className="w-full sm:w-1/3 font-medium text-purple-700 mb-1 sm:mb-0">Last Updated:</span>
                        <span className="w-full sm:w-2/3">
                          {format(parseISO(program.updatedAt), 'MMMM d, yyyy h:mm a')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div className="mb-8">
                  <div className="flex items-center mb-4 border-b border-purple-100 pb-2">
                    <FaLightbulb className="text-purple-600 mr-2" />
                    <h2 className="text-xl font-semibold text-purple-800">Description</h2>
                  </div>
                  {isEditing ? (
                    <TextareaAutosize
                      name="projectDescription"
                      value={editedData.projectDescription}
                      onChange={handleInputChange}
                      className="w-full p-4 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50"
                      minRows={5}
                    />
                  ) : (
                    <div className="bg-purple-50 p-4 rounded-lg shadow-inner">
                      {program.projectDescription || 'No description provided'}
                    </div>
                  )}
                </div>

                <div className="mb-8">
                  <div className="flex items-center mb-4 border-b border-purple-100 pb-2">
                    <FaHistory className="text-purple-600 mr-2" />
                    <h2 className="text-xl font-semibold text-purple-800">Purpose</h2>
                  </div>
                  {isEditing ? (
                    <TextareaAutosize
                      name="purpose"
                      value={editedData.purpose}
                      onChange={handleInputChange}
                      className="w-full p-4 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50"
                      minRows={3}
                    />
                  ) : (
                    <div className="bg-purple-50 p-4 rounded-lg shadow-inner">
                      {program.purpose || 'No purpose specified'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {showSuccessToast && (
        <SuccessToast
          message={successMessage}
          onClose={() => setShowSuccessToast(false)}
        />
      )}
      {showErrorToast && (
        <ErrorToast
          message={errorMessage}
          onClose={() => setShowErrorToast(false)}
        />
      )}
    </div>
  );
};

export default TrainingDetail;