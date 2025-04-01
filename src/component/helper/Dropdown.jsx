import React, { useState, useEffect, useRef } from "react";
import { FaSpinner } from "react-icons/fa";

const Dropdown = ({ name, value, options, onChange, setModalField }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null); // Ref for the dropdown container

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    if (option === "add-new") {
      setModalField(name);
    } else {
      onChange({ target: { name, value: typeof option === 'object' ? option.name : option } });
    }
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}> {/* Attach ref here */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-3 pr-10 border-2 border-gray-200 rounded-lg text-left focus:outline-none focus:border-blue-500 transition-colors ${
          value ? "text-black" : "text-gray-500"
        }`}
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center">
            <FaSpinner className="animate-spin mr-2" />
            Loading...
          </span>
        ) : (
          <span>{value || `Select ${name}`}</span>
        )}
        {!loading && (
          <svg
            className={`w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="max-h-[240px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {options.map((option) => (
              <div
                key={typeof option === 'object' ? option.publicId : option}
                onClick={() => handleSelect(option)}
                className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {typeof option === 'object' ? option.name : option}
              </div>
            ))}
            <div
              onClick={() => handleSelect("add-new")}
              className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 cursor-pointer text-sm font-medium border-t border-gray-200 flex items-center justify-between sticky bottom-0"
            >
              <span>Add New {name}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;