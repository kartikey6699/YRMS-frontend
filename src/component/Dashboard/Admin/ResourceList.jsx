import React, { useState } from "react";
import { 
  FaChartLine, 
  FaLightbulb, 
  FaSortUp, 
  FaSortDown, 
  FaSort, 
  FaSpinner, 
  FaSearch, 
  FaCalendarAlt,
  FaTrash
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DeleteConfirmationModal from "../../helper/DeleteConfirmationModal";
import { deleteResource } from "../../../features/resource/resourceAction";
import { SuccessToast } from "../../helper/ResourceToast";
import EmployeeDetail from "./EmployeDetail";
import { useNavigate } from "react-router-dom";

const ResourceList = ({ handleBaselineClick, handleOpportunitiesClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { resources, loading, error } = useSelector((state) => state.resource);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [selectedResource, setSelectedResource] = useState(null);
  const [loadingBaselineId, setLoadingBaselineId] = useState(null);
  const [searchValues, setSearchValues] = useState({
    employeeName: "",
    joiningDate: null,
    designation: "",
    status: "",
    assignedPrograms: ""
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    resourceId: null,
    resourceName: "",
  });
  const [toast, setToast] = useState(null);

  const statusOptions = ["Pool", "Deployed", "PIP"];

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleSearchChange = (key, value) => {
    setSearchValues({
      ...searchValues,
      [key]: value,
    });
  };

  const handleDateChange = (date) => {
    setSearchValues({
      ...searchValues,
      joiningDate: date,
    });
  };

  const handleDeleteClick = (resource) => {
    setDeleteModal({
      isOpen: true,
      resourceId: resource.publicId,
      resourceName: resource.employeeName,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteResource(deleteModal.resourceId));
      setToast(
        <SuccessToast 
          message="Resource deleted successfully!" 
          onClose={() => setToast(null)} 
        />
      );
      setDeleteModal({ isOpen: false, resourceId: null, resourceName: "" });
    } catch (error) {
      console.error("Failed to delete resource:", error);
    }
  };

  const handleProgramClick = (programId) => {
    console.log()
    navigate(`/training-detail/${programId}`);
  };

  const filteredResources = (resources || []).filter((resource) => {
    const matchesName = resource.employeeName?.toLowerCase().includes(searchValues.employeeName.toLowerCase()) ?? true;
    const matchesDesignation = resource.designation?.toLowerCase().includes(searchValues.designation.toLowerCase()) ?? true;
    const matchesStatus = searchValues.status ? resource.status?.toLowerCase() === searchValues.status.toLowerCase() : true;
    const matchesPrograms = searchValues.assignedPrograms 
      ? (resource.programs || []).some(p => 
          p.name.toLowerCase().includes(searchValues.assignedPrograms.toLowerCase())
        )
      : true;
    
    let matchesDate = true;
    if (searchValues.joiningDate) {
      const resourceDate = resource.joiningDate ? new Date(resource.joiningDate) : null;
      if (resourceDate) {
        matchesDate = 
          resourceDate.getDate() === searchValues.joiningDate.getDate() &&
          resourceDate.getMonth() === searchValues.joiningDate.getMonth() &&
          resourceDate.getFullYear() === searchValues.joiningDate.getFullYear();
      }
    }

    return matchesName && matchesDesignation && matchesStatus && matchesDate && matchesPrograms;
  });

  const sortedResources = [...filteredResources].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    // Special sorting for programs
    if (sortConfig.key === 'assignedPrograms') {
      const aPrograms = (a.programs || []).map(p => p.name).join(', ');
      const bPrograms = (b.programs || []).map(p => p.name).join(', ');
      return sortConfig.direction === "ascending"
        ? aPrograms.localeCompare(bPrograms)
        : bPrograms.localeCompare(aPrograms);
    }
    
    const valueA = a[sortConfig.key] || "";
    const valueB = b[sortConfig.key] || "";
    return sortConfig.direction === "ascending"
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });

  const handleBaselineClickWithLoading = async (resource) => {
    setLoadingBaselineId(resource.publicId);
    try {
      await handleBaselineClick(resource);
    } finally {
      setLoadingBaselineId(null);
    }
  };

  const columns = [
    { key: "sno", label: "S.No" },
    { key: "employeeName", label: "Employee Name" },
    { key: "joiningDate", label: "Joining Date" },
    { key: "designation", label: "Designation" },
    { key: "assignedPrograms", label: "Assigned Programs" },
    { key: "status", label: "Status" },
  ];

  if (loading) return <div className="text-center py-8">Loading resources...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>;

  return (
    <div className="relative">
      {toast}
      
      <div className={`overflow-x-auto rounded-lg shadow-lg border border-gray-200 ${deleteModal.isOpen ? 'filter blur-sm' : ''}`}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-blue-50 to-purple-50 text-gray-800">
              {columns.map((column) => (
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
                            selected={searchValues.joiningDate}
                            onChange={handleDateChange}
                            dateFormat="MM/dd/yyyy"
                            placeholderText="Select date"
                            className="w-full px-2 py-1 pr-6 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <FaCalendarAlt className="absolute right-2 top-2 text-gray-400 text-xs" />
                        </div>
                      ) : column.key === "status" ? (
                        <select
                          value={searchValues.status}
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
                      ) : column.key === "assignedPrograms" ? (
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search programs"
                            value={searchValues.assignedPrograms || ""}
                            onChange={(e) => handleSearchChange("assignedPrograms", e.target.value)}
                            className="w-full px-2 py-1 pr-6 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <FaSearch className="absolute right-2 top-2 text-gray-400 text-xs" />
                        </div>
                      ) : (
                        <div className="relative">
                          <input
                            type="text"
                            placeholder={`Search ${column.label}`}
                            value={searchValues[column.key] || ""}
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
              <th className="p-1 text-left font-semibold text-sm border-b border-gray-200">
                Actions
                <div className="mt-1 h-8"></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedResources.map((resource, index) => (
              <tr key={resource.publicId} className={`h-8 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}>
                <td className="p-1 text-gray-700 text-sm border-r border-gray-200">{index + 1}</td>
                <td
                  className="p-1 text-blue-600 text-sm cursor-pointer hover:underline border-r border-gray-200"
                  onClick={() => setSelectedResource(resource.publicId)}
                >
                  {resource.employeeName || "N/A"}
                </td>
                <td className="p-1 text-gray-700 text-sm border-r border-gray-200">
                  {resource.joiningDate ? new Date(resource.joiningDate).toLocaleDateString() : "N/A"}
                </td>
                <td className="p-1 text-gray-700 text-sm border-r border-gray-200">
                  {resource.designation || "N/A"}
                </td>
                <td className="p-1 text-gray-700 text-sm border-r border-gray-200 max-w-xs truncate">
                  <div className="flex flex-wrap gap-1">
                    {(resource.programs || []).map(program => (
                      <span 
                        key={program.id}
                        className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full cursor-pointer hover:bg-blue-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProgramClick(program.id);
                        }}
                      >
                        {program.name}
                      </span>
                    ))}
                    {(!resource.programs || resource.programs.length === 0) && "N/A"}
                  </div>
                </td>
                <td className="p-1 text-gray-700 text-sm border-r border-gray-200">
                  <span
                    className={`px-1 py-0.5 rounded-full text-xs ${
                      (resource.status || "pool") === "pool"
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
                </td>
                <td className="p-1 text-gray-700 text-sm">
                  <div className="flex space-x-1 relative">
                    <div className="relative group">
                      <button
                        className={`flex items-center justify-center w-7 h-7 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors cursor-pointer ${
                          loadingBaselineId === resource.publicId ? "opacity-75" : ""
                        }`}
                        onClick={() => handleBaselineClickWithLoading(resource)}
                        disabled={loadingBaselineId === resource.publicId}
                      >
                        {loadingBaselineId === resource.publicId ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaChartLine />
                        )}
                      </button>
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Baseline
                        <div className="absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45 -bottom-1"></div>
                      </span>
                    </div>
                    <div className="relative group">
                      <button
                        className="flex items-center justify-center w-7 h-7 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors cursor-pointer"
                        onClick={() => handleOpportunitiesClick(resource)}
                      >
                        <FaLightbulb />
                      </button>
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Opportunities
                        <div className="absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45 -bottom-1"></div>
                      </span>
                    </div>
                    <div className="relative group">
                      <button
                        className="flex items-center justify-center w-7 h-7 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                        onClick={() => handleDeleteClick(resource)}
                      >
                        <FaTrash size={12} />
                      </button>
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Delete
                        <div className="absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45 -bottom-1"></div>
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedResource && (
          <EmployeeDetail
            publicId={selectedResource}
            onClose={() => setSelectedResource(null)}
          />
        )}

        {!loading && sortedResources.length === 0 && (
          <div className="text-center py-8 bg-white">
            <div className="text-gray-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700">No resources found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, resourceId: null, resourceName: "" })}
        onConfirm={handleDeleteConfirm}
        resourceName={deleteModal.resourceName}
      />
    </div>
  );
};

export default ResourceList;