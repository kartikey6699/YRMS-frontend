import React, { useState } from 'react';
import {
    FaTimes, FaTasks, FaCalendarAlt,
    FaCheckCircle, FaExclamationCircle, FaEdit,
    FaArrowLeft, FaPlus
} from 'react-icons/fa';

const InternTaskDetails = ({ onClose, userId }) => {
    // Sample tasks data
    const [tasks, setTasks] = useState([
        {
            id: 1,
            title: "Complete React Training",
            description: "Finish all modules of the advanced React course",
            deadline: "2023-06-15",
            status: "In Progress",
            feedback: ""
        },
        {
            id: 2,
            title: "API Integration Task",
            description: "Connect frontend to the new customer API endpoints",
            deadline: "2023-06-20",
            status: "Pending",
            feedback: ""
        },
        {
            id: 3,
            title: "API Integration Testing",
            description: "Connect frontend to the new customer API endpoints",
            deadline: "2023-06-20",
            status: "Pending",
            feedback: ""
        },
        {
            id: 4,
            title: "API Integration Testing",
            description: "Connect frontend to the new customer API endpoints",
            deadline: "2023-06-20",
            status: "Pending",
            feedback: ""
        }
    ]);

    // View state: 'list' or 'form'
    const [currentView, setCurrentView] = useState('list');
    // Form mode: 'add' or 'edit'
    const [formMode, setFormMode] = useState('add');
    // Currently editing task ID
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [errors, setErrors] = useState({});

    const validateTaskField = (name, value, formData) => {
        const newErrors = {};
      
        switch (name) {
          case 'title':
            if (!value) {
              newErrors.title = 'Task title is required';
            } else if (value.length < 5) {
              newErrors.title = 'Title must be at least 5 characters long';
            } else if (value.length > 100) {
              newErrors.title = 'Title cannot exceed 100 characters';
            }
            break;
      
          case 'description':
            if (!value) {
              newErrors.description = 'Description is required';
            } else if (value.length < 10) {
              newErrors.description = 'Description must be at least 10 characters';
            } else if (value.length > 500) {
              newErrors.description = 'Description cannot exceed 500 characters';
            }
            break;
      
          case 'deadline':
            if (!value) {
              newErrors.deadline = 'Deadline is required';
            } else {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const selectedDate = new Date(value);
              
              if (selectedDate < today) {
                newErrors.deadline = 'Deadline cannot be in the past';
              }
            }
            break;
      
          case 'status':
            if (!value) {
              newErrors.status = 'Status is required';
            } else if (!['Pending', 'In Progress', 'Completed'].includes(value)) {
              newErrors.status = 'Invalid status selected';
            }
            break;
      
          case 'feedback':
            // Only validate feedback if we're in edit mode and status is "Completed"
            if (formData.status === 'Completed' && !value) {
              newErrors.feedback = 'Feedback is required for completed tasks';
            } else if (value && value.length > 1000) {
              newErrors.feedback = 'Feedback cannot exceed 1000 characters';
            }
            break;
      
          default:
            break;
        }
      
        return newErrors;
      };

      const validateForm = () => {
        const newErrors = {};
        
        // Validate all fields
        Object.keys(formData).forEach(field => {
          const fieldErrors = validateTaskField(field, formData[field], formData);
          if (Object.keys(fieldErrors).length > 0) {
            newErrors[field] = fieldErrors[field];
          }
        });
      
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };
      
    // Form data state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deadline: '',
        status: 'Pending',
        feedback: ''
    });

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return; // Don't submit if validation fails
          }
        
        if (formMode === 'add') {
            // Add new task
            const newTask = {
                id: tasks.length + 1,
                ...formData
            };
            setTasks([...tasks, newTask]);
        } else {
            // Update existing task
            setTasks(tasks.map(task =>
                task.id === editingTaskId ? formData : task
            ));
        }

        // Reset form and return to list view
        resetForm();
        setCurrentView('list');
    };

    // Handle edit button click
    const handleEditClick = (task) => {
        setFormData(task);
        setFormMode('edit');
        setEditingTaskId(task.id);
        setCurrentView('form');
    };

    // Reset form to initial state
    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            deadline: '',
            status: 'Pending',
            feedback: ''
        });
        setFormMode('add');
        setEditingTaskId(null);
    };

    // Handle cancel button
    const handleCancel = () => {
        resetForm();
        setCurrentView('list');
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col border-2 border-blue-100">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-lg flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">
                        <FaTasks className="inline mr-2" />
                        {currentView === 'form'
                            ? `${formMode === 'edit' ? 'Edit' : 'Add'} Task Details`
                            : 'Amit Task List'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-blue-200 transition-colors"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto flex-grow">
                    {currentView === 'list' ? (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
                                    Current Tasks
                                </h4>
                                <button
                                    onClick={() => setCurrentView('form')}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                                >
                                    <FaPlus className="mr-2" />
                                    Add Task
                                </button>
                            </div>

                            {tasks.length > 0 ? (
                                <div className="space-y-4">
                                    {tasks.map((task, index) => (
                                        <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow relative">
                                            <div className="flex justify-between items-start">
                                                <div className="w-4/5">
                                                    <h5 className="font-medium text-gray-900">{task.title}</h5>
                                                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                                    <div className="flex items-center mt-2 text-sm text-gray-500">
                                                        <FaCalendarAlt className="mr-1" />
                                                        <span>Due: {task.deadline}</span>
                                                    </div>
                                                    {task.feedback && (
                                                        <div className="mt-2">
                                                            <p className="text-xs font-semibold text-gray-500">Feedback:</p>
                                                            <p className="text-sm text-gray-600">{task.feedback}</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${task.status === 'Completed'
                                                            ? 'bg-green-100 text-green-800'
                                                            : task.status === 'In Progress'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {task.status === 'Completed' ? (
                                                            <FaCheckCircle className="inline mr-1" />
                                                        ) : (
                                                            <FaExclamationCircle className="inline mr-1" />
                                                        )}
                                                        {task.status}
                                                    </span>
                                                    <button
                                                        onClick={() => handleEditClick(task)}
                                                        className="mt-2 p-1 text-blue-600 hover:text-blue-800"
                                                        title="Edit task"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No tasks assigned yet
                                </div>
                            )}
                        </>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
                                >
                                    <FaArrowLeft className="mr-2" />
                                    Back to Task List
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Task Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            <FaCalendarAlt className="inline mr-2 text-blue-500" />
                                            Deadline
                                        </label>
                                        <input
                                            onClick={(e) => e.target.showPicker()}
                                            type="date"
                                            name="deadline"
                                            value={formData.deadline}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Status
                                        </label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                </div>

                                {formMode === 'edit' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Feedback
                                        </label>
                                        <textarea
                                            name="feedback"
                                            value={formData.feedback}
                                            onChange={handleInputChange}
                                            rows={2}
                                            className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter feedback for this task..."
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                                >
                                    <FaEdit className="mr-2" />
                                    {formMode === 'edit' ? 'Update Task' : 'Add Task'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="bg-gray-50 px-4 py-3 rounded-b-lg flex justify-between items-center border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                        {currentView === 'list' && (tasks.length > 0 ? `Showing ${tasks.length} tasks` : 'No tasks available')}
                    </div>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center"
                    >
                        <FaTimes className="mr-2" />
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InternTaskDetails;