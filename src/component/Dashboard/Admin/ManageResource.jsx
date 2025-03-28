import React, { useState, useRef, useEffect } from 'react';
import { FaPlus, FaArrowLeft, FaFilter, FaTimes, FaCogs, FaCalendar, FaComments, FaChevronDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ResourceList from './ResourceList';
import YRMSLoader from '../../helper/loader';
import AddOptionModal from '../../helper/OptionalModal';

// Custom Dropdown Component
const Dropdown = ({ name, value, options, onChange, onAddOption, setModalField }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (option) => {
    if (option === "add-new") {
      setModalField(name);
    } else {
      onChange({ target: { name, value: option } });
    }
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-3 pr-10 border-2 border-gray-200 rounded-lg text-left focus:outline-none focus:border-blue-500 transition-colors ${value ? 'text-black' : 'text-gray-500'}`}
      >
        <span>{value || `Select ${name}`}</span>
        <svg
          className={`w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {option}
            </div>
          ))}
          <div
            onClick={() => handleSelect("add-new")}
            className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 cursor-pointer text-sm font-medium border-t border-gray-200 flex items-center justify-between"
          >
            <span>Add New {name}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

const ManageResource = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('view');
  const [showFilters, setShowFilters] = useState(false);
  const [modalField, setModalField] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [techDropdownOpen, setTechDropdownOpen] = useState(false);
  const techDropdownRef = useRef(null);
  
  // Technology categories for the dropdown
  const techCategories = {
    'Frontend': ['React', 'Angular', 'Vue', 'JavaScript', 'TypeScript'],
    'Backend': ['Node.js', 'Python', 'Java', 'C#', 'Go', 'Ruby'],
    'Cloud/DevOps': ['AWS', 'Azure', 'Docker', 'Kubernetes', 'CI/CD'],
    'Mobile': ['React Native', 'Flutter', 'Swift', 'Kotlin'],
    'Database': ['SQL', 'MongoDB', 'PostgreSQL', 'Redis']
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (techDropdownRef.current && !techDropdownRef.current.contains(event.target)) {
        setTechDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [dropdownOptions, setDropdownOptions] = useState({
    designations: ['Software Engineer', 'Backend Developer', 'Project Manager'],
    competencies: ['Python', 'Java', 'Data Science']
  });

  const [formData, setFormData] = useState({
    employeeName: '',
    gender: '',
    location: '',
    email: '',
    phoneNumber: '',
    joiningDate: '',
    designation: '',
    employeeType: '',
    grade: '',
    businessGroup: '',
    businessUnit: '',
    competency: '',
    status: 'pool'
  });

  const [filterData, setFilterData] = useState({
    technologies: [],
    totalExperience: '',
    certifications: '',
    communication: ''
  });

  const [resources, setResources] = useState([
    {
      employeeName: 'John Doe',
      address: '123 Main Street, Springfield',
      email: 'john.doe@example.com',
      phoneNumber: '123-456-7890',
      joiningDate: '2025-03-20',
      jobTitle: 'Software Engineer',
      employeeType: 'permanent',
      grade: 'E3',
      businessGroup: 'Technology Solutions',
      businessUnit: 'Development Team',
      competency: 'Python',
      status: 'pool',
      technologies: ['Python'],
      totalExperience: 5,
      certifications: 'AWS Certified',
      communication: 'Fluent'
    },
    {
      employeeName: 'Jane Smith',
      address: '456 Elm Street, Springfield',
      email: 'jane.smith@example.com',
      phoneNumber: '234-567-8901',
      joiningDate: '2025-04-15',
      jobTitle: 'Backend Developer',
      employeeType: 'temporary',
      grade: 'E2',
      businessGroup: 'Technology Solutions',
      businessUnit: 'Development Team',
      competency: 'Java',
      status: 'deployed',
      technologies: ['Java'],
      totalExperience: 3,
      certifications: 'Oracle Certified',
      communication: 'Medium'
    },
    {
      employeeName: 'Alice Johnson',
      address: '789 Oak Street, Springfield',
      email: 'alice.johnson@example.com',
      phoneNumber: '345-678-9012',
      joiningDate: '2025-05-10',
      jobTitle: 'Project Manager',
      employeeType: 'permanent',
      grade: 'E5',
      businessGroup: 'Technology Solutions',
      businessUnit: 'Management Team',
      competency: 'Data Science',
      status: 'pip',
      technologies: ['Data Science'],
      totalExperience: 8,
      certifications: 'PMP Certified',
      communication: 'Average'
    },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleTechnology = (tech) => {
    setFilterData(prev => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter(t => t !== tech)
        : [...prev.technologies, tech]
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterData(prev => ({ ...prev, [name]: value })); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('resource data', formData);
    setActiveSection('view');
    setFormData({
      employeeName: '',
      gender: '',
      location: '',
      email: '',
      phoneNumber: '',
      joiningDate: '',
      designation: '',
      employeeType: '',
      grade: '',
      businessGroup: '',
      businessUnit: '',
      competency: '',
      status: 'pool'
    });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    // Add your API call here
  };

  const handleAddOption = (field, newOption) => {
    if (newOption.trim() && !dropdownOptions[field].includes(newOption.trim())) {
      setDropdownOptions(prev => ({
        ...prev,
        [field]: [...prev[field], newOption.trim()]
      }));
    }
    setModalField(null);
  };

  const handleDeleteOption = (field, option) => {
    setDropdownOptions(prev => ({
      ...prev,
      [field]: prev[field].filter(opt => opt !== option)
    }));
  };

  useEffect(() => {
    const fetchResources = async () => {
      console.log('Fetching resources', resources);
    };

    const fetchRoles = async () => {
      console.log('Fetching roles');
    };

    const fetchCompetencies = async () => {
      console.log('Fetching competencies');
    };

    fetchResources();
    fetchRoles();
    fetchCompetencies();
  }, [activeSection]);

  const handleBaselineClick = (resource) => {
    navigate('/manage-baseline', { state: { resource } });
  };

  const handleOpportunitiesClick = (resource) => {
    navigate('/opportunities', { state: { resource } });
  };

  const clearFilters = () => {
    setFilterData({
      technologies: [],
      totalExperience: '',
      certifications: '',
      communication: ''
    });
    setShowFilters(false); // Close the filters section
  };

  const handleAddResourceClick = () => {
    setShowLoader(true);
    setTimeout(() => {
      setShowLoader(false);
      setActiveSection('add');
    }, 3000);
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg">
      {showLoader && <YRMSLoader />}
      {activeSection !== 'add' ? (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-bold text-blue-800">Resource Details</h2>
            <button
              className="px-4 py-2 rounded-lg font-semibold text-sm flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              onClick={handleAddResourceClick}
            >
              <FaPlus className="mr-2" />
              Add Resource
            </button>
          </div>

          {/* Compact Filter Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Filter Resources</h3>
              <div className="flex space-x-2">
                {filterData.technologies.length > 0 || 
                 filterData.totalExperience || 
                 filterData.communication ? (
                  <button
                    onClick={clearFilters}
                    className="px-3 py-1.5 rounded-lg text-sm flex items-center bg-red-100 text-red-800 hover:bg-red-200 transition-all"
                  >
                    <FaTimes className="mr-1" />
                    Clear All
                  </button>
                ) : null}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-3 py-1.5 rounded-lg text-sm flex items-center transition-all ${
                    showFilters 
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                  }`}
                >
                  <FaFilter className="mr-1" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
              </div>
            </div>

            {/* Filter Panel - Collapsible */}
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
              showFilters ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0 mb-0'
            }`}>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 relative">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Technology Filter - Updated */}
                  <div className="relative" ref={techDropdownRef}>
                    <div className="flex items-center text-blue-600 mb-2">
                      <FaCogs className="mr-2 text-sm" />
                      <span className="font-medium text-sm">Technologies</span>
                    </div>
                    <div 
                      onClick={() => setTechDropdownOpen(!techDropdownOpen)}
                      className={`w-full min-h-10 p-2 border ${techDropdownOpen ? 'border-blue-500' : 'border-gray-300'} rounded-md bg-white text-sm cursor-pointer hover:border-blue-500 transition-colors flex flex-wrap gap-1 relative z-10`}
                    >
                      {filterData.technologies.length > 0 ? (
                        filterData.technologies.map(tech => (
                          <span 
                            key={tech} 
                            className="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {tech}
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTechnology(tech);
                              }}
                              className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none cursor-pointer"
                            >
                              ×
                            </button>
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 self-center">Select technologies</span>
                      )}
                      <FaChevronDown 
                        className={`ml-auto self-center text-xs transition-transform ${
                          techDropdownOpen ? 'transform rotate-180' : ''
                        }`}
                      />
                    </div>
                    
                    {techDropdownOpen && (
                      <div className="relative z-10 mt-1 left-0 right-0 min-w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
                        style={{
                          width: 'max-content',
                          minWidth: '100%'
                        }}
                      >
                        <div className="p-2 space-y-2">
                          {Object.entries(techCategories).map(([category, techs]) => (
                            <div key={category}>
                              <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 rounded">
                                {category}
                              </div>
                              <div className="grid grid-cols-2 gap-1 mt-1">
                                {techs.map(tech => (
                                  <label 
                                    key={tech} 
                                    className="flex items-center px-2 py-1 hover:bg-blue-50 rounded cursor-pointer whitespace-nowrap"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={filterData.technologies.includes(tech)}
                                      onChange={() => toggleTechnology(tech)}
                                      className="h-4 w-4 text-blue-600 rounded border-gray-300 mr-2 focus:ring-blue-500"
                                    />
                                    <span className="text-sm">{tech}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Experience Filter */}
                  <div>
                    <div className="flex items-center text-purple-600 mb-2">
                      <FaCalendar className="mr-2 text-sm" />
                      <span className="font-medium text-sm">Experience (years)</span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        name="totalExperience"
                        value={filterData.totalExperience}
                        onChange={handleFilterChange}
                        className="w-full p-2 pl-3 pr-8 border border-gray-300 rounded-md text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-200"
                        placeholder="0"
                        min="0"
                      />
                      <span className="absolute right-3 top-2.5 text-gray-400 text-sm">yrs</span>
                    </div>
                  </div>

                  {/* Communication Filter */}
                  <div>
                    <div className="flex items-center text-green-600 mb-2">
                      <FaComments className="mr-2 text-sm" />
                      <span className="font-medium text-sm">Communication</span>
                    </div>
                    <select
                      name="communication"
                      value={filterData.communication}
                      onChange={handleFilterChange}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:border-green-500 focus:ring-1 focus:ring-green-200"
                    >
                      <option value="">All levels</option>
                      <option value="Fluent">Fluent</option>
                      <option value="Medium">Medium</option>
                      <option value="Average">Average</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resource List */}
          {resources.length > 0 ? (
            <ResourceList
              resources={resources}
              handleBaselineClick={handleBaselineClick}
              handleOpportunitiesClick={handleOpportunitiesClick}
              filterData={filterData}
            />
          ) : (
            <div className="text-center text-gray-600 py-10">
              <p className="text-xl">No resource details available yet.</p>
              <p className="mt-2 text-lg">Click "Add Resource" to create a new resource entry.</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <button
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              onClick={() => setActiveSection('view')}
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
              <label className="block text-gray-700 font-medium mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={`w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${formData.gender ? 'text-black' : 'text-gray-500'}`}
                required
              >
                <option value="" disabled className="text-gray-400">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter location"
                required
              />
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
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Designation</label>
              <Dropdown
                name="designation"
                value={formData.designation}
                options={dropdownOptions.designations}
                onChange={handleInputChange}
                onAddOption={handleAddOption}
                setModalField={setModalField}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Employee Type</label>
              <select
                name="employeeType"
                value={formData.employeeType || ''}
                onChange={handleInputChange}
                className={`w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${formData.employeeType ? 'text-black' : 'text-gray-500'}`}
                required
              >
                <option value="" disabled className="text-gray-400">Select type</option>
                <option value="provision">Provision</option>
                <option value="permanent">Permanent</option>
                <option value="contract">Contract</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Grade</label>
              <select
                name="grade"
                value={formData.grade || ''}
                onChange={handleInputChange}
                className={`w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${formData.grade ? 'text-black' : 'text-gray-500'}`}
                required
              >
                <option value="" disabled className="text-gray-400">Select grade</option>
                {['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7'].map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={`w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${formData.status ? 'text-black' : 'text-gray-500'}`}
                required
              >
                <option value="pool" className="text-gray-400">Pool</option>
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
                className={`w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${formData.businessGroup ? 'text-black' : 'text-gray-500'}`}
                required
              >
                <option value="" disabled className="text-gray-400">Select business group</option>
                <option value="Technology Solutions">Technology Solutions</option>
                <option value="Management Team">Management Team</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Business Unit</label>
              <select
                name="businessUnit"
                value={formData.businessUnit}
                onChange={handleInputChange}
                className={`w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${formData.businessUnit ? 'text-black' : 'text-gray-500'}`}
                required
              >
                <option value="" disabled className="text-gray-400">Select business unit</option>
                <option value="Development Team">Development Team</option>
                <option value="Management Team">Management Team</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Competency</label>
              <Dropdown
                name="competency"
                value={formData.competency}
                options={dropdownOptions.competencies}
                onChange={handleInputChange}
                onAddOption={handleAddOption}
                setModalField={setModalField}
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex justify-center mt-8">
              <button
                type="submit"
                className="px-16 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}

      {modalField && (
        <AddOptionModal
          field={modalField === 'designation' ? 'designations' : 'competencies'}
          options={dropdownOptions[modalField === 'designation' ? 'designations' : 'competencies']}
          onAddOption={handleAddOption}
          onDeleteOption={handleDeleteOption}
          onClose={() => setModalField(null)}
        />
      )}
    </div>
  );
};

export default ManageResource;