import React, { useState } from "react";
import { FaSearch, FaTimes, FaEdit, FaTrash, FaCheck, FaPlus } from "react-icons/fa";
import { SuccessToast, ErrorToast } from "./ResourceToast";
import { useDispatch } from "react-redux";
import {
  updateCertificationAuthority,
  deleteCertificationAuthority,
  updateTechnologyCategory,
  deleteTechnologyCategory,
  updateTechnologyStack,
  deleteTechnologyStack,
  createCertificationAuthority,
  createTechnologyCategory,
  createTechnologyStack,
  fetchCertificationAuthorities,
  fetchTechnologyCategories,
  fetchTechnologyStacks
} from "../../features/baseline/baselineAction";

import {
  updateDesignation, deleteDesignation,
  updateCompetency,
  deleteCompetency, createDesignation, fetchCompetencies, fetchDesignations, createCompetency
} from "../../features/resource/resourceAction";

const AddOptionModal = ({ field, options, onClose, setToast }) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [newOption, setNewOption] = useState("");
  const [editingOption, setEditingOption] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = async () => {
    if (!newOption.trim()) return;

    try {
      setLoading(true);
      let result;
      switch (field) {
        case "designation":
          result = await dispatch(createDesignation(newOption.trim())).unwrap();
          dispatch(fetchDesignations());
          break;
        case "competency":
          result = await dispatch(createCompetency(newOption.trim())).unwrap();
          dispatch(fetchCompetencies());
          break;
        case "certification_authority":
          result = await dispatch(createCertificationAuthority(newOption.trim())).unwrap();
          dispatch(fetchCertificationAuthorities());
          break;
        case "technology_category":
          result = await dispatch(createTechnologyCategory(newOption.trim())).unwrap();
          dispatch(fetchTechnologyCategories());
          break;
        case "technology_stack":
          // For technology stack, we need to know the category
          const category = options.find(opt => opt.name === field)?.publicId;
          if (category) {
            result = await dispatch(createTechnologyStack({
              categoryId: category,
              name: newOption.trim()
            })).unwrap();
            dispatch(fetchTechnologyStacks(category));
          }
          break;
        default:
          break;
      }
      setToast(<SuccessToast message={`${getFieldLabel()} added successfully!`} onClose={() => setToast(null)} />);
      setNewOption("");
    } catch (error) {
      setToast(<ErrorToast message={error.message} onClose={() => setToast(null)} />);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editValue.trim() || !editingOption) return;

    try {
      setLoading(true);
      let result;
      switch (field) {
        case "designation":
          result = await dispatch(updateDesignation({
            id: editingOption.publicId,
            name: editValue.trim()
          })).unwrap();
          dispatch(fetchDesignations());
          break;
        case "competency":
          result = await dispatch(updateCompetency({
            id: editingOption.publicId,
            name: editValue.trim()
          })).unwrap();
          dispatch(fetchCompetencies());
          break;
        case "certification_authority":
          result = await dispatch(updateCertificationAuthority({
            id: editingOption.publicId,
            name: editValue.trim()
          })).unwrap();
          dispatch(fetchCertificationAuthorities());
          break;
        case "technology_category":
          result = await dispatch(updateTechnologyCategory({
            id: editingOption.publicId,
            name: editValue.trim()
          })).unwrap();
          dispatch(fetchTechnologyCategories());
          break;
        case "technology_stack":
          result = await dispatch(updateTechnologyStack({
            id: editingOption.publicId,
            name: editValue.trim()
          })).unwrap();
          // Find the category for this technology stack
          const category = options.find(opt => opt.publicId === editingOption.categoryId)?.publicId;
          if (category) {
            dispatch(fetchTechnologyStacks(category));
          }
          break;
        default:
          break;
      }
      setToast(<SuccessToast message={`${getFieldLabel()} updated successfully!`} onClose={() => setToast(null)} />);
      setEditingOption(null);
      setEditValue("");
    } catch (error) {
      setToast(<ErrorToast message={error.message} onClose={() => setToast(null)} />);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (option) => {
    try {
      setLoading(true);
      switch (field) {
        case "designation":
          await dispatch(deleteDesignation(option.publicId)).unwrap();
          dispatch(fetchDesignations());
          break;
        case "competency":
          await dispatch(deleteCompetency(option.publicId)).unwrap();
          dispatch(fetchCompetencies());
          break;
        case "certification_authority":
          await dispatch(deleteCertificationAuthority(option.publicId)).unwrap();
          dispatch(fetchCertificationAuthorities());
          break;
        case "technology_category":
          await dispatch(deleteTechnologyCategory(option.publicId)).unwrap();
          dispatch(fetchTechnologyCategories());
          break;
        case "technology_stack":
          await dispatch(deleteTechnologyStack(option.publicId)).unwrap();
          // Find the category for this technology stack
          const category = options.find(opt => opt.publicId === option.categoryId)?.publicId;
          if (category) {
            dispatch(fetchTechnologyStacks(category));
          }
          break;
        default:
          break;
      }
      setToast(<SuccessToast message={`${getFieldLabel()} deleted successfully!`} onClose={() => setToast(null)} />);
    } catch (error) {
      setToast(<ErrorToast message={error.message} onClose={() => setToast(null)} />);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (option) => {
    setEditingOption(option);
    setEditValue(option.name);
  };

  const cancelEditing = () => {
    setEditingOption(null);
    setEditValue("");
  };

  const getFieldLabel = () => {
    switch (field) {
      case "designation":
        return "Designation";
      case "competency":
        return "Competency";
      case "certification_authority":
        return "Certification Authority";
      case "technology_category":
        return "Technology Category";
      case "technology_stack":
        return "Technology Stack";
      default:
        return field;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-sm max-h-[70vh] flex flex-col border border-gray-300"
        style={{ minWidth: '300px' }}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-blue-50">
          <h3 className="text-lg font-semibold text-gray-800">
            Manage {getFieldLabel()}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={`Search ${getFieldLabel()}...`}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="mb-4 flex">
            <input
              type="text"
              placeholder={`Add new ${getFieldLabel()}`}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            />
            <button
              onClick={handleAdd}
              disabled={loading}
              className="bg-blue-600 text-white px-3 py-2 rounded-r-md hover:bg-blue-700 transition-colors flex items-center text-sm disabled:bg-blue-400"
            >
              {loading ? 'Adding...' : <><FaPlus className="mr-1" /> Add</>}
            </button>
          </div>

          <div className="border border-gray-200 rounded-md flex-1 overflow-hidden">
            <div className="h-[200px] overflow-y-auto custom-scrollbar">
              {filteredOptions.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No {getFieldLabel()} found
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {filteredOptions.map((option) => (
                    <li key={option.publicId} className="p-2 hover:bg-gray-50">
                      {editingOption?.publicId === option.publicId ? (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded-md mr-2 text-sm"
                            onKeyPress={(e) => e.key === 'Enter' && handleUpdate()}
                          />
                          <button
                            onClick={handleUpdate}
                            disabled={loading}
                            className="p-1 text-green-600 hover:text-green-800 mr-1"
                            title="Save"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Cancel"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-800 text-sm">{option.name}</span>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => startEditing(option)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                              title="Edit"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(option)}
                              className="p-1 text-red-600 hover:text-red-800"
                              title="Delete"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-gray-200 flex justify-end bg-gray-50">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOptionModal;