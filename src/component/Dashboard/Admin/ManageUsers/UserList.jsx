import React, { useState } from 'react';
import { FaPlus, FaSort, FaSearch, FaCalendarAlt, FaSortUp, FaSortDown } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router';
import DatePicker from "react-datepicker";
import EmployeeDetailPage from './UserDetails';

const UserList = () => {
  // Dummy data
  const initialData = [
    { publicId: 1000001, employeeName: 'John Doe', designation: 'Software Engineer', status: 'Active', role: 'Developer', joiningDate: '2022-01-15', competency: 'Python', email: 'john.doe@example.com', phoneNumber: '1234567890', gender: 'Male', location: 'New York', businessGroup: 'Group A', businessUnit: 'Unit X' },
    { publicId: 1000002, employeeName: 'Jane Smith', designation: 'Sr Software Engineer', status: 'Active', role: 'Tech Lead', joiningDate: '2021-03-22', competency: 'Java', email: 'jane.smith@example.com', phoneNumber: '2345678901', gender: 'Female', location: 'San Francisco', businessGroup: 'Group B', businessUnit: 'Unit Y' },
    { publicId: 1000003, employeeName: 'Robert Johnson', designation: 'Module Lead', status: 'Active', role: 'Manager', joiningDate: '2020-07-10', competency: 'Scala', email: 'robert.johnson@example.com', phoneNumber: '3456789012', gender: 'Male', location: 'Los Angeles', businessGroup: 'Group C', businessUnit: 'Unit Z' },
    { publicId: 1000004, employeeName: 'Emily Davis', designation: 'Software Engineer', status: 'Inactive', role: 'Designer', joiningDate: '2019-11-05', competency: 'Python', email: 'emily.davis@example.com', phoneNumber: '4567890123', gender: 'Female', location: 'Chicago', businessGroup: 'Group A', businessUnit: 'Unit X' },
    { publicId: 1000005, employeeName: 'Michael Brown', designation: 'Software Engineer', status: 'Active', role: 'Tester', joiningDate: '2022-04-18', competency: 'Java', email: 'michael.brown@example.com', phoneNumber: '5678901234', gender: 'Male', location: 'Houston', businessGroup: 'Group B', businessUnit: 'Unit Y' },
    { publicId: 1000006, employeeName: 'Sarah Wilson', designation: 'Software Engineer', status: 'Active', role: 'DevOps', joiningDate: '2021-08-30', competency: 'Scala', email: 'sarah.wilson@example.com', phoneNumber: '6789012345', gender: 'Female', location: 'Phoenix', businessGroup: 'Group C', businessUnit: 'Unit Z' },
    { publicId: 1000007, employeeName: 'David Taylor', designation: 'Software Engineer', status: 'Inactive', role: 'Analyst', joiningDate: '2020-02-14', competency: 'Python', email: 'david.taylor@example.com', phoneNumber: '7890123456', gender: 'Male', location: 'Philadelphia', businessGroup: 'Group A', businessUnit: 'Unit X' },
    { publicId: 1000008, employeeName: 'Jessica Anderson', designation: 'Software Engineer', status: 'Active', role: 'Developer', joiningDate: '2022-06-25', competency: 'Java', email: 'jessica.anderson@example.com', phoneNumber: '8901234567', gender: 'Female', location: 'San Antonio', businessGroup: 'Group B', businessUnit: 'Unit Y' },
    { publicId: 1000009, employeeName: 'Thomas Martinez', designation: 'Module Lead', status: 'Active', role: 'Architect', joiningDate: '2019-09-12', competency: 'Scala', email: 'thomas.martinez@example.com', phoneNumber: '9012345678', gender: 'Male', location: 'San Diego', businessGroup: 'Group C', businessUnit: 'Unit Z' },
    { publicId: 1000010, employeeName: 'Lisa Robinson', designation: 'Sr Software Engineer', status: 'Active', role: 'HR', joiningDate: '2021-12-01', competency: 'Python', email: 'lisa.robinson@example.com', phoneNumber: '1123456789', gender: 'Female', location: 'Dallas', businessGroup: 'Group A', businessUnit: 'Unit X' },
    { publicId: 1000011, employeeName: 'William Clark', designation: 'Software Engineer', status: 'Inactive', role: 'Developer', joiningDate: '2020-05-19', competency: 'Java', email: 'william.clark@example.com', phoneNumber: '2234567890', gender: 'Male', location: 'New York', businessGroup: 'Group B', businessUnit: 'Unit Y' },
    { publicId: 1000012, employeeName: 'Karen Rodriguez', designation: 'Module Lead', status: 'Active', role: 'Product', joiningDate: '2021-07-23', competency: 'Scala', email: 'karen.rodriguez@example.com', phoneNumber: '3345678901', gender: 'Female', location: 'San Francisco', businessGroup: 'Group C', businessUnit: 'Unit Z' },
    { publicId: 1000013, employeeName: 'James Lewis', designation: 'Software Engineer', status: 'Active', role: 'Developer', joiningDate: '2022-03-15', competency: 'Python', email: 'james.lewis@example.com', phoneNumber: '4456789012', gender: 'Male', location: 'Los Angeles', businessGroup: 'Group A', businessUnit: 'Unit X' },
    { publicId: 1000014, employeeName: 'Nancy Lee', designation: 'Sr Software Engineer', status: 'Active', role: 'Agile Coach', joiningDate: '2020-10-07', competency: 'Java', email: 'nancy.lee@example.com', phoneNumber: '5567890123', gender: 'Female', location: 'Chicago', businessGroup: 'Group B', businessUnit: 'Unit Y' },
    { publicId: 1000015, employeeName: 'Charles Walker', designation: 'Software Engineer', status: 'Inactive', role: 'DBA', joiningDate: '2019-04-20', competency: 'Scala', email: 'charles.walker@example.com', phoneNumber: '6678901234', gender: 'Male', location: 'Houston', businessGroup: 'Group C', businessUnit: 'Unit Z' },
    { publicId: 1000016, employeeName: 'Patricia Hall', designation: 'Module Lead', status: 'Active', role: 'Security', joiningDate: '2021-11-11', competency: 'Python', email: 'patricia.hall@example.com', phoneNumber: '7789012345', gender: 'Female', location: 'Phoenix', businessGroup: 'Group A', businessUnit: 'Unit X' },
    { publicId: 1000017, employeeName: 'Christopher Allen', designation: 'Software Engineer', status: 'Active', role: 'Documentation', joiningDate: '2022-05-30', competency: 'Java', email: 'christopher.allen@example.com', phoneNumber: '8890123456', gender: 'Male', location: 'Philadelphia', businessGroup: 'Group B', businessUnit: 'Unit Y' },
    { publicId: 1000018, employeeName: 'Amanda Young', designation: 'Software Engineer', status: 'Inactive', role: 'Research', joiningDate: '2020-08-25', competency: 'Scala', email: 'amanda.young@example.com', phoneNumber: '9901234567', gender: 'Female', location: 'San Antonio', businessGroup: 'Group C', businessUnit: 'Unit Z' },
    { publicId: 1000019, employeeName: 'Matthew Hernandez', designation: 'Software Engineer', status: 'Active', role: 'Support', joiningDate: '2021-02-17', competency: 'Python', email: 'matthew.hernandez@example.com', phoneNumber: '1012345678', gender: 'Male', location: 'San Diego', businessGroup: 'Group A', businessUnit: 'Unit X' },
    { publicId: 1000020, employeeName: 'Ashley King', designation: 'Tech Lead', status: 'Active', role: 'Executive', joiningDate: '2018-12-05', competency: 'Java', email: 'ashley.king@example.com', phoneNumber: '1123456789', gender: 'Female', location: 'Dallas', businessGroup: 'Group B', businessUnit: 'Unit Y' },
  ];

  const roleOptions = ["Admin", "User"];
  const [searchTerms, setSearchTerms] = useState({
    name: '',
    status: null,
    role: null,
    competency: null
  });


  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSearchChange = (key, value) => {
    setSearchTerms(searchTerms => ({ ...searchTerms, [key]: value }));
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleDateChange = (key, date) => {
    setSearchTerms({
      ...searchTerms,
      [key]: date,
    });
  };

  console.log("selectedUser: ", selectedUser)

  // Apply all filters
  const filteredData = initialData.filter(item => {
    return (
      (searchTerms.name === '' || item.name.toLowerCase().includes(searchTerms.name.toLowerCase())) &&
      (searchTerms.status === null || item.status === searchTerms.status) &&
      (searchTerms.role === null || item.role === searchTerms.role) &&
      (searchTerms.competency === null || item.competency === searchTerms.competency)
    );
  });


  const columns = [
    { key: "sno", label: "S.No" },
    { key: 'name', label: 'Name' },
    { key: 'designation', label: 'Designation' },
    { key: 'competency', label: 'Competency' },
    { key: 'joiningDate', label: 'Joining Date' },
    { key: 'status', label: 'Status' }
  ];

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold text-blue-800">All Users</h2>
          <Link
            className="btn px-6 py-3 rounded-lg font-semibold text-lg flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
            to='/'
          >
            <FaPlus className="mr-2" />
            Add User
          </Link>
        </div>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-800">
            {columns.map(column => (
              <th
                key={column.key}
                className="p-1 text-left font-semibold text-sm border-b border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <span>{column.label}</span>
                  {column.key !== "sno" && (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="ml-2 focus:outline-none"
                    >
                      {sortConfig.key === column.key ? (
                        sortConfig.direction === "ascending" ? (
                          <FaSortUp className="text-blue-600" />
                        ) : (
                          <FaSortDown className="text-blue-600" />
                        )
                      ) : (
                        <FaSort className="text-gray-400 hover:text-blue-600" />
                      )}
                    </button>
                  )}
                </div>
                {/* Search input for each column (except S.No) */}
                {column.key !== "sno" && (
                  <div className="relative mt-1">
                    {column.key === "joiningDate" ? (
                      <div className="relative">
                        <DatePicker
                          selected={searchTerms.joiningDate}
                          onChange={(date) => handleDateChange(column.key, date)}
                          dateFormat="MM/dd/yyyy"
                          placeholderText="Select date"
                          className="w-full px-2 py-1 pr-6 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <FaCalendarAlt className="absolute right-2 top-2 text-gray-400 text-xs" />
                      </div>
                    ) : column.key === "status" ? (
                      <select
                        value={searchTerms.status}
                        onChange={(e) => handleSearchChange("status", e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">All Status</option>
                        {roleOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : column.key === "designation" ? (
                      <select
                        value={searchTerms.designation}
                        onChange={(e) => handleSearchChange("designation", e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">All Status</option>
                        {roleOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : column.key === "competency" ? (
                      <select
                        value={searchTerms.competency}
                        onChange={(e) => handleSearchChange("competency", e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">All Status</option>
                        {roleOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="relative">
                        <input
                          type="text"
                          placeholder={`Search ${column.label}`}
                          value={searchTerms[column.key] || ""}
                          onChange={(e) => handleSearchChange(column.key, e.target.value)}
                          className="w-full px-2 py-1 pr-6 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <FaSearch className="absolute right-2 top-2 text-gray-400 text-xs" />
                      </div>
                    )}
                  </div>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((resource, index) => (
            <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors`}>
              <td className="p-3 text-gray-700 text-sm text-center border-r border-gray-200">{index + 1}</td>
              <td
                className="p-3 text-blue-600 text-sm border-r border-gray-200 cursor-pointer hover:underline"
                onClick={() => setSelectedUser(resource)}
              >
                {resource.employeeName.charAt(0).toUpperCase() + resource.employeeName.slice(1)}
              </td>
              <td className="p-3 text-gray-700 text-sm border-r border-gray-200">
                {resource.designation}
              </td>
              <td className="p-3 text-gray-700 text-sm border-r border-gray-200">
                {resource.competency.charAt(0).toUpperCase() + resource.competency.slice(1)}
              </td>
              <td className="p-3 text-gray-700 text-sm border-r border-gray-200">{new Date(resource.joiningDate).toLocaleDateString()}</td>
              <td className="p-3 text-gray-700 text-sm border-r border-gray-200 relative">
                <span className={`px-2 py-1 rounded-full text-xs ${resource.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                  resource.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                  {!resource.status ? "Admin" : resource.status.charAt(0).toUpperCase() + resource.status.slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedUser && (
        <EmployeeDetailPage
          key={selectedUser}
          publicId={selectedUser}
          onClose={() => {
            setSelectedUser(null)
          }}
        />
      )}
    </div>
  );
};

export default UserList;