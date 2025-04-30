import React, { useEffect, useState, useRef } from 'react';
import { FaUser, FaTimes, FaEdit, FaSave, FaDownload, FaUpload, FaCode, FaBriefcase, FaStar, FaProjectDiagram, FaUserTie, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchResourceDetails, 
  updateResource, 
  fetchDesignations,
  fetchUserTimeline,
  updateTimelineEntry
} from '../../../features/resource/resourceAction';
import { resetResourceDetails } from '../../../features/resource/resourceSlice';
import { SuccessToast, ErrorToast } from '../../helper/ResourceToast';
import { RESUME_API } from '../../../config/Endpoints/Endpoints';
import axios from 'axios';
import { ADMIN_API_BASE_URL } from '../../../config/Endpoints/BaseEndpoints';

const skillColors = [
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-yellow-100 text-yellow-800',
  'bg-purple-100 text-purple-800',
  'bg-pink-100 text-pink-800',
  'bg-indigo-100 text-indigo-800',
  'bg-red-100 text-red-800',
  'bg-teal-100 text-teal-800'
];

const getStatusIcon = (status) => {
  switch (status) {
    case 'deployed':
      return <FaUserTie className="text-green-600 text-lg" />;
    case 'pool':
      return <FaUser className="text-blue-600 text-lg" />;
    case 'pip':
      return <FaExclamationTriangle className="text-yellow-600 text-lg" />;
    case 'promoted':
      return <FaStar className="text-purple-600 text-lg" />;
    case 'completed':
      return <FaCheckCircle className="text-teal-600 text-lg" />;
    default:
      return <FaProjectDiagram className="text-indigo-600 text-lg" />;
  }
};

const EmployeeDetail = ({ publicId, onClose }) => {
  const dispatch = useDispatch();
  const { 
    resourceDetails, 
    loading, 
    designations,
    timeline,
    timelineLoading 
  } = useSelector((state) => state.resource);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [toast, setToast] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [clientName, setClientName] = useState('');
  const [statusDescription, setStatusDescription] = useState('');
  const [editingTimelineId, setEditingTimelineId] = useState(null);
  const [timelineEditData, setTimelineEditData] = useState({
    description: '',
    clientName: '',
    training: []
  });
  
  const initialLoadDone = useRef(false);
  const gradeOptions = ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7'];

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (!publicId) return;

    if (!initialLoadDone.current && (!resourceDetails || resourceDetails.publicId !== publicId)) {
      initialLoadDone.current = true;
      dispatch(fetchResourceDetails(publicId));
      dispatch(fetchUserTimeline(publicId));
    }
  }, [publicId, dispatch]);

  useEffect(() => {
    if (resourceDetails && resourceDetails.publicId === publicId) {
      setFormData(prev => ({
        ...prev,
        employeeName: resourceDetails.employeeName || prev?.employeeName || '',
        employeeId: resourceDetails.employeeId || prev?.employeeId || '',
        designation: resourceDetails.designation || prev?.designation || '',
        grade: resourceDetails.grade || prev?.grade || '',
        joiningDate: resourceDetails.joiningDate || prev?.joiningDate || '',
        experience: resourceDetails.experience || prev?.experience || '',
        status: resourceDetails.status || prev?.status || 'pool',
        profileImage: resourceDetails.profileImage || prev?.profileImage || null,
        techSkill: resourceDetails.techSkill || prev?.techSkill || [],
        resumeFile: prev?.resumeFile || resourceDetails.resumeFile || null,
        gender: resourceDetails.gender || prev?.gender || '',
        competencyId: resourceDetails.competencyId || prev?.competencyId || null,
        roleIds: resourceDetails.roleIds || prev?.roleIds || [],
        clientName: resourceDetails.clientName || prev?.clientName || '',
        statusDescription: resourceDetails.statusDescription || prev?.statusDescription || ''
      }));
      setClientName(resourceDetails.clientName || '');
      setStatusDescription(resourceDetails.statusDescription || '');
      if (resourceDetails.profileImage) {
        setProfilePicPreview(`data:image/png;base64,${resourceDetails.profileImage}`);
      }
    }
  }, [resourceDetails, publicId]);

  const renderRatingStars = (rating) => {
    return (
      <div className="flex items-center ml-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-3 h-3 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  useEffect(() => {
    return () => {
      initialLoadDone.current = false;
      if (!publicId) {
        dispatch(resetResourceDetails());
      }
    };
  }, [dispatch, publicId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setToast({
          type: 'error',
          message: 'Only image files are allowed'
        });
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setToast({
          type: 'error',
          message: 'Image must be less than 2MB'
        });
        return;
      }
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePic = () => {
    setProfilePic(null);
    setProfilePicPreview(null);
    setFormData(prev => ({ ...prev, profileImage: null }));
  };

  const uploadProfilePicture = async () => {
    if (!profilePic) return;
    try {
      setIsUploading(true);
      const uploadFormData = new FormData();
      uploadFormData.append('payload', profilePic);
      const token = sessionStorage.getItem('token');
      const response = await axios.post(
        `${ADMIN_API_BASE_URL}/user-profile-upload/?user_id=${publicId}`,
        uploadFormData,
        {
          headers: {
            accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        await dispatch(fetchResourceDetails(publicId)).unwrap();
        setToast({
          type: 'success',
          message: 'Profile picture updated successfully!'
        });
        setProfilePic(null);
      } else {
        throw new Error('Failed to upload profile picture');
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: error.message || 'Failed to update profile picture'
      });
      console.error('Profile upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const updatedData = {
        employeeName: formData.employeeName,
        employeeId: formData.employeeId,
        designation: formData.designation,
        grade: formData.grade,
        joiningDate: formData.joiningDate,
        status: formData.status,
        statusDescription: statusDescription,
        ...(formData.status === 'deployed' && { clientName: clientName })
      };

      await dispatch(updateResource({
        publicId,
        resourceData: updatedData
      })).unwrap();

      if (profilePic) {
        await uploadProfilePicture();
      }

      setToast({
        type: 'success',
        message: 'Employee details updated successfully!'
      });
      setIsEditing(false);
      dispatch(fetchUserTimeline(publicId));
      
    } catch (error) {
      setToast({
        type: 'error',
        message: error || 'Failed to update employee details'
      });
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setToast({
        type: 'error',
        message: 'Please upload a PDF or Word document'
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setToast({
        type: 'error',
        message: 'File size should be less than 5MB'
      });
      return;
    }
    setIsUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(RESUME_API.UPLOAD_RESUME(publicId), {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: uploadFormData,
      });
      if (response.ok) {
        const responseData = await response.json();
        const newResumeFileName = responseData.fileName || file.name;
        setFormData(prev => ({
          ...prev,
          resumeFile: newResumeFileName
        }));
        await dispatch(fetchResourceDetails(publicId)).unwrap();
        setToast({
          type: 'success',
          message: 'Resume uploaded successfully!'
        });
        window.location.reload();
      } else {
        const errorData = await response.json();
        setToast({
          type: 'error',
          message: errorData.message || 'Failed to upload resume'
        });
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Error uploading resume'
      });
      console.error('Error uploading resume:', error);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleResumeDownload = async () => {
    if (!formData.resumeFile) return;
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(RESUME_API.DOWNLOAD_RESUME(publicId), {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = formData.resumeFile || `${formData.employeeId}_resume.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setToast({
          type: 'success',
          message: 'Resume download started!'
        });
      } else {
        const errorData = await response.json();
        setToast({
          type: 'error',
          message: errorData.message || 'Failed to download resume'
        });
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Error downloading resume'
      });
      console.error('Error downloading resume:', error);
    }
  };

  const getRandomSkillColor = (index) => {
    return skillColors[index % skillColors.length];
  };

  const renderStatusSpecificFields = () => {
    switch (formData?.status) {
      case 'deployed':
        return (
          <>
            <div className="mt-3">
              <label className="block text-xs text-gray-500 mb-1">Client Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full border rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-300"
                placeholder="Enter client name"
              />
            </div>
            <div className="mt-3">
              <label className="block text-xs text-gray-500 mb-1">Description</label>
              <textarea
                value={statusDescription}
                onChange={(e) => setStatusDescription(e.target.value)}
                className="w-full border rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-300"
                placeholder="Enter description"
                rows={3}
              />
            </div>
          </>
        );
      case 'pool':
        return (
          <>
            <div className="mt-1">
              <label className="block text-xs text-gray-500 mb-1">Description</label>
              <textarea
                value={statusDescription}
                onChange={(e) => setStatusDescription(e.target.value)}
                className="w-full border rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-300"
                placeholder="Enter description"
                rows={3}
              />
            </div>
          </>
        );
      case 'pip':
        return (
          <div className="mt-3">
            <label className="block text-xs text-gray-500 mb-1">Description</label>
            <textarea
              value={statusDescription}
              onChange={(e) => setStatusDescription(e.target.value)}
              className="w-full border rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-300"
              placeholder="Enter PIP description"
              rows={3}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const handleTimelineEdit = (timelineItem) => {
    setEditingTimelineId(timelineItem.id);
    setTimelineEditData({
      description: timelineItem.description,
      clientName: timelineItem.clientName || '',
      training: timelineItem.training || []
    });
  };

  const handleTimelineEditChange = (e) => {
    const { name, value } = e.target;
    setTimelineEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleTimelineUpdate = async (timelineId) => {
    try {
      const payload = {
        description: timelineEditData.description,
        clientName: timelineEditData.clientName,
        training: timelineEditData.training
      };
      
      await dispatch(updateTimelineEntry({
        timelineId,
        data: payload
      })).unwrap();
      
      setToast({
        type: 'success',
        message: 'Timeline updated successfully!'
      });
      setEditingTimelineId(null);
      dispatch(fetchUserTimeline(publicId));
    } catch (error) {
      setToast({
        type: 'error',
        message: error.message || 'Failed to update timeline'
      });
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!formData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20 p-4">
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl">
          Loading employee details...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-60">
        {toast?.type === 'success' && (
          <SuccessToast message={toast.message} onClose={() => setToast(null)} />
        )}
        {toast?.type === 'error' && (
          <ErrorToast message={toast.message} onClose={() => setToast(null)} />
        )}
      </div>

      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20 p-4">
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl border border-gray-200">
          <div className="flex justify-between items-center mb-6 bg-blue-50 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <div className="relative">
                {profilePicPreview ? (
                  <>
                    <img
                      src={profilePicPreview}
                      alt="Profile"
                      className="w-12 h-12 rounded-full mr-3 object-cover border-2 border-blue-200"
                    />
                    {profilePic && (
                      <button
                        onClick={removeProfilePic}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        disabled={loading || isUploading}
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    )}
                  </>
                ) : (
                  <FaUser className="w-12 h-12 rounded-full mr-3 text-gray-400" />
                )}
              </div>
              {isEditing ? (
                <div className="flex flex-col">
                  <input
                    name="employeeName"
                    value={formData.employeeName}
                    onChange={handleInputChange}
                    className="text-xl font-semibold text-gray-800 border rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-300"
                    disabled={loading}
                  />
                  <div className="mt-2">
                    <input
                      type="file"
                      id="profilePic"
                      name="profilePic"
                      accept="image/*"
                      onChange={handleProfilePicChange}
                      className="hidden"
                      disabled={loading || isUploading}
                    />
                    <label
                      htmlFor="profilePic"
                      className={`flex items-center px-3 py-1.5 rounded-md text-sm cursor-pointer transition-all ${isUploading ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-700 hover:bg-blue-200 active:scale-95'
                        }`}
                    >
                      <FaUpload className="mr-1 text-xs" />
                      {isUploading ? 'Uploading...' : 'Update Profile Picture'}
                    </label>
                  </div>
                </div>
              ) : (
                <h3 className="text-xl font-semibold text-gray-800">
                  {formData.employeeName}
                </h3>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center px-3 py-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 text-sm"
                disabled={loading}
              >
                {isEditing ? (
                  <>
                    <FaTimes className="mr-1" /> Cancel
                  </>
                ) : (
                  <>
                    <FaEdit className="mr-1" /> Edit
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
                disabled={loading}
              >
                <FaTimes size={14} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-8">
              <h4 className="flex items-center text-base font-medium text-gray-800 mb-3">
                <FaBriefcase className="text-blue-500 mr-2 text-sm" />
                Timeline
              </h4>
              {timelineLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : timeline?.length > 0 ? (
                <div className="relative">
                  <div className="absolute left-8.5 top-0 bottom-0 w-0.5 bg-blue-200"></div>
                  <div className="max-h-[300px] overflow-y-auto overflow-x-hidden pr-2">
                    {timeline.map((event) => (
                      <div
                        key={event.id}
                        className="mb-4 flex items-center transition-all duration-200 hover:scale-[1.02] hover:bg-blue-50 hover:shadow-sm rounded-md p-3"
                      >
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-white border-2 border-blue-500 text-blue-500 rounded-full z-10">
                          {getStatusIcon(event.status)}
                        </div>
                        <div className="ml-4 flex-1 bg-white rounded-md shadow-sm p-3 min-h-[100px]">
                          <div className="flex justify-between items-start">
                            <h5 className="text-sm font-medium text-gray-800 capitalize">
                              {event.status}
                            </h5>
                            <button
                              onClick={() => handleTimelineEdit(event)}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              <FaEdit size={12} />
                            </button>
                          </div>
                          
                          {editingTimelineId === event.id ? (
                            <div className="mt-1 space-y-2">
                              <input
                                type="text"
                                name="description"
                                value={timelineEditData.description}
                                onChange={handleTimelineEditChange}
                                className="w-full border rounded px-2 py-1 text-xs"
                                placeholder="Description"
                              />
                              {event.status === 'deployed' && (
                                <input
                                  type="text"
                                  name="clientName"
                                  value={timelineEditData.clientName}
                                  onChange={handleTimelineEditChange}
                                  className="w-full border rounded px-2 py-1 text-xs"
                                  placeholder="Client Name"
                                />
                              )}
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleTimelineUpdate(event.id)}
                                  className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingTimelineId(null)}
                                  className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                              {event.clientName && (
                                <p className="text-xs text-gray-700 mt-1">
                                  <span className="font-medium">Client:</span> {event.clientName}
                                </p>
                              )}
                              {event.training?.length > 0 && (
                                <div className="mt-1">
                                  <p className="text-xs font-medium text-gray-700">Training:</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {event.training.map((train, idx) => (
                                      <span key={idx} className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                                        {train.name}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(event.createdAt)}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white/50 rounded-md p-3 flex flex-col items-center justify-center border border-dashed border-gray-300 text-center">
                  <FaBriefcase className="text-gray-400 text-2xl mb-2" />
                  <p className="text-gray-500 text-sm">No timeline events added yet</p>
                </div>
              )}
            </div>

            <div className={`bg-gray-50 rounded-lg p-4 ${isEditing ? 'ring-1 ring-blue-200' : ''}`}>
              <h4 className="flex items-center text-base font-medium text-gray-800 mb-3">
                <FaBriefcase className="text-blue-500 mr-2 text-sm" />
                Employment Details
              </h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Employee ID</label>
                    {isEditing ? (
                      <input
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleInputChange}
                        className="w-full border rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-300"
                        disabled={loading}
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-800">{formData.employeeId || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Designation</label>
                    {isEditing ? (
                      <select
                        name="designation"
                        value={formData.designation}
                        onChange={handleInputChange}
                        className="w-full border rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-300"
                        disabled={loading}
                      >
                        <option value="">Select Designation</option>
                        {designations.map(designation => (
                          <option key={designation.publicId} value={designation.name}>
                            {designation.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-sm font-medium text-gray-800">{formData.designation || 'N/A'}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Grade</label>
                    {isEditing ? (
                      <select
                        name="grade"
                        value={formData.grade}
                        onChange={handleInputChange}
                        className="w-full border rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-300"
                        disabled={loading}
                      >
                        <option value="">Select Grade</option>
                        {gradeOptions.map(grade => (
                          <option key={grade} value={grade}>
                            {grade}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-sm font-medium text-gray-800">{formData.grade || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Joining Date</label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="joiningDate"
                        value={formData.joiningDate}
                        onChange={handleInputChange}
                        className="w-full border rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-300"
                        disabled={loading}
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-800">
                        {formData.joiningDate ? new Date(formData.joiningDate).toLocaleDateString() : 'N/A'}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Experience</label>
                    <p className="text-sm font-medium text-gray-800">
                      {formData.experience ? `${formData.experience} years` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Status</label>
                    {isEditing ? (
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full border rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-300"
                        disabled={loading}
                      >
                        <option value="pool">Pool</option>
                        <option value="deployed">Deployed</option>
                        <option value="pip">PIP</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${formData.status === 'pool' ? 'bg-blue-100 text-blue-800' :
                        formData.status === 'deployed' ? 'bg-green-100 text-green-800' :
                          formData.status === 'pip' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
                {isEditing && renderStatusSpecificFields()}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="flex items-center text-base font-medium text-gray-800 mb-3">
                <FaCode className="text-blue-500 mr-2 text-sm" />
                Technical Skills
              </h4>
              {formData.techSkill?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.techSkill.map((skill, index) => (
                    <div
                      key={index}
                      className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRandomSkillColor(index)} hover:scale-105 transition-transform`}
                    >
                      {skill.technology}
                      {renderRatingStars(skill.rating)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/50 rounded-md p-3 flex flex-col items-center justify-center border border-dashed border-gray-300 text-center">
                  <FaCode className="text-gray-400 text-2xl mb-2" />
                  <p className="text-gray-500 text-sm">No skills added yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="flex gap-2 items-start">
              <label className={`flex items-center px-3 py-1.5 rounded-md text-sm cursor-pointer transition-all h-[34px]
                ${isUploading ? 'bg-gray-100 text-gray-500' : 'bg-blue-50 text-blue-700 hover:bg-blue-100 active:scale-95'}`}>
                <FaUpload className="mr-1 text-xs" />
                {isUploading ? 'Uploading...' : 'Upload Resume'}
                <input
                  type="file"
                  onChange={handleResumeUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  disabled={isUploading || loading}
                />
              </label>
              {formData.resumeFile && (
                <div className="flex flex-col items-start">
                  <button
                    onClick={handleResumeDownload}
                    className="flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-md text-sm transition-all hover:bg-green-100 active:scale-95 h-[34px]"
                    disabled={loading}
                  >
                    <FaDownload className="mr-1 text-xs animate-pulse group-hover:animate-none" />
                    Download Resume
                  </button>
                  <span className="mt-1 text-xs text-gray-600 font-medium truncate max-w-[200px] hover:text-gray-800 transition-colors">
                    {formData.resumeFile}
                  </span>
                </div>
              )}
            </div>
            <button
              className="flex items-center px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium disabled:bg-blue-400 transition-colors"
              onClick={isEditing ? handleSubmit : onClose}
              disabled={loading || isUploading}
            >
              {isEditing ? (
                <>
                  <FaSave className="mr-1" /> {loading ? 'Saving...' : 'Save'}
                </>
              ) : (
                'Close'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeDetail;