import React, { useState, useMemo } from "react";
import { FaChartLine, FaLightbulb, FaSortUp, FaSortDown, FaSort, FaSpinner } from "react-icons/fa";
import { useSelector } from "react-redux";
import EmployeeDetail from './EmployeDetail';

const ResourceList = ({ 
  handleBaselineClick, 
  handleOpportunitiesClick, 
  filterData 
}) => {
  const { resources, loading, error } = useSelector((state) => state.resource);
  const [searchTerms, setSearchTerms] = useState({
    employeeName: "",
    joiningDate: "",
    designation: "",
    status: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [selectedResource, setSelectedResource] = useState(null);
  const [loadingBaselineId, setLoadingBaselineId] = useState(null);

  const handleSearchChange = (e, column) => {
    setSearchTerms((prev) => ({ ...prev, [column]: e.target.value }));
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedResources = useMemo(() => {
    return [...(resources || [])]
      .filter((resource = {}) => {
        return (
          (resource?.employeeName || "").toLowerCase().includes(searchTerms.employeeName.toLowerCase()) &&
          (resource.joiningDate || "").toLowerCase().includes(searchTerms.joiningDate.toLowerCase()) &&
          (resource.designation || "").toLowerCase().includes(searchTerms.designation.toLowerCase()) &&
          (!searchTerms.status || (resource.status || "pool") === searchTerms.status) &&
          (filterData.technologies.length === 0 ||
            (resource.technologies &&
              filterData.technologies.every(tech => resource.technologies.includes(tech)))) &&
          (!filterData.totalExperience ||
            (resource.experience &&
              resource.experience >= parseInt(filterData.totalExperience)))
        );
      })
      .sort((a, b) => {
        if (!sortConfig.key) return 0;
        const valueA = a[sortConfig.key] || "";
        const valueB = b[sortConfig.key] || "";
        return sortConfig.direction === "ascending"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      });
  }, [resources, searchTerms, sortConfig, filterData]);

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
    { key: "status", label: "Status" },
  ];

  if (loading) return <div className="text-center py-8">Loading resources...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>;

  return (
    <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-blue-50 to-purple-50 text-gray-800">
            {columns.map((column) => (
              <th
                key={column.key}
                className="p-1 text-left font-semibold text-sm border-b border-gray-200" // Reduced padding
              >
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <span>{column.label}</span>
                    {column.key !== "sno" && column.key !== "status" && (
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
                  {column.key !== "sno" && column.key !== "status" && (
                    <input
                      type="text"
                      value={searchTerms[column.key]}
                      onChange={(e) => handleSearchChange(e, column.key)}
                      placeholder={`Search ${column.label}`}
                      className="w-full p-1 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 placeholder-gray-400"
                    />
                  )}
                  {column.key === "status" && (
                    <select
                      value={searchTerms.status}
                      onChange={(e) => handleSearchChange(e, "status")}
                      className="w-full p-1 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Statuses</option>
                      <option value="pool">Pool</option>
                      <option value="deployed">Deployed</option>
                      <option value="pip">PIP</option>
                      <option value="hold">Hold</option>
                    </select>
                  )}
                </div>
              </th>
            ))}
            <th className="p-1 text-left font-semibold text-sm border-b border-gray-200">Actions</th> {/* Reduced padding */}
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedResources.map((resource, index) => (
            <tr key={resource.publicId} className={`h-8 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}> {/* Zebra striping */}
              <td className="p-1 text-gray-700 text-sm border-r border-gray-200"> {/* Reduced padding */}
                {index + 1}
              </td>
              <td
                className="p-1 text-blue-600 text-sm cursor-pointer hover:underline border-r border-gray-200" // Reduced padding
                onClick={() => setSelectedResource(resource.publicId)}
              >
                {resource.employeeName || "N/A"}
              </td>
              <td className="p-1 text-gray-700 text-sm border-r border-gray-200"> {/* Reduced padding */}
                {resource.joiningDate ? new Date(resource.joiningDate).toLocaleDateString() : "N/A"}
              </td>
              <td className="p-1 text-gray-700 text-sm border-r border-gray-200"> {/* Reduced padding */}
                {resource.designation || "N/A"}
              </td>
              <td className="p-1 text-gray-700 text-sm border-r border-gray-200"> {/* Reduced padding */}
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
              </td>
              <td className="p-1 text-gray-700 text-sm"> {/* Reduced padding */}
                <div className="flex space-x-1"> {/* Further reduced space between buttons */}
                  <button
                    className={`flex items-center justify-center w-7 h-7 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors relative group cursor-pointer ${loadingBaselineId === resource.publicId ? "opacity-75" : ""}`} // Further reduced button size
                    onClick={() => handleBaselineClickWithLoading(resource)}
                    disabled={loadingBaselineId === resource.publicId}
                  >
                    {loadingBaselineId === resource.publicId ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaChartLine />
                    )}
                    <span className="absolute bottom-full mb-1 w-max px-1 py-0.5 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      Baseline
                    </span>
                  </button>
                  <button
                    className="flex items-center justify-center w-7 h-7 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors relative group cursor-pointer" // Further reduced button size
                    onClick={() => handleOpportunitiesClick(resource)}
                  >
                    <FaLightbulb />
                    <span className="absolute bottom-full mb-1 w-max px-1 py-0.5 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      Opportunities
                    </span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedResource && (
        <EmployeeDetail
          key={selectedResource}
          publicId={selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      )}

      {!loading && filteredAndSortedResources.length === 0 && (
        <div className="text-center py-8 bg-white">
          <div className="text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700">No resources found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default ResourceList;