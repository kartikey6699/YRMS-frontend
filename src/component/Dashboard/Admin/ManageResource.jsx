import React, { useEffect, useState } from "react";
import { FaPlus, FaArrowLeft, FaFilter, FaTimes, FaCogs, FaCalendar, FaComments } from "react-icons/fa";
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
    status: "",
  });

  const [filterData, setFilterData] = useState({
    technologies: [],
    categories: [],
    experience: "",
    certifications: "",
    communication: "",
  });

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

  console.log(categories  , '....');
  console.log(technologies  , '>>>');


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
    dispatch(fetchDesignations());
    dispatch(fetchCompetencies());
    dispatch(fetchTechnologies());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
    setShowFilters(false);
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
      });
      setProfilePic(null);
      setProfilePicPreview(null);
      setActiveSection("view");
      setToast(null);
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

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg">
      {loading && <YRMSLoader />}
      {toast}
      {activeSection !== "add" ? (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-bold text-blue-800">Resource Details</h2>
            <button
              className="px-4 py-2 rounded-lg font-semibold text-sm flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              onClick={() => setActiveSection("add")}
            >
              <FaPlus className="mr-2" />
              Add Resource
            </button>
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
                  filterData.communication ? (
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
              <label className="block text-gray-700 font-medium mb-2">Profile Picture </label>
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
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Employee Name</label>
              <input
                type="text"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter employee name"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Employee Id</label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter employee ID"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={`w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${
                  formData.gender ? "text-black" : "text-gray-500"
                }`}
                required
              >
                <option value="" disabled>
                  Select gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Location</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${
                  formData.location ? "text-black" : "text-gray-500"
                }`}
                required
              >
                <option value="Indore_Yash_IT_Park_SC_DC">Indore-YASH IT Park-SC-DC</option>
                <option value="Pune_Magarpatta_DC_II">Pune-Magarpatta-DC-II</option>
                <option value="Hyderabad_Mindspace_I_DC">Hyderabad-Mindspace I-DC</option>
                <option value="Bangalore_Whitefield_DC">Bangalore-Whitefield-DC</option>
                <option value="Indore_Crystal_IT_Park_DC_II">Indore-Crystal IT Park-DC-II</option>
                <option value="Indore_BTC_CO">Indore-BTC-CO</option>
                <option value="Pune_Hinjewadi_III_DC">Pune-Hinjewadi III-DC</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter email"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter phone number"
                required
              />
            </div>

            {/* Employment Details Section */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-6">Employment Details</h3>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Joining Date</label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                required
                onClick={(e) => e.target.showPicker()}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Designation</label>
              <Dropdown
                name="designation"
                value={formData.designation}
                options={designations}
                onChange={(e) => {
                  console.log("Designation selected:", e.target.value);
                  handleInputChange(e);
                }}
                setModalField={setModalField}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Employee Type</label>
              <select
                name="employeeType"
                value={formData.employeeType}
                onChange={handleInputChange}
                className={`w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${
                  formData.employeeType ? "text-black" : "text-gray-500"
                }`}
                required
              >
                <option value="" disabled>
                  Select type
                </option>
                <option value="probation">Probation</option>
                <option value="permanent">Permanent</option>
                <option value="contract">Contract</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Grade</label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className={`w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${
                  formData.grade ? "text-black" : "text-gray-500"
                }`}
                required
              >
                <option value="" disabled>
                  Select grade
                </option>
                {["E1", "E2", "E3", "E4", "E5", "E6", "E7"].map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={`w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${
                  formData.status ? "text-black" : "text-gray-500"
                }`}
              >
                <option value="" disabled>Select status</option>
                <option value="pool">Pool</option>
                <option value="deployed">Deployed</option>
                <option value="pip">PIP</option>
                <option value="hold">Hold</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Business Group</label>
              <select
                name="businessGroup"
                value={formData.businessGroup}
                onChange={handleInputChange}
                className={`w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${
                  formData.businessGroup ? "text-black" : "text-gray-500"
                }`}
                required
              >
                <option value="" disabled>
                  Select business group
                </option>
                <option value="BG4">BG4</option>
                <option value="BG5">BG5</option>
                <option value="SSG1">SSG1</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Business Unit</label>
              <select
                name="businessUnit"
                value={formData.businessUnit}
                onChange={handleInputChange}
                className={`w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${
                  formData.businessUnit ? "text-black" : "text-gray-500"
                }`}
                required
              >
                <option value="" disabled>
                  Select business unit
                </option>
                <option value="BU5">BU5</option>
                <option value="BU4">BU4</option>
                <option value="SSU1">SSU1</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Competency</label>
              <Dropdown
                name="competency"
                value={formData.competency}
                options={competencies}
                onChange={handleInputChange}
                setModalField={setModalField}
              />
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
          options={modalField === "designation" ? designations : competencies}
          onClose={() => setModalField(null)}
          setToast={setToast}
        />
      )}
    </div>
  );
};

export default ManageResource;