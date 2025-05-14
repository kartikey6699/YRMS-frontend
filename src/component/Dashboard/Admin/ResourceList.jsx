import React, { useState, useMemo, useEffect } from "react";
import {
  FaChartLine,
  FaLightbulb,
  FaSortUp,
  FaSortDown,
  FaSort,
  FaSpinner,
  FaSearch,
  FaCalendarAlt,
  FaTrash,
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
  FaUser
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DeleteConfirmationModal from "../../helper/DeleteConfirmationModal";
import { deleteResource } from "../../../features/resource/resourceAction";
import { SuccessToast } from "../../helper/ResourceToast";
import EmployeeDetail from "./EmployeDetail";
import { useNavigate } from "react-router-dom";

const ResourceList = ({ handleBaselineClick, handleOpportunitiesClick, setStatusFilter, statusFilter }) => {
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
    status: statusFilter,
    assignedPrograms: ""
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    resourceId: null,
    resourceName: "",
  });
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const statusOptions = ["Pool", "PIP", "Deployed"];

  // State for client info tooltip
  const [hoveredResource, setHoveredResource] = useState(null);

  // Sync searchValues.status with statusFilter from parent
  useEffect(() => {
    setSearchValues((prev) => ({ ...prev, status: statusFilter }));
  }, [statusFilter]);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleSearchChange = (key, value) => {
    const newSearchValues = {
      ...searchValues,
      [key]: value,
    };
    setSearchValues(newSearchValues);
    if (key === "status") {
      setStatusFilter(value); // Update parent status filter
    }
    setCurrentPage(1);
  };

  const handleDateChange = (date) => {
    setSearchValues({
      ...searchValues,
      joiningDate: date,
    });
    setCurrentPage(1);
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

  const handleProgramClick = (programId, resourceId) => {
    navigate(`/training-detail/${programId}`, { state: { resourceId } });
  };

  const filteredResources = useMemo(() => {
    return (resources || []).filter((resource) => {
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
  }, [resources, searchValues]);

  const sortedResources = useMemo(() => {
    return [...filteredResources].sort((a, b) => {
      if (!sortConfig.key) return 0;

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
  }, [filteredResources, sortConfig]);

  const totalPages = Math.ceil(sortedResources.length / itemsPerPage);
  const paginatedResources = sortedResources.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleBaselineClickWithLoading = async (resource) => {
    setLoadingBaselineId(resource.publicId);
    try {
      await handleBaselineClick(resource);
    } finally {
      setLoadingBaselineId(null);
    }
  };

  const columns = [
    { key: "profileImage", label: "Profile" },
    { key: "employeeName", label: "Employee Name" },
    { key: "joiningDate", label: "Joining Date" },
    { key: "designation", label: "Designation" },
    { key: "assignedPrograms", label: "Current Activity" },
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
                    {column.key !== "profileImage" && (
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
                  {column.key !== "profileImage" && (
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
            {paginatedResources.map((resource, index) => (
              <tr key={resource.publicId} className={`h-8 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}>
                <td className="p-1 text-gray-700 text-sm border-r border-gray-200 text-center">
                  {resource.profileImage ? (
                    <img
                      src={`data:image/png;base64,${resource.profileImage}`}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-blue-200 mx-auto"
                    />
                  ) : (
                    <FaUser className="w-8 h-8 rounded-full text-gray-400 mx-auto" />
                  )}
                </td>
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
                <td className="p-1 text-gray-700 text-sm border-r border-gray-200 max-w-xs truncate text-center">
                  <div className="flex flex-wrap gap-1 text-centre">
                    {(resource.programs || []).map(program => (
                      <span
                        key={program.id}
                        className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full cursor-pointer hover:bg-blue-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProgramClick(program.id, resource.publicId);
                        }}
                      >
                        {program.name}
                      </span>
                    ))}
                    {(!resource.programs || resource.programs.length === 0) && (
                      <div className="w-full flex justify-center">-</div>
                    )}
                  </div>
                </td>
                <td className="p-1 text-gray-700 text-sm border-r border-gray-200">
                  <span
                    className={`px-1 py-0.5 rounded-full text-xs ${(resource.status || "pool") === "pool"
                        ? "bg-blue-100 text-blue-800"
                        : resource.status === "deployed"
                          ? "bg-green-100 text-green-800"
                          : resource.status === "pip"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    onMouseEnter={() => resource.status === "deployed" && setHoveredResource(resource)}
                    onMouseLeave={() => setHoveredResource(null)}
                  >
                    {(resource.status || "pool").charAt(0).toUpperCase() +
                      (resource.status || "pool").slice(1)}
                  </span>
                  {hoveredResource === resource && resource.status === "deployed" && (
                    <div className="absolute z-50 bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 rounded-xl shadow-xl p-3 transition-all duration-200 ease-in-out transform scale-95 hover:scale-100 hover:shadow-2xl">
                      <div className="text-xs font-semibold text-blue-800 mb-1 flex items-center">
                        <FaUser className="mr-1" />
                        Client: <span className="ml-1 font-bold">{resource.clientName || "N/A"}</span>
                      </div>
                      <div className="text-xs text-gray-600 leading-tight bg-blue-50 p-2 rounded-md">
                        <span className="font-medium">Description:</span> {resource.clientDescription || "No description available"}
                      </div>
                      <div className="absolute -top-2 left-4 w-4 h-4 bg-white border-t-2 border-l-2 border-blue-200 transform rotate-45"></div>
                      <div className="absolute inset-0 rounded-xl border-2 border-blue-100 pointer-events-none"></div>
                    </div>
                  )}
                </td>
                <td className="p-1 text-gray-700 text-sm">
                  <div className="flex space-x-1 relative">
                    <div className="relative group">
                      <button
                        className={`flex items-center justify-center w-7 h-7 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors cursor-pointer ${loadingBaselineId === resource.publicId ? "opacity-75" : ""
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

        {sortedResources.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, sortedResources.length)}
              </span>{" "}
              of <span className="font-medium">{sortedResources.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
              >
                <FaAngleDoubleLeft />
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
              >
                <FaAngleLeft />
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
                    className={`w-10 h-10 rounded-md ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-50'}`}
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
                <FaAngleRight />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
              >
                <FaAngleDoubleRight />
              </button>
            </div>
          </div>
        )}

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
                  d="M9.172 16.172a4 4 0 015.656 0M9 10 اختیار M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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