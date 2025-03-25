import React, { useState } from "react";
import ProfileCard from "../../helper/ProfileCard";
import { StarIcon } from "@heroicons/react/20/solid";
import { FaInfoCircle } from "react-icons/fa";

export const BaselineHistories = ({ histories, employeeName, competency, gender }) => {
    const dummyHistories = [
        {
            employeeId: "EMP123456",
            communication: "Fluent",
            feedback: "Excellent team player",
            techSkills: [
                { technology: "React", rating: 1 },
                { technology: "Node.js", rating: 1 },
            ],
            timestamp: "2024-10-01T10:00:00Z",
        },
        {
            employeeId: "EMP123456",
            communication: "Medium",
            feedback: "Needs improvement in communication",
            techSkills: [
                { technology: "Java", rating: 2 },
                { technology: "Spring", rating: 3 },
            ],
            timestamp: "2024-11-15T14:30:00Z",
        },
        {
            employeeId: "EMP123456",
            communication: "Average",
            feedback: "Good performance",
            techSkills: [
                { technology: "Python", rating: 5 },
                { technology: "Django", rating: 4 },
            ],
            timestamp: "2025-01-20T09:15:00Z",
        },
    ];

    const combinedHistories = [...dummyHistories, ...histories];
    const [selectedBaseline, setSelectedBaseline] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const formatDate = (timestamp) => {
        if (!timestamp) return "N/A";
        const date = new Date(timestamp);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const calculateOverallRating = (techSkills) => {
        if (!techSkills || techSkills.length === 0) return 0;
        const total = techSkills.reduce((sum, skill) => sum + skill.rating, 0);
        return Math.round(total / techSkills.length);
    };

    const getStatusStyles = (rating) => {
        switch (rating) {
            case 0:
            case 1:
                return {
                    bg: "bg-red-100",
                    text: "text-red-800",
                    border: "border-red-700",
                };
            case 2:
                return {
                    bg: "bg-orange-100",
                    text: "text-orange-800",
                    border: "border-orange-700",
                };
            case 3:
                return {
                    bg: "bg-yellow-100",
                    text: "text-yellow-800",
                    border: "border-yellow-700",
                };
            case 4:
                return {
                    bg: "bg-lime-100",
                    text: "text-lime-800",
                    border: "border-lime-700",
                };
            case 5:
                return {
                    bg: "bg-green-100",
                    text: "text-green-800",
                    border: "border-green-700",
                };
            default:
                return {
                    bg: "bg-gray-100",
                    text: "text-gray-800",
                    border: "border-gray-700",
                };
        }
    };

    const openBaselineDetails = (baseline) => {
        setSelectedBaseline(baseline);
        setIsPopupOpen(true);
    };

    const closeBaselineDetails = () => {
        setIsPopupOpen(false);
        setTimeout(() => setSelectedBaseline(null), 300);
    };

    const sortedHistories = [...combinedHistories].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    return (
        <>
            {sortedHistories.map((history, index) => {
                const overallRating = calculateOverallRating(history.techSkills);
                const statusStyles = getStatusStyles(overallRating);

                return (
                    <div key={index} className="col-span-1">
                        <div
                            onClick={() => openBaselineDetails(history)}
                            className={`relative rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 h-48 flex flex-col ${statusStyles.bg} border-l-4 ${statusStyles.border} hover:shadow-xl hover:translate-y-[-4px]`}
                        >
                            <div className="p-4 flex-1 flex flex-col">
                                <div className="mb-2">
                                    <h3 className="text-lg font-semibold text-gray-800 break-words">
                                        Baseline - {formatDate(history.timestamp)}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        <strong>Communication:</strong> {history.communication}
                                    </p>
                                </div>

                <div className="mt-auto flex justify-between items-center">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FaInfoCircle className="mr-1" />
                                        <span>Skills: {history.techSkills.length}</span>
                                    </div>
                                    <div
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border-2 ${statusStyles.bg} ${statusStyles.text} ${statusStyles.border}`}
                                    >
                                        Rating: {overallRating}/5
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {sortedHistories.length === 0 && (
                <div className="col-span-full text-center py-10">
                    <p className="text-gray-500 text-lg">No baseline histories available yet.</p>
                </div>
            )}

            {selectedBaseline && (
                <div
                    className={`fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${isPopupOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                >
                    <div
                        className={`bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${isPopupOpen ? "scale-100" : "scale-95"
                            }`}
                    >
                        <div
                            className={`p-6 ${getStatusStyles(
                                calculateOverallRating(selectedBaseline.techSkills)
                            ).bg} rounded-t-xl`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">
                                        Baseline - {formatDate(selectedBaseline.timestamp)}
                                    </h3>
                                    <p className="text-gray-600">Communication: {selectedBaseline.communication}</p>
                                </div>
                                <button
                                    onClick={closeBaselineDetails}
                                    className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer transition-colors duration-200"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Overall Rating</h4>
                                    <p
                                        className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border-2 ${getStatusStyles(calculateOverallRating(selectedBaseline.techSkills)).bg
                                            } ${getStatusStyles(calculateOverallRating(selectedBaseline.techSkills)).text
                                            } ${getStatusStyles(calculateOverallRating(selectedBaseline.techSkills)).border
                                            }`}
                                    >
                                        {calculateOverallRating(selectedBaseline.techSkills)}/5
                                    </p>
                                </div>
                                <div className="md:col-span-2">
                                    <h4 className="text-sm font-medium text-gray-500">Feedback</h4>
                                    <p className="mt-1 text-gray-800 p-3 bg-gray-50 rounded-lg italic">
                                        "{selectedBaseline.feedback}"
                                    </p>
                                </div>
                                <div className="md:col-span-2">
                                    <h4 className="text-sm font-medium text-gray-500">Technology Ratings</h4>
                                    <div className="mt-2 space-y-3">
                                        {selectedBaseline.techSkills.map((skill, skillIndex) => (
                                            <div
                                                key={skillIndex}
                                                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                                            >
                                                <span className="text-gray-800 font-medium">{skill.technology}</span>
                                                <div className="flex items-center space-x-1">
                                                    {[...Array(5)].map((_, starIndex) => (
                                                        <StarIcon
                                                            key={starIndex}
                                                            className={`w-5 h-5 ${starIndex < skill.rating ? "text-yellow-400" : "text-gray-300"
                                                                }`}
                                                        />
                                                    ))}
                                                    <span className="text-sm text-gray-600 ml-2">({skill.rating}/5)</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};