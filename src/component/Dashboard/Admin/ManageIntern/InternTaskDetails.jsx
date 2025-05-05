import React, { useState, useEffect } from 'react';
import {
  FaTimes, FaTasks, FaCalendarAlt,
  FaEdit, FaArrowLeft, FaPlus, FaChevronDown, FaChevronUp
} from 'react-icons/fa';
import TaskCard from '../../../helper/TaskCard';
import { useDispatch, useSelector } from 'react-redux';
import {
  createInternTask,
  fetchInternTask,
  deleteInternTask
} from '../../../../features/InternTask/internTaskAction';
import { clearError } from '../../../../features/InternTask/internTaskSlice';
import { ErrorToast, SuccessToast } from '../../../helper/ResourceToast';
import YRMSLoader from '../../../helper/loader';
import DeleteConfirmationModal from '../../../helper/DeleteConfirmationModal';

const InternTaskDetails = ({ userId, onClose }) => {
  const dispatch = useDispatch();
  const { interntask, loading, error } = useSelector((state) => state.internTask);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, taskId: null, taskName: "" });

  // View state
  const [currentView, setCurrentView] = useState('list');
  const [formMode, setFormMode] = useState('add');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [errors, setErrors] = useState({});
  
  // Section visibility state
  const [sectionVisibility, setSectionVisibility] = useState({
    inProgress: true,
    pending: true,
    completed: true
  });

  useEffect(() => {
    if (userId) {
      dispatch(fetchInternTask(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (error) {
      setToast(<ErrorToast message={error} onClose={() => dispatch(clearError())} />);
    }
  }, [error, dispatch]);

  // Toggle section visibility
  const toggleSection = (section) => {
    setSectionVisibility(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const groupedTasks = (interntask || []).reduce((acc, task) => {
    if (!acc[task.status]) acc[task.status] = [];
    acc[task.status].push(task);
    return acc;
  }, {});

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    setToast(<YRMSLoader message="Deleting Task..." />);
    try {
      await dispatch(deleteInternTask(deleteModal.taskId)).unwrap();
      setToast(<SuccessToast message="Task deleted successfully!" onClose={() => setToast(null)} />);
      // Refresh the task list after successful deletion
      dispatch(fetchInternTask(userId));
    } catch (error) {
      setToast(<ErrorToast message={error.message || "Failed to delete task"} onClose={() => setToast(null)} />);
    }
    setDeleteModal({ isOpen: false, taskId: null, taskName: "" });
  };

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
        } else if (!['pending', 'in_progress', 'completed'].includes(value)) {
          newErrors.status = 'Invalid status selected';
        }
        break;
  
      case 'feedback':
        if (formData.status === 'completed' && !value) {
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
    intern_id: userId,
    title: '',
    description: '',
    deadline: '',
    status: '',
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      setToast(<YRMSLoader message={formMode === 'edit' ? "Updating task..." : "Creating task..."} />);

      const payload = {
        ...formData,
        ...(formMode === 'edit' && { id: editingTaskId })
      };

      const result = await dispatch(createInternTask(payload));
      
      if (result?.error) {
        throw new Error(result.error.message || "Failed to process task");
      }

      setToast(<SuccessToast message={`Task ${formMode === 'edit' ? 'updated' : 'created'} successfully!`} onClose={() => setToast(null)} />);
      resetForm();
      setCurrentView('list');
      dispatch(fetchInternTask(userId));
    } catch (err) {
      setToast(<ErrorToast message={err.message || `Failed to ${formMode === 'edit' ? 'update' : 'create'} task`} onClose={() => setToast(null)} />);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit button click
  const handleEditClick = (task) => {
    // Format the deadline to YYYY-MM-DD for the date input
    const formattedDeadline = task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '';
    
    setFormData({
      intern_id: userId,
      title: task.title,
      description: task.description,
      deadline: formattedDeadline,
      status: task.status,
      feedback: task.feedback || ''
    });
    setFormMode('edit');
    setEditingTaskId(task.id);
    setCurrentView('form');
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      intern_id: userId,
      title: '',
      description: '',
      deadline: '',
      status: '',
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

  if (loading && !interntask) {
    return (
      <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <YRMSLoader message="Loading tasks..." />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {toast}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col border-2 border-blue-100">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-lg flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">
            <FaTasks className="inline mr-2" />
            {currentView === 'form'
              ? `${formMode === 'edit' ? 'Edit' : 'Add'} Task Details`
              : 'Intern Task List'}
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
                <h4 className="text-lg font-semibold text-gray-800">Tasks</h4>
                <button
                  onClick={() => setCurrentView('form')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <FaPlus className="mr-2" />
                  Add Task
                </button>
              </div>

              {/* In Progress Section */}
              <div className="mb-6">
                <div 
                  className="flex justify-between items-center cursor-pointer bg-blue-50 p-3 rounded-t-lg"
                  onClick={() => toggleSection('inProgress')}
                >
                  <h5 className="font-medium text-blue-800 flex items-center">
                    {sectionVisibility.inProgress ? <FaChevronDown className="mr-2" /> : <FaChevronUp className="mr-2" />}
                    In Progress ({groupedTasks['in_progress']?.length || 0})
                  </h5>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    Active
                  </span>
                </div>
                {sectionVisibility.inProgress && (
                  <div className="space-y-4 p-3 border border-t-0 border-gray-200 rounded-b-lg">
                    {groupedTasks['in_progress']?.length > 0 ? (
                      groupedTasks['in_progress'].map(task => (
                        <TaskCard 
                          key={task.id} 
                          task={task} 
                          onEdit={handleEditClick}
                          setDeleteModal={setDeleteModal}
                        />
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No tasks in progress</p>
                    )}
                  </div>
                )}
              </div>

              {/* Pending Section */}
              <div className="mb-6">
                <div 
                  className="flex justify-between items-center cursor-pointer bg-yellow-50 p-3 rounded-t-lg"
                  onClick={() => toggleSection('pending')}
                >
                  <h5 className="font-medium text-yellow-800 flex items-center">
                    {sectionVisibility.pending ? <FaChevronDown className="mr-2" /> : <FaChevronUp className="mr-2" />}
                    Pending ({groupedTasks['pending']?.length || 0})
                  </h5>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    Waiting
                  </span>
                </div>
                {sectionVisibility.pending && (
                  <div className="space-y-4 p-3 border border-t-0 border-gray-200 rounded-b-lg">
                    {groupedTasks['pending']?.length > 0 ? (
                      groupedTasks['pending'].map(task => (
                        <TaskCard 
                          key={task.id} 
                          task={task} 
                          onEdit={handleEditClick}
                          setDeleteModal={setDeleteModal}
                        />
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No pending tasks</p>
                    )}
                  </div>
                )}
              </div>

              {/* Completed Section */}
              <div className="mb-6">
                <div 
                  className="flex justify-between items-center cursor-pointer bg-green-50 p-3 rounded-t-lg"
                  onClick={() => toggleSection('completed')}
                >
                  <h5 className="font-medium text-green-800 flex items-center">
                    {sectionVisibility.completed ? <FaChevronDown className="mr-2" /> : <FaChevronUp className="mr-2" />}
                    Completed ({groupedTasks['completed']?.length || 0})
                  </h5>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Done
                  </span>
                </div>
                {sectionVisibility.completed && (
                  <div className="space-y-4 p-3 border border-t-0 border-gray-200 rounded-b-lg">
                    {groupedTasks['completed']?.length > 0 ? (
                      groupedTasks['completed'].map(task => (
                        <TaskCard 
                          key={task.id} 
                          task={task} 
                          onEdit={handleEditClick}
                          setDeleteModal={setDeleteModal}
                        />
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No completed tasks</p>
                    )}
                  </div>
                )}
              </div>
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
                    className={`w-full px-4 py-2 border ${errors.title ? 'border-red-500' : 'border-blue-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
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
                    className={`w-full px-4 py-2 border ${errors.description ? 'border-red-500' : 'border-blue-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
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
                      className={`w-full px-4 py-2 border ${errors.deadline ? 'border-red-500' : 'border-blue-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${errors.status ? 'border-red-500' : 'border-blue-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="" selected>select</option>
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                  </div>
                </div>

                {(formMode === 'edit' || formData.status === 'completed') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Feedback
                    </label>
                    <textarea
                      name="feedback"
                      value={formData.feedback}
                      onChange={handleInputChange}
                      rows={2}
                      className={`w-full px-4 py-2 border ${errors.feedback ? 'border-red-500' : 'border-blue-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Enter feedback for this task..."
                    />
                    {errors.feedback && <p className="text-red-500 text-sm mt-1">{errors.feedback}</p>}
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
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center disabled:opacity-70"
                  disabled={isSubmitting}
                >
                  <FaEdit className="mr-2" />
                  {isSubmitting ? 'Processing...' : (formMode === 'edit' ? 'Update Task' : 'Add Task')}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-4 py-3 rounded-b-lg flex justify-between items-center border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {currentView === 'list' && (interntask ? `Showing ${interntask.length} tasks` : 'No tasks available')}
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
      <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, taskId: null, taskName: "" })}
                onConfirm={handleDeleteConfirm}
                resourceName={deleteModal.taskName}
                resourceType="task"
            />
    </div>
  );
};

export default InternTaskDetails;