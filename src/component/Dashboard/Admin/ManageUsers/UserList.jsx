import React, { useEffect, useState } from 'react';
import { FaPlus, FaSort, FaSearch, FaCalendarAlt, FaSortUp, FaSortDown } from 'react-icons/fa';
import { Link } from 'react-router';
import DatePicker from "react-datepicker";
import EmployeeDetailPage from './UserDetails';
import { useDispatch, useSelector } from "react-redux";
import { fetchResources } from '../../../../features/resource/resourceAction';

const UserList = ({setActiveSection}) => {

  const dispatch = useDispatch();
  const { resources } = useSelector((state) => state.resource);
  const roleOptions = ["Admin", "User"];
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerms, setSearchTerms] = useState({
    name: '',
    status: null,
    role: null,
    competency: null
  });

  useEffect(() => {
    dispatch(fetchResources())
  }, [dispatch], resources);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

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

  // Apply all filters
  const filteredData = resources.filter(item => {
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
          <button
            className="btn px-6 py-3 rounded-lg font-semibold text-lg flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
            onClick={() => {setActiveSection('add')}}
          >
            <FaPlus className="mr-2" />
            Add User
          </button>
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
                onClick={() => setSelectedUser(resource.publicId)}
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