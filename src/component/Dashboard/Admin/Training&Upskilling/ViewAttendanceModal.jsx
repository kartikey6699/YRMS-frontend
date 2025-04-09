// ViewAttendanceModal.js
import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaIdCard, FaCalendarAlt, FaChartPie, FaChevronDown, FaChevronUp, FaTimes, FaCalendarDay, FaComment } from 'react-icons/fa';

const ViewAttendanceModal = ({ onClose }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300);
  };

  const attendanceData = [
    { 
      id: 1, 
      empId: 'EMP001', 
      name: 'John Doe', 
      email: 'john@example.com', 
      trainingDays: 5, 
      absentDays: 1, 
      percentage: 80,
      absentDetails: [
        { date: '2023-06-15', reason: 'Sick leave' }
      ]
    },
    { 
      id: 2, 
      empId: 'EMP002', 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      trainingDays: 5, 
      absentDays: 0, 
      percentage: 100,
      absentDetails: []
    },
    { 
      id: 3, 
      empId: 'EMP003', 
      name: 'Bob Johnson', 
      email: 'bob@example.com', 
      trainingDays: 5, 
      absentDays: 6, 
      percentage: 40,
      absentDetails: [
        { date: '2023-06-16', reason: 'Personal' },
        { date: '2023-06-18', reason: 'Family event' },
        { date: '2023-06-20', reason: 'Medical appointment' },
        { date: '2023-06-22', reason: 'Sick leave' },
        { date: '2023-06-25', reason: 'Emergency' },
        { date: '2023-06-28', reason: 'Vacation' }
      ]
    },
  ];

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 70) return 'text-blue-600 bg-blue-100';
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all duration-300 ${isOpen ? 'scale-100' : 'scale-95'}`}>
        <div className="flex justify-between items-center bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
          <h3 className="text-xl font-bold">
            <FaChartPie className="inline mr-2" />
            View Attendance Summary
          </h3>
          <button 
            onClick={handleClose}
            className="text-white hover:text-purple-200 transition-colors"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-12 gap-2 font-semibold text-sm text-purple-800 border-b pb-2 mb-2">
            <div className="col-span-1"></div>
            <div className="col-span-2">Emp ID</div>
            <div className="col-span-3">Name</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-1 text-center">Days</div>
            <div className="col-span-1 text-center">Absent</div>
            <div className="col-span-1 text-center">%</div>
          </div>
          
          {attendanceData.map((emp) => (
            <div key={emp.id} className="border-b border-gray-100">
              <div 
                className="grid grid-cols-12 gap-2 items-center py-2 hover:bg-purple-50 cursor-pointer"
                onClick={() => toggleRow(emp.id)}
              >
                <div className="col-span-1 flex justify-center">
                  {expandedRow === emp.id ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                <div className="col-span-2 flex items-center">
                  <FaIdCard className="text-purple-600 mr-1" />
                  {emp.empId}
                </div>
                <div className="col-span-3">{emp.name}</div>
                <div className="col-span-3 flex items-center">
                  <FaEnvelope className="text-purple-600 mr-1" />
                  <span className="truncate">{emp.email}</span>
                </div>
                <div className="col-span-1 text-center">{emp.trainingDays}</div>
                <div className="col-span-1 text-center">{emp.absentDays}</div>
                <div className={`col-span-1 text-center font-bold rounded-full px-2 py-1 text-xs ${getPercentageColor(emp.percentage)}`}>
                  {emp.percentage}%
                </div>
              </div>
              
              {expandedRow === emp.id && (
                <div className="bg-gray-50 p-3 mb-2 rounded">
                  <h4 className="text-sm font-semibold text-purple-700 mb-3 flex items-center">
                    <FaCalendarDay className="mr-2" />
                    Absent Details
                  </h4>
                  
                  {emp.absentDetails.length > 0 ? (
                    <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                      {emp.absentDetails.map((detail, index) => (
                        <div key={index} className="bg-white p-3 rounded border border-gray-200">
                          <div className="flex items-center text-purple-700 mb-1">
                            <FaCalendarDay className="mr-2" />
                            <span className="font-medium">{detail.date}</span>
                          </div>
                          <div className="flex items-start text-gray-600">
                            <FaComment className="mr-2 mt-1 flex-shrink-0" />
                            <span>{detail.reason || 'No reason provided'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-green-600 bg-green-50 rounded">
                      Perfect attendance - no absent records
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="bg-gray-50 px-4 py-3 flex justify-end border-t">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAttendanceModal;