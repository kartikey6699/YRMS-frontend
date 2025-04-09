import React, { useState } from 'react';
import { 
  FaChalkboardTeacher, 
  FaCalendarAlt, 
  FaUserTie, 
  FaUsers,
  FaTimes,
  FaCheck,
  FaPlus
} from 'react-icons/fa';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

// Static list of resources for demonstration
const resourceOptions = [
  { value: 1, label: 'John Doe', role: 'Developer' },
  { value: 2, label: 'Jane Smith', role: 'Designer' },
  { value: 3, label: 'Mike Johnson', role: 'Manager' },
  { value: 4, label: 'Sarah Williams', role: 'QA Engineer' },
  { value: 5, label: 'David Brown', role: 'DevOps' },
  { value: 6, label: 'Emily Davis', role: 'Frontend Developer' },
  { value: 7, label: 'Robert Wilson', role: 'Backend Developer' },
  { value: 8, label: 'Lisa Taylor', role: 'Product Manager' },
];

const competencyOptions = [
  { value: 'react', label: 'React' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'devops', label: 'DevOps' },
  { value: 'ux', label: 'UX Design' },
];

const requesterOptions = [
  { value: 'hr', label: 'HR Department' },
  { value: 'management', label: 'Management' },
  { value: 'team_lead', label: 'Team Lead' },
  { value: 'employee', label: 'Employee Request' },
];

const AddTraining = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    programName: '',
    trainerName: '',
    startDate: '',
    endDate: '',
    requester: null,
    competency: null,
    participants: [],
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (name, selectedOption) => {
    setFormData({
      ...formData,
      [name]: selectedOption
    });
  };

  const handleMultiSelectChange = (selectedOptions) => {
    setFormData({
      ...formData,
      participants: selectedOptions
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.programName) newErrors.programName = 'Program name is required';
    if (!formData.trainerName) newErrors.trainerName = 'Trainer name is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.requester) newErrors.requester = 'Requester is required';
    if (!formData.competency) newErrors.competency = 'Competency is required';
    if (formData.participants.length === 0) newErrors.participants = 'At least one participant is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        requester: formData.requester.label,
        competency: formData.competency.label,
        participants: formData.participants.map(p => p.label)
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-t-lg flex justify-between items-center">
          <h3 className="text-white text-xl font-bold flex items-center">
            <FaChalkboardTeacher className="mr-2" />
            Add New Training Program
          </h3>
          <button onClick={onClose} className="text-white hover:text-purple-200">
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Program Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Program Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="programName"
                  value={formData.programName}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${errors.programName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g. React Fundamentals"
                />
                {errors.programName && (
                  <p className="mt-1 text-sm text-red-600">{errors.programName}</p>
                )}
              </div>
            </div>

            {/* Trainer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trainer Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserTie className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="trainerName"
                  value={formData.trainerName}
                  onChange={handleChange}
                  className={`w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${errors.trainerName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g. John Smith"
                />
                {errors.trainerName && (
                  <p className="mt-1 text-sm text-red-600">{errors.trainerName}</p>
                )}
              </div>
            </div>

            {/* Start Date */}
            <div>
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
                  className={`w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                )}
              </div>
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date <span className="text-red-500">*</span>
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
                  className={`w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                )}
              </div>
            </div>

            {/* Requester */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requester <span className="text-red-500">*</span>
              </label>
              <Select
                options={requesterOptions}
                value={formData.requester}
                onChange={(selected) => handleSelectChange('requester', selected)}
                className={`basic-single ${errors.requester ? 'border-red-500' : ''}`}
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
                onChange={(selected) => handleSelectChange('competency', selected)}
                className={`basic-single ${errors.competency ? 'border-red-500' : ''}`}
                classNamePrefix="select"
                placeholder="Select competency..."
              />
              {errors.competency && (
                <p className="mt-1 text-sm text-red-600">{errors.competency}</p>
              )}
            </div>

            {/* Participants */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Participants <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Select
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  options={resourceOptions}
                  value={formData.participants}
                  onChange={handleMultiSelectChange}
                  className={`basic-multi-select ${errors.participants ? 'border-red-500' : ''}`}
                  classNamePrefix="select"
                  placeholder="Select participants..."
                  styles={{
                    menu: (provided) => ({
                      ...provided,
                      maxHeight: 150, // Limit the height of the dropdown
                      overflowY: 'auto', // Enable scrolling
                    }),
                  }}
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
            >
              <FaCheck className="mr-2" />
              Save Training Program
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTraining;