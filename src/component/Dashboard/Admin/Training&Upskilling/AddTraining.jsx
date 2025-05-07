import React, { useState, useEffect } from "react";
import {
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaUserTie,
  FaUsers,
  FaTimes,
  FaCheck,
  FaCalendarDay,
  FaProjectDiagram,
  FaUserPlus,
  FaInfoCircle
} from "react-icons/fa";
import Select from "react-select";
import { holidays, isHoliday } from "../../../helper/holidays";
import { useDispatch, useSelector } from "react-redux";
import AddOptionModal from "../../../helper/OptionalModal";
import { ErrorToast, SuccessToast } from '../../../helper/ResourceToast';
import { createProgram, fetchProgramList } from '../../../../features/program/programAction';
import { fetchTrainingTechnologies, fetchResources, fetchCompetencies } from "../../../../features/resource/resourceAction";
import YRMSLoader from "../../../helper/Loader";

const MultiSelectTechnology = ({ value, onChange, setModalField, loading, options }) => {
  const handleAddNew = () => {
    setModalField("trainingtechnology");
  };

  const MenuList = (props) => {
    return (
      <div>
        {props.children}
        <div style={{
          position: "sticky",
          bottom: 0,
          background: "white",
          borderTop: "1px solid #eee",
          padding: "8px",
          zIndex: 1,
        }}>
          <button
            type="button"
            onClick={handleAddNew}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center text-sm"
          >
            Add Training Technology
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      <Select
        options={options}
        isMulti
        value={value}
        onChange={onChange}
        className="basic-multi-select"
        classNamePrefix="select"
        placeholder="Select technologies..."
        isLoading={loading}
        components={{ MenuList }}
        styles={{
          menu: (provided) => ({
            ...provided,
            maxHeight: 200,
            overflowY: "auto",
          }),
        }}
      />
    </div>
  );
};

const AddTraining = ({ onClose, onSave, isUpskilling = false }) => {
  const dispatch = useDispatch();
  const { trainers, participants, competencies, trainingTechnologies, trainingTechnologyLoading } = useSelector(
    (state) => state.resource
  );

  const trainerOptions = trainers.map(user => ({
    value: user.publicId,
    label: user.employeeName,
  }));

  const participantOptions = participants.map(user => ({
    value: user.publicId,
    label: user.employeeName,
  }));

  const competencyOptions = competencies.map(competency => ({
    value: competency.publicId,
    label: competency.name,
  }));

  const requesterOptions = [
    { value: 1, label: "Python" },
    { value: 2, label: "Data Engineering" },
    { value: 3, label: "Data Analytics" },
    { value: 4, label: "Project_Management_Office" },
  ];

  const technologyOptions = trainingTechnologies.map(tech => ({
    value: tech.publicId,
    label: tech.name,
  }));

  const [formData, setFormData] = useState({
    programName: "",
    trainerName: null,
    startDate: "",
    duration: "",
    endDate: "",
    requester: null,
    competency: null,
    technologies: [],
    projectDescription: "",
    purpose: "",
    participants: [],
  });

  const [errors, setErrors] = useState({});
  const [modalField, setModalField] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    dispatch(fetchResources({}));
    dispatch(fetchTrainingTechnologies());
    dispatch(fetchCompetencies());
  }, [dispatch]);

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
      validateField("endDate", calculatedEndDate);
    } else {
      setFormData((prev) => ({ ...prev, endDate: "" }));
      setErrors((prev) => ({ ...prev, endDate: undefined }));
    }
  }, [formData.startDate, formData.duration]);

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "programName":
        newErrors.programName = !value.trim()
          ? `${isUpskilling ? 'Upskilling' : 'Training'} name is required`
          : undefined;
        break;
      case "trainerName":
        newErrors.trainerName = !value
          ? "Trainer name is required"
          : undefined;
        break;
      case "startDate":
        if (!value) {
          newErrors.startDate = "Start date is required";
        } else {
          const today = new Date(formatDate(new Date()));
          const selectedDate = new Date(value);
          newErrors.startDate = selectedDate < today
            ? "Start date cannot be in the past"
            : undefined;
        }
        break;
      case "duration":
        newErrors.duration = !value || value <= 0
          ? "Duration must be a positive number"
          : undefined;
        break;
      case "endDate":
        if (formData.startDate && value) {
          const start = new Date(formData.startDate);
          const end = new Date(value);
          newErrors.endDate = end < start
            ? "End date must be on or after start date"
            : undefined;
        }
        break;
      case "requester":
        newErrors.requester = !value
          ? "Requester is required"
          : undefined;
        break;
      case "competency":
        newErrors.competency = !value
          ? "Competency is required"
          : undefined;
        break;
      case "technologies":
        newErrors.technologies = value.length === 0
          ? "At least one technology is required"
          : undefined;
        break;
      case "purpose":
        newErrors.purpose = !value.trim()
          ? "Purpose is required"
          : undefined;
        break;
      case "participants":
        newErrors.participants = value.length === 0
          ? "At least one participant is required"
          : undefined;
        break;
      case "projectDescription":
        if (!isUpskilling && !value.trim()) {
          newErrors.projectDescription = "Project description is required";
        } else {
          newErrors.projectDescription = undefined;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.programName) newErrors.programName = `${isUpskilling ? 'Upskilling' : 'Training'} name is required`;
    if (!formData.trainerName) newErrors.trainerName = "Trainer name is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    else {
      const today = new Date(formatDate(new Date()));
      const selectedDate = new Date(formData.startDate);
      if (selectedDate < today) newErrors.startDate = "Start date cannot be in the past";
    }
    if (!formData.duration || formData.duration <= 0) newErrors.duration = "Duration must be a positive number";
    if (!formData.requester) newErrors.requester = "Requester is required";
    if (!formData.competency) newErrors.competency = "Competency is required";
    if (formData.technologies.length === 0) newErrors.technologies = "At least one technology is required";
    if (!formData.purpose) newErrors.purpose = "Purpose is required";
    if (formData.participants.length === 0) newErrors.participants = "At least one participant is required";
    if (!isUpskilling && !formData.projectDescription) newErrors.projectDescription = "Project description is required";
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) newErrors.endDate = "End date must be on or after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleSelectChange = (name, selectedOption) => {
    setFormData({ ...formData, [name]: selectedOption });
    validateField(name, selectedOption);
  };

  const handleMultiSelectChange = (name, selectedOptions) => {
    setFormData({ ...formData, [name]: selectedOptions });
    validateField(name, selectedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (trainerOptions.length === 0 || participantOptions.length === 0) {
      setToast(
        <ErrorToast
          message="No trainers or participants available. Please contact the administrator."
          onClose={() => setToast(null)}
        />
      );
      return;
    }

    try {
      setToast(<YRMSLoader message="Creating program..." />);

      const programData = {
        type: isUpskilling ? 2 : 1,
        programName: formData.programName,
        startDate: formData.startDate,
        endDate: formData.endDate,
        duration: parseInt(formData.duration),
        requester: formData.requester.value,
        technology: formData.technologies.map(t => t.label).join(", "),
        projectDescription: formData.projectDescription,
        competencyId: formData.competency.value,
        trainerId: formData.trainerName.value,
        purpose: formData.purpose,
        participantIds: formData.participants.map((p) => p.value)
      };

      const createResult = await dispatch(createProgram(programData)).unwrap();

      if (!createResult.publicId) {
        throw new Error("Failed to get publicId from response");
      }

      setToast(<SuccessToast message="Program created successfully!" onClose={() => setToast(null)} />);

      setToast(<YRMSLoader message="Refreshing programs..." />);
      await dispatch(fetchProgramList());
      
      onSave(createResult);
      onClose();
      setToast(null);
    } catch (err) {
      let errorMessage = "Failed to create program";
      if (err.message) {
        if (err.message.includes("duplicate")) {
          errorMessage = "A program with this name already exists";
        } else if (err.message.includes("trainer")) {
          errorMessage = "Invalid or unavailable trainer selected";
        } else if (err.message.includes("participant")) {
          errorMessage = "Invalid or unavailable participants selected";
        } else {
          errorMessage = err.message;
        }
      }
      setToast(<ErrorToast message={errorMessage} onClose={() => setToast(null)} />);
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
          {trainerOptions.length === 0 && (
            <p className="mb-4 text-red-600 text-sm">
              No trainers available. Please contact the administrator.
            </p>
          )}
          {participantOptions.length === 0 && (
            <p className="mb-4 text-red-600 text-sm">
              No participants available. Please contact the administrator.
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${errors.programName ? "border-red-500" : "border-gray-300"}`}
                  placeholder={isUpskilling ? "e.g. Leadership Development" : "e.g. React Fundamentals"}
                />
                {errors.programName && (
                  <p className="mt-1 text-sm text-red-600">{errors.programName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trainer Name <span className="text-red-500">*</span>
              </label>
              <Select
                options={trainerOptions}
                value={formData.trainerName}
                onChange={(selected) => handleSelectChange("trainerName", selected)}
                className={`basic-single ${errors.trainerName ? "border-red-500" : ""}`}
                placeholder="Select trainer..."
                isDisabled={trainerOptions.length === 0}
              />
              {errors.trainerName && (
                <p className="mt-1 text-sm text-red-600">{errors.trainerName}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <div className="flex items-end space-x-4">
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
                      className={`w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${errors.startDate ? "border-red-500" : "border-gray-300"}`}
                      onClick={(e) => e.target.showPicker()}
                    />
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                    )}
                  </div>
                </div>

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
                      className={`w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${errors.duration ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Days"
                    />
                    {errors.duration && (
                      <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
                    )}
                  </div>
                </div>

                <div className="flex-1 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated End Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarAlt className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className={`w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${errors.endDate ? "border-red-500" : "border-gray-300"}`}
                      onClick={(e) => e.target.showPicker()}
                    />
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requester <span className="text-red-500">*</span>
              </label>
              <Select
                options={requesterOptions}
                value={formData.requester}
                onChange={(selected) => handleSelectChange("requester", selected)}
                className={`basic-single ${errors.requester ? "border-red-500" : ""}`}
                classNamePrefix="select"
                placeholder="Select requester..."
              />
              {errors.requester && (
                <p className="mt-1 text-sm text-red-600">{errors.requester}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Competency <span className="text-red-500">*</span>
              </label>
              <Select
                options={competencyOptions}
                value={formData.competency}
                onChange={(selected) => handleSelectChange("competency", selected)}
                className={`basic-single ${errors.competency ? "border-red-500" : ""}`}
                classNamePrefix="select"
                placeholder="Select competency..."
              />
              {errors.competency && (
                <p className="mt-1 text-sm text-red-600">{errors.competency}</p>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:col-span-2 gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isUpskilling ? 'Upskilling Technologies' : 'Training Technologies'} <span className="text-red-500">*</span>
                </label>
                <MultiSelectTechnology
                  value={formData.technologies}
                  onChange={(selected) => handleMultiSelectChange("technologies", selected)}
                  setModalField={setModalField}
                  loading={trainingTechnologyLoading}
                  options={technologyOptions}
                />
                {errors.technologies && (
                  <p className="mt-1 text-sm text-red-600">{errors.technologies}</p>
                )}
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Details {!isUpskilling && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                    <FaProjectDiagram className="text-gray-400" />
                  </div>
                  <textarea
                    name="projectDescription"
                    value={formData.projectDescription}
                    onChange={handleChange}
                    className={`w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[100px] ${errors.projectDescription ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Enter project details..."
                  />
                  {errors.projectDescription && (
                    <p className="mt-1 text-sm text-red-600">{errors.projectDescription}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purpose/Description <span className="text-red-500">*</span>
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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Participants <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Select
                  options={participantOptions}
                  isMulti
                  value={formData.participants}
                  onChange={(selected) => handleMultiSelectChange("participants", selected)}
                  className={`basic-multi-select ${errors.participants ? "border-red-500" : ""}`}
                  classNamePrefix="select"
                  placeholder="Select participants..."
                  styles={{
                    menu: (provided) => ({
                      ...provided,
                      maxHeight: 150,
                      overflowY: "auto",
                    }),
                  }}
                  isDisabled={participantOptions.length === 0}
                />
                {errors.participants && (
                  <p className="mt-1 text-sm text-red-600">{errors.participants}</p>
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
              disabled={trainerOptions.length === 0 || participantOptions.length === 0}
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

    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday(dateStr)) {
      businessDays++;
    }
  }

  return date.toISOString().split("T")[0];
}

function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default AddTraining;