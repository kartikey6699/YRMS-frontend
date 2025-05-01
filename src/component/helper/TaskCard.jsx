import React, { useState } from 'react';
import {
    FaCalendarAlt, FaEdit, FaTrash
} from 'react-icons/fa';


const TaskCard = ({ task, onEdit, onDelete }) => (
    <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow relative">
        <div className="flex justify-between items-start">
            <div className="w-4/5">
                <h5 className="font-medium text-gray-900">{task.title}</h5>
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                {task.feedback && (
                    <div className="mt-2">
                        <p className="text-xs font-semibold text-gray-500">Feedback:</p>
                        <p className="text-sm text-gray-600">{task.feedback}</p>
                    </div>
                )}
                <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-gray-500">
                        <FaCalendarAlt className="inline mr-1" />
                        <span>Created: {new Date(task.createdDate || task.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="text-xs text-red-500">
                        <FaCalendarAlt className="inline mr-1" />
                        <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${task.status === 'Completed'
                    ? 'bg-green-100 text-green-800'
                    : task.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {task.status}
                </span>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onEdit(task)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Edit task"
                    >
                        <FaEdit />
                    </button>
                    <button
                        onClick={() => onDelete(task.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Delete task"
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export default TaskCard;