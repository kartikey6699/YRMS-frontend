import React, { useEffect, useState } from 'react';
import { FaPlus, FaSort, FaSearch, FaCalendarAlt, FaSortUp, FaSortDown, FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight, FaTrash, FaFileDownload, FaFileUpload } from 'react-icons/fa';
import { Link } from 'react-router';
import DatePicker from "react-datepicker";
import EmployeeDetailPage from './UserDetails';
import { useDispatch, useSelector } from "react-redux";
import { deleteResource, fetchCompetencies, fetchDesignations, fetchResources, updateResource } from '../../../../features/resource/resourceAction';
import { ErrorToast, SuccessToast } from '../../../helper/ResourceToast';
import YRMSLoader from '../../../helper/loader';
import DeleteConfirmationModal from '../../../helper/DeleteConfirmationModal';
import axios from 'axios'; // Ensure axios is imported
import { ADMIN_API_BASE_URL } from "../../../../config/Endpoints/BaseEndpoints";


const UserList = ({ setActiveSection }) => {
  const dispatch = useDispatch();
  const { resources, competencies, designations } = useSelector((state) => state.resource);
  const storedRoles = sessionStorage.getItem('role');
  const roleOptions = storedRoles ? JSON.parse(storedRoles).map((role) => role.role) : [];
  const statusOptions = ["Pool", "Deployed", "PIP"];
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  useEffect(() => {
    setFilteredData(resources);
    applyFilters(searchTerms);
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

        if (key === 'roleIds') {
          const roleName = getRoleName(item.roleIds).toLowerCase();
          return roleName.includes(value.toLowerCase());
        }

        if (item[key]) {
          return String(item[key]).toLowerCase().includes(String(value).toLowerCase());
        }

        return false;
      });
    });

    setFilteredData(filtered);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedResources = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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

  const handleDeleteConfirm = () => {
    setToast(<YRMSLoader message="Deleting resource..." />);

    dispatch(deleteResource(deleteModal.resourceId))
      .unwrap()
      .then(() => {
        setToast(<SuccessToast message="Resource deleted successfully!" onClose={() => setToast(null)} />);
      })
      .catch(error => {
        setToast(<ErrorToast message={error.message || "Failed to delete resource"} onClose={() => setToast(null)} />);
      });
    setDeleteModal({ isOpen: false, resourceId: null, resourceName: '' });
  };

  const downloadSampleCSV = async () => {
    try {
      setToast(<YRMSLoader loadingMessage="Preparing sample CSV..." />);

      // Use fetch to get the CSV content as text
      const response = await fetch('/src/assets/sample_csv/valid_users.csv');
      const csvContent = await response.text();
      
      // Create a blob from the CSV content
      const blob = new Blob([csvContent], { type: 'text/csv' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resource_sample.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Clean up the URL object
      window.URL.revokeObjectURL(url);

      setToast(<SuccessToast message="Sample CSV downloaded successfully!" onClose={() => setToast(null)} />);
    } catch (error) {
      setToast(<ErrorToast message="Failed to download sample CSV" onClose={() => setToast(null)} />);
      console.error("CSV download error:", error);
    }
  };

  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      setToast(<ErrorToast message="Please upload a CSV file" onClose={() => setToast(null)} />);
      return;
    }

    try {
      setToast(<YRMSLoader loadingMessage="Processing CSV file..." />);
      
      const formData = new FormData();
      formData.append('file', file);

      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `${ADMIN_API_BASE_URL}/register-users-csv`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setToast(<SuccessToast message={response.data.message} onClose={() => setToast(null)} />);
      } else {
        const errorMessage = response.data.error.details[0].error;
        setToast(<ErrorToast message={errorMessage} onClose={() => setToast(null)} />);
      }
      
      // Refresh the user list
      dispatch(fetchResources());
    } catch (error) {
      const primaryErrorMessage = error.response?.data?.message;
      const secondaryErrorMessage = error.response?.data?.error?.details?.[0]?.error;
      const errorMsg = primaryErrorMessage ? `${primaryErrorMessage}: ${secondaryErrorMessage || "Failed to upload CSV"}` : "Failed to upload CSV";
      setToast(<ErrorToast message={errorMsg} onClose={() => setToast(null)} />);
    } finally {
      // Reset the file input
      e.target.value = '';
    }
  };

  const columns = [
    { key: "sno", label: "S.No" },
    { key: 'employeeName', label: 'Name' },
    { key: 'designation', label: 'Designation' },
    { key: 'competency', label: 'Competency' },
    { key: 'joiningDate', label: 'Joining Date' },
    { key: 'roleIds', label: 'Role' },
    { key: 'status', label: 'Status' },
    { key: 'action', label: 'Actions' }
  ];

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg">
      {toast}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold text-blue-800">All Users</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="file"
                id="csvUpload"
                accept=".csv"
                onChange={handleCSVUpload}
                className="hidden"
              />
              <label
                htmlFor="csvUpload"
                className="px-4 py-2 rounded-lg font-semibold text-sm flex items-center bg-gradient-to-r from-green-600 to-teal-600 text-white hover:from-green-700 hover:to-teal-700 transition-all transform hover:scale-105 cursor-pointer"
              >
                <FaFileUpload className="mr-2" />
                Bulk Upload
              </label>
            </div>
            <button
              onClick={downloadSampleCSV}
              className="px-4 py-2 rounded-lg font-semibold text-sm flex items-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105"
            >
              <FaFileDownload className="mr-2" />
              Sample CSV
            </button>
            <button
              className="px-4 py-2 rounded-lg font-semibold text-sm flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              onClick={() => setActiveSection('add')}
            >
              <FaPlus className="mr-2" />
              Add User
            </button>
          </div>
        </div>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-800">
            {columns.map(column => (
              <th
                key={column.key}
                className="p-3 text-left font-semibold text-sm border-b border-gray-200 align-top"
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
                  <div className="relative mt-1 flex flex-col">
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
                    ) : column.key === "status" ? (
                      <select
                        value={searchTerms.status || ""}
                        onChange={(e) => handleSearchChange("status", e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">All Statuses</option>
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : column.key === "designation" ? (
                      <select
                        value={searchTerms.designation || ""}
                        onChange={(e) => handleSearchChange("designation", e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">All Designations</option>
                        {designations.map((designation) => (
                          <option key={designation.publicId} value={designation.name}>
                            {designation.name}
                          </option>
                        ))}
                      </select>
                    ) : column.key === "competency" ? (
                      <select
                        value={searchTerms.competency || ""}
                        onChange={(e) => handleSearchChange("competency", e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">All Competencies</option>
                        {competencies.map((competency) => (
                          <option key={competency.publicId} value={competency.name}>
                            {competency.name}
                          </option>
                        ))}
                      </select>
                    ) : column.key === "roleIds" ? (
                      <select
                        value={searchTerms.roleIds || ""}
                        onChange={(e) => handleSearchChange("roleIds", e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">All Roles</option>
                        {roleOptions.map((role) => (
                          <option key={role} value={role}>
                            {role}
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
          {paginatedResources.map((resource, index) => (
            <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors`}>
              <td className="p-3 text-gray-700 text-sm text-center border-r border-gray-200">{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td
                className="p-3 text-blue-600 text-sm border-r border-gray-200 cursor-pointer hover:underline"
                onClick={() => setSelectedUser(resource.publicId)}
              >
                {resource.employeeName?.charAt(0).toUpperCase() + resource.employeeName?.slice(1)}
              </td>
              <td className="p-3 text-gray-700 text-sm border-r border-gray-200">
                {resource.designation}
              </td>
              <td className="p-3 text-gray-700 text-sm border-r border-gray-200">
                {resource.competency?.charAt(0).toUpperCase() + resource.competency?.slice(1)}
              </td>
              <td className="p-3 text-gray-700 text-sm border-r border-gray-200">
                {resource.joiningDate ? new Date(resource.joiningDate).toLocaleDateString() : 'N/A'}
              </td>
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
                  <span
                    className={`px-1 py-0.5 rounded-full text-xs ${(resource.status || "pool") === "pool"
                      ? "bg-blue-100 text-blue-800"
                      : resource.status === "deployed"
                        ? "bg-green-100 text-green-800"
                        : resource.status === "pip"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                  >
                    {(resource.status || "pool").charAt(0).toUpperCase() +
                      (resource.status || "pool").slice(1)}
                  </span>
                </div>

                {editingStatusId === resource.publicId && (
                  <div className="absolute z-10 mt-1 bg-white shadow-lg rounded-md border border-gray-200">
                    <select
                      autoFocus
                      name='status'
                      className="w-full p-1 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                      value={resource.status || 'pool'}
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
                        <option key={option} value={option.toLowerCase()}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </td>
              <td className="p-3 text-gray-700 text-sm">
                <div className="flex space-x-1 relative">
                  <div className="relative group">
                    <button
                      className="flex items-center justify-center w-7 h-7 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                      onClick={() => setDeleteModal({
                        isOpen: true,
                        resourceId: resource.publicId,
                        resourceName: resource.employeeName
                      })}
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredData.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-200 gap-3">
          <div className="text-sm text-gray-700 whitespace-nowrap">
            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredData.length)}
            </span>{" "}
            of <span className="font-medium">{filteredData.length}</span> results
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
            >
              <FaAngleDoubleLeft className="text-sm sm:text-base" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
            >
              <FaAngleLeft className="text-sm sm:text-base" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base rounded-md ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-50'}`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
            >
              <FaAngleRight className="text-sm sm:text-base" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
            >
              <FaAngleDoubleRight className="text-sm sm:text-base" />
            </button>
          </div>
        </div>
      )}
      {selectedUser && (
        <EmployeeDetailPage
          key={selectedUser}
          publicId={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, resourceId: null, resourceName: "" })}
        onConfirm={handleDeleteConfirm}
        resourceName={deleteModal.resourceName}
        resourceType="user"
      />
    </div>
  );
};

export default UserList;