import React, { useState, useEffect } from "react";
import {
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaUserTie,
  FaUsers,
  FaTimes,
  FaCheck,
  FaPlus,
  FaCalendarDay,
  FaProjectDiagram,
  FaUserPlus,
  FaInfoCircle
} from "react-icons/fa";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { holidays, isHoliday } from "../../../helper/holidays";
import { useDispatch, useSelector } from "react-redux";
import Dropdown from "../../../helper/Dropdown";
import AddOptionModal from "../../../helper/OptionalModal";
import { ErrorToast, SuccessToast } from '../../../helper/ResourceToast';
import YRMSLoader from '../../../helper/loader';
import { createProgram, fetchProgramList } from '../../../../features/program/programAction'; // Adjust path as needed
import { fetchTrainingTechnologies, fetchResources, fetchCompetencies } from "../../../../features/resource/resourceAction";

const AddTraining = ({ onClose, onSave, isUpskilling = false }) => {
  const dispatch = useDispatch();
  const { resources, competencies, trainingTechnologies, trainingTechnologyLoading } = useSelector(
    (state) => state.resource
  );

  const trainerOptions = resources.map(resource => ({
    value: resource.publicId,
    label: resource.employeeName,
  }));

  const competencyOptions = competencies.map(competency => ({
    value: competency.publicId,
    label: competency.name,
  }));

  const requesterOptions = [
    { value: 1, label: "HR Department" },
    { value: 2, label: "Engineering_Team" },
    { value: 3, label: "Project_Management_Office" },
    // { value: "employee", label: "Employee Request" },
  ];


  const [formData, setFormData] = useState({
    programName: "",
    trainerId: "",
    startDate: "",
    duration: "",
    endDate: "",
    requester: null,
    competencyId: null,
    technology: "",
    projectDescription: "",
    purpose: "",
    participants: [],
  });

  const [errors, setErrors] = useState({});
  const [modalField, setModalField] = useState(null);
  const [toast, setToast] = useState(null);

  // Fetch training technologies on mount
  useEffect(() => {
    dispatch(fetchTrainingTechnologies());
    dispatch(fetchResources());
    dispatch(fetchCompetencies());
  }, [dispatch]);

  // Calculate end date when start date or duration changes
  useEffect(() => {
    if (formData.startDate && formData.duration && formData.duration > 0) {
      const calculatedEndDate = calculateEndDate(
        formData.startDate,
        parseInt(formData.duration)
      );
      setFormData((prev) => ({
        ...prev,
        endDate: calculatedEndDate,
      }));
    }
  }, [formData.startDate, formData.duration]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name, selectedOption) => {
    setFormData({
      ...formData,
      [name]: selectedOption,
    });
  };

  const handleMultiSelectChange = (selectedOptions) => {
    setFormData({
      ...formData,
      participants: selectedOptions,
    });
  };

  const handleDropdownChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.programName) newErrors.programName = `${isUpskilling ? 'Upskilling' : 'Training'} name is required`;
    if (!formData.trainerId) newErrors.trainerId = "Trainer name is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.duration || formData.duration <= 0)
      newErrors.duration = "Valid duration is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.requester) newErrors.requester = "Requester is required";
    if (!formData.competencyId) newErrors.competencyId = "Competency is required";
    if (!formData.technology)
      newErrors.technology = `${isUpskilling ? 'Upskilling' : 'Training'} technology is required`;
    if (formData.participants.length === 0)
      newErrors.participants = "At least one participant is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setToast(<YRMSLoader message="Creating program..." />);

      console.log("formData: ", formData)
      // Prepare the data in the required format
      const programData = {
        programName: formData.programName,
        startDate: formData.startDate,
        endDate: formData.endDate,
        duration: formData.duration,
        requester: formData.requester.value,
        technology: formData.technology,
        projectDescription: formData.projectDescription,
        competencyId: formData.competency.value,
        trainerId: formData.trainerName.value,
        participantIds: formData.participants.map((p) => p.value)
      };
      console.log("programData: ", programData)

      // Dispatch the create action
      const createResult = await dispatch(createProgram(programData));

      if (!createResult.payload?.publicId) {
        throw new Error("Failed to get publicId from response");
      }

      setToast(<SuccessToast message="Program created successfully!" onClose={() => setToast(null)} />);

      // Refresh programs list
      setToast(<YRMSLoader message="Refreshing programs..." />);
      await dispatch(fetchProgramList());

      // Reset form and close
      onClose();
      setToast(null);
    } catch (err) {
      setToast(<ErrorToast message={err.message || "Failed to create program"} onClose={() => setToast(null)} />);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      {toast}
      {modalField && (
        <AddOptionModal
          field={modalField}
          options={trainingTechnologies}
          onClose={() => setModalField(null)}
          setToast={setToast}
        />
      )}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-screen overflow-y-auto">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-t-lg flex justify-between items-center">
          <h3 className="text-white text-xl font-bold flex items-center">
            {isUpskilling ? (
              <FaUserPlus className="mr-2" />
            ) : (
              <FaChalkboardTeacher className="mr-2" />
            )}
            {isUpskilling ? 'Add New Upskilling Program' : 'Add New Training Program'}
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-purple-200"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Program Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isUpskilling ? 'Upskilling Name' : 'Training Name'} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="programName"
                  value={formData.programName}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${errors.programName ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder={isUpskilling ? "e.g. Leadership Development" : "e.g. React Fundamentals"}
                />
                {errors.programName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.programName}
                  </p>
                )}
              </div>
            </div>

            {/* Trainer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trainer Name <span className="text-red-500">*</span>
              </label>
              <Select
                options={trainerOptions}  // Use the transformed options
                value={formData.trainerName}
                onChange={(selected) => handleSelectChange("trainerName", selected)}
                className={`basic-single ${errors.trainerName ? "border-red-500" : ""}`}
                placeholder="Select trainer..."
                required
              />
              {errors.trainerName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.trainerName}
                </p>
              )}
            </div>

            {/* Date Section - Single Row */}
            <div className="md:col-span-2">
              <div className="flex items-end space-x-4">
                {/* Start Date */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarAlt className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      min={formatDate(new Date())}
                      className={`w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${errors.startDate ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.startDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Duration */}
                <div className="w-28">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarDay className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      min="1"
                      className={`w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${errors.duration ? "border-red-500" : "border-gray-300"
                        }`}
                      placeholder="Days"
                    />
                    {errors.duration && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.duration}
                      </p>
                    )}
                  </div>
                </div>

                {/* Estimated End Date */}
                <div className="flex-1 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated End Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarAlt className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      readOnly
                      className={`w-full pl-10 p-2 border rounded-md bg-gray-100 ${errors.endDate ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.endDate}
                      </p>
                    )}
                  </div>
                  {formData.endDate && (
                    <p className="absolute text-xs text-gray-500 whitespace-nowrap">
                      Excludes weekends and holidays
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Requester Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requester <span className="text-red-500">*</span>
              </label>
              <Select
                options={requesterOptions}
                value={formData.requester}
                onChange={(selected) => handleSelectChange("requester", selected)}
                className={`basic-single ${errors.requester ? "border-red-500" : ""
                  }`}
                classNamePrefix="select"
                placeholder="Select requester..."
              />
              {errors.requester && (
                <p className="mt-1 text-sm text-red-600">{errors.requester}</p>
              )}
            </div>

            {/* Competency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Competency <span className="text-red-500">*</span>
              </label>
              <Select
                options={competencyOptions}
                value={formData.competency}
                onChange={(selected) => handleSelectChange("competency", selected)}
                className={`basic-single ${errors.competencyId ? "border-red-500" : ""}`}
                classNamePrefix="select"
                placeholder="Select competency..."
              />
              {errors.competencyId && (
                <p className="mt-1 text-sm text-red-600">{errors.competencyId}</p>
              )}
            </div>

            {/* Training Technology Field */}
            <div className="flex flex-col md:flex-row md:col-span-2 gap-6">
              {/* Technology Dropdown - Left Side */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isUpskilling ? 'Upskilling Technology' : 'Training Technology'} <span className="text-red-500">*</span>
                </label>
                <Dropdown
                  name="technology"
                  value={formData.technology}
                  options={trainingTechnologies}
                  onChange={handleDropdownChange}
                  setModalField={setModalField}
                  loading={trainingTechnologyLoading}
                />
                {errors.technology && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.technology}
                  </p>
                )}
              </div>

              {/* Project Details - Right Side (Converted to Textarea) */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Details {!isUpskilling && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                    <FaProjectDiagram className="text-gray-400" />
                  </div>
                  <textarea
                    name="project"
                    value={formData.project}
                    onChange={handleChange}
                    className={`w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[100px] ${errors.projectDescription ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Enter project details..."
                  />
                  {errors.project && (
                    <p className="mt-1 text-sm text-red-600">{errors.project}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Purpose/Description Field (Full width below) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purpose/Description {isUpskilling && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                  <FaInfoCircle className="text-gray-400" />
                </div>
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  className={`w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[100px] ${errors.purpose ? "border-red-500" : "border-gray-300"}`}
                  placeholder={
                    isUpskilling
                      ? "Describe the purpose of this upskilling program..."
                      : "Add any additional description or goals for this training..."
                  }
                />
                {errors.purpose && (
                  <p className="mt-1 text-sm text-red-600">{errors.purpose}</p>
                )}
              </div>
            </div>

            {/* Participants */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Participants <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Select
                  options={trainerOptions}
                  isMulti
                  value={formData.participants}
                  onChange={handleMultiSelectChange}
                  className={`basic-multi-select ${errors.participants ? "border-red-500" : ""
                    }`}
                  classNamePrefix="select"
                  placeholder="Select participants..."
                  styles={{
                    menu: (provided) => ({
                      ...provided,
                      maxHeight: 150,
                      overflowY: "auto",
                    }),
                  }}
                />
                {errors.participants && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.participants}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <FaCheck className="mr-2" />
              {isUpskilling ? 'Save Upskilling Program' : 'Save Training Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper function to calculate end date excluding weekends and holidays
function calculateEndDate(startDate, duration) {
  if (!startDate || !duration || duration <= 0) return "";

  const date = new Date(startDate);
  let daysAdded = 0;
  let businessDays = 0;

  while (businessDays < duration) {
    date.setDate(date.getDate() + 1);
    daysAdded++;

    const dayOfWeek = date.getDay();
    const dateStr = date.toISOString().split("T")[0];

    // Skip weekends (0=Sunday, 6=Saturday) and holidays
    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday(dateStr)) {
      businessDays++;
    }
  }

  return date.toISOString().split("T")[0];
}

// Helper function to format date as YYYY-MM-DD
function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default AddTraining;