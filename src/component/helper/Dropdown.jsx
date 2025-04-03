import React, { useState, useEffect, useRef } from "react";
import { FaSpinner, FaPlus } from "react-icons/fa";

const Dropdown = ({
  name,
  value,
  options,
  onChange,
  setModalField,
  loading,
  dependentValue,
  technologyCategories,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getFilteredOptions = () => {
    if (name === "technology" && dependentValue) {
      const category = technologyCategories?.find(
        (cat) => cat.publicId === dependentValue
      );
      return category?.technologies || [];
    }
    return options || [];
  };

  const filteredOptions = getFilteredOptions();

  const handleSelect = (option) => {
    if (option === "add-new") {
      // Pass the field name directly to setModalField
      setModalField(name);
    } else {
      const selectedValue =
        name === "designation" || name === "competency"
          ? typeof option === "object"
            ? option.name
            : option
          : typeof option === "object"
          ? option.publicId
          : option;
      onChange({ target: { name, value: selectedValue } });
    }
    setIsOpen(false);
  };

  const getDisplayValue = () => {
    if (!value) return `Select ${name}`;

    if (name === "technology" && technologyCategories) {
      const tech = technologyCategories
        .flatMap((cat) => cat.technologies)
        .find((t) => t.publicId === value);
      return tech?.name || value;
    }

    if (name === "designation" || name === "competency") {
      return value; // Value is already the name
    }

    // For category or other fields where value is publicId
    const foundOption = options?.find(
      (opt) => (typeof opt === "object" ? opt.publicId : opt) === value
    );
    return foundOption?.name || value;
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
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
          <span>{getDisplayValue()}</span>
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="max-h-[240px] overflow-y-auto">
            {filteredOptions.map((option) => {
              const optionKey =
                typeof option === "object" ? option.publicId : option;
              const optionDisplay =
                typeof option === "object" ? option.name : option;

              return (
                <div
                  key={optionKey}
                  onClick={() => handleSelect(option)}
                  className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {optionDisplay}
                </div>
              );
            })}
            <div
              onClick={() => handleSelect("add-new")}
              className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 cursor-pointer text-sm font-medium border-t border-gray-200 flex items-center justify-between sticky bottom-0"
            >
              <span>Add New {name}</span>
              <FaPlus className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;