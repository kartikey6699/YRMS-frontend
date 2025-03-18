// DropdownWithSearchAndCheckbox.jsx
import React, { useState } from 'react';

const DropdownWithSearchAndCheckbox = ({ field, selectedValues, options, onChange, onAddNew, isOpen, setIsOpen }) => {
  const [search, setSearch] = useState('');

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  const handleOptionToggle = (option) => {
    const newSelected = selectedValues.includes(option)
      ? selectedValues.filter(item => item !== option)
      : [...selectedValues, option];
    onChange(field, newSelected);
  };

  const handleAddNewClick = () => {
    onAddNew(field);
    setIsOpen(false); // Close dropdown when adding new option
  };

  return (
    <div className="relative w-64">
      <label className="block text-gray-700 font-medium mb-1">{field}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)} // Use prop setIsOpen instead of local state
        className="w-full p-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 flex justify-between items-center"
      >
        <span>{`Select ${field}`}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {selectedValues.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1">
          {selectedValues.map((value) => (
            <span
              key={value}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
            >
              {value}
              <button
                type="button"
                onClick={() => handleOptionToggle(value)}
                className="ml-1 focus:outline-none"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M4 7h16" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          <div className="p-2 border-b">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 p-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search..."
              />
            </div>
          </div>
          <div className="max-h-40 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {filteredOptions.map(opt => (
              <div
                key={opt}
                onClick={() => handleOptionToggle(opt)}
                className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(opt)}
                  onChange={() => handleOptionToggle(opt)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
                <label className="w-full ml-2 text-sm">{opt}</label>
              </div>
            ))}
            {filteredOptions.length === 0 && (
              <div className="p-2 text-gray-500">No options found</div>
            )}
          </div>
          <button
            type="button"
            onClick={handleAddNewClick}
            className="w-full p-2 text-blue-600 border-t hover:bg-gray-100 text-sm"
          >
            {`Add ${field}`}
          </button>
        </div>
      )}
    </div>
  );
};

export default DropdownWithSearchAndCheckbox;