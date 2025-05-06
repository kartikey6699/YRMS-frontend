import React from "react";

const UserTrainings = ({ activeSection, setActiveSection }) => {
    // Dummy data for trainings and tasks
    const trainings = [
        {
            id: 1,
            name: "Java Advanced Training",
            status: "In Progress",
            tasks: [
                { id: 1, name: "Complete Module 1 Quiz", status: "Pending" },
                { id: 2, name: "Submit Project Proposal", status: "Completed" }
            ]
        },
        {
            id: 2,
            name: "React Basics",
            status: "Completed",
            tasks: [
                { id: 3, name: "Build Todo App", status: "Completed" },
                { id: 4, name: "Attend Workshop", status: "Completed" }
            ]
        }
    ];

    return (
        <div className="p-6">
            <h3 className="text-2xl font-semibold text-gray-700 mb-6">My Trainings</h3>
            {trainings.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    No trainings assigned.
                </div>
            ) : (
                <div className="space-y-6">
                    {trainings.map(training => (
                        <div key={training.id} className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg shadow">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-xl font-medium text-gray-800">{training.name}</h4>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${training.status === "In Progress" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
                                    {training.status}
                                </span>
                            </div>
                            <div>
                                <h5 className="text-lg font-semibold text-gray-700 mb-2">Tasks</h5>
                                {training.tasks.length === 0 ? (
                                    <p className="text-gray-500">No tasks assigned.</p>
                                ) : (
                                    <ul className="space-y-2">
                                        {training.tasks.map(task => (
                                            <li key={task.id} className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm">
                                                <span>{task.name}</span>
                                                <span className={`text-sm ${task.status === "Completed" ? "text-green-600" : "text-red-600"}`}>
                                                    {task.status}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserTrainings;