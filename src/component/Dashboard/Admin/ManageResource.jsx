import React, { useEffect, useState, useMemo } from "react";
import {
  FaPlus,
  FaArrowLeft,
  FaFilter,
  FaTimes,
  FaCogs,
  FaCalendar,
  FaComments,
  FaFileDownload,
  FaFileUpload,
  FaUsers,
  FaUserClock,
  FaExclamationCircle,
  FaUserCheck
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ResourceList from "./ResourceList";
import { createResource, fetchResources, fetchDesignations, fetchCompetencies, fetchTechnologies } from "../../../features/resource/resourceAction";
import YRMSLoader from "../../helper/loader";
import AddOptionModal from "../../helper/OptionalModal";
import { SuccessToast, ErrorToast } from "../../helper/ResourceToast";
import Dropdown from "../../helper/Dropdown";
import axios from "axios";
import { ADMIN_API_BASE_URL } from "../../../config/Endpoints/BaseEndpoints";

const ManageResource = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { resources, loading, error, designations, competencies, technologies, technologyLoading } = useSelector(
    (state) => state.resource
  );

  const [activeSection, setActiveSection] = useState("view");
  const [modalField, setModalField] = useState(null);
  const [toast, setToast] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [loadingBaselineId, setLoadingBaselineId] = useState(null);
  const [loadingOpportunityId, setLoadingOpportunityId] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    gender: "",
    location: "indore",
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
  });

  const [filterData, setFilterData] = useState({
    technologies: [],
    categories: [],
    experience: "",
    certifications: "",
    communication: "",
  });

  const [statusFilter, setStatusFilter] = useState("");

  // Calculate status counts
  const statusCounts = useMemo(() => {
    const counts = {
      all: resources?.length || 0,
      pool: 0,
      pip: 0,
      deployed: 0
    };
    (resources || []).forEach((resource) => {
      const status = (resource.status || "pool").toLowerCase();
      if (status === "pool") counts.pool += 1;
      else if (status === "pip") counts.pip += 1;
      else if (status === "deployed") counts.deployed += 1;
    });
    return counts;
  }, [resources]);

  // Validation rules
  const validate = {
    employeeId: (value) => {
      if (!value) return "Employee ID is required";
      if (!/^[A-Za-z0-9]{4,20}$/.test(value)) return "ID must be 4-20 alphanumeric characters";
      return null;
    },
    employeeName: (value) => {
      if (!value) return "Name is required";
      if (!/^[A-Za-z\s]{3,50}$/.test(value)) return "Name must be 3-50 letters only";
      return null;
    },
    gender: (value) => {
      if (!value) return "Gender is required";
      return null;
    },
    location: (value) => {
      if (!value) return "Location is required";
      return null;
    },
    email: (value) => {
      if (!value) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
      return null;
    },
    phoneNumber: (value) => {
      if (!value) return "Phone number is required";
      if (!/^[0-9]{10,15}$/.test(value)) return "Phone must be 10-15 digits";
      return null;
    },
    joiningDate: (value) => {
      if (!value) return "Joining date is required";
      const selectedDate = new Date(value);
      const today = new Date();
      if (selectedDate > today) return "Joining date cannot be in the future";
      return null;
    },
    designation: (value) => {
      if (!value) return "Designation is required";
      return null;
    },
    employeeType: (value) => {
      if (!value) return "Employee type is required";
      return null;
    },
    grade: (value) => {
      if (!value) return "Grade is required";
      return null;
    },
    businessGroup: (value) => {
      if (!value) return "Business group is required";
      return null;
    },
    businessUnit: (value) => {
      if (!value) return "Business unit is required";
      return null;
    },
    competency: (value) => {
      if (!value) return "Competency is required";
      return null;
    },
    status: (value) => {
      if (!value) return "Status is required";
      return null;
    },
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validate[field]?.(formData[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Group technologies by category
  const technologiesByCategory = technologies.reduce((acc, tech) => {
    const category = tech.technologyCategoryName;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tech.name);
    return acc;
  }, {});

  // Get unique categories
  const categories = [...new Set(technologies.map(tech => tech.technologyCategoryName))];

  // Fetch resources whenever filterData or statusFilter changes
  useEffect(() => {
    dispatch(fetchResources({
      experience: filterData.experience || undefined,
      communication: filterData.communication || undefined,
      certification: filterData.certifications || undefined,
      technology: filterData.technologies.length > 0 ? filterData.technologies : undefined,
    }));
  }, [dispatch, filterData, statusFilter]);

  // Initial fetch for designations, competencies, and technologies
  useEffect(() => {
    dispatch(fetchDesignations());
    dispatch(fetchCompetencies());
    dispatch(fetchTechnologies());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Validate on change if the field has been touched
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validate[name]?.(value) || null,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validate[name]?.(formData[name]) || null,
    }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        setErrors((prev) => ({
          ...prev,
          profilePic: "Only image files are allowed",
        }));
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          profilePic: "Image must be less than 2MB",
        }));
        return;
      }

      setProfilePic(file);
      setErrors((prev) => ({ ...prev, profilePic: null }));
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
    setErrors((prev) => ({ ...prev, profilePic: null }));
  };

  const toggleTechnology = (tech) => {
    setFilterData((prev) => {
      const newTechs = prev.technologies.includes(tech)
        ? prev.technologies.filter((t) => t !== tech)
        : [...prev.technologies, tech];
      
      // Update categories based on selected technologies
      const techCategories = technologies
        .filter(t => newTechs.includes(t.name))
        .map(t => t.technologyCategoryName);
      const uniqueCategories = [...new Set(techCategories)];
      
      return {
        ...prev,
        technologies: newTechs,
        categories: uniqueCategories
      };
    });
  };

  const toggleCategory = (category) => {
    setFilterData((prev) => {
      const categoryTechs = technologies
        .filter(tech => tech.technologyCategoryName === category)
        .map(tech => tech.name);
      
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];
      
      let newTechs = [...prev.technologies];
      
      if (newCategories.includes(category)) {
        // Add all technologies from this category
        newTechs = [...new Set([...newTechs, ...categoryTechs])];
      } else {
        // Remove all technologies from this category
        newTechs = newTechs.filter(tech => !categoryTechs.includes(tech));
      }
      
      return {
        ...prev,
        categories: newCategories,
        technologies: newTechs
      };
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterData((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilterData({
      technologies: [],
      categories: [],
      experience: "",
      certifications: "",
      communication: "",
    });
    setStatusFilter(""); // Clear status filter as well
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

  const downloadSampleCSV = async () => {
    try {
      setToast(<YRMSLoader message="Preparing sample CSV..." />);
      
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${ADMIN_API_BASE_URL}/resources/sample-csv/`,
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resource_sample.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();

      setToast(<SuccessToast message="Sample CSV downloaded successfully!" onClose={() => setToast(null)} />);
    } catch (error) {
      setToast(<ErrorToast message="Failed to download sample CSV" onClose={() => setToast(null)} />);
      console.error("CSV download error:", error);
    }
  };

  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      setToast(<ErrorToast message="Please upload a CSV file" onClose={() => setToast(null)} />);
      return;
    }

    try {
      setToast(<YRMSLoader message="Processing CSV file..." />);
      
      const formData = new FormData();
      formData.append('file', file);

      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `${ADMIN_API_BASE_URL}/resources/bulk-upload/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setToast(<SuccessToast message={`${response.data.created_count} resources created successfully!`} onClose={() => setToast(null)} />);
      
      // Refresh the resource list
      dispatch(fetchResources());
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to upload CSV";
      setToast(<ErrorToast message={errorMsg} onClose={() => setToast(null)} />);
      console.error("CSV upload error:", error);
    } finally {
      // Reset the file input
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched to show all errors
    const allTouched = {};
    Object.keys(formData).forEach((field) => {
      allTouched[field] = true;
    });
    setTouched(allTouched);
    
    // Validate the form
    if (!validateForm()) {
      setToast(<ErrorToast message="Please fix all errors before submitting" onClose={() => setToast(null)} />);
      return;
    }

    try {
      setToast(<YRMSLoader message="Creating resource..." />);

      const createResult = await dispatch(createResource(formData));

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
        location: "indore",
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
      });
      setProfilePic(null);
      setProfilePicPreview(null);
      setActiveSection("view");
      setToast(null);
      setErrors({});
      setTouched({});
    } catch (err) {
      setToast(<ErrorToast message={err.message || "Failed to create resource"} onClose={() => setToast(null)} />);
    }
  };

  const handleBaselineClick = (resource) => {
    setLoadingBaselineId(resource.publicId);
    navigate(`/manage-baseline/${resource.publicId}`);
  };

  const handleOpportunitiesClick = (resource) => {
    setLoadingOpportunityId(resource.publicId);
    navigate(`/opportunities/${resource.publicId}`);
  };

  // Helper function to render input with validation
  const renderInput = (name, label, type = "text", placeholder, required = true) => (
    <div>
      <label className="block text-gray-700 font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors ${
          errors[name] ? "border-red-500" : "border-gray-200 focus:border-blue-500"
        }`}
        placeholder={placeholder}
        required={required}
      />
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
      )}
    </div>
  );

  // Helper function to render select with validation
  const renderSelect = (name, label, options, required = true) => (
    <div>
      <label className="block text-gray-700 font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors ${
          errors[name] ? "border-red-500" : "border-gray-200 focus:border-blue-500"
        } ${formData[name] ? "text-black" : "text-gray-500"}`}
        required={required}
      >
        <option value="" disabled>
          Select {label.toLowerCase()}
        </option>
        {options.map((option) => (
          <option key={option.value || option} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg mt-15">
      {loading && <YRMSLoader />}
      {toast}
      {activeSection !== "add" ? (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-bold text-blue-800">Resource Details</h2>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <input
                  type="file"
                  id="csvUpload"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="hidden"
                />
                <label
                  htmlFor="csvUpload"
                  className="px-4 py-2 rounded-lg font-semibold text-sm flex items-center bg-gradient-to-r from-green-600 to-teal-600 text-white hover:from-green-700 hover:to-teal-700 transition-all transform hover:scale-105 cursor-pointer"
                >
                  <FaFileUpload className="mr-2" />
                  Bulk Upload
                </label>
              </div>
              <button
                onClick={downloadSampleCSV}
                className="px-4 py-2 rounded-lg font-semibold text-sm flex items-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105"
              >
                <FaFileDownload className="mr-2" />
                Sample CSV
              </button>
              <button
                className="px-4 py-2 rounded-lg font-semibold text-sm flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
                onClick={() => setActiveSection("add")}
              >
                <FaPlus className="mr-2" />
                Add Resource
              </button>
            </div>
          </div>

          {/* Status Count Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              {
                status: "all",
                label: "All Resources",
                count: statusCounts.all,
                icon: <FaUsers className={`text-3xl ${statusFilter === "all" ? "text-white" : "text-purple-600"}`} />,
                color: "purple-600",
                gradient: "from-purple-600 to-purple-800",
                hoverBg: "hover:bg-purple-50",
                selected: statusFilter === "all"
              },
              {
                status: "pool",
                label: "Pool",
                count: statusCounts.pool,
                icon: <FaUserClock className={`text-3xl ${statusFilter === "pool" ? "text-white" : "text-blue-600"}`} />,
                color: "blue-600",
                gradient: "from-blue-600 to-blue-800",
                hoverBg: "hover:bg-blue-50",
                selected: statusFilter === "pool"
              },
              {
                status: "pip",
                label: "PIP",
                count: statusCounts.pip,
                icon: <FaExclamationCircle className={`text-3xl ${statusFilter === "pip" ? "text-white" : "text-orange-600"}`} />,
                color: "orange-600",
                gradient: "from-orange-600 to-orange-800",
                hoverBg: "hover:bg-orange-50",
                selected: statusFilter === "pip"
              },
              {
                status: "deployed",
                label: "Deployed",
                count: statusCounts.deployed,
                icon: <FaUserCheck className={`text-3xl ${statusFilter === "deployed" ? "text-white" : "text-green-600"}`} />,
                color: "green-600",
                gradient: "from-green-600 to-green-800",
                hoverBg: "hover:bg-green- ills50",
                selected: statusFilter === "deployed"
              }
            ].map(({ status, label, count, icon, color, gradient, hoverBg, selected }) => (
              <div
                key={status}
                onClick={() => setStatusFilter(status === "all" ? "" : status)}
                className={`cursor-pointer p-4 rounded-xl shadow-md transition-all transform hover:scale-105 ${
                  selected
                    ? `bg-gradient-to-r ${gradient} text-white`
                    : `bg-white ${hoverBg}`
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{label}</h3>
                    <p className={`text-2xl font-bold ${selected ? "text-white" : `text-${color}`}`}>
                      {count}
                    </p>
                  </div>
                  {icon}
                </div>
              </div>
            ))}
          </div>

          {/* Compact Filter Section */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-md font-semibold text-gray-700"></h3>
              <div className="flex space-x-2">
                {filterData.technologies.length > 0 ||
                  filterData.categories.length > 0 ||
                  filterData.experience ||
                  filterData.certifications ||
                  filterData.communication ||
                  statusFilter ? (
                  <button
                    onClick={clearFilters}
                    className="px-2 py-1 rounded-md text-xs flex items-center bg-red-100 text-red-800 hover:bg-red-200 transition-all"
                  >
                    <FaTimes className="mr-1" />
                    Clear
                  </button>
                ) : null}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-2 py-1 rounded-md text-xs flex items-center transition-all ${
                    showFilters
                      ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                  }`}
                >
                  <FaFilter className="mr-1" />
                  {showFilters ? "Hide" : "Adv. Filters"}
                </button>
              </div>
            </div>

            {/* Filter Panel - Collapsible */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                showFilters ? "max-h-96 opacity-100 mb-2" : "max-h-0 opacity-0 mb-0"
              }`}
            >
              <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Experience Filter */}
                  <div className="space-y-1">
                    <div className="flex items-center text-purple-600">
                      <FaCalendar className="mr-1 text-xs" />
                      <span className="font-medium text-xs">Experience</span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        name="experience"
                        value={filterData.experience}
                        onChange={handleFilterChange}
                        className="w-full p-1.5 pl-2 pr-6 border border-gray-300 rounded text-xs focus:border-purple-500 focus:ring-1 focus:ring-purple-200"
                        placeholder="0"
                        min="0"
                      />
                      <span className="absolute right-2 top-1.5 text-gray-400 text-xs">yrs</span>
                    </div>
                  </div>

                  {/* Communication Filter */}
                  <div className="space-y-1">
                    <div className="flex items-center text-green-600">
                      <FaComments className="mr-1 text-xs" />
                      <span className="font-medium text-xs">Communication</span>
                    </div>
                    <select
                      name="communication"
                      value={filterData.communication}
                      onChange={handleFilterChange}
                      className="w-full p-1.5 border border-gray-300 rounded text-xs focus:border-green-500 focus:ring-1 focus:ring-green-200"
                    >
                      <option value="">All levels</option>
                      <option value="Average">Average</option>
                      <option value="Medium">Medium</option>
                      <option value="Fluent">Fluent</option>
                    </select>
                  </div>

                  {/* Certification Filter */}
                  <div className="space-y-1">
                    <div className="flex items-center text-blue-600">
                      <FaCogs className="mr-1 text-xs" />
                      <span className="font-medium text-xs">Certifications</span>
                    </div>
                    <input
                      type="text"
                      name="certifications"
                      value={filterData.certifications}
                      onChange={handleFilterChange}
                      className="w-full p-1.5 border border-gray-300 rounded text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                      placeholder="Certifications"
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="md:col-span-3 space-y-1">
                    <div className="flex items-center text-blue-600">
                      <FaCogs className="mr-1 text-xs" />
                      <span className="font-medium text-sm">Filter by selecting category</span>
                    </div>
                    {technologyLoading ? (
                      <div className="text-gray-500 text-sm">Loading categories...</div>
                    ) : categories.length === 0 ? (
                      <div className="text-gray-500 text-sm">No categories available</div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 max-h-[3.5rem] overflow-y-auto">
                        {categories.map((category) => (
                          <label key={category} className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filterData.categories.includes(category)}
                              onChange={() => toggleCategory(category)}
                              className="hidden"
                            />
                            <span
                              className={`px-2 py-1 text-xs rounded-full transition-all ${
                                filterData.categories.includes(category)
                                  ? "bg-blue-100 text-blue-800 border border-blue-500"
                                  : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-50"
                              }`}
                            >
                              {category}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Technology Filter - Dynamic */}
                  <div className="md:col-span-3 space-y-1">
                    <div className="flex items-center text-red-600">
                      <FaCogs className="mr-1 text-xs" />
                      <span className="font-medium text-sm">Filter by selecting technology</span>
                    </div>
                    {technologyLoading ? (
                      <div className="text-gray-500 text-sm">Loading technologies...</div>
                    ) : technologies.length === 0 ? (
                      <div className="text-gray-500 text-sm">No technologies available</div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 max-h-[3.5rem] overflow-y-auto">
                        {technologies.map((tech) => (
                          <label key={tech.publicId} className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filterData.technologies.includes(tech.name)}
                              onChange={() => toggleTechnology(tech.name)}
                              className="hidden"
                            />
                            <span
                              className={`px-2 py-1 text-xs rounded-full transition-all ${
                                filterData.technologies.includes(tech.name)
                                  ? "bg-[#ffc9c9] text-[#9F0712] border border-[#9F0712]"
                                  : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-50"
                              }`}
                            >
                              {tech.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resource List */}
          <ResourceList
            handleBaselineClick={handleBaselineClick}
            handleOpportunitiesClick={handleOpportunitiesClick}
            setStatusFilter={setStatusFilter}
            statusFilter={statusFilter}
          />
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <button
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              onClick={() => setActiveSection("view")}
            >
              <FaArrowLeft className="mr-2" />
              Back to Resources
            </button>
          </div>
          <h2 className="text-3xl font-bold text-blue-800 mb-6">Add New Resource</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information Section */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
            </div>

            {/* Profile Picture Upload */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">Profile Picture</label>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {profilePicPreview ? (
                    <>
                      <img
                        src={profilePicPreview}
                        alt="Profile preview"
                        className="w-20 h-20 rounded-full object-cover border-2 border-blue-200"
                      />
                      <button
                        type="button"
                        onClick={removeProfilePic}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      No Image
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
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg cursor-pointer transition-colors inline-block"
                  >
                    Choose File
                  </label>
                  <span className="ml-2 text-sm text-gray-500">
                    {profilePic ? profilePic.name : "No file chosen"}
                  </span>
                  {errors.profilePic && (
                    <p className="text-red-500 text-sm mt-1">{errors.profilePic}</p>
                  )}
                </div>
              </div>
            </div>

            {renderInput("employeeName", "Employee Name", "text", "Enter employee name")}
            {renderInput("employeeId", "Employee ID", "text", "Enter employee ID")}
            
            {renderSelect("gender", "Gender", [
              { value: "male", label: "Male" },
              { value: "female", label: "Female" }
            ])}
            
            {renderSelect("location", "Location", [
              { value: "Indore_Yash_IT_Park_SC_DC", label: "Indore-YASH IT Park-SC-DC" },
              { value: "Pune_Magarpatta_DC_II", label: "Pune-Magarpatta-DC-II" },
              { value: "Hyderabad_Mindspace_I_DC", label: "Hyderabad-Mindspace I-DC" },
              { value: "Bangalore_Whitefield_DC", label: "Bangalore-Whitefield-DC" },
              { value: "Indore_Crystal_IT_Park_DC_II", label: "Indore-Crystal IT Park-DC-II" },
              { value: "Indore_BTC_CO", label: "Indore-BTC-CO" },
              { value: "Pune_Hinjewadi_III_DC", label: "Pune-Hinjewadi III-DC" }
            ])}
            
            {renderInput("email", "Email", "email", "Enter email")}
            {renderInput("phoneNumber", "Phone Number", "tel", "Enter phone number")}

            {/* Employment Details Section */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-6">Employment Details</h3>
            </div>
            
            {renderInput("joiningDate", "Joining Date", "date", "", true)}
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Designation <span className="text-red-500">*</span>
              </label>
              <Dropdown
                name="designation"
                value={formData.designation}
                options={designations}
                onChange={handleInputChange}
                onBlur={handleBlur}
                setModalField={setModalField}
                error={errors.designation}
              />
              {errors.designation && (
                <p className="text-red-500 text-sm mt-1">{errors.designation}</p>
              )}
            </div>
            
            {renderSelect("employeeType", "Employee Type", [
              { value: "probation", label: "Probation" },
              { value: "permanent", label: "Permanent" },
              { value: "contract", label: "Contract" }
            ])}
            
            {renderSelect("grade", "Grade", ["E1", "E2", "E3", "E4", "E5", "E6", "E7"])}
            
            {renderSelect("status", "Status", [
              { value: "pool", label: "Pool" },
              { value: "deployed", label: "Deployed" },
              { value: "pip", label: "PIP" },
              { value: "hold", label: "Hold" }
            ])}
            
            {renderSelect("businessGroup", "Business Group", [
              { value: "BG4", label: "BG4" },
              { value: "BG5", label: "BG5" },
              { value: "SSG1", label: "SSG1" }
            ])}
            
            {renderSelect("businessUnit", "Business Unit", [
              { value: "BU5", label: "BU5" },
              { value: "BU4", label: "BU4" },
              { value: "SSU1", label: "SSU1" }
            ])}
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Competency <span className="text-red-500">*</span>
              </label>
              <select
                name="competency"
                value={formData.competency}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.competency ? "border-red-500" : "border-gray-200 focus:border-blue-500"
                } ${formData.competency ? "text-black" : "text-gray-500"}`}
                required
              >
                <option value="" disabled>
                  Select competency
                </option>
                {competencies.map((competency) => (
                  <option key={competency.publicId} value={competency.name}>
                    {competency.name}
                  </option>
                ))}
              </select>
              {errors.competency && (
                <p className="text-red-500 text-sm mt-1">{errors.competency}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex justify-center mt-8">
              <button
                type="submit"
                disabled={loading}
                className={`px-16 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                }`}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      )}

      {modalField && (
        <AddOptionModal
          field={modalField}
          options={modalField === "designation" ? designations : []}
          onClose={() => setModalField(null)}
          setToast={setToast}
        />
      )}
    </div>
  );
};

export default ManageResource;