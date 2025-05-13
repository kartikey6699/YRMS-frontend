import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
  FaUserCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import { format, parseISO, addDays, isValid, differenceInDays } from 'date-fns';
import { holidays, isHoliday } from "../../../helper/holidays";

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
  const location = useLocation();
  const resourceId = location.state?.resourceId;
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux states
  const { data: program, loading, error } = useSelector(state => state.program.programDetails);
  const { resources, competencies, trainingTechnologies } = useSelector((state) => state.resource);

  // Local states
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showParticipantModal, setShowParticipantModal] = useState(false);
  const [selectedParticipantToAdd, setSelectedParticipantToAdd] = useState(null);
  const [showUpskillingDetails, setShowUpskillingDetails] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [retryAttempts, setRetryAttempts] = useState({ program: 0, technologies: 0, resources: 0, competencies: 0 });

  // Retry logic with exponential backoff
  const retryFetch = useCallback(async (action, maxAttempts = 3, baseDelay = 1000) => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await dispatch(action).unwrap();
        return true;
      } catch (err) {
        if (attempt === maxAttempts) {
          return false;
        }
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }, [dispatch]);

  // Fetch data on mount with retry
  useEffect(() => {
    const fetchData = async () => {
      const results = await Promise.all([
        retryFetch(fetchProgramDetails(id)).then(success => ({ type: 'program', success })),
        retryFetch(fetchTrainingTechnologies()).then(success => ({ type: 'technologies', success })),
        retryFetch(fetchResources()).then(success => ({ type: 'resources', success })),
        retryFetch(fetchCompetencies()).then(success => ({ type: 'competencies', success }))
      ]);

      results.forEach(({ type, success }) => {
        if (!success) {
          setRetryAttempts(prev => ({ ...prev, [type]: prev[type] + 1 }));
          setErrorMessage(`Failed to fetch ${type} data after retries`);
          setShowErrorToast(true);
          setTimeout(() => setShowErrorToast(false), 3000);
        }
      });
    };

    fetchData();
  }, [id, dispatch, retryFetch]);

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
        programName: program.programName || '',
        projectDescription: program.projectDescription || '',
        purpose: program.purpose || '',
        technologies: formattedTechnologies,
        duration: program.duration || '',
        startDate: program.startDate || '',
        endDate: program.endDate || '',
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
      setFormErrors({});
    }
  }, [program, resources, competencies, trainingTechnologies]);

  useEffect(() => {
    if (editedData.startDate && editedData.duration && editedData.duration > 0) {
      const calculatedEndDate = calculateEndDate(
        editedData.startDate,
        parseInt(editedData.duration)
      );
      setEditedData((prev) => ({
        ...prev,
        endDate: calculatedEndDate,
      }));
    } else {
      setEditedData((prev) => ({ ...prev, endDate: "" }));
      setFormErrors((prev) => ({ ...prev, endDate: undefined }));
    }
  }, [editedData.startDate, editedData.duration]);

  // Form validation
  const validateForm = () => {
    const errors = {};
    const today = new Date();

    // Program Name
    if (!editedData.programName?.trim()) {
      errors.programName = 'Program name is required';
    }

    // Project Description
    if (!editedData.projectDescription?.trim()) {
      errors.projectDescription = 'Project description is required';
    }

    // Purpose
    if (!editedData.purpose?.trim()) {
      errors.purpose = 'Purpose is required';
    }

    // Technologies
    if (!editedData.technologies?.length) {
      errors.technologies = 'At least one technology is required';
    }

    // Duration
    if (!editedData.duration || isNaN(editedData.duration) || editedData.duration <= 0) {
      errors.duration = 'Duration must be a positive number';
    }

    // Start Date
    if (!editedData.startDate || !isValid(parseISO(editedData.startDate))) {
      errors.startDate = 'Valid start date is required';
    } else if (parseISO(editedData.startDate) < today.setHours(0, 0, 0, 0)) {
      errors.startDate = 'Start date cannot be in the past';
    }

    // End Date (depends on duration)
    if (!editedData.endDate || !isValid(parseISO(editedData.endDate))) {
      errors.endDate = 'Valid end date is required';
    } else if (editedData.endDate < editedData.startDate) {
      errors.endDate = 'End date cannot be before start date';
    } else if (editedData.duration && !errors.duration) {
      const expectedEndDate = calculateEndDate(
        editedData.startDate,
        parseInt(editedData.duration)
      );
      const actualEndDate = parseISO(editedData.endDate);
      if (differenceInDays(actualEndDate, expectedEndDate) !== 0) {
        errors.endDate = `End date must match start date + duration (${format(expectedEndDate, 'yyyy-MM-dd')})`;
      }
    }

    // Requester
    if (!editedData.requester?.value) {
      errors.requester = 'Requester is required';
    }

    // Competency
    if (!editedData.competency?.value) {
      errors.competency = 'Competency is required';
    }

    // Trainer
    if (!editedData.trainer?.value) {
      errors.trainer = 'Trainer is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Dropdown options with fallback
  const requesterOptions = resources?.length ? [
    { value: 1, label: "HR Department" },
    { value: 2, label: "Engineering Team" },
    { value: 3, label: "Project Management Office" }
  ] : [];

  const trainerOptions = resources?.map(resource => ({
    value: resource.publicId,
    label: resource.employeeName,
  })) || [];

  const competencyOptions = competencies?.map(competency => ({
    value: competency.publicId,
    label: competency.name,
  })) || [];

  const technologyOptions = trainingTechnologies?.map(tech => ({
    value: tech.name,
    label: tech.name,
  })) || [];

  const participantOptions = resources
    ?.filter(resource => !program?.participants?.some(p => p.publicId === resource.publicId))
    .map(resource => ({
      value: resource.publicId,
      label: resource.employeeName,
    })) || [];

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
    if (!isEditing) {
      setFormErrors({});
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for the field on change
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSelectChange = (name, selectedOption) => {
    setEditedData(prev => ({
      ...prev,
      [name]: selectedOption
    }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleMultiSelectChange = (name, selectedOptions) => {
    setEditedData(prev => ({
      ...prev,
      [name]: selectedOptions
    }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSave = async () => {
    if (!validateForm()) {
      setErrorMessage('Please fix the form errors before saving');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
      return;
    }

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

    try {
      await dispatch(updateProgramDetails(payload)).unwrap();
      setSuccessMessage('Program updated successfully!');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
      setIsEditing(false);
      await dispatch(fetchProgramDetails(id)).unwrap();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update program');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormErrors({});
    // Reset to original data
    const formattedTechnologies = program?.technology
      ? program.technology.split(',').map(tech => ({
        value: tech.trim(),
        label: tech.trim()
      }))
      : [];

    setEditedData({
      programName: program?.programName || '',
      projectDescription: program?.projectDescription || '',
      purpose: program?.purpose || '',
      technologies: formattedTechnologies,
      duration: program?.duration || '',
      startDate: program?.startDate || '',
      endDate: program?.endDate || '',
      requester: program?.requester ? {
        value: program.requester,
        label: getRequesterDetails(program.requester).text
      } : null,
      competency: program?.competencyPublicId ? {
        value: program.competencyPublicId,
        label: program.competencyName
      } : null,
      trainer: program?.trainerPublicId ? {
        value: program.trainerPublicId,
        label: program.trainerName
      } : null
    });
  };

  const handleAddParticipant = async () => {
    if (!selectedParticipantToAdd) return;

    try {
      await dispatch(addParticipants({
        programId: program.publicId,
        participantIds: [selectedParticipantToAdd.value]
      })).unwrap();
      await dispatch(fetchProgramDetails(id)).unwrap();
      setSuccessMessage('Participant added successfully!');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
      setSelectedParticipantToAdd(null);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to add participant');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    }
  };

  const handleRemoveParticipant = async (participantId) => {
    try {
      await dispatch(removeParticipants([participantId])).unwrap();
      await dispatch(fetchProgramDetails(id)).unwrap();
      setSuccessMessage('Participant removed successfully!');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to remove participant');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    }
  };

  // Loading state
  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
    </div>
  );

  // Error state with retry
  if (error || retryAttempts.program >= 3) return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-8">
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md" role="alert">
        <p className="font-bold flex items-center">
          <FaExclamationTriangle className="mr-2" />
          Error loading program details
        </p>
        <p>{error || 'Failed to load data after multiple attempts'}</p>
        <button
          onClick={() => {
            setRetryAttempts(prev => ({ ...prev, program: 0 }));
            retryFetch(fetchProgramDetails(id));
          }}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    </div>
  );

  // Fallback UI for missing data
  if (!program || !resources || !competencies || !trainingTechnologies) return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-8">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow-md" role="alert">
        <p className="font-bold flex items-center">
          <FaExclamationTriangle className="mr-2" />
          Data Unavailable
        </p>
        <p>Some required data is missing. Please try again or contact support.</p>
        <button
          onClick={() => {
            setRetryAttempts({ program: 0, technologies: 0, resources: 0, competencies: 0 });
            retryFetch(fetchProgramDetails(id));
            retryFetch(fetchTrainingTechnologies());
            retryFetch(fetchResources());
            retryFetch(fetchCompetencies());
          }}
          className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
        >
          Retry
        </button>
      </div>
    </div>
  );

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
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-purple-800">
            {isEditing ? (
              <div>
                <input
                  type="text"
                  name="programName"
                  value={editedData.programName}
                  onChange={handleInputChange}
                  className={`bg-transparent border-b-2 ${formErrors.programName ? 'border-red-500' : 'border-purple-300'} focus:border-purple-600 focus:outline-none w-full max-w-md px-2 py-1`}
                  aria-invalid={!!formErrors.programName}
                  aria-describedby="programName-error"
                />
                {formErrors.programName && (
                  <p id="programName-error" className="text-red-500 text-sm mt-1">{formErrors.programName}</p>
                )}
              </div>
            ) : (
              program.programName
            )}
          </h1>
        </div>

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
                        <div>
                          <Select
                            options={trainerOptions}
                            value={editedData.trainer}
                            onChange={(selected) => handleSelectChange("trainer", selected)}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select trainer..."
                            aria-invalid={!!formErrors.trainer}
                            aria-describedby="trainer-error"
                          />
                          {formErrors.trainer && (
                            <p id="trainer-error" className="text-red-500 text-sm mt-1">{formErrors.trainer}</p>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center p-2 bg-gray-50 rounded">
                          <FaUserTie className="text-purple-500 mr-2" />
                          {program.trainerName || 'N/A'}
                        </div>
                      )}
                    </div>

                    {/* Technology */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-purple-700 mb-1">Technology</label>
                      {isEditing ? (
                        <div>
                          <MultiSelectTechnology
                            options={technologyOptions}
                            value={editedData.technologies}
                            onChange={(selected) => handleMultiSelectChange("technologies", selected)}
                            aria-invalid={!!formErrors.technologies}
                            aria-describedby="technologies-error"
                          />
                          {formErrors.technologies && (
                            <p id="technologies-error" className="text-red-500 text-sm mt-1">{formErrors.technologies}</p>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded">
                          {program.technology?.split(',').map((tech, index) => (
                            <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                              {tech.trim()}
                            </span>
                          )) || 'None'}
                        </div>
                      )}
                    </div>

                    {/* Requester */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-purple-700 mb-1">Requester</label>
                      {isEditing ? (
                        <div>
                          <Select
                            options={requesterOptions}
                            value={editedData.requester}
                            onChange={(selected) => handleSelectChange("requester", selected)}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select requester..."
                            aria-invalid={!!formErrors.requester}
                            aria-describedby="requester-error"
                          />
                          {formErrors.requester && (
                            <p id="requester-error" className="text-red-500 text-sm mt-1">{formErrors.requester}</p>
                          )}
                        </div>
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
                        <div>
                          <Select
                            options={competencyOptions}
                            value={editedData.competency}
                            onChange={(selected) => handleSelectChange("competency", selected)}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select competency..."
                            aria-invalid={!!formErrors.competency}
                            aria-describedby="competency-error"
                          />
                          {formErrors.competency && (
                            <p id="competency-error" className="text-red-500 text-sm mt-1">{formErrors.competency}</p>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center p-2 bg-gray-50 rounded">
                          <FaChartBar className="text-purple-500 mr-2" />
                          {program.competencyName || 'N/A'}
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
                        <div>
                          <input
                            type="number"
                            name="duration"
                            value={editedData.duration}
                            onChange={handleInputChange}
                            min="1"
                            className={`w-full px-3 py-2 border ${formErrors.duration ? 'border-red-500' : 'border-purple-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
                            aria-invalid={!!formErrors.duration}
                            aria-describedby="duration-error"
                          />
                          {formErrors.duration && (
                            <p id="duration-error" className="text-red-500 text-sm mt-1">{formErrors.duration}</p>
                          )}
                        </div>
                      ) : (
                        <div className="p-2 bg-gray-50 rounded">
                          {program.duration ? `${program.duration} days` : 'N/A'}
                        </div>
                      )}
                    </div>

                    {/* Start Date */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-purple-700 mb-1">Start Date</label>
                      {isEditing ? (
                        <div>
                          <input
                            type="date"
                            name="startDate"
                            value={editedData.startDate ? editedData.startDate.split('T')[0] : ''}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border ${formErrors.startDate ? 'border-red-500' : 'border-purple-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
                            aria-invalid={!!formErrors.startDate}
                            aria-describedby="startDate-error"
                          />
                          {formErrors.startDate && (
                            <p id="startDate-error" className="text-red-500 text-sm mt-1">{formErrors.startDate}</p>
                          )}
                        </div>
                      ) : (
                        <div className="p-2 bg-gray-50 rounded">
                          {program.startDate ? format(parseISO(program.startDate), 'MMMM d, yyyy') : 'N/A'}
                        </div>
                      )}
                    </div>

                    {/* End Date */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-purple-700 mb-1">End Date</label>
                      {isEditing ? (
                        <div>
                          <input
                            type="date"
                            name="endDate"
                            value={editedData.endDate ? editedData.endDate.split('T')[0] : ''}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border ${formErrors.endDate ? 'border-red-500' : 'border-purple-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
                            aria-invalid={!!formErrors.endDate}
                            aria-describedby="endDate-error"
                          />
                          {formErrors.endDate && (
                            <p id="endDate-error" className="text-red-500 text-sm mt-1">{formErrors.endDate}</p>
                          )}
                        </div>
                      ) : (
                        <div className="p-2 bg-gray-50 rounded">
                          {program.endDate ? format(parseISO(program.endDate), 'MMMM d, yyyy') : 'N/A'}
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
                    <div>
                      <TextareaAutosize
                        name="projectDescription"
                        value={editedData.projectDescription}
                        onChange={handleInputChange}
                        className={`w-full p-4 border ${formErrors.projectDescription ? 'border-red-500' : 'border-purple-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50`}
                        minRows={5}
                        aria-invalid={!!formErrors.projectDescription}
                        aria-describedby="projectDescription-error"
                      />
                      {formErrors.projectDescription && (
                        <p id="projectDescription-error" className="text-red-500 text-sm mt-1">{formErrors.projectDescription}</p>
                      )}
                    </div>
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
                    <div>
                      <TextareaAutosize
                        name="purpose"
                        value={editedData.purpose}
                        onChange={handleInputChange}
                        className={`w-full p-4 border ${formErrors.purpose ? 'border-red-500' : 'border-purple-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50`}
                        minRows={3}
                        aria-invalid={!!formErrors.purpose}
                        aria-describedby="purpose-error"
                      />
                      {formErrors.purpose && (
                        <p id="purpose-error" className="text-red-500 text-sm mt-1">{formErrors.purpose}</p>
                      )}
                    </div>
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
                    Current Participants ({program.participants?.length || 0})
                  </h4>

                  {program.participants?.length > 0 ? (
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
            participants: program.participants || [],
            participantCount: program.participants?.length || 0,
          }}
          publicId={resourceId}
        />
      )}

      {/* <div
        className="p-4 bg-blue-50 rounded-lg border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors"
        onClick={() => {
          setSelectedTraining({
            ...program,
            participants: program.participants || [],
            participantCount: program.participants?.length || 0
          });
          setShowUpskillingDetails(true);
        }}
      > */}
        {/* <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-blue-800">Participants</h3>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl text-purple-600">
                {program.participants?.length || 0}
              </span>
              <div className="text-xs text-gray-500">
                (N/A attended)
              </div>
            </div>
          </div>
          <FaUserFriends className="text-blue-500 text-2xl" />
        </div>
        <div className="mt-2 text-sm text-blue-700">
          Click to view details
        </div> */}
      {/* </div> */}
    </div>
  );
};

function calculateEndDate(startDate, duration) {
  if (!startDate || !duration || duration <= 0) return "";

  const date = new Date(startDate);
  let daysAdded = 0;
  let businessDays = 0;

  while (businessDays < duration) {
    date.setDate(date.getDate() + 1);
    daysAdded++;

    const dayOfWeek = date.getDay();
    const dateStr = date.toISOString().split("T")[0];

    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday(dateStr)) {
      businessDays++;
    }
  }

  return date.toISOString().split("T")[0];
}

export default TrainingDetail;