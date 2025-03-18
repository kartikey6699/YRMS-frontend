import React, { useEffect, useState } from 'react';

const ManageResource = () => {

  const [activeSection, setActiveSection] = useState('view');
  const [roles, setRoles] = useState([]); // State for roles
  const [competencies, setCompetencies] = useState([]); // State for competencies
  const [statuses, setStatuses] = useState([]); // State for statuses
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    joiningDate: '',
    jobTitle: '',
    businessGroup: '',
    businessUnit: '',
    role: '',
    competency: '',
    status: '',
  });
  const [resources, setResources] = useState([]);

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
      console.log('Fetching resources');
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

            {/* Role and Skills Section */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-700 mb-2 mt-4">Role and Skills</h3>
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
            <div>
              <label className="block text-gray-700 font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              >
                <option value="" disabled>Select a status</option>
                {statuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
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
          <h2 className="text-2xl font-semibold text-blue-700 mb-6">
            Resource Details
          </h2>
          {resources.length > 0 ? (
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">First Name</th>
                  <th className="py-2 px-4 border-b">Last Name</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Phone Number</th>
                  <th className="py-2 px-4 border-b">Job Title</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((resource, index) => (
                  <tr key={index} className="text-center">
                    <td className="py-2 px-4 border-b">{resource.firstName}</td>
                    <td className="py-2 px-4 border-b">{resource.lastName}</td>
                    <td className="py-2 px-4 border-b">{resource.email}</td>
                    <td className="py-2 px-4 border-b">
                      {resource.phoneNumber}
                    </td>
                    <td className="py-2 px-4 border-b">{resource.jobTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-600">
              No resource details available.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageResource;
