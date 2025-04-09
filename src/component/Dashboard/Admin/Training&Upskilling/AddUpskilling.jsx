import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaCalendarAlt, FaUserTie, FaTimes, FaCheck } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';

const AddUpskilling = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    trainer: '',
    startDate: null,
    duration: '',
    endDate: null,
    requester: '',
    competency: '',
    participants: []
  });

  // Static list of resources for multiselect
  const resourceOptions = [
    { value: 'emp001', label: 'John Doe (Frontend Developer)' },
    { value: 'emp002', label: 'Jane Smith (Backend Developer)' },
    { value: 'emp003', label: 'Mike Johnson (UX Designer)' },
    { value: 'emp004', label: 'Sarah Williams (QA Engineer)' },
    { value: 'emp005', label: 'David Brown (DevOps Engineer)' },
    { value: 'emp006', label: 'Emily Davis (Product Manager)' },
    { value: 'emp007', label: 'Robert Wilson (Full Stack Developer)' },
  ];

  const competencyOptions = [
    { value: 'leadership', label: 'Leadership' },
    { value: 'communication', label: 'Communication' },
    { value: 'management', label: 'Management' },
    { value: 'presentation', label: 'Presentation Skills' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'time', label: 'Time Management' },
    { value: 'critical', label: 'Critical Thinking' },
  ];

  const requesterOptions = [
    { value: 'hr', label: 'HR Department' },
    { value: 'management', label: 'Management' },
    { value: 'tech', label: 'Technology Team' },
    { value: 'product', label: 'Product Team' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date, field) => {
    setFormData(prev => ({ ...prev, [field]: date }));
  };

  const handleSelectChange = (selectedOptions, field) => {
    setFormData(prev => ({ ...prev, [field]: selectedOptions }));
  };

  const calculateEndDate = (startDate, duration) => {
    if (!startDate || !duration || duration <= 0) return null;

    const date = new Date(startDate);
    let businessDays = 0;

    while (businessDays < duration) {
      date.setDate(date.getDate() + 1);
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip weekends
        businessDays++;
      }
    }

    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (formData.startDate && formData.duration) {
      const calculatedEndDate = calculateEndDate(formData.startDate, parseInt(formData.duration));
      setFormData(prev => ({ ...prev, endDate: calculatedEndDate }));
    }
  }, [formData.startDate, formData.duration]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Format the data before saving
    const upskillingToSave = {
      ...formData,
      startDate: formData.startDate.toISOString().split('T')[0],
      endDate: formData.endDate,
      participants: formData.participants.map(p => p.value),
      status: 'pending'
    };
    onSave(upskillingToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-lg text-white">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold flex items-center">
              <FaUserPlus className="mr-2" />
              Add New Upskilling Program
            </h3>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <FaTimes />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upskilling Name */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upskilling Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
                placeholder="e.g. Leadership Development Program"
              />
            </div>

            {/* Trainer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trainer <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserTie className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="trainer"
                  value={formData.trainer}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                  placeholder="Trainer name"
                />
              </div>
            </div>

            {/* Requester */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requester <span className="text-red-500">*</span>
              </label>
              <Select
                options={requesterOptions}
                onChange={(selected) => handleSelectChange(selected, 'requester')}
                className="basic-single"
                classNamePrefix="select"
                placeholder="Select requester..."
                required
              />
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
                <DatePicker
                  selected={formData.startDate}
                  onChange={(date) => handleDateChange(date, 'startDate')}
                  minDate={new Date()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholderText="Select start date"
                  required
                />
              </div>
            </div>

            {/* Duration */}
            <div className="w-28">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Days"
                required
              />
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
                <DatePicker
                  selected={formData.endDate}
                  onChange={(date) => handleDateChange(date, 'endDate')}
                  minDate={formData.startDate || new Date()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholderText="Select end date"
                  required
                />
              </div>
            </div>

            {/* Competency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Competency <span className="text-red-500">*</span>
              </label>
              <Select
                options={competencyOptions}
                onChange={(selected) => handleSelectChange(selected, 'competency')}
                className="basic-single"
                classNamePrefix="select"
                placeholder="Select competency..."
                required
              />
            </div>

            {/* Participants */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Participants <span className="text-red-500">*</span>
              </label>
              <Select
                isMulti
                options={resourceOptions}
                onChange={(selected) => handleSelectChange(selected, 'participants')}
                className="basic-multi-select"
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
              <p className="mt-1 text-xs text-gray-500">
                {formData.participants.length} participants selected
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <FaTimes className="inline mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <FaCheck className="inline mr-2" />
              Save Upskilling
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUpskilling;