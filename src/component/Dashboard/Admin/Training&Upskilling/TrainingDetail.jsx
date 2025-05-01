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
  FaChartBar,
  FaUserPlus,
  FaUserFriends,
  FaUserCircle
} from 'react-icons/fa';
import { format, parseISO } from 'date-fns';

import {
  fetchProgramDetails,
  updateProgramDetails,
  addParticipants,
  removeParticipants
} from '../../../../features/program/programAction';
import TextareaAutosize from 'react-textarea-autosize';
import UpskillingDetailModal from './UpskillingDetailModal';
import Select from 'react-select';
import { SuccessToast, ErrorToast } from '../../../helper/ResourceToast';
import { fetchTrainingTechnologies, fetchResources, fetchCompetencies } from "../../../../features/resource/resourceAction";

const MultiSelectTechnology = ({ value, onChange, options, isDisabled }) => {
  return (
    <Select
      options={options}
      isMulti
      value={value}
      onChange={onChange}
      className="basic-multi-select"
      classNamePrefix="select"
      placeholder="Select technologies..."
      isDisabled={isDisabled}
    />
  );
};

const TrainingDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux states
  const { data: program, loading, error } = useSelector(state => state.program.programDetails);
  const { resources, competencies, trainingTechnologies } = useSelector((state) => state.resource);

  // Local states
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showParticipantModal, setShowParticipantModal] = useState(false);
  const [selectedParticipantToAdd, setSelectedParticipantToAdd] = useState(null);
  const [showUpskillingDetails, setShowUpskillingDetails] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchProgramDetails(id));
    dispatch(fetchTrainingTechnologies());
    dispatch(fetchResources());
    dispatch(fetchCompetencies());
  }, [id, dispatch]);

  // Initialize form data when program or resources load
  useEffect(() => {
    if (program && resources && competencies && trainingTechnologies) {
      const formattedTechnologies = program.technology
        ? program.technology.split(',').map(tech => ({
          value: tech.trim(),
          label: tech.trim()
        }))
        : [];

      setEditedData({
        programName: program.programName,
        projectDescription: program.projectDescription,
        purpose: program.purpose,
        technologies: formattedTechnologies,
        duration: program.duration,
        startDate: program.startDate,
        endDate: program.endDate,
        requester: program.requester ? {
          value: program.requester,
          label: getRequesterDetails(program.requester).text
        } : null,
        competency: program.competencyPublicId ? {
          value: program.competencyPublicId,
          label: program.competencyName
        } : null,
        trainer: program.trainerPublicId ? {
          value: program.trainerPublicId,
          label: program.trainerName
        } : null
      });
    }
  }, [program, resources, competencies, trainingTechnologies]);

  // Dropdown options
  const requesterOptions = [
    { value: 1, label: "HR Department" },
    { value: 2, label: "Engineering Team" },
    { value: 3, label: "Project Management Office" }
  ];

  const trainerOptions = resources.map(resource => ({
    value: resource.publicId,
    label: resource.employeeName,
  }));

  const competencyOptions = competencies.map(competency => ({
    value: competency.publicId,
    label: competency.name,
  }));

  const technologyOptions = trainingTechnologies.map(tech => ({
    value: tech.name,
    label: tech.name,
  }));

  const participantOptions = resources
    .filter(resource => !program?.participants?.some(p => p.publicId === resource.publicId))
    .map(resource => ({
      value: resource.publicId,
      label: resource.employeeName,
    }));

  // Helper functions
  const getStatusDetails = (status) => {
    switch (status) {
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
    switch (type) {
      case '1': // Training
        return { text: 'Training', icon: <FaBook className="text-purple-500" />, color: 'bg-purple-100 text-purple-800' };
      case '2': // Upskilling
        return { text: 'Upskilling', icon: <FaUserPlus className="text-indigo-500" />, color: 'bg-indigo-100 text-indigo-800' };
      default:
        return { text: 'Unknown', icon: null, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getRequesterDetails = (requester) => {
    switch (requester) {
      case "1": // HR Department
        return { text: "HR Department", icon: <FaUserTie className="text-green-500" />, color: 'bg-green-100 text-green-800' };
      case "2": // Engineering Team
        return { text: "Engineering Team", icon: <FaCode className="text-blue-500" />, color: 'bg-blue-100 text-blue-800' };
      case "3": // Project Management Office
        return { text: "Project Management Office", icon: <FaUsers className="text-purple-500" />, color: 'bg-purple-100 text-purple-800' };
      default:
        return { text: 'Unknown', icon: null, color: 'bg-gray-100 text-gray-800' };
    }
  };

  // Event handlers
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

  const handleSelectChange = (name, selectedOption) => {
    setEditedData(prev => ({
      ...prev,
      [name]: selectedOption
    }));
  };

  const handleMultiSelectChange = (name, selectedOptions) => {
    setEditedData(prev => ({
      ...prev,
      [name]: selectedOptions
    }));
  };

  const handleSave = () => {
    const payload = {
      public_id: program.publicId,
      type: parseInt(program.type),
      programName: editedData.programName,
      startDate: editedData.startDate.split('T')[0],
      endDate: editedData.endDate.split('T')[0],
      duration: parseInt(editedData.duration),
      requester: parseInt(editedData.requester?.value),
      technology: editedData.technologies?.map(t => t.value).join(', '),
      projectDescription: editedData.projectDescription,
      purpose: editedData.purpose,
      competencyId: editedData.competency?.value,
      trainerId: editedData.trainer?.value
    };

    dispatch(updateProgramDetails(payload))
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
    // Reset to original data
    const formattedTechnologies = program.technology
      ? program.technology.split(',').map(tech => ({
        value: tech.trim(),
        label: tech.trim()
      }))
      : [];

    setEditedData({
      programName: program.programName,
      projectDescription: program.projectDescription,
      purpose: program.purpose,
      technologies: formattedTechnologies,
      duration: program.duration,
      startDate: program.startDate,
      endDate: program.endDate,
      requester: program.requester ? {
        value: program.requester,
        label: getRequesterDetails(program.requester).text
      } : null,
      competency: program.competencyPublicId ? {
        value: program.competencyPublicId,
        label: program.competencyName
      } : null,
      trainer: program.trainerPublicId ? {
        value: program.trainerPublicId,
        label: program.trainerName
      } : null
    });
  };

  const handleAddParticipant = () => {
    if (!selectedParticipantToAdd) return;

    dispatch(addParticipants({
      programId: program.publicId,
      participantIds: [selectedParticipantToAdd.value]
    }))
      .unwrap()
      .then(() => {
        // Refresh program details after successful addition
        dispatch(fetchProgramDetails(id)).unwrap().then(() => {
          setSuccessMessage('Participant added successfully!');
          setShowSuccessToast(true);
          setTimeout(() => setShowSuccessToast(false), 3000);
          setSelectedParticipantToAdd(null);
        });
      })
      .catch(err => {
        setErrorMessage(err.message || 'Failed to add participant');
        setShowErrorToast(true);
        setTimeout(() => setShowErrorToast(false), 3000);
      });
  };

  const handleRemoveParticipant = (participantId) => {
    dispatch(removeParticipants([participantId]))
      .unwrap()
      .then(() => {
        // Refresh program details after successful removal
        dispatch(fetchProgramDetails(id)).unwrap().then(() => {
          setSuccessMessage('Participant removed successfully!');
          setShowSuccessToast(true);
          setTimeout(() => setShowSuccessToast(false), 3000);
        });
      })
      .catch(err => {
        setErrorMessage(err.message || 'Failed to remove participant');
        setShowErrorToast(true);
        setTimeout(() => setShowErrorToast(false), 3000);
      });
  };
  // Loading and error states
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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4 md:p-8 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-purple-700 hover:text-purple-900 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowParticipantModal(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-md text-sm"
            >
              <FaUserFriends className="mr-2" />
              Manage Participants
            </button>

            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition shadow-md text-sm"
                >
                  <FaSave className="mr-2" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition shadow-md text-sm"
                >
                  <FaTimes className="mr-2" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEditToggle}
                className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition shadow-md text-sm"
              >
                <FaEdit className="mr-2" />
                Edit Program
              </button>
            )}
            <button
              onClick={() => setShowUpskillingDetails(true)}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-md text-sm"
            >
              <FaUserFriends className="mr-2" />
              View Participants
            </button>
          </div>
        </div>

        {/* Program Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-purple-800 mb-6">
          {isEditing ? (
            <input
              type="text"
              name="programName"
              value={editedData.programName}
              onChange={handleInputChange}
              className="bg-transparent border-b-2 border-purple-300 focus:border-purple-600 focus:outline-none w-full max-w-md px-2 py-1"
            />
          ) : (
            program.programName
          )}
        </h1>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-3 mb-6">
          <span className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${typeDetails.color}`}>
            {typeDetails.icon}
            <span className="ml-1">{typeDetails.text}</span>
          </span>
          <span className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusDetails.color}`}>
            {statusDetails.icon}
            <span className="ml-1">{statusDetails.text}</span>
          </span>
          <span className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${requesterDetails.color}`}>
            {requesterDetails.icon}
            <span className="ml-1">{requesterDetails.text}</span>
          </span>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-purple-100">
          {/* Card Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div>
                {/* Program Details Section */}
                <div className="mb-8">
                  <div className="flex items-center mb-4 border-b border-purple-100 pb-2">
                    <FaClipboardList className="text-purple-600 mr-2" />
                    <h2 className="text-xl font-semibold text-purple-800">Program Details</h2>
                  </div>

                  <div className="space-y-4">
                    {/* Trainer */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-purple-700 mb-1">Trainer</label>
                      {isEditing ? (
                        <Select
                          options={trainerOptions}
                          value={editedData.trainer}
                          onChange={(selected) => handleSelectChange("trainer", selected)}
                          className="basic-single"
                          classNamePrefix="select"
                          placeholder="Select trainer..."
                        />
                      ) : (
                        <div className="flex items-center p-2 bg-gray-50 rounded">
                          <FaUserTie className="text-purple-500 mr-2" />
                          {program.trainerName}
                        </div>
                      )}
                    </div>

                    {/* Technology */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-purple-700 mb-1">Technology</label>
                      {isEditing ? (
                        <MultiSelectTechnology
                          options={technologyOptions}
                          value={editedData.technologies}
                          onChange={(selected) => handleMultiSelectChange("technologies", selected)}
                        />
                      ) : (
                        <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded">
                          {program.technology.split(',').map((tech, index) => (
                            <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Requester */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-purple-700 mb-1">Requester</label>
                      {isEditing ? (
                        <Select
                          options={requesterOptions}
                          value={editedData.requester}
                          onChange={(selected) => handleSelectChange("requester", selected)}
                          className="basic-single"
                          classNamePrefix="select"
                          placeholder="Select requester..."
                        />
                      ) : (
                        <div className="flex items-center p-2 bg-gray-50 rounded">
                          {requesterDetails.icon}
                          <span className="ml-2">{requesterDetails.text}</span>
                        </div>
                      )}
                    </div>

                    {/* Competency */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-purple-700 mb-1">Competency</label>
                      {isEditing ? (
                        <Select
                          options={competencyOptions}
                          value={editedData.competency}
                          onChange={(selected) => handleSelectChange("competency", selected)}
                          className="basic-single"
                          classNamePrefix="select"
                          placeholder="Select competency..."
                        />
                      ) : (
                        <div className="flex items-center p-2 bg-gray-50 rounded">
                          <FaChartBar className="text-purple-500 mr-2" />
                          {program.competencyName}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Schedule Section */}
                <div className="mb-8">
                  <div className="flex items-center mb-4 border-b border-purple-100 pb-2">
                    <FaCalendarAlt className="text-purple-600 mr-2" />
                    <h2 className="text-xl font-semibold text-purple-800">Schedule</h2>
                  </div>

                  <div className="space-y-4">
                    {/* Duration */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-purple-700 mb-1">Duration (days)</label>
                      {isEditing ? (
                        <input
                          type="number"
                          name="duration"
                          value={editedData.duration}
                          onChange={handleInputChange}
                          min="1"
                          className="w-full px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded">
                          {program.duration} days
                        </div>
                      )}
                    </div>

                    {/* Start Date */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-purple-700 mb-1">Start Date</label>
                      {isEditing ? (
                        <input
                          type="date"
                          name="startDate"
                          value={editedData.startDate ? editedData.startDate.split('T')[0] : ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded">
                          {format(parseISO(program.startDate), 'MMMM d, yyyy')}
                        </div>
                      )}
                    </div>

                    {/* End Date */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-purple-700 mb-1">End Date</label>
                      {isEditing ? (
                        <input
                          type="date"
                          name="endDate"
                          value={editedData.endDate ? editedData.endDate.split('T')[0] : ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded">
                          {format(parseISO(program.endDate), 'MMMM d, yyyy')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                {/* Project Description */}
                <div className="mb-8">
                  <div className="flex items-center mb-4 border-b border-purple-100 pb-2">
                    <FaLightbulb className="text-purple-600 mr-2" />
                    <h2 className="text-xl font-semibold text-purple-800">Project Description</h2>
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

                {/* Purpose */}
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

      {/* Participant Management Modal */}
      {showParticipantModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Blurred Background */}
          <div
            className="fixed inset-0 bg-opacity-30 backdrop-blur-sm transition-opacity"
            onClick={() => setShowParticipantModal(false)}
          ></div>

          {/* Modal Container */}
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {/* Modal Header */}
              <div className="bg-purple-600 px-4 py-3 sm:px-6 sm:flex sm:items-center sm:justify-between">
                <h3 className="text-lg leading-6 font-bold text-white">
                  <FaUserFriends className="inline mr-2" />
                  Manage Participants
                </h3>
                <button
                  type="button"
                  className="text-white hover:text-purple-200 focus:outline-none"
                  onClick={() => setShowParticipantModal(false)}
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">
                    Current Participants ({program.participants.length})
                  </h4>

                  {program.participants.length > 0 ? (
                    <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
                      {program.participants.map((participant) => (
                        <li key={participant.publicId} className="py-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <FaUserCircle className="text-purple-500 text-xl mr-3" />
                            <span className="text-gray-700">{participant.employeeName}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveParticipant(participant.publicId)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                            title="Remove participant"
                          >
                            <FaTrash />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No participants added yet</p>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Add New Participants</h4>
                  <div className="flex items-center gap-2">
                    <Select
                      options={participantOptions}
                      onChange={setSelectedParticipantToAdd}
                      value={selectedParticipantToAdd}
                      className="flex-1"
                      placeholder="Search participants to add..."
                      classNamePrefix="select"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          minHeight: '42px',
                          borderColor: '#E5E7EB', // Tailwind gray-200
                          boxShadow: 'none',
                          '&:hover': {
                            borderColor: '#A78BFA', // Tailwind purple-400
                          },
                        }),
                        menu: (provided) => ({
                          ...provided,
                          zIndex: 60, // Higher than modal's z-50
                          marginTop: 4,
                          borderRadius: '0.5rem', // Tailwind rounded-lg
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', // Tailwind shadow-md
                          maxHeight: '200px',
                          overflowY: 'auto',
                        }),
                        menuPortal: (provided) => ({
                          ...provided,
                          zIndex: 60, // Ensure portal has high z-index
                        }),
                      }}
                      menuPortalTarget={document.body} // Append dropdown to body to avoid clipping
                      menuPosition="fixed" // Use fixed positioning to prevent overflow issues
                    />
                    <button
                      onClick={handleAddParticipant}
                      className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!selectedParticipantToAdd}
                    >
                      <FaUserPlus className="mr-1" />
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowParticipantModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {showUpskillingDetails && (
        <UpskillingDetailModal
          onClose={() => setShowUpskillingDetails(false)}
          training={{
            ...program,
            participants: program.participants,
            participantCount: program.participants.length,
          }}
        />
      )}

      <div 
        className="p-4 bg-blue-50 rounded-lg border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors"
        onClick={() => {
          setSelectedTraining({
            ...program,
            participants: program.participants,
            participantCount: program.participants.length
          });
          setShowUpskillingDetails(true);
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-blue-800">Participants</h3>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl text-purple-600">
                {program.participants.length}
              </span>
              <div className="text-xs text-gray-500">
                ({/* You might want to calculate attended count here */} attended)
              </div>
            </div>
          </div>
          <FaUserFriends className="text-blue-500 text-2xl" />
        </div>
        <div className="mt-2 text-sm text-blue-700">
          Click to view details
        </div>
      </div>
    </div>
  );
};

export default TrainingDetail;