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
    console.log(roleIds, "Input role IDs");
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
        joiningDate: resourceDetails.joiningDate?.split('T')[0] || ''
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
      const response = await dispatch(updateResource({
        publicId: publicId,
        updatedData: formData
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
      joiningDate: resourceDetails.joiningDate?.split('T')[0] || ''
    });
    setIsEditing(false);
  };

  console.log("resourceDetails: ", resourceDetails)

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
      <div className="fixed top-4 right-4 z-60">
        {toast?.type === 'success' && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {toast.message}
          </div>
        )}
        {toast?.type === 'error' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {toast.message}
          </div>
        )}
      </div>

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
                      {formData.employeeName}
                    </h3>
                  )}
                </div>

                {/* ID Info */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-3 py-2 rounded-lg shadow-xs flex items-center gap-2 border border-indigo-100">
                  <FaIdBadge className="text-indigo-500" />
                  <span className="text-sm text-indigo-600 font-medium">Employee ID:</span>
                  <span className="text-base text-indigo-800 font-medium">
                    {formData.employeeId}
                  </span>
                </div>

                {/* Status */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-3 py-2 rounded-lg shadow-xs flex items-center gap-2 border border-indigo-100">
                  <span className="text-sm text-indigo-600 font-medium">Status:</span>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${formData.status === 'Active' ? 'bg-green-100 text-green-800' :
                    formData.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                    {formData.status || 'Not specified'}
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
                        {formData.joiningDate ? new Date(formData.joiningDate).toLocaleDateString() : 'N/A'}
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
                      {formData.email || 'Not specified'}
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
                      {formData.phoneNumber || 'Not specified'}
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
                      {formData.gender || 'Not specified'}
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
                    <FaVenusMars className="mr-2" /> Role
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      {/* Input-like container that shows selected roles */}
                      <div
                        className={`w-full min-h-12 p-2 bg-white border border-indigo-200 rounded-md flex flex-wrap items-center cursor-pointer ${isRolesOpen ? 'ring-1 ring-indigo-300 border-transparent' : ''}`}
                        onClick={() => setIsRolesOpen(!isRolesOpen)}
                      >
                        {formData.roleIds.length === 0 ? (
                          <span className="text-gray-400 ml-2">Select roles...</span>
                        ) : (
                          formData.roleIds.map(roleId => {
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
                          {roles.map(role => (
                            <label
                              key={role.id}
                              className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out rounded"
                                checked={formData.roleIds.includes(role.id)}
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
                      {getRoleName(formData.roleIds).names || 'Not specified'}
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
                      name="role"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-indigo-200 rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-indigo-300"
                      disabled={loading}
                    >
                      <option value="indore-yash-it-park-sc-dc">Indore-YASH IT Park-SC-DC</option>
                      <option value="pune-magarpatta-dc-ii">Pune-Magarpatta-DC-II</option>
                      <option value="hyderabad-mindspace-i-dc">Hyderabad-Mindspace I-DC</option>
                      <option value="bangalore-whitefield-dc">Bangalore-Whitefield-DC</option>
                      <option value="indore-crystal-it-park-dc-ii">Indore-Crystal IT Park-DC-II</option>
                      <option value="indore-btc-co">Indore-BTC-CO</option>
                      <option value="indore-btc-co">Pune-Hinjewadi III-DC</option>
                    </select>
                  ) : (
                    <p className="text-sm font-medium text-indigo-800">
                      {formData.location || 'Not specified'}
                    </p>
                  )}
                </div>

                {/* Designation */}
                <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                  <label className="block text-xs text-indigo-600 mb-1 font-semibold">Designation</label>
                  {isEditing ? (
                    <select
                      name='designation'
                      value={formData.competencyId || ''}
                      onChange={(e) => {
                        const selectedDesignation = designations.find(c => c.publicId === e.target.value);
                        setFormData(prev => ({
                          ...prev,
                          competencyId: e.target.value,
                          competency: selectedDesignation?.name || ''
                        }));
                      }}
                      className="w-full h-12 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    >
                      <option value="" disabled>Select Designation</option>
                      {designations.map((designation) => (
                        <option value={designation.publicId} key={designation.publicId}>
                          {designation.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm font-medium text-indigo-800 truncate">
                      {formData.designation || 'Not specified'}
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
                      name="role"
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
                      {formData.businessGroup || 'Not specified'}
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
                      name="role"
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
                      {formData.businessUnit || 'Not specified'}
                    </p>
                  )}
                </div>

                {/* Competency */}
                <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                  <label className="block text-xs text-indigo-600 mb-1 font-semibold">Competency</label>
                  {isEditing ? (
                    <select
                      name='competencyId'
                      value={formData.competencyId || ''}
                      onChange={(e) => {
                        const selectedCompetency = competencies.find(c => c.publicId === e.target.value);
                        setFormData(prev => ({
                          ...prev,
                          competencyId: e.target.value,
                          competency: selectedCompetency?.name || ''
                        }));
                      }}
                      className="w-full h-12 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    >
                      <option value="" disabled>Select Competency</option>
                      {competencies.map((competency) => (
                        <option value={competency.publicId} key={competency.publicId}>
                          {competency.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm font-medium text-indigo-800 truncate">
                      {formData.competency || 'Not specified'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Optional Full-width Bottom Section */}
          <div className="bg-gradient-to-b from-gray-50 to-white rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h4 className="flex items-center text-base font-medium text-indigo-700">
                <FaChartLine className="text-indigo-500 mr-2 text-sm" />
                Additional Information
              </h4>
              <button
                onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                {showAdditionalInfo ? 'Hide' : 'Show More'}
              </button>
            </div>

            {showAdditionalInfo && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Add any additional fields here */}
                <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                  <label className="block text-xs text-indigo-600 mb-1 font-semibold">Reporting Manager</label>
                  <p className="text-sm font-medium text-indigo-800">John Doe</p>
                </div>
                <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                  <label className="block text-xs text-indigo-600 mb-1 font-semibold">Department</label>
                  <p className="text-sm font-medium text-indigo-800">Engineering</p>
                </div>
                <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                  <label className="block text-xs text-indigo-600 mb-1 font-semibold">Team</label>
                  <p className="text-sm font-medium text-indigo-800">Frontend Development</p>
                </div>
              </div>
            )}
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