import React, { useEffect, useState } from 'react';
import {
    FaArrowLeft,
    FaUser,
    FaEnvelope,
    FaVenusMars,
    FaPhone,
    FaUserTie,
    FaCode,
    FaCalendarAlt,
    FaUpload,
    FaClock,
    FaMapMarkerAlt,
    FaCheckCircle,
    FaTimes
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createResource, fetchCompetencies, fetchDesignations, fetchResources, fetchTechnologies } from '../../../../features/resource/resourceAction';
import { fetchRoles } from '../../../../features/role/roleAction'
import { ErrorToast, SuccessToast } from '../../../helper/ResourceToast';
import YRMSLoader from '../../../helper/loader';
import Dropdown from '../../../helper/Dropdown';
import axios from 'axios';
import { ADMIN_API_BASE_URL } from '../../../../config/Endpoints/BaseEndpoints';

const AddResource = ({ setActiveSection }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { resources, loading, designations, competencies, technologies, technologyLoading } = useSelector(
        (state) => state.resource
    );

    const { roles } = useSelector(
        (state) => state.role
    );

    const [modalField, setModalField] = useState(null);
    const [isRolesOpen, setIsRolesOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const [profilePic, setProfilePic] = useState(null);
    const [profilePicPreview, setProfilePicPreview] = useState(null);

    const [formData, setFormData] = useState({
        employeeId: "",
        employeeName: "",
        gender: "",
        location: "",
        email: "",
        phoneNumber: "",
        joiningDate: "",
        designation: "",
        employeeType: "",
        grade: "",
        businessGroup: "",
        businessUnit: "",
        competency: "",
        status: "pool",
        roleIds: [],
        irm: { name: "" }, // New field for IRM
        srm: { name: "" }, // New field for SRM
    });

    const [filterData, setFilterData] = useState({
        technologies: [],
        experience: "",
        certifications: "",
        communication: "",
    });

    const [errors, setErrors] = useState({
        employeeId: "",
        employeeName: "",
        gender: "",
        location: "",
        email: "",
        phoneNumber: "",
        joiningDate: "",
        designation: "",
        employeeType: "",
        grade: "",
        businessGroup: "",
        businessUnit: "",
        competency: "",
        roleIds: "",
        irm: { name: "" }, // Error state for IRM
        srm: { name: "" }, // Error state for SRM
    });

    // Validation function
    const validateField = (name, value) => {
        let error = "";
        
        switch (name) {
            case 'employeeId':
                if (!value) error = "Employee ID is required";
                else if (!/^[a-zA-Z0-9]+$/.test(value)) error = "Only alphanumeric characters allowed";
                break;
            case 'employeeName':
                if (!value) error = "Employee name is required";
                else if (value.length < 2) error = "Name must be at least 2 characters";
                break;
            case 'email':
                if (!value) error = "Email is required";
                else if (!/^[a-zA-Z0-9._%+-]+@yash\.com$/i.test(value)) error = "Only yash.com emails allowed";
                break;
            case 'phoneNumber':
                if (!value) error = "Phone number is required";
                else if (!/^[0-9]{7,15}$/.test(value)) error = "Phone must be 7-15 digits";
                break;
            case 'gender':
            case 'location':
            case 'designation':
            case 'employeeType':
            case 'grade':
            case 'businessGroup':
            case 'businessUnit':
            // case 'competency':
            case 'joiningDate':
                if (!value) error = "This field is required";
                break;
            case 'roleIds':
                if (!value || value.length === 0) error = "At least one role must be selected";
                break;
            case 'irm':
                if (!value.name) error = "IRM name is required";
                break;
            case 'srm':
                if (!value.name) error = "SRM name is required";
                break;
            default:
                break;
        }
        
        return error;
    };

    // Handle field blur
    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    // Handle input change with optimized validation
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        
        // Only validate if there's already an error
        if (errors[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    // Handle role selection blur
    const handleRoleBlur = () => {
        const error = validateField('roleIds', formData.roleIds);
        setErrors(prev => ({ ...prev, roleIds: error }));
    };

    // Handle role selection change
    const handleRoleSelection = (roleId, isChecked) => {
        const newRoleIds = formData.roleIds || [];
        const updatedRoleIds = isChecked 
            ? [...newRoleIds, roleId]
            : newRoleIds.filter(id => id !== roleId);
            
        setFormData(prev => ({ ...prev, roleIds: updatedRoleIds }));
        
        // Validate roles
        const error = validateField('roleIds', updatedRoleIds);
        setErrors(prev => ({ ...prev, roleIds: error }));
    };

    // Validate entire form
    const validateForm = () => {
        let isValid = true;
        const newErrors = { ...errors };
        
        // Validate all fields
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            newErrors[key] = error;
            if (error) isValid = false;
        });
        
        // Special validation for roleIds
        const roleError = validateField('roleIds', formData.roleIds);
        newErrors.roleIds = roleError;
        if (roleError) isValid = false;

        // Validate IRM and SRM
        const irmError = validateField('irm', formData.irm);
        const srmError = validateField('srm', formData.srm);
        newErrors.irm = irmError;
        newErrors.srm = srmError;
        if (irmError || srmError) isValid = false;

        setErrors(newErrors);
        return isValid;
    };

    // Helper to get input classes based on validation
    const getInputClasses = (fieldName) => {
        return errors[fieldName] 
            ? "w-full p-3 border border-red-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition-all"
            : "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all";
    };

    // Helper to get select classes based on validation
    const getSelectClasses = (fieldName) => {
        const baseClass = `w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all ${formData[fieldName] ? "text-gray-800" : "text-gray-400"}`;
        return errors[fieldName] 
            ? `${baseClass} border-red-500 focus:ring-red-300`
            : `${baseClass} border-gray-300 focus:ring-indigo-300`;
    };

    // Fetch resources whenever filterData changes
    useEffect(() => {
        dispatch(fetchResources({
            experience: filterData.experience || undefined,
            communication: filterData.communication || undefined,
            certification: filterData.certifications || undefined,
            technology: filterData.technologies.length > 0 ? filterData.technologies : undefined,
        }));
    }, [dispatch, filterData]);

    // Initial fetch for designations, competencies, and technologies
    useEffect(() => {
        dispatch(fetchRoles());
        dispatch(fetchDesignations());
        dispatch(fetchCompetencies());
        dispatch(fetchTechnologies());
    }, [dispatch]);

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
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
    };

    const uploadProfilePicture = async (userId) => {
        if (!profilePic) return;

        try {
            const formData = new FormData();
            formData.append("payload", profilePic);

            const token = sessionStorage.getItem("token");
            const response = await axios.post(
                `${ADMIN_API_BASE_URL}/user-profile-upload/?user_id=${userId}`,
                formData,
                {
                    headers: {
                        accept: "application/json",
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error("Profile upload failed:", error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setToast(<ErrorToast message="Please fix all validation errors" onClose={() => setToast(null)} />);
            return;
        }

        try {
            setToast(<YRMSLoader message="Creating resource..." />);
            const payload = {
                ...formData,
                meta_data: {
                    irm: { name: formData.irm.name },
                    srm: { name: formData.srm.name }
                }
            };
            const createResult = await dispatch(createResource(payload));

            if (!createResult.payload?.publicId) {
                throw new Error("Failed to get publicId from response");
            }

            const publicId = createResult.payload.publicId;

            if (profilePic) {
                setToast(<YRMSLoader message="Uploading profile picture..." />);
                await uploadProfilePicture(publicId);
            }

            setToast(<SuccessToast message="Resource created successfully!" onClose={() => setToast(null)} />);

            setToast(<YRMSLoader message="Refreshing data..." />);
            await dispatch(fetchResources());

            setFormData({
                employeeId: "",
                employeeName: "",
                gender: "",
                location: "",
                email: "",
                phoneNumber: "",
                joiningDate: "",
                designation: "",
                employeeType: "",
                grade: "",
                businessGroup: "",
                businessUnit: "",
                competency: "",
                status: "pool",
                roleIds: [],
                irm: { name: "" }, // Reset IRM field
                srm: { name: "" }, // Reset SRM field
            });
            setProfilePic(null);
            setProfilePicPreview(null);
            setActiveSection("view");
            setToast(null);
        } catch (err) {
            setToast(<ErrorToast message={err.message || "Failed to create resource"} onClose={() => setToast(null)} />);
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen p-6">
            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-4 right-4 z-50">
                    {toast}
                </div>
            )}

            {/* Header Section */}
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <button
                        className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                        onClick={() => { setActiveSection("view") }}
                    >
                        <FaArrowLeft className="mr-2" />
                        <span className="font-medium">Back to Users</span>
                    </button>
                </div>

                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                    Add New User
                </h2>
                <p className="text-gray-600 mb-8">Fill in the details below to add a new resource</p>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 md:p-8">
                    {/* Personal Information Section */}
                    <div className="mb-10">
                        <div className="flex items-center mb-6">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                                <FaUser className="text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Profile Picture Upload */}
                            <div className="md:col-span-2">
                                <label className="block text-gray-700 font-medium mb-3">Profile Picture</label>
                                <div className="flex items-center space-x-6">
                                    <div className="relative">
                                        {profilePicPreview ? (
                                            <>
                                                <img
                                                    src={profilePicPreview}
                                                    alt="Profile preview"
                                                    className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100 shadow-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeProfilePic}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
                                                >
                                                    <FaTimes className="text-xs" />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 border-4 border-indigo-100">
                                                <FaUser className="text-2xl" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            id="profilePic"
                                            name="profilePic"
                                            accept="image/*"
                                            onChange={handleProfilePicChange}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="profilePic"
                                            className="px-5 py-2.5 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 text-indigo-700 rounded-lg cursor-pointer transition-all duration-200 inline-flex items-center shadow-sm border border-indigo-100"
                                        >
                                            <FaUpload className="mr-2" />
                                            Choose File
                                        </label>
                                        <span className="ml-3 text-sm text-gray-500">
                                            {profilePic ? profilePic.name : "JPEG or PNG, max 2MB"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Personal Info Fields */}
                            <div className="space-y-1">
                                <label className="block text-gray-700 font-medium mb-1 flex items-center">
                                    <FaUser className="text-indigo-500 mr-2 text-sm" />
                                    Employee Name
                                </label>
                                <input
                                    type="text"
                                    name="employeeName"
                                    value={formData.employeeName}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={getInputClasses('employeeName')}
                                    placeholder="John Doe"
                                    required
                                />
                                {errors.employeeName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.employeeName}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-gray-700 font-medium mb-1 flex items-center">
                                    <FaUserTie className="text-indigo-500 mr-2 text-sm" />
                                    Employee ID
                                </label>
                                <input
                                    type="text"
                                    name="employeeId"
                                    value={formData.employeeId}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={getInputClasses('employeeId')}
                                    placeholder="YASH1234"
                                    required
                                />
                                {errors.employeeId && (
                                    <p className="text-red-500 text-sm mt-1">{errors.employeeId}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-gray-700 font-medium mb-1 flex items-center">
                                    <FaVenusMars className="text-indigo-500 mr-2 text-sm" />
                                    Gender
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={getSelectClasses('gender')}
                                    required
                                >
                                    <option value="" disabled>Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                {errors.gender && (
                                    <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-gray-700 font-medium mb-1 flex items-center">
                                    <FaMapMarkerAlt className="text-indigo-500 mr-2 text-sm" />
                                    Location
                                </label>
                                <select
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={getSelectClasses('location')}
                                    required
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
                                {errors.location && (
                                    <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-gray-700 font-medium mb-1 flex items-center">
                                    <FaMapMarkerAlt className="text-indigo-500 mr-2 text-sm" />
                                    Roles (Select multiple)
                                </label>

                                <div className="relative">
                                    <button
                                        type="button"
                                        className={`w-full p-3 border ${errors.roleIds ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 ${errors.roleIds ? 'focus:ring-red-300' : 'focus:ring-indigo-300'} focus:border-transparent transition-all text-left ${formData.roleIds?.length ? "text-gray-800" : "text-gray-400"}`}
                                        onClick={() => setIsRolesOpen(!isRolesOpen)}
                                        onBlur={handleRoleBlur}
                                    >
                                        {formData.roleIds?.length > 0
                                            ? `${formData.roleIds.length} selected`
                                            : "Select one or more roles"}
                                    </button>

                                    {isRolesOpen && (
                                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg py-1 border border-gray-200 max-h-60 overflow-auto">
                                            {roles.map((role) => (
                                                <label
                                                    key={role.id}
                                                    className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out rounded"
                                                        value={role.id}
                                                        checked={formData.roleIds?.includes(role.id) || false}
                                                        onChange={(e) => handleRoleSelection(role.id, e.target.checked)}
                                                    />
                                                    <span className="ml-3 text-gray-700">{role.role}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {errors.roleIds && (
                                    <p className="text-red-500 text-sm mt-1">{errors.roleIds}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-gray-700 font-medium mb-1 flex items-center">
                                    <FaEnvelope className="text-indigo-500 mr-2 text-sm" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={getInputClasses('email')}
                                    placeholder="john.doe@yash.com"
                                    required
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-gray-700 font-medium mb-1 flex items-center">
                                    <FaPhone className="text-indigo-500 mr-2 text-sm" />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={getInputClasses('phoneNumber')}
                                    placeholder="9876543210"
                                    required
                                />
                                {errors.phoneNumber && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                                )}
                            </div>

                            {/* New Fields for IRM and SRM */}
                            <div className="space-y-1">
                                <label className="block text-gray-700 font-medium mb-1 flex items-center">
                                    <FaUser className="text-indigo-500 mr-2 text-sm" />
                                    IRM Name
                                </label>
                                <input
                                    type="text"
                                    name="irm.name"
                                    value={formData.irm.name}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={getInputClasses('irm.name')}
                                    placeholder="IRM Name"
                                    required
                                />
                                {errors.irm.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.irm.name}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-gray-700 font-medium mb-1 flex items-center">
                                    <FaUser className="text-indigo-500 mr-2 text-sm" />
                                    SRM Name
                                </label>
                                <input
                                    type="text"
                                    name="srm.name"
                                    value={formData.srm.name}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={getInputClasses('srm.name')}
                                    placeholder="SRM Name"
                                    required
                                />
                                {errors.srm.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.srm.name}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Employment Details Section */}
                    <div className="mb-10">
                        <div className="flex items-center mb-6">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                                <FaUserTie className="text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800">Employment Details</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="block text-gray-700 font-medium mb-1 flex items-center">
                                    <FaCalendarAlt className="text-indigo-500 mr-2 text-sm" />
                                    Joining Date
                                </label>
                                <input
                                    type="date"
                                    name="joiningDate"
                                    value={formData.joiningDate}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={getInputClasses('joiningDate')}
                                    required
                                />
                                {errors.joiningDate && (
                                    <p className="text-red-500 text-sm mt-1">{errors.joiningDate}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-gray-700 font-medium mb-1 flex items-center">
                                    <FaUserTie className="text-indigo-500 mr-2 text-sm" />
                                    Designation
                                </label>
                                <Dropdown
                                    name="designation"
                                    value={formData.designation}
                                    options={designations}
                                    onChange={(e) => {
                                        handleInputChange(e);
                                    }}
                                    setModalField={setModalField}
                                    onBlur={handleBlur}
                                    error={errors.designation}
                                />
                                {errors.designation && (
                                    <p className="text-red-500 text-sm mt-1">{errors.designation}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-gray-700 font-medium mb-1 flex items-center">
                                    <FaUserTie className="text-indigo-500 mr-2 text-sm" />
                                    Employee Type
                                </label>
                                <select
                                    name="employeeType"
                                    value={formData.employeeType}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={getSelectClasses('employeeType')}
                                    required
                                >
                                    <option value="" disabled>Select type</option>
                                    <option value="probation">Probation</option>
                                    <option value="permanent">Permanent</option>
                                    <option value="contract">Contract</option>
                                </select>
                                {errors.employeeType && (
                                    <p className="text-red-500 text-sm mt-1">{errors.employeeType}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-gray-700 font-medium mb-1 flex items-center">
                                    <FaCheckCircle className="text-indigo-500 mr-2 text-sm" />
                                    Grade
                                </label>
                                <select
                                    name="grade"
                                    value={formData.grade}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={getSelectClasses('grade')}
                                    required
                                >
                                    <option value="" disabled>Select grade</option>
                                    {["E1", "E2", "E3", "E4", "E5", "E6", "E7"].map((grade) => (
                                        <option key={grade} value={grade}>
                                            {grade}
                                        </option>
                                    ))}
                                </select>
                                {errors.grade && (
                                    <p className="text-red-500 text-sm mt-1">{errors.grade}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-gray-700 font-medium mb-1 flex items-center">
                                    <FaCheckCircle className="text-indigo-500 mr-2 text-sm" />
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all ${formData.status ? "text-gray-800" : "text-gray-400"}`}
                                    required
                                >
                                    <option value="pool">Pool</option>
                                    <option value="deployed">Deployed</option>
                                    <option value="pip">PIP</option>
                                    <option value="hold">Hold</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-gray-700 font-medium mb-1 flex items-center">
                                    <FaUserTie className="text-indigo-500 mr-2 text-sm" />
                                    Business Group
                                </label>
                                <select
                                    name="businessGroup"
                                    value={formData.businessGroup}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={getSelectClasses('businessGroup')}
                                    required
                                >
                                    <option value="" disabled>Select business group</option>
                                    <option value="BG4">BG4</option>
                                    <option value="BG5">BG5</option>
                                    <option value="SSG1">SSG1</option>
                                </select>
                                {errors.businessGroup && (
                                    <p className="text-red-500 text-sm mt-1">{errors.businessGroup}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-gray-700 font-medium mb-1 flex items-center">
                                    <FaUserTie className="text-indigo-500 mr-2 text-sm" />
                                    Business Unit
                                </label>
                                <select
                                    name="businessUnit"
                                    value={formData.businessUnit}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={getSelectClasses('businessUnit')}
                                    required
                                >
                                    <option value="" disabled>Select business unit</option>
                                    <option value="BU5">BU5</option>
                                    <option value="BU4">BU4</option>
                                    <option value="SSU1">SSU1</option>
                                </select>
                                {errors.businessUnit && (
                                    <p className="text-red-500 text-sm mt-1">{errors.businessUnit}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-gray-700 font-medium mb-1 flex items-center">
                                    <FaCode className="text-indigo-500 mr-2 text-sm" />
                                    Competency
                                </label>
                                <Dropdown
                                    name="competency"
                                    value={formData.competency}
                                    options={competencies}
                                    onChange={handleInputChange}
                                    setModalField={setModalField}
                                    onBlur={handleBlur}
                                    error={errors.competency}
                                />
                                {errors.competency && (
                                    <p className="text-red-500 text-sm mt-1">{errors.competency}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center mt-8">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-12 py-3.5 rounded-lg font-semibold text-lg transition-all transform hover:scale-[1.02] shadow-lg ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                "Create Resource"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddResource;