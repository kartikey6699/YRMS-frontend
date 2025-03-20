import React, { useEffect, useState } from 'react';

const ManageResource = () => {

  const [activeSection, setActiveSection] = useState('view');
  const [roles, setRoles] = useState([]);
  const [competencies, setCompetencies] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
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
  const [resources, setResources] = useState([{
    firstName: 'John',
    lastName: 'Doe',
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
    firstName: 'John',
    lastName: 'Doe',
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
    firstName: 'John',
    lastName: 'Doe',
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
  }]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  // Fetch roles, competencies, and statuses from APIs
  useEffect(() => {
    const fetchResources = async () => {
      console.log('Fetching resources', resources);
      // try {
      //   const response = await fetch("API_ENDPOINT_URL"); // Replace with your API endpoint
      //   if (!response.ok) {
      //     throw new Error("Failed to fetch data");
      //   }
      //   const data = await response.json();
      //   setResources(data);
      // } catch (err) {
      //   console.error("Error fetching resources:", err);
      // }
    };

    const fetchRoles = async () => {
      console.log('Fetching roles');
      // try {
      //   const response = await fetch("https://your-api-endpoint.com/roles");
      //   const data = await response.json();
      //   setRoles(data);
      // } catch (error) {
      //   console.error("Error fetching roles:", error);
      // }
    };

    const fetchCompetencies = async () => {
      console.log('Fetching competencies');
      // try {
      //   const response = await fetch("https://your-api-endpoint.com/competencies");
      //   const data = await response.json();
      //   setCompetencies(data);
      // } catch (error) {
      //   console.error("Error fetching competencies:", error);
      // }
    };

    const fetchStatuses = async () => {
      console.log('Fetching statuses');
      // try {
      //   const response = await fetch("https://your-api-endpoint.com/statuses");
      //   const data = await response.json();
      //   setStatuses(data);
      // } catch (error) {
      //   console.error("Error fetching statuses:", error);
      // }
    };

    fetchResources();
    fetchRoles();
    fetchCompetencies();
    fetchStatuses();
  }, [activeSection]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <div className="flex justify-between mb-6">
        <button
          className={`px-4 py-2 rounded-lg font-semibold ${activeSection === 'view' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'} hover:bg-blue-700 hover:text-white transition-colors`}
          onClick={() => setActiveSection('view')}
        >
          View Resource Details
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold ${activeSection === 'add' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'} hover:bg-blue-700 hover:text-white transition-colors`}
          onClick={() => setActiveSection('add')}
        >
          Add Resource
        </button>
      </div>

      {activeSection === 'add' ? (
        <div>
          <h2 className="text-2xl font-semibold text-blue-700 mb-6">Add New Resource</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Personal Information Section */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Personal Information</h3>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter first name"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter last name"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter email address"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter phone number"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-1">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter full address"
                rows="3"
              />
            </div>

            {/* Employment Details Section */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-700 mb-2 mt-4">Employment Details</h3>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Joining Date</label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Employee ID</label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter employee ID"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Job Title</label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter job title"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Business Group</label>
              <input
                type="text"
                name="businessGroup"
                value={formData.businessGroup}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter business group"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Business Unit</label>
              <input
                type="text"
                name="businessUnit"
                value={formData.businessUnit}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter business unit"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
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
              <label className="block text-gray-700 font-medium mb-1">Competency</label>
              <select
                name="competency"
                value={formData.competency}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
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
            <div className="md:col-span-2 flex justify-center mt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold text-blue-700 mb-6">Resource Details</h2>
          {resources.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="p-3 text-left font-semibold">First Name</th>
                    <th className="p-3 text-left font-semibold">Last Name</th>
                    <th className="p-3 text-left font-semibold">Email</th>
                    <th className="p-3 text-left font-semibold">Phone Number</th>
                    <th className="p-3 text-left font-semibold">Job Title</th>
                    <th className="p-3 text-left font-semibold">Joining Date</th>
                    <th className="p-3 text-left font-semibold">Employee ID</th>
                  </tr>
                </thead>
                <tbody>
                  {resources.map((resource, index) => (
                    <tr
                      key={index}
                      className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors`}
                    >
                      <td className="p-3 text-gray-700">{resource.firstName}</td>
                      <td className="p-3 text-gray-700">{resource.lastName}</td>
                      <td className="p-3 text-gray-700">{resource.email}</td>
                      <td className="p-3 text-gray-700">{resource.phoneNumber}</td>
                      <td className="p-3 text-gray-700">{resource.jobTitle}</td>
                      <td className="p-3 text-gray-700">
                        {new Date(resource.joiningDate).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-gray-700">{resource.employeeId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-600">
              <p>No resource details available yet.</p>
              <p className="mt-2">Click "Add Resource" to create a new resource entry.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageResource;
