import React from 'react';
import { FaExclamationTriangle, FaTimes, FaCheck } from 'react-icons/fa';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  resourceName 
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with stronger blur */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-40" />
      
      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl mx-4 border border-gray-200">
          <div className="flex items-center mb-4">
            <FaExclamationTriangle className="text-yellow-500 mr-2" size={24} />
            <h3 className="text-lg font-semibold">Confirm Deletion</h3>
          </div>
          
          <p className="mb-6">
            Are you sure you want to delete <span className="font-semibold">{resourceName}</span>? 
            This action cannot be undone.
          </p>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center transition-colors"
            >
              <FaTimes className="mr-2" /> Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center transition-colors"
            >
              <FaCheck className="mr-2" /> Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmationModal;