import React, { useEffect, useState, useRef } from 'react';
import { FaUser, FaTimes, FaEdit, FaSave, FaDownload, FaUpload, FaCode, FaBriefcase, FaStar, FaProjectDiagram, FaUserTie, FaCheckCircle, FaExclamationTriangle, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchResourceDetails,
  updateResource,
  fetchDesignations,
  fetchUserTimeline,
  updateTimelineEntry,
  deleteTimelineEntry
} from '../../../features/resource/resourceAction';
import { resetResourceDetails } from '../../../features/resource/resourceSlice';
import { SuccessToast, ErrorToast } from '../../helper/ResourceToast';
import { RESUME_API } from '../../../config/Endpoints/Endpoints';
import axios from 'axios';
import { ADMIN_API_BASE_URL } from '../../../config/Endpoints/BaseEndpoints';
import backgroundImage from '../../../assets/images/Profile/ProfileBg2.jpg';

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
  switch (status.toLowerCase()) {
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
  const [formErrors, setFormErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [clientName, setClientName] = useState('');
  const [clientNameError, setClientNameError] = useState('');
  const [statusDescription, setStatusDescription] = useState('');
  const [statusDescriptionError, setStatusDescriptionError] = useState('');
  const [editingTimelineId, setEditingTimelineId] = useState(null);
  const [timelineEditData, setTimelineEditData] = useState({
    description: '',
    clientName: '',
    training: [],
    status: '',
    createdAt: '',
    updatedAt: ''
  });
  const [timelineEditErrors, setTimelineEditErrors] = useState({});
  const [isTimelineEditMode, setIsTimelineEditMode] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [timelineToDelete, setTimelineToDelete] = useState(null);

  const initialLoadDone = useRef(false);
  const gradeOptions = ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7'];
  const MAX_UPLOAD_RETRIES = 3;

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

  const validateFormField = (name, value) => {
    switch (name) {
      case 'employeeName':
        if (!value.trim()) return 'Employee name is required';
        if (value.length > 50) return 'Employee name must be 50 characters or less';
        return '';
      case 'employeeId':
        if (!value.trim()) return 'Employee ID is required';
        if (!/^[a-zA-Z0-9]{4,20}$/.test(value)) return 'Employee ID must be 4-20 alphanumeric characters';
        return '';
      case 'designation':
        if (!value) return 'Designation is required';
        return '';
      case 'grade':
        if (!value) return 'Grade is required';
        return '';
      case 'joiningDate':
        if (!value) return 'Joining date is required';
        if (new Date(value) > new Date()) return 'Joining date cannot be in the future';
        return '';
      case 'status':
        if (!value) return 'Status is required';
        return '';
      default:
        return '';
    }
  };

  const validateClientName = (value) => {
    if (!value.trim()) return 'Client name is required for deployed status';
    if (value.length > 100) return 'Client name must be 100 characters or less';
    return '';
  };

  const validateStatusDescription = (value) => {
    if (!value.trim()) return 'Description is required';
    if (value.length > 500) return 'Description must be 500 characters or less';
    return '';
  };

  const validateTimelineField = (name, value, otherFields) => {
    switch (name) {
      case 'description':
        if (!value.trim()) return 'Description is required';
        if (value.length > 500) return 'Description must be 500 characters or less';
        return '';
      case 'clientName':
        if (otherFields.status === 'deployed' && !value.trim()) return 'Client name is required for deployed status';
        if (value.length > 100) return 'Client name must be 100 characters or less';
        return '';
      case 'status':
        if (!value) return 'Status is required';
        return '';
      case 'createdAt':
        if (!value) return 'Created date is required';
        if (otherFields.updatedAt && new Date(value) >= new Date(otherFields.updatedAt)) {
          return 'Created date must be before updated date';
        }
        return '';
      case 'updatedAt':
        if (value && otherFields.createdAt && new Date(value) <= new Date(otherFields.createdAt)) {
          return 'Updated date must be after created date';
        }
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: validateFormField(name, value) }));
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    setFormErrors(prev => ({ ...prev, [name]: validateFormField(name, value) }));
  };

  const handleClientNameChange = (e) => {
    const value = e.target.value;
    setClientName(value);
    setClientNameError(validateClientName(value));
  };

  const handleClientNameBlur = () => {
    setClientNameError(validateClientName(clientName));
  };

  const handleStatusDescriptionChange = (e) => {
    const value = e.target.value;
    setStatusDescription(value);
    setStatusDescriptionError(validateStatusDescription(value));
  };

  const handleStatusDescriptionBlur = () => {
    setStatusDescriptionError(validateStatusDescription(statusDescription));
  };

  const handleTimelineEditChange = (e) => {
    const { name, value } = e.target;
    setTimelineEditData(prev => ({
      ...prev,
      [name]: name === 'status' ? normalizeStatus(value) : value
    }));
    setTimelineEditErrors(prev => ({
      ...prev,
      [name]: validateTimelineField(name, value, { ...timelineEditData, [name]: value })
    }));
  };

  const handleTimelineEditBlur = (e) => {
    const { name, value } = e.target;
    setTimelineEditErrors(prev => ({
      ...prev,
      [name]: validateTimelineField(name, value, timelineEditData)
    }));
  };

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
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
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

  const uploadProfilePicture = async (retryCount = 0) => {
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
      if (retryCount < MAX_UPLOAD_RETRIES - 1) {
        setToast({
          type: 'error',
          message: `Retrying profile picture upload... (Attempt ${retryCount + 2})`
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
        return uploadProfilePicture(retryCount + 1);
      }
      let errorMessage = 'Failed to update profile picture';
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = 'Invalid request. Please check the uploaded file.';
            break;
          case 401:
            errorMessage = 'Unauthorized. Please log in again.';
            break;
          case 413:
            errorMessage = 'File too large. Maximum size is 2MB.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = error.response.data.message || errorMessage;
        }
      }
      setToast({
        type: 'error',
        message: errorMessage
      });
      console.error('Profile upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    errors.employeeName = validateFormField('employeeName', formData.employeeName);
    errors.employeeId = validateFormField('employeeId', formData.employeeId);
    errors.designation = validateFormField('designation', formData.designation);
    errors.grade = validateFormField('grade', formData.grade);
    errors.joiningDate = validateFormField('joiningDate', formData.joiningDate);
    errors.status = validateFormField('status', formData.status);

    if (formData.status === 'deployed') {
      setClientNameError(validateClientName(clientName));
      if (clientNameError) errors.clientName = clientNameError;
    }
    setStatusDescriptionError(validateStatusDescription(statusDescription));
    if (statusDescriptionError) errors.statusDescription = statusDescriptionError;

    setFormErrors(errors);
    return Object.values(errors).every(error => !error);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setToast({
        type: 'error',
        message: 'Please fix the form errors before submitting'
      });
      return;
    }

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
      let errorMessage = 'Failed to update employee details';
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = 'Invalid data provided. Please check your inputs.';
            break;
          case 401:
            errorMessage = 'Unauthorized. Please log in again.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = error.response.data.message || errorMessage;
        }
      }
      setToast({
        type: 'error',
        message: errorMessage
      });
    }
  };

  const handleResumeUpload = async (e, retryCount = 0) => {
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
        throw new Error('Failed to upload resume');
      }
    } catch (error) {
      if (retryCount < MAX_UPLOAD_RETRIES - 1) {
        setToast({
          type: 'error',
          message: `Retrying resume upload... (Attempt ${retryCount + 2})`
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
        return handleResumeUpload(e, retryCount + 1);
      }
      let errorMessage = 'Failed to upload resume';
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = 'Invalid file format or data.';
            break;
          case 401:
            errorMessage = 'Unauthorized. Please log in again.';
            break;
          case 413:
            errorMessage = 'File too large. Maximum size is 5MB.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = error.response.data.message || errorMessage;
        }
      }
      setToast({
        type: 'error',
        message: errorMessage
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
        throw new Error('Failed to download resume');
      }
    } catch (error) {
      let errorMessage = 'Error downloading resume';
      if (error.response) {
        switch (error.response.status) {
          case 404:
            errorMessage = 'Resume file not found.';
            break;
          case 401:
            errorMessage = 'Unauthorized. Please log in again.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = error.response.data.message || errorMessage;
        }
      }
      setToast({
        type: 'error',
        message: errorMessage
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
          <div className="mt-4 bg-purple-100 rounded-md shadow-sm p-3">
            <label className="block text-xs text-purple-800 font-bold mb-1">Client Name</label>
            <input
              type="text"
              value={clientName}
              onChange={handleClientNameChange}
              onBlur={handleClientNameBlur}
              className={`w-full border rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-blue-300 ${clientNameError ? 'border-red-500' : ''}`}
              placeholder="Enter client name"
            />
            {clientNameError && <p className="text-xs text-red-500 mt-1">{clientNameError}</p>}
            <label className="block text-xs text-purple-800 font-bold mt-2 mb-1">Description</label>
            <textarea
              value={statusDescription}
              onChange={handleStatusDescriptionChange}
              onBlur={handleStatusDescriptionBlur}
              className={`w-full border rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-blue-300 ${statusDescriptionError ? 'border-red-500' : ''}`}
              placeholder="Enter description"
              rows={2}
            />
            {statusDescriptionError && <p className="text-xs text-red-500 mt-1">{statusDescriptionError}</p>}
          </div>
        );
      case 'pool':
      case 'pip':
        return (
          <div className="mt-4 bg-purple-100 rounded-md shadow-sm p-3">
            <label className="block text-xs text-purple-800 font-bold mb-1">Description</label>
            <textarea
              value={statusDescription}
              onChange={handleStatusDescriptionChange}
              onBlur={handleStatusDescriptionBlur}
              className={`w-full border rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-blue-300 ${statusDescriptionError ? 'border-red-500' : ''}`}
              placeholder="Enter description"
              rows={2}
            />
            {statusDescriptionError && <p className="text-xs text-red-500 mt-1">{statusDescriptionError}</p>}
          </div>
        );
      default:
        return null;
    }
  };

  const normalizeStatus = (status) => {
    return status ? status.toLowerCase() : '';
  };

  const handleTimelineEdit = (timelineItem) => {
    setEditingTimelineId(timelineItem.id);
    setTimelineEditData({
      description: timelineItem.description || '',
      clientName: timelineItem.clientName || '',
      training: timelineItem.training || [],
      status: normalizeStatus(timelineItem.status),
      createdAt: timelineItem.createdAt.split('T')[0] || '',
      updatedAt: timelineItem.updatedAt ? timelineItem.updatedAt.split('T')[0] : ''
    });
    setTimelineEditErrors({});
  };

  const validateTimelineForm = () => {
    const errors = {};
    errors.description = validateTimelineField('description', timelineEditData.description, timelineEditData);
    errors.clientName = validateTimelineField('clientName', timelineEditData.clientName, timelineEditData);
    errors.status = validateTimelineField('status', timelineEditData.status, timelineEditData);
    errors.createdAt = validateTimelineField('createdAt', timelineEditData.createdAt, timelineEditData);
    errors.updatedAt = validateTimelineField('updatedAt', timelineEditData.updatedAt, timelineEditData);

    setTimelineEditErrors(errors);
    return Object.values(errors).every(error => !error);
  };

  const handleTimelineUpdate = async (timelineId) => {
    if (!validateTimelineForm()) {
      setToast({
        type: 'error',
        message: 'Please fix the timeline form errors before submitting'
      });
      return;
    }

    try {
      const payload = {
        description: timelineEditData.description || '',
        clientName: timelineEditData.clientName || '',
        training: timelineEditData.training || [],
        status: normalizeStatus(timelineEditData.status),
        created_at: timelineEditData.createdAt ? `${timelineEditData.createdAt}T00:00:00.000Z` : null,
        updated_at: timelineEditData.updatedAt ? `${timelineEditData.updatedAt}T00:00:00.000Z` : null
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
      let errorMessage = 'Failed to update timeline';
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = 'Invalid timeline data provided.';
            break;
          case 401:
            errorMessage = 'Unauthorized. Please log in again.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = error.response.data.message || errorMessage;
        }
      }
      setToast({
        type: 'error',
        message: errorMessage
      });
    }
  };

  const openDeleteModal = (timelineItem) => {
    setTimelineToDelete(timelineItem);
    setIsDeleteConfirmOpen(true);
  };

  const handleTimelineDelete = async () => {
    if (!timelineToDelete) return;
    try {
      await dispatch(deleteTimelineEntry(timelineToDelete.id)).unwrap();
      setToast({
        type: 'success',
        message: 'Timeline entry deleted successfully!'
      });
      dispatch(fetchUserTimeline(publicId));
    } catch (error) {
      let errorMessage = 'Failed to delete timeline entry';
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = 'Unauthorized. Please log in again.';
            break;
          case 404:
            errorMessage = 'Timeline entry not found.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = error.response.data.message || errorMessage;
        }
      }
      setToast({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setIsDeleteConfirmOpen(false);
      setTimelineToDelete(null);
    }
  };

  const toggleTimelineEditMode = () => {
    setIsTimelineEditMode(!isTimelineEditMode);
    if (isTimelineEditMode) {
      setEditingTimelineId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!formData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20 p-4">
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4.5xl">
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

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-60 backdrop-blur-sm bg-black/30">
          <div className="bg-white rounded-lg p-4 max-w-sm w-full shadow-xl border border-gray-200">
            <div className="flex items-center mb-3">
              <FaExclamationTriangle className="text-yellow-500 mr-2" size={20} />
              <h3 className="text-sm font-semibold text-gray-800">Confirm Deletion</h3>
            </div>
            <p className="text-xs text-gray-600 mb-4">
              Are you sure you want to delete the <span className="font-medium capitalize">{timelineToDelete?.status}</span> timeline entry? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setTimelineToDelete(null);
                }}
                className="px-3 py-1 border border-gray-300 rounded-md text-xs text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTimelineDelete}
                className="px-3 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20 p-4">
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4.5xl border border-gray-200 max-h-[98vh]">
          <div className="relative mb-4 rounded-lg overflow-hidden">
            <img
              src={backgroundImage}
              alt="Background"
              className="absolute top-0 left-0 w-full h-full object-cover z-0"
            />
            <div className="relative flex justify-between items-center px-4 py-3 z-10">
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
                      onBlur={handleInputBlur}
                      className={`text-xl font-semibold text-gray-800 border rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-300 bg-white bg-opacity-90 ${formErrors.employeeName ? 'border-red-500' : ''}`}
                      disabled={loading}
                    />
                    {formErrors.employeeName && <p className="text-xs text-red-500 mt-1">{formErrors.employeeName}</p>}
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
                        className={`flex items-center px-3 py-1 rounded-md text-sm cursor-pointer transition-all ${isUploading ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-700 hover:bg-blue-200 active:scale-95'}`}
                      >
                        <FaUpload className="mr-1 text-xs" />
                        {isUploading ? 'Uploading...' : 'Update Profile Picture'}
                      </label>
                    </div>
                  </div>
                ) : (
                  <h3 className="text-xl font-semibold text-gray-800 bg-white bg-opacity-90 px-2 py-1 rounded">
                    {formData.employeeName}
                  </h3>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 text-sm"
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
                  className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
                  disabled={loading}
                >
                  <FaTimes size={14} />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="flex items-center text-base font-medium text-gray-800">
                  <FaBriefcase className="text-blue-500 mr-2 text-sm" />
                  Timeline
                </h4>
                <button
                  onClick={toggleTimelineEditMode}
                  className="flex items-center px-2 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 text-sm"
                  disabled={loading || timelineLoading}
                >
                  {isTimelineEditMode ? (
                    <>
                      <FaTimes className="mr-1" /> Cancel
                    </>
                  ) : (
                    <>
                      <FaEdit className="mr-1" /> Edit/Delete
                    </>
                  )}
                </button>
              </div>
              {timelineLoading ? (
                <div className="flex justify-center items-center h-24">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
              ) : timeline?.length > 0 ? (
                <div className="relative">
                  <div className="absolute left-5.5 top-0 bottom-0 w-0.5 bg-blue-200"></div>
                  <div className="max-h-[300px] overflow-y-auto overflow-x-hidden -mr-4 pr-1">
                    {timeline.map((event) => (
                      <div
                        key={event.id}
                        className="mb-3 flex items-center transition-all duration-200 hover:scale-[1.02] hover:bg-blue-50 hover:shadow-sm rounded-md p-2 w-full"
                      >
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white border-2 border-blue-500 text-blue-500 rounded-full z-10">
                          {getStatusIcon(event.status)}
                        </div>
                        <div className="ml-3 flex-1 bg-white rounded-md shadow-sm p-4 min-h-[100px] w-[300px]">
                          <div className="flex justify-between items-start">
                            {editingTimelineId === event.id ? (
                              <select
                                name="status"
                                value={timelineEditData.status}
                                onChange={handleTimelineEditChange}
                                onBlur={handleTimelineEditBlur}
                                className={`text-xs font-medium text-gray-800 border rounded px-2 py-1 focus:ring-1 focus:ring-blue-300 ${timelineEditErrors.status ? 'border-red-500' : ''}`}
                                title="Select status"
                              >
                                <option value="">Select Status</option>
                                <option value="deployed">Deployed</option>
                                <option value="pool">Pool</option>
                                <option value="pip">PIP</option>
                              </select>
                            ) : (
                              <h5 className="text-xs font-medium text-gray-800 capitalize">
                                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                              </h5>
                            )}
                            <div className="flex gap-1">
                              {isTimelineEditMode && (
                                <>
                                  <button
                                    onClick={() => handleTimelineEdit(event)}
                                    className="text-xs text-blue-600 hover:text-blue-800"
                                    disabled={editingTimelineId !== null}
                                    title="Edit timeline entry"
                                  >
                                    <FaEdit size={12} />
                                  </button>
                                  <button
                                    onClick={() => openDeleteModal(event)}
                                    className="text-xs text-red-600 hover:text-red-800"
                                    disabled={editingTimelineId !== null}
                                    title="Delete timeline entry"
                                  >
                                    <FaTrash size={12} />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {editingTimelineId === event.id ? (
                              <>
                                <div>
                                  <input
                                    type="date"
                                    name="createdAt"
                                    value={timelineEditData.createdAt}
                                    onChange={handleTimelineEditChange}
                                    onBlur={handleTimelineEditBlur}
                                    className={`text-xs border rounded px-1.5 py-0.5 focus:ring-1 focus:ring-blue-300 ${timelineEditErrors.createdAt ? 'border-red-500' : ''}`}
                                    title="Select created date"
                                  />
                                  {timelineEditErrors.createdAt && <p className="text-xs text-red-500 mt-1">{timelineEditErrors.createdAt}</p>}
                                </div>
                                <div>
                                  <input
                                    type="date"
                                    name="updatedAt"
                                    value={timelineEditData.updatedAt}
                                    onChange={handleTimelineEditChange}
                                    onBlur={handleTimelineEditBlur}
                                    className={`text-xs border rounded px-1.5 py-0.5 focus:ring-1 focus:ring-blue-300 ${timelineEditErrors.updatedAt ? 'border-red-500' : ''}`}
                                    title="Select updated date"
                                  />
                                  {timelineEditErrors.updatedAt && <p className="text-xs text-red-500 mt-1">{timelineEditErrors.updatedAt}</p>}
                                </div>
                              </>
                            ) : (
                              <>
                                <span className="text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-bold">
                                  From: {formatDate(event.createdAt)}
                                </span>
                                {event.updatedAt && (
                                  <span className="text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-bold">
                                    To: {formatDate(event.updatedAt)}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                          {editingTimelineId === event.id ? (
                            <div className="mt-2 space-y-1">
                              <div>
                                <textarea
                                  name="description"
                                  value={timelineEditData.description}
                                  onChange={handleTimelineEditChange}
                                  onBlur={handleTimelineEditBlur}
                                  className={`w-full border rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-300 ${timelineEditErrors.description ? 'border-red-500' : ''}`}
                                  placeholder="Description"
                                  rows={3}
                                  title="Enter description"
                                />
                                {timelineEditErrors.description && <p className="text-xs text-red-500 mt-1">{timelineEditErrors.description}</p>}
                              </div>
                              {timelineEditData.status === 'deployed' && (
                                <div>
                                  <input
                                    type="text"
                                    name="clientName"
                                    value={timelineEditData.clientName}
                                    onChange={handleTimelineEditChange}
                                    onBlur={handleTimelineEditBlur}
                                    className={`w-full border rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-300 ${timelineEditErrors.clientName ? 'border-red-500' : ''}`}
                                    placeholder="Client Name"
                                    title="Enter client name"
                                  />
                                  {timelineEditErrors.clientName && <p className="text-xs text-red-500 mt-1">{timelineEditErrors.clientName}</p>}
                                </div>
                              )}
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleTimelineUpdate(event.id)}
                                  className="px-2 py-0.5 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                                  title="Save changes"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingTimelineId(null)}
                                  className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300"
                                  title="Cancel editing"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-2">
                              {event.description && (
                                <p className="text-xs text-gray-600 mt-1 break-words max-w-[280px]">
                                  {event.description}
                                </p>
                              )}
                              {event.clientName && event.status === 'deployed' && (
                                <p className="text-xs text-gray-600 mt-1">
                                  <span className="font-medium">Client:</span> {event.clientName}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-500">No timeline events available.</p>
              )}
            </div>

            <div className={`bg-gray-50 rounded-lg p-4 ${isEditing ? 'ring-1 ring-blue-200' : ''}`}>
              <h4 className="flex items-center text-base font-medium text-gray-800 mb-2">
                <FaBriefcase className="text-blue-500 mr-2 text-sm" />
                Employment Details
              </h4>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Employee ID</label>
                    {isEditing ? (
                      <div>
                        <input
                          name="employeeId"
                          value={formData.employeeId}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          className={`w-full border rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-blue-300 ${formErrors.employeeId ? 'border-red-500' : ''}`}
                          disabled={loading}
                          title="Enter employee ID"
                        />
                        {formErrors.employeeId && <p className="text-xs text-red-500 mt-1">{formErrors.employeeId}</p>}
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-gray-800">{formData.employeeId || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Designation</label>
                    {isEditing ? (
                      <div>
                        <select
                          name="designation"
                          value={formData.designation}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          className={`w-full border rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-blue-300 ${formErrors.designation ? 'border-red-500' : ''}`}
                          disabled={loading}
                          title="Select designation"
                        >
                          <option value="">Select Designation</option>
                          {designations.map(designation => (
                            <option key={designation.publicId} value={designation.name}>
                              {designation.name}
                            </option>
                          ))}
                        </select>
                        {formErrors.designation && <p className="text-xs text-red-500 mt-1">{formErrors.designation}</p>}
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-gray-800">{formData.designation || 'N/A'}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Grade</label>
                    {isEditing ? (
                      <div>
                        <select
                          name="grade"
                          value={formData.grade}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          className={`w-full border rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-blue-300 ${formErrors.grade ? 'border-red-500' : ''}`}
                          disabled={loading}
                          title="Select grade"
                        >
                          <option value="">Select Grade</option>
                          {gradeOptions.map(grade => (
                            <option key={grade} value={grade}>
                              {grade}
                            </option>
                          ))}
                        </select>
                        {formErrors.grade && <p className="text-xs text-red-500 mt-1">{formErrors.grade}</p>}
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-gray-800">{formData.grade || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Joining Date</label>
                    {isEditing ? (
                      <div>
                        <input
                          type="date"
                          name="joiningDate"
                          value={formData.joiningDate}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          className={`w-full border rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-blue-300 ${formErrors.joiningDate ? 'border-red-500' : ''}`}
                          disabled={loading}
                          title="Select joining date"
                        />
                        {formErrors.joiningDate && <p className="text-xs text-red-500 mt-1">{formErrors.joiningDate}</p>}
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-gray-800">
                        {formData.joiningDate ? new Date(formData.joiningDate).toLocaleDateString() : 'N/A'}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Experience</label>
                    <p className="text-sm font-medium text-gray-800">
                      {formData.experience ? `${formData.experience} years` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Status</label>
                    {isEditing ? (
                      <div>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          className={`w-full border rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-blue-300 ${formErrors.status ? 'border-red-500' : ''}`}
                          disabled={loading}
                          title="Select status"
                        >
                          <option value="">Select Status</option>
                          <option value="pool">Pool</option>
                          <option value="deployed">Deployed</option>
                          <option value="pip">PIP</option>
                        </select>
                        {formErrors.status && <p className="text-xs text-red-500 mt-1">{formErrors.status}</p>}
                      </div>
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
              <h4 className="flex items-center text-base font-medium text-gray-800 mb-2">
                <FaCode className="text-blue-500 mr-2 text-sm" />
                Technical Skills
              </h4>
              {formData.techSkill?.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {formData.techSkill.map((skill, index) => (
                    <div
                      key={index}
                      className={`flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRandomSkillColor(index)} hover:scale-105 transition-transform`}
                    >
                      {skill.technology}
                      {renderRatingStars(skill.rating)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/50 rounded-md p-2 flex flex-col items-center justify-center border border-dashed border-gray-300 text-center">
                  <FaCode className="text-gray-400 text-xl mb-1" />
                  <p className="text-gray-500 text-xs">No skills added yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <label className={`flex items-center px-3 py-1 rounded-md text-sm cursor-pointer transition-all h-[30px]
                ${isUploading ? 'bg-gray-100 text-gray-500' : 'bg-blue-50 text-blue-700 hover:bg-blue-100 active:scale-95'}`}>
                <FaUpload className="mr-1 text-xs" />
                {isUploading ? 'Uploading...' : 'Upload Resume'}
                <input
                  type="file"
                  onChange={handleResumeUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  disabled={isUploading || loading}
                  title="Upload resume"
                />
              </label>
              {formData.resumeFile && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResumeDownload}
                    className="flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-md text-sm transition-all hover:bg-green-100 active:scale-95 h-[30px]"
                    disabled={loading}
                    title="Download resume"
                  >
                    <FaDownload className="mr-1 text-xs animate-pulse group-hover:animate-none" />
                    Download Resume
                  </button>
                  <span className="text-xs text-gray-600 font-medium truncate max-w-[150px] hover:text-gray-800 transition-colors">
                    {formData.resumeFile}
                  </span>
                </div>
              )}
            </div>
            <button
              className="flex items-center px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium disabled:bg-blue-400 transition-colors"
              onClick={isEditing ? handleSubmit : onClose}
              disabled={loading || isUploading}
              title={isEditing ? 'Save changes' : 'Close modal'}
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