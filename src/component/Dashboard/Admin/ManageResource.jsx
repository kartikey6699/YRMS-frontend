import React, { useEffect, useState } from 'react';
import { FaPlus, FaArrowLeft, FaFilter, FaTimes, FaCogs, FaCalendar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ResourceList from './ResourceList';

const ManageResource = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('view');
  const [roles, setRoles] = useState([]);
  const [competencies, setCompetencies] = useState([]);
  const [showFilterForm, setShowFilterForm] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: '',
    address: '',
    email: '',
    phoneNumber: '',
    joiningDate: '',
    jobTitle: '',
    employeeType: '',
    grade: '',
    businessGroup: '',
    businessUnit: '',
    competency: '',
    status: 'pool',
    technologies: [],
    totalExperience: 0
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
    // ... other sample resources ...
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
      address: '',
      email: '',
      phoneNumber: '',
      joiningDate: '',
      jobTitle: '',
      employeeType: '',
      grade: '',
      businessGroup: '',
      businessUnit: '',
      competency: '',
      status: 'pool',
      technologies: [],
      totalExperience: 0
    });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setShowFilterForm(false);
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

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg">
      {activeSection !== 'add' && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-bold text-blue-800">Resource Details</h2>
            <button
              className="px-6 py-3 rounded-lg font-semibold text-lg flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              onClick={() => setActiveSection('add')}
            >
              <FaPlus className="mr-2" />
              Add Resource
            </button>
          </div>
          <div className="flex justify-end">
            <button
              className="px-4 py-2 my-4 rounded-lg font-semibold text-sm flex items-center bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all"
              onClick={() => setShowFilterForm(true)}
            >
              <FaFilter className="mr-2" />
              Add Filter
            </button>
          </div>
        </div>
      )}

      {showFilterForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100 hover:scale-105">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <FaFilter className="mr-2 text-blue-600" /> Filter Resources
              </h3>
              <button onClick={() => setShowFilterForm(false)} className="text-gray-500 hover:text-gray-700 text-xl">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleFilterSubmit}>
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-3 flex items-center">
                  <FaCogs className="mr-2 text-blue-500" /> Technologies
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['React', 'Node.js', 'Python', 'JavaScript', 'Kotlin', 'Android', 'AWS', 'Docker', 'SQL', 'Figma'].map(tech => (
                    <div key={tech} className="flex items-center bg-gray-100 p-2 rounded-lg">
                      <input
                        type="checkbox"
                        name="technologies"
                        value={tech}
                        checked={filterData.technologies.includes(tech)}
                        onChange={handleFilterChange}
                        className="mr-2 accent-blue-600"
                      />
                      <label className="text-sm text-gray-700">{tech}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2 flex items-center">
                  <FaCalendar className="mr-2 text-blue-500" /> Total Experience (years)
                </label>
                <input
                  type="number"
                  name="totalExperience"
                  value={filterData.totalExperience}
                  onChange={handleFilterChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter minimum years"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowFilterForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
                >
                  <FaTimes className="mr-2" /> Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center"
                >
                  <FaFilter className="mr-2" /> Apply Filter
                </button>
              </div>
            </form>
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
            <div className="md:col-span-2">
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
            <div>
              <label className="block text-gray-700 font-medium mb-2">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none"
                placeholder="Enter address"
                rows="3"
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
              <label className="block text-gray-700 font-medium mb-2">Job Title</label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter job title"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Employee Type</label>
              <select
                name="employeeType"
                value={formData.employeeType || ''}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                required
              >
                <option value="" disabled>Select type</option>
                <option value="provision">Provision</option>
                <option value="permanent">Permanent</option>
                <option value="temporary">Temporary</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Grade</label>
              <select
                name="grade"
                value={formData.grade || ''}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                required
              >
                <option value="" disabled>Select grade</option>
                {['E1', 'E2', 'E3', 'E4', 'E5'].map(grade => (
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
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                required
              >
                <option value="pool">Pool</option>
                <option value="deployed">Deployed</option>
                <option value="pip">PIP</option>
                <option value="hold">Hold</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Business Group</label>
              <input
                type="text"
                name="businessGroup"
                value={formData.businessGroup}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter business group"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Business Unit</label>
              <input
                type="text"
                name="businessUnit"
                value={formData.businessUnit}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter business unit"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Competency</label>
              <select
                name="competency"
                value={formData.competency}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="" disabled>Select a competency</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="Data Science">Data Science</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex justify-center mt-8">
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
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