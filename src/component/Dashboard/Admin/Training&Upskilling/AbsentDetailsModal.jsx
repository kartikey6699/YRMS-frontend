// AbsentDetailsModal.js
import React, { useState } from 'react';
import { FaCalendarDay, FaComment, FaTimes } from 'react-icons/fa';

const AbsentDetailsModal = ({ employee, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden transform transition-all duration-300 ${isOpen ? 'scale-100' : 'scale-95'}`}>
        <div className="flex justify-between items-center bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
          <h3 className="text-xl font-bold">
            <FaCalendarDay className="inline mr-2" />
            Absent Details for {employee.name}
          </h3>
          <button 
            onClick={handleClose}
            className="text-white hover:text-purple-200 transition-colors"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[70vh]">
          {employee.absentDetails.length > 0 ? (
            <div className="space-y-3">
              {employee.absentDetails.map((detail, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3 hover:bg-purple-50">
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
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
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
              <h3 className="text-lg font-medium text-gray-700">No absent records found</h3>
              <p className="text-gray-500 mt-1">This employee has perfect attendance</p>
            </div>
          )}
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

export default AbsentDetailsModal;