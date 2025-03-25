import React, { useEffect, useState } from 'react';
import { FaChartLine, FaLightbulb, FaPlus, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ManageResource = () => {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('view');
  const [roles, setRoles] = useState([]);
  const [competencies, setCompetencies] = useState([]);
  const [formData, setFormData] = useState({
    employeeName: '',
    email: '',
    phoneNumber: '',
    address: '',
    joiningDate: '',
    employeeId: '',
    jobTitle: '',
    businessGroup: '',
    businessUnit: '',
    role: '',
    competency: '',
  });
  const [resources, setResources] = useState([
    {
      employeeName: 'John Doe',
      email: 'john.doe@example.com',
      phoneNumber: '+91-9876543210',
      address: '123 Main Street, Springfield',
      joiningDate: '2025-03-20',
      employeeId: 'EMP123456',
      jobTitle: 'Software Engineer',
      businessGroup: 'Technology Solutions',
      businessUnit: 'Development Team',
      role: 'Frontend Developer',
      competency: 'Advanced',
    },
    {
      employeeName: 'Jane Smith',
      email: 'jane.smith@example.com',
      phoneNumber: '+91-9876543211',
      address: '456 Elm Street, Springfield',
      joiningDate: '2025-04-15',
      employeeId: 'EMP123457',
      jobTitle: 'Backend Developer',
      businessGroup: 'Technology Solutions',
      businessUnit: 'Development Team',
      role: 'Backend Developer',
      competency: 'Intermediate',
    },
    {
      employeeName: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      phoneNumber: '+91-9876543212',
      address: '789 Oak Street, Springfield',
      joiningDate: '2025-05-10',
      employeeId: 'EMP123458',
      jobTitle: 'Project Manager',
      businessGroup: 'Technology Solutions',
      businessUnit: 'Management Team',
      role: 'Project Manager',
      competency: 'Expert',
    },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Handle form submission
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
        <div className="flex justify-between mb-6">
          <button
            className={`px-6 py-3 rounded-lg font-semibold text-lg flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 ml-auto ${
              activeSection === 'add'
                ? ''
                : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => setActiveSection('add')}
          >
            <FaPlus className="mr-2" />
            Add Resource
          </button>
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
                placeholder="Enter email address"
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
              <label className="block text-gray-700 font-medium mb-2">Employee ID</label>
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
              <label className="block text-gray-700 font-medium mb-2">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                required
              >
                <option value="" disabled>Select a role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
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
                {competencies.map((competency) => (
                  <option key={competency.id} value={competency.id}>
                    {competency.name}
                  </option>
                ))}
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
          <h2 className="text-3xl font-bold text-blue-800 mb-6">Resource Details</h2>
          {resources.length > 0 ? (
            <div className="overflow-x-auto rounded-lg shadow-lg">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <th className="p-3 text-left font-medium text-sm border-r border-purple-500">Employee ID</th>
                    <th className="p-3 text-left font-medium text-sm border-r border-purple-500">Employee Name</th>
                    <th className="p-3 text-left font-medium text-sm border-r border-purple-500">Joining Date</th>
                    <th className="p-3 text-left font-medium text-sm border-r border-purple-500">Job Title</th>
                    <th className="p-3 text-left font-medium text-sm border-r border-purple-500">Email</th>
                    <th className="p-3 text-left font-medium text-sm border-r border-purple-500">Phone Number</th>
                    <th className="p-3 text-left font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {resources.map((resource, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      } hover:bg-gray-100 transition-colors`}
                    >
                      <td className="p-3 text-gray-700 text-sm border-r border-gray-200">{resource.employeeId}</td>
                      <td className="p-3 text-gray-700 text-sm border-r border-gray-200">{resource.employeeName}</td>
                      <td className="p-3 text-gray-700 text-sm border-r border-gray-200">
                        {new Date(resource.joiningDate).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-gray-700 text-sm border-r border-gray-200">{resource.jobTitle}</td>
                      <td className="p-3 text-gray-700 text-sm border-r border-gray-200">{resource.email}</td>
                      <td className="p-3 text-gray-700 text-sm border-r border-gray-200">{resource.phoneNumber}</td>
                      <td className="p-3 text-gray-700 text-sm">
                        <div className="flex space-x-3">
                          <button
                            className="flex items-center justify-center w-10 h-10 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors relative group"
                            onClick={() => handleBaselineClick(resource)}
                          >
                            <FaChartLine />
                            <span className="absolute bottom-full mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                              Baseline
                            </span>
                          </button>
                          <button
                            className="flex items-center justify-center w-10 h-10 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors relative group"
                            onClick={() => handleOpportunitiesClick(resource)}
                          >
                            <FaLightbulb />
                            <span className="absolute bottom-full mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                              Opportunities
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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