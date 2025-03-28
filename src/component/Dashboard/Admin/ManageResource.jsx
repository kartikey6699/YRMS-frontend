import React, { useEffect, useState } from "react";
import { FaPlus, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ResourceList from "./ResourceList";
import { createResource , fetchResources } from "../../../features/resource/resourceAction";
import { addDesignation , addCompetency} from "../../../features/resource/resourceSlice";
import YRMSLoader from "../../helper/loader";
import AddOptionModal from "../../helper/OptionalModal";
import { SuccessToast , ErrorToast } from "../../helper/ResourceToast";
// Custom Dropdown Component
const Dropdown = ({ name, value, options, onChange, setModalField }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    if (option === "add-new") {
      setModalField(name);
    } else {
      onChange({ target: { name, value: option } });
    }
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-3 pr-10 border-2 border-gray-200 rounded-lg text-left focus:outline-none focus:border-blue-500 transition-colors ${
          value ? "text-black" : "text-gray-500"
        }`}
      >
        <span>{value || `Select ${name}`}</span>
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
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {option}
            </div>
          ))}
          <div
            onClick={() => handleSelect("add-new")}
            className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 cursor-pointer text-sm font-medium border-t border-gray-200 flex items-center justify-between"
          >
            <span>Add New {name}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

const ManageResource = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { resources, loading, error, designations, competencies } = useSelector(
    (state) => state.resource
  );
  const [activeSection, setActiveSection] = useState("view");
  const [modalField, setModalField] = useState(null);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    employeeName: "",
    gender: "",
    location: "",
    email: "",
    phoneNumber: "",
    joiningDate: "",
    designation: "",
    employeeType: "",
    grade: "",
    businessGroup: "",
    businessUnit: "",
    competency: "",
    status: "pool",
  });

  useEffect(() => {
    dispatch(fetchResources()); // Fetch resources on mount (adjust endpoint if needed)
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createResource(formData)).unwrap();
      setToast(<SuccessToast message="Resource created successfully!" onClose={() => setToast(null)} />);
      setActiveSection("view");
      setFormData({
        employeeName: "",
        gender: "",
        location: "",
        email: "",
        phoneNumber: "",
        joiningDate: "",
        designation: "",
        employeeType: "",
        grade: "",
        businessGroup: "",
        businessUnit: "",
        competency: "",
        status: "pool",
      });
    } catch (err) {
      setToast(<ErrorToast message={err || "Failed to create resource"} onClose={() => setToast(null)} />);
    }
  };

  const handleAddOption = (field, newOption) => {
    if (newOption.trim()) {
      if (field === "designations") {
        dispatch(addDesignation(newOption.trim()));
      } else if (field === "competencies") {
        dispatch(addCompetency(newOption.trim()));
      }
    }
    setModalField(null);
  };

  const handleBaselineClick = (resource) => {
    navigate("/manage-baseline", { state: { resource } });
  };

  const handleOpportunitiesClick = (resource) => {
    navigate("/opportunities", { state: { resource } });
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg">
      {loading && <YRMSLoader />}
      {toast}
      {activeSection !== "add" && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-bold text-blue-800">Resource Details</h2>
            <button
              className="px-4 py-2 rounded-lg font-semibold text-sm flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              onClick={() => setActiveSection("add")}
            >
              <FaPlus className="mr-2" />
              Add Resource
            </button>
          </div>
        </div>
      )}

      {activeSection === "add" ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <button
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              onClick={() => setActiveSection("view")}
            >
              <FaArrowLeft className="mr-2" />
              Back to Resources
            </button>
          </div>
          <h2 className="text-3xl font-bold text-blue-800 mb-6">Add New Resource</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Employee Name</label>
              <input
                type="text"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter employee name"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={`w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${
                  formData.gender ? "text-black" : "text-gray-500"
                }`}
                required
              >
                <option value="" disabled>
                  Select gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter location"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter email"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter phone number"
                required
              />
            </div>

            {/* Employment Details */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-6">Employment Details</h3>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Joining Date</label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Designation</label>
              <Dropdown
                name="designation"
                value={formData.designation}
                options={designations}
                onChange={handleInputChange}
                setModalField={setModalField}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Employee Type</label>
              <select
                name="employeeType"
                value={formData.employeeType}
                onChange={handleInputChange}
                className={`w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${
                  formData.employeeType ? "text-black" : "text-gray-500"
                }`}
                required
              >
                <option value="" disabled>
                  Select type
                </option>
                <option value="probation">Probation</option>
                <option value="permanent">Permanent</option>
                <option value="contract">Contract</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Grade</label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className={`w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${
                  formData.grade ? "text-black" : "text-gray-500"
                }`}
                required
              >
                <option value="" disabled>
                  Select grade
                </option>
                {["E1", "E2", "E3", "E4", "E5", "E6", "E7"].map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={`w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${
                  formData.status ? "text-black" : "text-gray-500"
                }`}
                required
              >
                <option value="pool">Pool</option>
                <option value="deployed">Deployed</option>
                <option value="pip">PIP</option>
                <option value="hold">Hold</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Business Group</label>
              <select
                name="businessGroup"
                value={formData.businessGroup}
                onChange={handleInputChange}
                className={`w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${
                  formData.businessGroup ? "text-black" : "text-gray-500"
                }`}
                required
              >
                <option value="" disabled>
                  Select business group
                </option>
                <option value="Technology Solutions">Technology Solutions</option>
                <option value="Management Team">Management Team</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Business Unit</label>
              <select
                name="businessUnit"
                value={formData.businessUnit}
                onChange={handleInputChange}
                className={`w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors ${
                  formData.businessUnit ? "text-black" : "text-gray-500"
                }`}
                required
              >
                <option value="" disabled>
                  Select business unit
                </option>
                <option value="Development Team">Development Team</option>
                <option value="Management Team">Management Team</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Competency</label>
              <Dropdown
                name="competency"
                value={formData.competency}
                options={competencies}
                onChange={handleInputChange}
                setModalField={setModalField}
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex justify-center mt-8">
              <button
                type="submit"
                disabled={loading}
                className={`px-16 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                }`}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <ResourceList
          handleBaselineClick={handleBaselineClick}
          handleOpportunitiesClick={handleOpportunitiesClick}
        />
      )}

      {modalField && (
        <AddOptionModal
          field={modalField === "designation" ? "designations" : "competencies"}
          options={modalField === "designation" ? designations : competencies}
          onAddOption={handleAddOption}
          onDeleteOption={(field, option) =>
            dispatch(modalField === "designation" ? deleteDesignation(option) : deleteCompetency(option))
          }
          onClose={() => setModalField(null)}
        />
      )}
    </div>
  );
};

export default ManageResource;