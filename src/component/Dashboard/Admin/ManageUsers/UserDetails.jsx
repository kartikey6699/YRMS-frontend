import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaVenusMars,
  FaMapMarkerAlt,
  FaBuilding,
  FaSitemap,
  FaLightbulb,
  FaIdBadge,
  FaChevronDown,
  FaEdit,
  FaTimes,
  FaSave,
  FaBriefcase,
  FaUserTie,
  FaChartLine
} from 'react-icons/fa';
import { fetchCompetencies, fetchDesignations, fetchResourceDetails, updateResource } from '../../../../features/resource/resourceAction';

const EmployeeDetailPage = ({ publicId, onClose }) => {
  const dispatch = useDispatch();
  const { resourceDetails, loading, competencies, designations, error } = useSelector((state) => state.resource);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [toast, setToast] = useState(null);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [isRolesOpen, setIsRolesOpen] = useState(false);

  const handleRoleToggle = (roleId) => {
    setFormData(prev => ({
      ...prev,
      roleIds: prev.roleIds.includes(roleId)
        ? prev.roleIds.filter(id => id !== roleId)
        : [...prev.roleIds, roleId]
    }));
  };

  useEffect(() => {
    if (!resourceDetails || resourceDetails.publicId !== publicId) {
      dispatch(fetchResourceDetails(publicId));
      dispatch(fetchCompetencies());
      dispatch(fetchDesignations());
    }
  }, [dispatch]);

  // Get roles from sessionStorage (expecting a stringified array of roles)
  const storedRoles = sessionStorage.getItem('role');
  const roles = JSON.parse(storedRoles); // Parse the stored string into an array

  const getRoleName = (roleIds) => {
    if (!roleIds) return { names: "N/A", ids: "N/A" };
    if (!storedRoles) return { names: "N/A", ids: "N/A" };

    try {
      // Handle both single ID and array of IDs
      const result = Array.isArray(roleIds)
        ? {
          names: roleIds.map(id => roles.find(r => r.id === id)?.role || "Unknown").join(", "),
          ids: roleIds.join(", ")
        }
        : {
          names: roles.find(r => r.id === roleIds)?.role || "Unknown",
          ids: roleIds
        };

      return result;
    } catch (e) {
      console.error("Error parsing roles:", e);
      return { names: "N/A", ids: "N/A" };
    }
  };

  // Initialize form data when resourceDetails changes
  useEffect(() => {
    if (resourceDetails) {
      setFormData({
        ...resourceDetails,
        joiningDate: resourceDetails.joiningDate?.split('T')[0] || '',
        roleIds: resourceDetails.roleIds || []
      });
    }
  }, [resourceDetails]);

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const transformData = {
        employeeName: formData.employeeName || '',
        employeeId: formData.employeeId || '',
        joiningDate: formData.joiningDate || '',
        designation: formData.designation || '',
        roleIds: Array.isArray(formData.roleIds) ? formData.roleIds.map(id => parseInt(id)) : [],
        phoneNumber: formData.phoneNumber || '',
        gender: formData.gender ? formData.gender.toLowerCase() : '',
        location: formData.location || '',
        businessGroup: formData.businessGroup || '',
        businessUnit: formData.businessUnit || '',
        competency: formData.competency || ''
      };

      const response = await dispatch(updateResource({
        publicId: publicId,
        resourceData: transformData
      })).unwrap();

      setToast({ type: 'success', message: 'Employee details updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      setToast({
        type: 'error',
        message: error.message || 'Failed to update employee details'
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      ...resourceDetails,
      joiningDate: resourceDetails.joiningDate?.split('T')[0] || '',
      roleIds: resourceDetails.roleIds || []
    });
    setIsEditing(false);
  };

  if (!resourceDetails) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20 p-4">
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl border border-gray-200">
          <div className="flex justify-center items-center h-64">
            {loading ? (
              <p className="text-gray-600">Loading employee details...</p>
            ) : (
              <p className="text-gray-600">Employee not found</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-60">
          <div className={`px-4 py-3 rounded ${toast.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`}>
            {toast.message}
          </div>
        </div>
      )}

      {/* Main Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 overflow-auto backdrop-blur-sm bg-black/20 p-4">
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-6xl border border-gray-200">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6 gap-4 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100">
            <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
              {/* Profile Image */}
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center border-2 border-white shadow-lg">
                  <FaUser className="text-indigo-500 text-2xl" />
                </div>
              </div>

              {/* Employee Details */}
              <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                {/* Name */}
                <div className="bg-gradient-to-r from-white to-indigo-50 px-4 py-2 rounded-lg shadow-xs min-w-0 max-w-80 overflow-hidden border border-indigo-100">
                  {isEditing ? (
                    <input
                      name="employeeName"
                      value={formData.employeeName}
                      onChange={handleInputChange}
                      className="text-xl font-semibold text-indigo-800 bg-transparent w-full min-w-0 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      disabled={loading}
                    />
                  ) : (
                    <h3 className="text-xl font-semibold text-indigo-800 truncate">
                      {resourceDetails.employeeName}
                    </h3>
                  )}
                </div>

                {/* ID Info */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-3 py-2 rounded-lg shadow-xs flex items-center gap-2 border border-indigo-100">
                  <FaIdBadge className="text-indigo-500" />
                  <span className="text-sm text-indigo-600 font-medium">Employee ID:</span>
                  <span className="text-base text-indigo-800 font-medium">
                    {resourceDetails.employeeId}
                  </span>
                </div>

                {/* Status */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-3 py-2 rounded-lg shadow-xs flex items-center gap-2 border border-indigo-100">
                  <span className="text-sm text-indigo-600 font-medium">Status:</span>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${formData.status === 'Active' ? 'bg-green-100 text-green-800' :
                    formData.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                    {resourceDetails.status || 'Not specified'}
                  </div>
                </div>

                {/* Joining Date */}
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-2 py-2 rounded-lg shadow-xs flex items-center gap-2 border border-indigo-100">
                    <span className="text-sm text-indigo-600 font-medium">Joining Date:</span>
                    {isEditing ? (
                      <input
                        type="date"
                        name="joiningDate"
                        value={formData.joiningDate}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-blue-200 rounded-md px-1 py-1 text-sm focus:ring-1 focus:ring-blue-300"
                        disabled={loading}
                      />
                    ) : (
                      <span className="text-base text-indigo-800 font-medium">
                        {resourceDetails.joiningDate ? new Date(resourceDetails.joiningDate).toLocaleDateString() : 'N/A'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Block - Actions */}
            {!isEditing ? (
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 rounded-lg hover:from-indigo-200 hover:to-blue-200 text-base font-medium transition-colors duration-200 shadow-xs border border-indigo-200"
                >
                  <FaEdit className="mr-2" /> Edit
                </button>
                <button
                  onClick={onClose}
                  className="p-2.5 rounded-lg bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 text-gray-600 flex-shrink-0 transition-colors duration-200 shadow-xs border border-gray-200"
                >
                  <FaTimes size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={onClose}
                  className="p-2.5 rounded-lg bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 text-gray-600 flex-shrink-0 transition-colors duration-200 shadow-xs border border-gray-200"
                >
                  <FaTimes size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Main Content - Three Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Column 1 - Personal Information */}
            <div className={`bg-gradient-to-b from-gray-50 to-white rounded-lg p-4 ${isEditing ? 'ring-2 ring-indigo-200' : ''}`}>
              <h4 className="flex items-center text-base font-medium text-indigo-700 mb-4 border-b border-indigo-100 pb-2">
                <FaUser className="text-indigo-500 mr-2 text-sm" />
                Personal Information
              </h4>

              <div className="space-y-4">
                {/* Email */}
                <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                  <label className="block text-xs text-indigo-600 mb-1 font-semibold flex items-center">
                    <FaEnvelope className="mr-2" /> Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-indigo-200 rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-indigo-300"
                      disabled={loading}
                    />
                  ) : (
                    <p className="text-sm font-medium text-indigo-800">
                      {resourceDetails.email || 'Not specified'}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                  <label className="block text-xs text-indigo-600 mb-1 font-semibold flex items-center">
                    <FaPhone className="mr-2" /> Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-indigo-200 rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-indigo-300"
                      disabled={loading}
                    />
                  ) : (
                    <p className="text-sm font-medium text-indigo-800">
                      {resourceDetails.phoneNumber || 'Not specified'}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                  <label className="block text-xs text-indigo-600 mb-1 font-semibold flex items-center">
                    <FaVenusMars className="mr-2" /> Gender
                  </label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-indigo-200 rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-indigo-300"
                      disabled={loading}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="text-sm font-medium text-indigo-800">
                      {resourceDetails.gender || 'Not specified'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Column 2 - Professional Information */}
            <div className={`bg-gradient-to-b from-gray-50 to-white rounded-lg p-4 ${isEditing ? 'ring-2 ring-indigo-200' : ''}`}>
              <h4 className="flex items-center text-base font-medium text-indigo-700 mb-4 border-b border-indigo-100 pb-2">
                <FaBriefcase className="text-indigo-500 mr-2 text-sm" />
                Employment Details
              </h4>

              <div className="space-y-4">
                {/* Role */}
                <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                  <label className="block text-xs text-indigo-600 mb-1 font-semibold flex items-center">
                    <FaUserTie className="mr-2" /> Role
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      {/* Input-like container that shows selected roles */}
                      <div
                        className={`w-full min-h-12 p-2 bg-white border border-indigo-200 rounded-md flex flex-wrap items-center cursor-pointer ${isRolesOpen ? 'ring-1 ring-indigo-300 border-transparent' : ''}`}
                        onClick={() => setIsRolesOpen(!isRolesOpen)}
                      >
                        {formData.roleIds?.length === 0 ? (
                          <span className="text-gray-400 ml-2">Select roles...</span>
                        ) : (
                          formData.roleIds?.map(roleId => {
                            const role = roles.find(r => r.id === roleId);
                            return (
                              <div
                                key={roleId}
                                className="bg-indigo-100 text-indigo-800 text-sm px-2 py-1 rounded m-1 flex items-center"
                              >
                                {role?.role || 'Unknown'}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRoleToggle(roleId);
                                  }}
                                  className="ml-1 text-indigo-500 hover:text-indigo-700"
                                >
                                  <FaTimes className="text-xs" />
                                </button>
                              </div>
                            );
                          })
                        )}
                        <div className="ml-auto pr-2">
                          <FaChevronDown className={`text-gray-400 transition-transform ${isRolesOpen ? 'transform rotate-180' : ''}`} />
                        </div>
                      </div>

                      {/* Dropdown with checkboxes */}
                      {isRolesOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg py-1 border border-indigo-200 max-h-60 overflow-auto">
                          {roles?.map(role => (
                            <label
                              key={role.id}
                              className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out rounded"
                                checked={formData.roleIds?.includes(role.id)}
                                onChange={() => handleRoleToggle(role.id)}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <span className="ml-3 text-gray-700">{role.role}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-indigo-800">
                      {getRoleName(resourceDetails.roleIds).names || 'Not specified'}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                  <label className="block text-xs text-indigo-600 mb-1 font-semibold flex items-center">
                    <FaMapMarkerAlt className="mr-2" /> Location
                  </label>
                  {isEditing ? (
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-indigo-200 rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-indigo-300"
                      disabled={loading}
                    >
                      <option value="">Select Location</option>
                      <option value="Indore_Yash_IT_Park_SC_DC">Indore-YASH IT Park-SC-DC</option>
                      <option value="Pune_Magarpatta_DC_II">Pune-Magarpatta-DC-II</option>
                      <option value="Hyderabad_Mindspace_I_DC">Hyderabad-Mindspace I-DC</option>
                      <option value="Bangalore_Whitefield_DC">Bangalore-Whitefield-DC</option>
                      <option value="Indore_Crystal_IT_Park_DC_II">Indore-Crystal IT Park-DC-II</option>
                      <option value="Indore_BTC_CO">Indore-BTC-CO</option>
                      <option value="Pune_Hinjewadi_III_DC">Pune-Hinjewadi III-DC</option>
                    </select>
                  ) : (
                    <p className="text-sm font-medium text-indigo-800">
                      {resourceDetails.location || 'Not specified'}
                    </p>
                  )}
                </div>

                {/* Designation */}
                <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                  <label className="block text-xs text-indigo-600 mb-1 font-semibold flex items-center">
                    <FaChartLine className="mr-2" /> Designation
                  </label>
                  {isEditing ? (
                    <select
                      name='designation'
                      value={formData.designation || ''}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-indigo-200 rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-indigo-300"
                      disabled={loading}
                    >
                      <option value="">Select Designation</option>
                      {designations.map((designation) => (
                        <option value={designation.name} key={designation.publicId}>
                          {designation.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm font-medium text-indigo-800 truncate">
                      {resourceDetails.designation || 'Not specified'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Column 3 - Organizational Information */}
            <div className={`bg-gradient-to-b from-gray-50 to-white rounded-lg p-4 ${isEditing ? 'ring-2 ring-indigo-200' : ''}`}>
              <h4 className="flex items-center text-base font-medium text-indigo-700 mb-4 border-b border-indigo-100 pb-2">
                <FaBuilding className="text-indigo-500 mr-2 text-sm" />
                Organizational Structure
              </h4>

              <div className="space-y-4">
                {/* Business Group */}
                <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                  <label className="block text-xs text-indigo-600 mb-1 font-semibold flex items-center">
                    <FaBuilding className="mr-2" /> Business Group
                  </label>
                  {isEditing ? (
                    <select
                      name="businessGroup"
                      value={formData.businessGroup}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-indigo-200 rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-indigo-300"
                      disabled={loading}
                    >
                      <option value="">Select Business Group</option>
                      <option value="BG4">BG4</option>
                      <option value="BG5">BG5</option>
                      <option value="SSG1">SSG1</option>
                    </select>
                  ) : (
                    <p className="text-sm font-medium text-indigo-800">
                      {resourceDetails.businessGroup || 'Not specified'}
                    </p>
                  )}
                </div>

                {/* Business Unit */}
                <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                  <label className="block text-xs text-indigo-600 mb-1 font-semibold flex items-center">
                    <FaSitemap className="mr-2" /> Business Unit
                  </label>
                  {isEditing ? (
                    <select
                      name="businessUnit"
                      value={formData.businessUnit}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-indigo-200 rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-indigo-300"
                      disabled={loading}
                    >
                      <option value="">Select Business Unit</option>
                      <option value="BU5">BU5</option>
                      <option value="BU4">BU4</option>
                      <option value="SSU1">SSU1</option>
                    </select>
                  ) : (
                    <p className="text-sm font-medium text-indigo-800">
                      {resourceDetails.businessUnit || 'Not specified'}
                    </p>
                  )}
                </div>

                {/* Competency */}
                <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                  <label className="block text-xs text-indigo-600 mb-1 font-semibold flex items-center">
                    <FaLightbulb className="mr-2" /> Competency
                  </label>
                  {isEditing ? (
                    <select
                      name='competency'
                      value={formData.competency || ''}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-indigo-200 rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-indigo-300"
                      disabled={loading}
                    >
                      <option value="">Select Competency</option>
                      {competencies.map((competency) => (
                        <option value={competency.name} key={competency.publicId}>
                          {competency.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm font-medium text-indigo-800 truncate">
                      {resourceDetails.competencyName || 'Not specified'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions - Save/Cancel when editing */}
          {isEditing && (
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-gray-100 to-red-50 text-gray-700 rounded-lg hover:from-red-100 hover:to-red-100 text-base font-medium transition-colors duration-200 shadow-xs border border-gray-200"
              >
                <FaTimes className="mr-2" /> Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 text-base font-medium transition-colors duration-200 shadow-xs border border-indigo-700"
                disabled={loading}
              >
                <FaSave className="mr-2" /> {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EmployeeDetailPage;