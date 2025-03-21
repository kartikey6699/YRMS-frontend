// EmployeeTable.jsx
import React, { useState } from 'react';

const EmployeeTable = ({ employees, onBaseline }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  // Function to handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort the employees array based on the sort configuration
  const sortedEmployees = [...employees].sort((a, b) => {
    if (sortConfig.key === 'name') {
      return sortConfig.direction === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortConfig.key === 'employeeId') {
      return sortConfig.direction === 'asc'
        ? a.employeeId.localeCompare(b.employeeId)
        : b.employeeId.localeCompare(a.employeeId);
    } else if (sortConfig.key === 'position') {
      return sortConfig.direction === 'asc'
        ? a.position.localeCompare(b.position)
        : b.position.localeCompare(a.position);
    } else if (sortConfig.key === 'phone') {
      return sortConfig.direction === 'asc'
        ? a.phone.localeCompare(b.phone)
        : b.phone.localeCompare(a.phone);
    }
    return 0;
  });

  // Function to get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? (
      <svg className="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
        <thead>
          <tr className="bg-red-500 text-white">
            <th
              className="py-3 px-6 text-left font-semibold cursor-pointer hover:bg-red-600 transition-colors"
              onClick={() => handleSort('name')}
            >
              Name {getSortIcon('name')}
            </th>
            <th
              className="py-3 px-6 text-left font-semibold cursor-pointer hover:bg-red-600 transition-colors"
              onClick={() => handleSort('employeeId')}
            >
              Employee ID {getSortIcon('employeeId')}
            </th>
            <th
              className="py-3 px-6 text-left font-semibold cursor-pointer hover:bg-red-600 transition-colors"
              onClick={() => handleSort('position')}
            >
              Position {getSortIcon('position')}
            </th>
            <th
              className="py-3 px-6 text-left font-semibold cursor-pointer hover:bg-red-600 transition-colors"
              onClick={() => handleSort('phone')}
            >
              Phone {getSortIcon('phone')}
            </th>
            <th className="py-3 px-6 text-left font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedEmployees.map((employee) => (
            <tr
              key={employee.employeeId}
              className="border-b border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <td className="py-3 px-6">{employee.name}</td>
              <td className="py-3 px-6">{employee.employeeId}</td>
              <td className="py-3 px-6">{employee.position}</td>
              <td className="py-3 px-6">{employee.phone}</td>
              <td className="py-3 px-6">
                <button
                  onClick={() => onBaseline(employee)}
                  className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 transition-colors shadow-sm"
                >
                  Baseline
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;