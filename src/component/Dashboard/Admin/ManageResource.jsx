import React, { useState, useRef, useEffect } from 'react';
import { FaPlus, FaArrowLeft, FaFilter, FaTimes, FaCogs, FaCalendar, FaComments } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ResourceList from './ResourceList';
import YRMSLoader from '../../helper/loader';
import AddOptionModal from '../../helper/OptionalModal';

const ManageResource = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('view');
  const [showFilters, setShowFilters] = useState(false);
  const [modalField, setModalField] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  
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

  const clearFilters = () => {
    setFilterData({
      technologies: [],
      totalExperience: '',
      certifications: '',
      communication: ''
    });
    setShowFilters(false); // Close the filters section
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
              onClick={() => setActiveSection('add')}
            >
              <FaPlus className="mr-2" />
              Add Resource
            </button>
          </div>

          {/* Compact Filter Section */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-md font-semibold text-gray-700">Filter Resources</h3>
              <div className="flex space-x-2">
                {filterData.technologies.length > 0 || 
                 filterData.totalExperience || 
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
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                  }`}
                >
                  <FaFilter className="mr-1" />
                  {showFilters ? 'Hide' : 'Filters'}
                </button>
              </div>
            </div>

            {/* Filter Panel - Collapsible */}
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
              showFilters ? 'max-h-80 opacity-100 mb-2' : 'max-h-0 opacity-0 mb-0'
            }`}>
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
                        name="totalExperience"
                        value={filterData.totalExperience}
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
                      <option value="Fluent">Fluent</option>
                      <option value="Medium">Medium</option>
                      <option value="Average">Average</option>
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

                  {/* Technology Filter - Compact */}
                  <div className="md:col-span-3 space-y-1">
                    <div className="flex items-center text-blue-600">
                      <FaCogs className="mr-1 text-xs" />
                      <span className="font-medium text-xs">Technologies</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-[3.5rem] overflow-y-auto">
                      {['React', 'Angular', 'Vue', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Java', 'C#', 'Go', 'Ruby', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'CI/CD', 'React Native', 'Flutter', 'Swift', 'Kotlin', 'SQL', 'MongoDB', 'PostgreSQL', 'Redis', 'GraphQL', 'Rust', 'Scala', 'Elixir', 'Clojure', 'PHP', 'Perl', 'Shell', 'HTML', 'CSS', 'Spring Boot', 'Django', 'Laravel', 'Express.js', 'ASP.NET', 'TensorFlow', 'PyTorch', 'Hadoop', 'Spark', 'Jenkins', 'Terraform', 'Ansible', 'Unity', 'Unreal Engine', 'WebGL'].map(tech => (
                        <label key={tech} className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filterData.technologies.includes(tech)}
                            onChange={() => toggleTechnology(tech)}
                            className="hidden"
                          />
                          <span className={`px-2 py-1 text-xs rounded-full transition-all ${
                            filterData.technologies.includes(tech)
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-50'
                          }`}>
                            {tech}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resource List */}
          {resources.length > 0 ? (
            <ResourceList
              resources={resources}
              handleBaselineClick={() => {}}
              handleOpportunitiesClick={() => {}}
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