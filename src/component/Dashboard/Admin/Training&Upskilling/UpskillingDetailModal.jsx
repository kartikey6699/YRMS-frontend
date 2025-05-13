import React, { useState, useEffect, useRef } from 'react';
import {
  FaUser,
  FaEnvelope,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaPlus,
  FaTrash,
  FaEdit,
  FaTasks,
  FaSearch,
  FaTimes
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { postParticipantTask, fetchParticipantTasks, updateParticipantTask, deleteParticipantTask } from '../../../../features/program/programAction';

const UpskillingDetailModal = ({ onClose, training, publicId }) => {
  const dispatch = useDispatch();
  const { participantTasks, loading, error } = useSelector((state) => state.program);
  const participantListRef = useRef(null);

  const [participants, setParticipants] = useState([]);
  const [activeParticipant, setActiveParticipant] = useState(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    task: '',
    feedback: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editTaskData, setEditTaskData] = useState({
    task: '',
    feedback: ''
  });

  // Fetch participant tasks when modal opens or training changes
  useEffect(() => {
    if (training?.id) {
      dispatch(fetchParticipantTasks(training.id));
    }
  }, [training?.id, dispatch]);

  // Update local participants state when Redux data changes and handle default selection
  useEffect(() => {
    if (participantTasks?.participants) {
      setParticipants(participantTasks.participants);
      
      // If publicId is provided, find and set the matching participant as active
      if (publicId) {
        const defaultParticipant = participantTasks.participants.find(
          p => p.publicId === publicId
        );
        if (defaultParticipant) {
          setActiveParticipant(defaultParticipant);
          
          // Scroll to the selected participant
          setTimeout(() => {
            const participantElement = document.getElementById(`participant-${defaultParticipant.publicId}`);
            if (participantElement && participantListRef.current) {
              participantListRef.current.scrollTop = participantElement.offsetTop - participantListRef.current.offsetTop;
            }
          }, 100);
        }
      }
      // Update active participant if it exists in the new data
      else if (activeParticipant) {
        const updatedParticipant = participantTasks.participants.find(
          p => p.id === activeParticipant.id
        );
        if (updatedParticipant) {
          setActiveParticipant(updatedParticipant);
        } else {
          setActiveParticipant(null);
        }
      }
    }
  }, [participantTasks, publicId]);

  const filteredParticipants = participants.filter(participant =>
    participant.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = () => {
    const hasTasks = activeParticipant?.tasks?.length > 0;
    const allCompleted = hasTasks && activeParticipant.tasks.every(t => t.status === 'completed');

    if (allCompleted) return <FaCheckCircle className="text-green-500" />;
    if (hasTasks) return <FaHourglassHalf className="text-yellow-500" />;
    return <FaTimesCircle className="text-red-500" />;
  };

  const handleAddTask = () => {
    if (!newTask.task.trim()) return;

    dispatch(postParticipantTask({
      programId: training.id,
      participantId: activeParticipant.id,
      task: newTask.task,
      feedback: newTask.feedback
    })).then((response) => {
      if (response.meta.requestStatus === 'fulfilled') {
        // Optimistically update the local state
        const newTaskData = response.payload; // Assuming the response contains the new task
        const updatedParticipant = {
          ...activeParticipant,
          tasks: [...(activeParticipant.tasks || []), newTaskData]
        };

        setActiveParticipant(updatedParticipant);
        setParticipants(participants.map(p => 
          p.id === activeParticipant.id ? updatedParticipant : p
        ));
        
        setNewTask({ task: '', feedback: '' });
        setShowAddTask(false);
        
        // Refresh from server to ensure consistency
        dispatch(fetchParticipantTasks(training.id));
      }
    }).catch((error) => {
      console.error('Failed to add task:', error);
    });
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteParticipantTask(taskId)).then((response) => {
        if (response.meta.requestStatus === 'fulfilled') {
          // Optimistically update the local state
          const updatedParticipant = {
            ...activeParticipant,
            tasks: activeParticipant.tasks.filter(task => task.id !== taskId)
          };
          
          setActiveParticipant(updatedParticipant);
          setParticipants(participants.map(p => 
            p.id === activeParticipant.id ? updatedParticipant : p
          ));
          
          // Refresh from server to ensure consistency
          dispatch(fetchParticipantTasks(training.id));
        }
      });
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task.id);
    setEditTaskData({
      task: task.task,
      feedback: task.feedback || ''
    });
  };

  const handleSaveEdit = (taskId) => {
    dispatch(updateParticipantTask({
      taskId,
      data: {
        task: editTaskData.task,
        feedback: editTaskData.feedback
      }
    })).then((response) => {
      if (response.meta.requestStatus === 'fulfilled') {
        // Optimistically update the local state
        const updatedParticipant = {
          ...activeParticipant,
          tasks: activeParticipant.tasks.map(task => 
            task.id === taskId ? { ...task, ...editTaskData } : task
          )
        };
        
        setActiveParticipant(updatedParticipant);
        setParticipants(participants.map(p => 
          p.id === activeParticipant.id ? updatedParticipant : p
        ));
        
        setEditingTask(null);
        
        // Refresh from server to ensure consistency
        dispatch(fetchParticipantTasks(training.id));
      }
    });
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Blurred Background */}
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-30 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-4 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 sm:px-6 sm:flex sm:items-center sm:justify-between">
            <h3 className="text-lg leading-6 font-medium text-white">
              <FaUser className="inline mr-2" />
              {training?.name} - Participant Details
            </h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {loading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading data...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {!loading && (
              <div className="flex flex-col md:flex-row gap-6">
                {/* Participants List */}
                <div className="w-full md:w-1/3">
                  <div className="relative mb-3">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search participants by name"
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                    <FaUser className="mr-2 text-purple-600" />
                    Participants ({participants.length})
                  </h4>
                  <div ref={participantListRef} className="space-y-2 h-80 overflow-y-auto pr-2">
                    {filteredParticipants.map(participant => (
                      <div
                        id={`participant-${participant.publicId}`}
                        key={participant.publicId}
                        onClick={() => setActiveParticipant(participant)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          activeParticipant?.id === participant.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="font-medium text-gray-800">{participant.employeeName}</div>
                          <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                            {participant.tasks?.length || 0} tasks
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <FaEnvelope className="mr-1 text-gray-400" />
                          <span className="truncate">{participant.email}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <span className="truncate">ID: {participant.employeeId}</span>
                        </div>
                        <div className="flex items-center text-sm mt-2">
                          {/* {getStatusIcon()} */}
                          {/* <span className="ml-1 capitalize">
                            {participant.tasks?.length ? 'Has tasks' : 'No tasks'}
                          </span> */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Participant Details */}
                <div className="w-full md:w-2/3">
                  {activeParticipant ? (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-gray-700 flex items-center">
                          <FaTasks className="mr-2 text-purple-600" />
                          Tasks ({activeParticipant.tasks?.length || 0})
                        </h4>
                        <button
                          onClick={() => setShowAddTask(true)}
                          className="flex items-center px-3 py-1.5 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 transition-colors"
                          disabled={loading}
                        >
                          <FaPlus className="mr-1" />
                          Add Task
                        </button>
                      </div>

                      {/* Add Task Form */}
                      {showAddTask && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <h5 className="font-medium text-gray-700 mb-3">New Task</h5>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Task Description
                              </label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={newTask.task}
                                onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                                placeholder="Enter task description"
                                disabled={loading}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Feedback (Optional)
                              </label>
                              <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                rows="2"
                                value={newTask.feedback}
                                onChange={(e) => setNewTask({ ...newTask, feedback: e.target.value })}
                                placeholder="Enter feedback or notes"
                                disabled={loading}
                              ></textarea>
                            </div>
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => setShowAddTask(false)}
                                className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                disabled={loading}
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleAddTask}
                                className="px-3 py-1.5 text-sm text-white bg-purple-600 rounded-md hover:bg-purple-700"
                                disabled={loading || !newTask.task.trim()}
                              >
                                {loading ? 'Saving...' : 'Save Task'}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tasks List */}
                      <div className="space-y-4 h-80 overflow-y-auto pr-2">
                        {activeParticipant.tasks?.length > 0 ? (
                          activeParticipant.tasks.map(task => (
                            <div
                              key={task.publicId}
                              className={`p-4 border rounded-lg bg-white shadow-sm ${
                                !task.feedback ? 'bg-orange-50 border-orange-200' : 'border-gray-200'
                              }`}
                            >
                              {editingTask === task.id ? (
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Task Description
                                    </label>
                                    <input
                                      type="text"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                      value={editTaskData.task}
                                      onChange={(e) => setEditTaskData({ ...editTaskData, task: e.target.value })}
                                      disabled={loading}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Feedback
                                    </label>
                                    <textarea
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                      rows="2"
                                      value={editTaskData.feedback}
                                      onChange={(e) => setEditTaskData({ ...editTaskData, feedback: e.target.value })}
                                      disabled={loading}
                                    ></textarea>
                                  </div>
                                  <div className="flex justify-end space-x-2">
                                    <button
                                      onClick={handleCancelEdit}
                                      className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                      disabled={loading}
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => handleSaveEdit(task.id)}
                                      className="px-3 py-1.5 text-sm text-white bg-purple-600 rounded-md hover:bg-purple-700"
                                      disabled={loading || !editTaskData.task.trim()}
                                    >
                                      {loading ? 'Saving...' : 'Save'}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-800">{task.task}</div>
                                    <div className="mt-1 flex items-center space-x-2">
                                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex items-center">
                                        <span className="mr-1">📅</span>
                                        <span>{new Date(task.createdAt).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric'
                                        })}</span>
                                      </div>
                                    </div>
                                    {task.feedback ? (
                                      <div className="mt-2 text-sm text-gray-600 bg-blue-50 p-2 rounded">
                                        <span className="font-medium">Feedback:</span> {task.feedback}
                                      </div>
                                    ) : (
                                      <div className="mt-2 text-sm text-orange-600 italic">
                                        No feedback provided yet
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex space-x-2 ml-2">
                                    <button
                                      onClick={() => handleEditTask(task)}
                                      className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                                      title="Edit task"
                                      disabled={loading}
                                    >
                                      <FaEdit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteTask(task.id)}
                                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                      title="Delete task"
                                      disabled={loading}
                                    >
                                      <FaTrash className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <FaTasks className="mx-auto text-gray-400 text-3xl mb-2" />
                            <p className="text-gray-500">No tasks assigned yet</p>
                            <button
                              onClick={() => setShowAddTask(true)}
                              className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200"
                              disabled={loading}
                            >
                              <FaPlus className="mr-1" />
                              Add First Task
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FaUser className="mx-auto text-gray-400 text-4xl mb-3" />
                      <h4 className="text-lg font-medium text-gray-700">Select a participant</h4>
                      <p className="text-gray-500 mt-1">Choose from the list to view or add tasks</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
              disabled={loading}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpskillingDetailModal;