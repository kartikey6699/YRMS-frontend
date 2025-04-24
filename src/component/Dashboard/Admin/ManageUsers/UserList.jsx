import React, { useEffect, useState } from 'react';
import { FaPlus, FaSort, FaSearch, FaCalendarAlt, FaSortUp, FaSortDown } from 'react-icons/fa';
import { Link } from 'react-router';
import DatePicker from "react-datepicker";
import EmployeeDetailPage from './UserDetails';
import { useDispatch, useSelector } from "react-redux";
import { fetchCompetencies, fetchDesignations, fetchResources, updateResource } from '../../../../features/resource/resourceAction';
import { ErrorToast, SuccessToast } from '../../../helper/ResourceToast';
import YRMSLoader from '../../../helper/loader';

const UserList = ({ setActiveSection }) => {
  const dispatch = useDispatch();
  const { resources, competencies, designations } = useSelector((state) => state.resource);
  const roleOptions = ["Admin", "User"];
  const statusOptions = ["pool", "pip", "deployed"]; // Updated to match API
  const competenciesOptions = competencies.map((competency) => competency.name); // Updated to match API
  const designationsOptions = designations.map((designation) => designation.name); // Updated to match API
  const [selectedUser, setSelectedUser] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    resourceId: null,
    resourceName: "",
  });

  const [searchTerms, setSearchTerms] = useState({
    name: '',
    designation: '',
    competency: '',
    joiningDate: '',
    status: '',
    roleIds: ''
  });

  const getRoleName = (roleIds) => {
    if (!roleIds) return "N/A";
    const storedRoles = sessionStorage.getItem('role');
    if (!storedRoles) return "N/A";
    try {
      const roles = JSON.parse(storedRoles);
      const roleNames = Array.isArray(roleIds)
        ? roleIds.map(id => roles.find(r => r.id === id)?.role || "Unknown")
        : [roles.find(r => r.id === roleIds)?.role || "Unknown"];
      return roleNames.join(", ");
    } catch (e) {
      console.error("Error parsing roles:", e);
      return "N/A";
    }
  };

  useEffect(() => {
    dispatch(fetchResources());
    dispatch(fetchDesignations());
    dispatch(fetchCompetencies());
  }, [dispatch]);

  // Set filteredData to resources when resources change
  useEffect(() => {
    setFilteredData(resources);
    applyFilters(searchTerms); // Re-apply filters if any are active
  }, [resources]);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

  const handleSearchChange = (key, value) => {
    setSearchTerms(prev => ({ ...prev, [key]: value }));
    applyFilters({ ...searchTerms, [key]: value });
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    // Apply sorting to filteredData
    const sortedData = [...filteredData].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });
    setFilteredData(sortedData);
  };

  const applyFilters = (filters) => {
    const isFilterEmpty = Object.values(filters).every(val => !val);
    if (isFilterEmpty) {
      setFilteredData(resources);
      return;
    }

    const filtered = resources.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;

        if (key === 'joiningDate') {
          return new Date(item[key]).toDateString() === new Date(value).toDateString();
        }

        if (item[key]) {
          return String(item[key]).toLowerCase().includes(String(value).toLowerCase());
        }

        return false;
      });
    });

    setFilteredData(filtered);
  };

  const handleUpdateStatus = async (e, event, publicId) => {
    setIsSubmitting(true);
    try {
      setToast(<YRMSLoader message="Updating status..." />);
      
      const resourceData = {
        status: event.target.value
      };

      const updateResult = await dispatch(updateResource({
        publicId: publicId,
        resourceData
      }));

      if (updateResult) {
        setToast(<SuccessToast message="status updated successfully!" onClose={() => setToast(null)} />);
        dispatch(fetchResources())
      } else {
        throw new Error("Failed to update resource");
      }
    } catch (err) {
      setToast(<ErrorToast message={err.message || "Failed to update status"} onClose={() => setToast(null)} />);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { key: "sno", label: "S.No" },
    { key: 'employeeName', label: 'Name' }, // Updated to match API field
    { key: 'designation', label: 'Designation' },
    { key: 'competency', label: 'Competency' },
    { key: 'joiningDate', label: 'Joining Date' },
    { key: 'roleIds', label: 'Role' },
    { key: 'status', label: 'Status' }
  ];

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold text-blue-800">All Users</h2>
          <button
            className="btn px-6 py-3 rounded-lg font-semibold text-lg flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
            onClick={() => setActiveSection('add')}
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
                {column.key !== "sno" && (
                  <div className="relative mt-1">
                    {column.key === "joiningDate" ? (
                      <div className="relative">
                        <DatePicker
                          selected={searchTerms[column.key] ? new Date(searchTerms[column.key]) : null}
                          onChange={(date) => handleSearchChange(column.key, date)}
                          dateFormat="MM/dd/yyyy"
                          placeholderText="Select date"
                          className="w-full px-2 py-1 pr-6 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <FaCalendarAlt className="absolute right-2 top-2 text-gray-400 text-xs" />
                      </div>
                    ) : column.key === "status" || column.key === "designation" || column.key === "competency" ? (
                      <select
                        value={searchTerms[column.key] || ""}
                        onChange={(e) => handleSearchChange(column.key, e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">All {column.label}</option>
                        {(column.key === "status" ? statusOptions :
                          column.key === "designation" ? designationsOptions :
                            competenciesOptions).map((option) => (
                              <option
                                key={typeof option === 'string' ? option : option.publicId}
                                value={typeof option === 'string' ? option : option.publicId}
                              >
                                {typeof option === 'string' ? option : option.name}
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
              <td className="p-3 text-gray-700 text-sm border-r border-gray-200">
                {getRoleName(resource.roleIds)}
              </td>
              <td className="p-3 text-gray-700 text-sm border-r border-gray-200 relative">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingStatusId(editingStatusId === resource.publicId ? null : resource.publicId);
                  }}
                  className="cursor-pointer"
                >
                  <span className={`px-2 py-1 rounded-full text-xs ${resource.status === 'Running' ? 'bg-blue-100 text-blue-800' :
                    resource.status === 'Complete' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                    {!resource.status ? "Running" : resource.status.charAt(0).toUpperCase() + resource.status.slice(1)}
                  </span>
                </div>

                {editingStatusId === resource.publicId && (
                  <div className="absolute z-10 mt-1 bg-white shadow-lg rounded-md border border-gray-200">
                    <select
                      autoFocus
                      name='status'
                      className="w-full p-1 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                      value={resource.status || 'Running'}
                      onChange={(e) => {
                        const syntheticEvent = {
                          target: {
                            name: 'status',
                            value: e.target.value
                          }
                        };
                        handleUpdateStatus(e, syntheticEvent, resource.publicId);
                        setEditingStatusId(null);
                      }}
                      onBlur={() => setTimeout(() => setEditingStatusId(null), 200)}
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedUser && (
        <EmployeeDetailPage
          key={selectedUser}
          publicId={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default UserList;