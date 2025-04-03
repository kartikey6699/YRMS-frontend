import React, { useEffect, useState, useRef } from 'react';
import { FaUser, FaTimes, FaEdit, FaSave, FaDownload, FaUpload, FaCode, FaBriefcase } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResourceDetails } from '../../../features/resource/resourceAction';
import { resetResourceDetails } from '../../../features/resource/resourceSlice';
import { SuccessToast, ErrorToast } from '../../helper/ResourceToast'; // Import the toast components
import { RESUME_API } from '../../../config/Endpoints/Endpoints';

const EmployeeDetail = ({ publicId, onClose }) => {
  const dispatch = useDispatch();
  const { resourceDetails } = useSelector((state) => state.resource);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [toast, setToast] = useState(null);
  const initialLoadDone = useRef(false);

  // Close toast after timeout
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Fetch resource details if needed
  useEffect(() => {
    if (!publicId) return;

    if (!initialLoadDone.current && (!resourceDetails || resourceDetails.publicId !== publicId)) {
      initialLoadDone.current = true;
      dispatch(fetchResourceDetails(publicId));
    }
  }, [publicId, resourceDetails, dispatch]);

  // Update formData when we get new details
  useEffect(() => {
    if (resourceDetails && resourceDetails.publicId === publicId) {
      setFormData({
        employeeId: resourceDetails.employeeId || '',
        designation: resourceDetails.designation || '',
        grade: resourceDetails.grade || '',
        joiningDate: resourceDetails.joiningDate || '',
        experience: resourceDetails.experience || '',
        status: resourceDetails.status || 'pool'
      });
    }
  }, [resourceDetails, publicId]);

  // Cleanup only when completely unmounting
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

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await fetch(RESUME_API.UPLOAD_RESUME(publicId), {
          method: 'POST',
          headers: {
            'accept': 'application/json',
          },
          body: formData,
        });
        
        if (response.ok) {
          setToast({
            type: 'success',
            message: 'Resume uploaded successfully!'
          });
        } else {
          setToast({
            type: 'error',
            message: 'Failed to upload resume'
          });
        }
      } catch (error) {
        setToast({
          type: 'error',
          message: 'Error uploading resume'
        });
        console.error('Error uploading resume:', error);
      }
    }
  };

  const handleResumeDownload = async () => {
    try {
      const response = await fetch(RESUME_API.DOWNLOAD_RESUME(publicId), {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${formData.employeeId}_resume.pdf`; // Changed file name to {user_id}_resume
        document.body.appendChild(a);
        a.click();
        a.remove();
        
        setToast({
          type: 'success',
          message: 'Resume download started!'
        });
      } else {
        setToast({
          type: 'error',
          message: 'Failed to download resume'
        });
        console.error('Error downloading resume:', response.statusText);
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Error downloading resume'
      });
      console.error('Error downloading resume:', error);
    }
  };

  if (!formData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20 p-4">
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl">
          Loading employee details...
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Toast Notification */}
      <div className="fixed top-4 right-4 z-60"> {/* Adjusted z-index and positioning to top right */}
        {toast?.type === 'success' && (
          <SuccessToast message={toast.message} onClose={() => setToast(null)} />
        )}
        {toast?.type === 'error' && (
          <ErrorToast message={toast.message} onClose={() => setToast(null)} />
        )}
      </div>

      {/* Main Modal Content */}
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20 p-4">
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl border border-gray-200">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <FaUser className="text-blue-600 mr-2 text-xl" />
              <h3 className="text-xl font-semibold text-gray-800">
                {resourceDetails.employeeName}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-sm"
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
              >
                <FaTimes size={14} />
              </button>
            </div>
          </div>

          {/* Content - Side by Side Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Employment Details Section */}
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
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-800">{formData.employeeId || 'N/A'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Designation</label>
                    {isEditing ? (
                      <input
                        name="designation"
                        value={formData.designation}
                        onChange={handleInputChange}
                        className="w-full border rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-300"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-800">{formData.designation || 'N/A'}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Grade</label>
                    {isEditing ? (
                      <input
                        name="grade"
                        value={formData.grade}
                        onChange={handleInputChange}
                        className="w-full border rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-300"
                      />
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
                    {isEditing ? (
                      <input
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="w-full border rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-300"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-800">
                        {formData.experience ? `${formData.experience} years` : 'N/A'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Status</label>
                    {isEditing ? (
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full border rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-300"
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
              </div>
            </div>

            {/* Technologies Section - Empty */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="flex items-center text-base font-medium text-gray-800 mb-3">
                <FaCode className="text-blue-500 mr-2 text-sm" />
                Technologies
              </h4>
              <div className="bg-white/50 rounded-md p-3 flex flex-col items-center justify-center border border-dashed border-gray-300 text-center">
                <FaCode className="text-gray-400 text-2xl mb-2" />
                <p className="text-gray-500 text-sm">No technologies assigned yet</p>
              </div>
            </div>
          </div>

          {/* Footer with Resume Buttons on Left */}
          <div className="mt-4 flex justify-between items-center">
            <div className="flex gap-2">
              <label className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 text-sm cursor-pointer">
                <FaUpload className="mr-1 text-xs" />
                Upload Resume
                <input
                  type="file"
                  onChange={handleResumeUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                />
              </label>
              <button
                onClick={handleResumeDownload}
                className="flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-md hover:bg-green-100 text-sm"
              >
                <FaDownload className="mr-1 text-xs" />
                Download Resume
              </button>
            </div>

            <button
              className="flex items-center px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
              onClick={isEditing ? handleSubmit : onClose}
            >
              {isEditing ? (
                <>
                  <FaSave className="mr-1" /> Save
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