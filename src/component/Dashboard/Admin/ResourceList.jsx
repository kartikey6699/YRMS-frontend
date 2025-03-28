import React, { useState } from "react";
import { FaChartLine, FaLightbulb, FaSortUp, FaSortDown, FaSort } from "react-icons/fa";
import { useSelector } from "react-redux";
// import EmployeeDetail from "./EmployeeDetail";
import EmployeeDetail from "./EmployeDetail"

const ResourceList = ({ handleBaselineClick, handleOpportunitiesClick }) => {
  const { resources, loading } = useSelector((state) => state.resource);
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

  const filteredAndSortedResources = [...resources]
    .filter((resource) => {
      return (
        resource.employeeName.toLowerCase().includes(searchTerms.employeeName.toLowerCase()) &&
        (resource.joiningDate || "").toLowerCase().includes(searchTerms.joiningDate.toLowerCase()) &&
        (resource.designation || "").toLowerCase().includes(searchTerms.designation.toLowerCase()) &&
        (!searchTerms.status || (resource.status || "pool") === searchTerms.status)
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

  const columns = [
    { key: "sno", label: "S.No" },
    { key: "employeeName", label: "Employee Name" },
    { key: "joiningDate", label: "Joining Date" },
    { key: "designation", label: "Designation" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" }
  ];

  return (
    <div>
      {/* Resource Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-800">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="p-3 text-left font-semibold text-sm border-b border-gray-200"
                >
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <span>{column.label}</span>
                      {column.key !== "sno" && column.key !== "actions" && (
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
                    {column.key !== "sno" && column.key !== "actions" && (
                      <input
                        type="text"
                        value={searchTerms[column.key]}
                        onChange={(e) => handleSearchChange(e, column.key)}
                        placeholder={`Search ${column.label}`}
                        className="w-full p-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                    {column.key === "status" && (
                      <select
                        value={searchTerms.status}
                        onChange={(e) => handleSearchChange(e, "status")}
                        className="w-full p-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Statuses</option>
                        <option value="pool">Pool</option>
                        <option value="deployed">Deployed</option>
                        <option value="pip">PIP</option>
                      </select>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedResources.map((resource, index) => (
              <tr
                key={resource.publicId}
                className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition-colors`}
              >
                <td className="p-3 text-gray-700 text-sm border-r border-gray-200">{index + 1}</td>
                <td
                  className="p-3 text-blue-600 text-sm border-r border-gray-200 cursor-pointer hover:underline"
                  onClick={() => setSelectedResource(resource.publicId)}
                >
                  {resource.employeeName}
                </td>
                <td className="p-3 text-gray-700 text-sm border-r border-gray-200">
                  {resource.joiningDate ? new Date(resource.joiningDate).toLocaleDateString() : "N/A"}
                </td>
                <td className="p-3 text-gray-700 text-sm border-r border-gray-200">
                  {resource.designation || "N/A"}
                </td>
                <td className="p-3 text-gray-700 text-sm border-r border-gray-200">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
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

      {selectedResource && (
        <EmployeeDetail 
          publicId={selectedResource} 
          onClose={() => setSelectedResource(null)} 
        />
      )}
    </div>
  );
};

export default ResourceList;