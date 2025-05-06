import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaBook, FaTasks, FaCheckCircle, FaHourglassHalf, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { fetchProgramList } from "../../../../features/program/programAction";

const UserTrainings = ({ activeSection, setActiveSection }) => {
    const dispatch = useDispatch();
    const { programs, loading, error } = useSelector((state) => state.program);
    const [expandedTrainings, setExpandedTrainings] = useState({});

    // Fetch programs on component mount
    useEffect(() => {
        dispatch(fetchProgramList());
    }, [dispatch]);

    // Initialize expanded state when programs change
    useEffect(() => {
        setExpandedTrainings(
            programs.reduce((acc, training) => ({
                ...acc,
                [training.id]: true,
            }), {})
        );
    }, [programs]);

    const toggleTraining = (id) => {
        setExpandedTrainings((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    // Format date to readable format (e.g., "April 23, 2025")
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    // Map API response to component's expected training structure
    const trainings = programs.map((program) => ({
        id: program.id,
        name: program.programName,
        status: program.status,
        startDate: program.startDate,
        endDate: program.endDate,
        duration: program.duration,
        trainerName: program.trainerName,
        technology: program.technology,
        participantCount: program.participantCount,
        tasks: program.tasks.map((task) => ({
            id: task.id,
            name: task.task,
            status: task.feedback ? "Completed" : "Pending",
            feedback: task.feedback,
        })),
    }));

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-8 text-center">
                My Training Programs
            </h2>
            {loading ? (
                <div className="text-center py-12 text-gray-600 font-medium">
                    Loading...
                </div>
            ) : error ? (
                <div className="text-center py-12 text-red-600 font-medium">
                    Error: {error}
                </div>
            ) : trainings.length === 0 ? (
                <div className="text-center py-12 text-gray-600 font-medium">
                    No trainings assigned.
                </div>
            ) : (
                <div className="space-y-6">
                    {trainings.map((training) => (
                        <div
                            key={training.id}
                            className="rounded-xl shadow-lg border border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-all duration-300"
                        >
                            <div
                                className="flex items-center justify-between p-5 cursor-pointer"
                                onClick={() => toggleTraining(training.id)}
                            >
                                <div className="flex items-center">
                                    <div className="p-3 mr-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md">
                                        <FaBook size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-700">
                                            {training.name}
                                        </h3>
                                        <span className="text-sm text-purple-600">
                                            {training.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${training.status === "Hold"
                                            ? "bg-orange-100 text-orange-800"
                                            : training.status === "Pending"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : training.status === "Running"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : training.status === "Completed"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-gray-100 text-gray-800"
                                            }`}
                                    >
                                        {training.status}
                                    </span>
                                    {expandedTrainings[training.id] ? (
                                        <FaChevronUp className="text-gray-600" />
                                    ) : (
                                        <FaChevronDown className="text-gray-600" />
                                    )}
                                </div>
                            </div>
                            {expandedTrainings[training.id] && (
                                <div className="p-6 border-t border-gray-200">
                                    {/* Training Details */}
                                    <div className="mb-6">
                                        <h4 className="text-lg font-semibold text-gray-700 mb-3">
                                            Program Details
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                                            <div>
                                                <span className="font-medium">Start Date:</span>{" "}
                                                {formatDate(training.startDate)}
                                            </div>
                                            <div>
                                                <span className="font-medium">End Date:</span>{" "}
                                                {formatDate(training.endDate)}
                                            </div>
                                            <div>
                                                <span className="font-medium">Duration:</span>{" "}
                                                {training.duration} days
                                            </div>
                                            <div>
                                                <span className="font-medium">Trainer:</span>{" "}
                                                {training.trainerName}
                                            </div>
                                            <div>
                                                <span className="font-medium">Participants:</span>{" "}
                                                {training.participantCount}
                                            </div>
                                            <div>
                                                <span className="font-medium">Technologies:</span>{" "}
                                                {training.technology.split(", ").map((tech, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs mr-2 mb-1"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tasks Section */}
                                    <div className="flex items-center mb-4">
                                        <div className="p-2 mr-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-sm">
                                            <FaTasks size={16} />
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-700">
                                            Tasks
                                        </h4>
                                    </div>
                                    {training.tasks.length === 0 ? (
                                        <p className="text-gray-500 italic">
                                            No tasks assigned.
                                        </p>
                                    ) : (
                                        <ul className="space-y-3">
                                            {training.tasks.map((task) => (
                                                <li
                                                    key={task.id}
                                                    className="flex flex-col bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-200"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            {task.status === "Completed" ? (
                                                                <FaCheckCircle className="text-green-600 text-lg mr-3" />
                                                            ) : (
                                                                <FaHourglassHalf className="text-red-600 text-lg mr-3" />
                                                            )}
                                                            <span className="text-gray-800">
                                                                {task.name}
                                                            </span>
                                                        </div>
                                                        <span
                                                            className={`text-sm font-medium ${task.status === "Completed"
                                                                ? "text-green-600"
                                                                : "text-red-600"
                                                                }`}
                                                        >
                                                            {task.status}
                                                        </span>
                                                    </div>
                                                    {task.feedback && (
                                                        <div className="mt-2 text-sm text-gray-500 italic">
                                                            <span className="font-medium">Feedback:</span>{" "}
                                                            {task.feedback}
                                                        </div>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserTrainings;