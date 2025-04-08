// AttendanceDetailsModal.js
import React, { useState } from 'react';
import { FaCalendarAlt, FaUser, FaEnvelope, FaIdCard, FaCheck, FaTimes } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AttendanceDetailsModal = ({ onClose }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([
    { id: 1, empId: 'EMP001', name: 'John Doe', email: 'john@example.com', present: true, reason: '' },
    { id: 2, empId: 'EMP002', name: 'Jane Smith', email: 'jane@example.com', present: false, reason: 'Sick leave' },
    { id: 3, empId: 'EMP003', name: 'Bob Johnson', email: 'bob@example.com', present: true, reason: '' },
    { id: 4, empId: 'EMP004', name: 'Alice Brown', email: 'alice@example.com', present: false, reason: 'Personal' },
  ]);

  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 200);
  };

  const handleAttendanceChange = (id, field, value) => {
    setAttendanceData(attendanceData.map(item => 
      item.id === id 
        ? { ...item, [field]: value, ...(field === 'present' && !value ? {} : { reason: '' }) }
        : item
    ));
  };

  return (
    <div className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div 
        className={`bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden transform transition-all duration-200 ${isOpen ? 'scale-100' : 'scale-95'} border-2 border-purple-200`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
          <h3 className="text-xl font-bold">
            <FaUser className="inline mr-2" />
            Attendance Details
          </h3>
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2" />
            <DatePicker
              selected={selectedDate}
              onChange={date => setSelectedDate(date)}
              className="bg-purple-700 border-none text-white rounded px-2 py-1 focus:outline-none"
              dateFormat="MMMM d, yyyy"
            />
            <button 
              onClick={handleClose}
              className="ml-4 text-white hover:text-purple-200 transition-colors"
            >
              <FaTimes />
            </button>
          </div>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-12 gap-2 font-semibold text-sm text-purple-800 border-b pb-2 mb-2">
            <div className="col-span-1">#</div>
            <div className="col-span-2">Emp ID</div>
            <div className="col-span-2">Name</div>
            <div className="col-span-2">Email</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-4">Reason for Absence</div>
          </div>
          
          {attendanceData.map((emp, index) => (
            <div key={emp.id} className="grid grid-cols-12 gap-2 items-start py-3 border-b border-gray-100 hover:bg-purple-50">
              <div className="col-span-1 text-gray-600 mt-1">{index + 1}</div>
              <div className="col-span-2 flex items-center">
                <FaIdCard className="text-purple-600 mr-1" />
                {emp.empId}
              </div>
              <div className="col-span-2 mt-1">{emp.name}</div>
              <div className="col-span-2 flex items-center">
                <FaEnvelope className="text-purple-600 mr-1" />
                <span className="truncate">{emp.email}</span>
              </div>
              <div className="col-span-1 mt-1">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={emp.present}
                    onChange={(e) => handleAttendanceChange(emp.id, 'present', e.target.checked)}
                    className="form-checkbox h-4 w-4 text-purple-600 transition duration-150 ease-in-out"
                  />
                  <span className="ml-2">{emp.present ? 'Present' : 'Absent'}</span>
                </label>
              </div>
              <div className="col-span-4">
                {!emp.present && (
                  <textarea
                    value={emp.reason}
                    onChange={(e) => handleAttendanceChange(emp.id, 'reason', e.target.value)}
                    placeholder="Enter detailed reason for absence..."
                    rows={3}
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-y min-h-[80px]"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-3 border-t">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            Save Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceDetailsModal;