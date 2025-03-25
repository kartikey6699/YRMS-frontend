import React, { useState } from 'react';

const AddOptionModal = ({ field, options, onAddOption, onDeleteOption, onClose }) => {
  const [newOption, setNewOption] = useState('');

  const handleAdd = () => {
    if (newOption.trim() && !options.includes(newOption)) {
      if (field === 'skillCategories') {
        onAddOption(newOption);
      } else {
        onAddOption(field, newOption);
      }
      setNewOption('');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-60"> {/* Increased z-index */}
      <div className="bg-white p-4 rounded-lg shadow-lg w-80 max-h-[80vh] flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          {field === 'skillCategories' ? 'Add New Skill Category' : `Add New ${field}`}
        </h3>
        <div className="flex items-center mb-3">
          <input
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={field === 'skillCategories' ? 'Enter new category' : `Enter new ${field}`}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button
            onClick={handleAdd}
            className="ml-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
          >
            Add
          </button>
        </div>
        {field !== 'skillCategories' && (
          <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {options.map((option) => (
              <div
                key={option}
                className="flex items-center justify-between p-2 hover:bg-gray-100"
              >
                <span className="text-sm text-gray-700">{option}</span>
                <button
                  onClick={() => onDeleteOption(field, option)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="mt-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOptionModal;