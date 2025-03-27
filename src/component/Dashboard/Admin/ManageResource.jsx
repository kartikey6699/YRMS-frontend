import React, { useEffect, useState } from 'react';
import { FaPlus, FaArrowLeft, FaFilter, FaTimes, FaCogs, FaCalendar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ResourceList from './ResourceList';
import YRMSLoader from '../../helper/loader';

const AddOptionModal = ({ field, options, onAddOption, onClose }) => {
  const [newOption, setNewOption] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newOption.trim()) {
      onAddOption(newOption.trim());
      setNewOption('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h3 className="text-lg font-semibold mb-4">
          Add New {field.charAt(0).toUpperCase() + field.slice(1)}
        </h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
            placeholder={`Enter new ${field} name`}
            autoFocus
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ManageResource = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('view');
  const [showFilters, setShowFilters] = useState(false);

  const [modalField, setModalField] = useState(null);

  const [showLoader, setShowLoader] = useState(false);
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
    totalExperience: ''
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
      totalExperience: 5
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
      totalExperience: 3
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
      totalExperience: 8
    },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFilterData(prev => ({
        ...prev,
        technologies: checked
          ? [...prev.technologies, value]
          : prev.technologies.filter(tech => tech !== value)
      }));
    } else {
      setFilterData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('resouce data' ,formData)
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
      totalExperience: ''
    });
    // Keep filters section open after clearing
    setShowFilters(true);
  };

  const clearAndCloseFilters = () => {
    setFilterData({
      technologies: [],
      totalExperience: ''
    });
    setShowFilters(false); // Close the filters section
  };

  const handleAddResourceClick = () => {
    setShowLoader(true);
    setTimeout(() => {
      setShowLoader(false);
      setActiveSection('add');
    }, 3000); // Show loader for 3 seconds
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg">
      {showLoader && <YRMSLoader />} {/* Show loader when showLoader is true */}
      {activeSection !== 'add' && (
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
        </div>
      )}

      {activeSection === 'add' ? (
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
              <select
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                className={`w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${formData.designation ? 'text-black' : 'text-gray-500'}`}
                required
              >
                <option value="" disabled className="text-gray-400">Select designation</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Project Manager">Project Manager</option>
              </select>
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
              <select
                name="competency"
                value={formData.competency}
                onChange={handleInputChange}
                className={`w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${formData.competency ? 'text-black' : 'text-gray-500'}`}
              >
                <option value="" disabled className="text-gray-400">Select a competency</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="Data Science">Data Science</option>
              </select>
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
      ) : (
        <div>
          <div className="flex justify-end mb-2">
            <button
              className={`px-3 py-1.5 rounded-lg text-sm flex items-center transition-all ${showFilters ? 'bg-red-100 text-red-800 hover:bg-red-200' : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'}`}
              onClick={showFilters ? clearAndCloseFilters : () => setShowFilters(true)}
            >
              {showFilters ? (
                <>
                  <FaTimes className="mr-1" />
                  Remove Filters
                </>
              ) : (
                <>
                  <FaFilter className="mr-1" />
                  Filters
                </>
              )}
            </button>
          </div>

          {/* Filters Section with Transition */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-40 opacity-100 mb-3' : 'max-h-0 opacity-0 mb-0'}`}>
            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center">
                  <FaCogs className="mr-2 text-blue-500 text-sm" />
                  <div className="flex flex-wrap gap-1">
                    {['React', 'Node', 'Python', 'JS', 'Kotlin', 'Android', 'AWS', 'Docker', 'SQL', 'Figma'].map(tech => (
                      <label key={tech} className="flex items-center text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          name="technologies"
                          value={tech}
                          checked={filterData.technologies.includes(tech)}
                          onChange={handleFilterChange}
                          className="mr-1 accent-blue-600"
                        />
                        {tech}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center">
                  <FaCalendar className="mr-2 text-blue-500 text-sm" />
                  <div className="flex items-center">
                    <span className="text-xs mr-2">Exp ≥</span>
                    <input
                      type="number"
                      name="totalExperience"
                      value={filterData.totalExperience}
                      onChange={handleFilterChange}
                      className="w-16 p-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="Years"
                    />
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
      )}
    </div>
  );
};

export default ManageResource;