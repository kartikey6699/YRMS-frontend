// BaselineHistories.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { StarIcon } from "@heroicons/react/20/solid";
import { FaInfoCircle } from "react-icons/fa";

export const BaselineHistories = ({ histories, employeeName, competency, gender }) => {
    // get resource details (including profileImage) from Redux store
    const { resourceDetails } = useSelector((state) => state.resource);
    const profileImage = resourceDetails?.profileImage;

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
        const total = techSkills.reduce((sum, skill) => sum + (skill.rating || 0), 0);
        return Math.round(total / techSkills.length);
    };

    const getStatusStyles = (rating) => {
        switch (rating) {
            case 0:
            case 1:
                return { bg: "bg-red-100", text: "text-red-800", border: "border-red-700" };
            case 2:
                return { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-700" };
            case 3:
                return { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-700" };
            case 4:
                return { bg: "bg-lime-100", text: "text-lime-800", border: "border-lime-700" };
            case 5:
                return { bg: "bg-green-100", text: "text-green-800", border: "border-green-700" };
            default:
                return { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-700" };
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

    const sortedHistories = [...histories].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    return (
        <>
            {sortedHistories.map((history, index) => {
                const overallRating = history.rating || calculateOverallRating(history.technicalSkills);
                const statusStyles = getStatusStyles(overallRating);

                return (
                    <div key={history.publicId || index} className="col-span-1">
                        <div
                            onClick={() => openBaselineDetails(history)}
                            className={`relative rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 h-48 flex flex-col ${statusStyles.bg} border-l-4 ${statusStyles.border} hover:shadow-xl hover:translate-y-[-4px]`}
                        >
                            <div className="p-4 flex-1 flex flex-col">
                                <div className="mb-2 flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-800 break-words">
                                        Baseline-{sortedHistories.length - index}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {formatDate(history.timestamp)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        <strong>Communication:</strong> {history.communication}
                                    </p>
                                </div>
                                <div className="mt-auto flex justify-between items-center">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FaInfoCircle className="mr-1" />
                                        <span>Skills: {history.technicalSkills?.length || 0}</span>
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
                    className={`fixed inset-0 bg-gray-800/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${isPopupOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                >
                    <div
                        className={`bg-gray-100 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-300 ${isPopupOpen ? "scale-100" : "scale-95"}`}
                    >
                        {/* Fixed Header with Rating-based Gradient */}
                        <div
                            className={`p-6 ${getStatusStyles(selectedBaseline.rating || calculateOverallRating(selectedBaseline.technicalSkills)).bg} rounded-t-xl sticky top-0 z-10`}
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                    {profileImage ? (
                                        <div className="relative">
                                            <img 
                                                src={`data:image/png;base64,${profileImage}`} 
                                                alt="Profile" 
                                                className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shadow-md">
                                            <span className={`text-xl font-semibold ${getStatusStyles(selectedBaseline.rating || calculateOverallRating(selectedBaseline.technicalSkills)).text}`}>
                                                {employeeName ? employeeName[0] : "N/A"}
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <h3 className={`text-xl font-bold ${getStatusStyles(selectedBaseline.rating || calculateOverallRating(selectedBaseline.technicalSkills)).text}`}>
                                            {employeeName || "Unknown Employee"}
                                        </h3>
                                        <p className={`text-sm ${getStatusStyles(selectedBaseline.rating || calculateOverallRating(selectedBaseline.technicalSkills)).text}`}>
                                            {competency || "N/A"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className={`bg-white/20 p-2 px-3 rounded-lg ${getStatusStyles(selectedBaseline.rating || calculateOverallRating(selectedBaseline.technicalSkills)).text}`}>
                                        <h3 className={`text-sm font-semibold ${getStatusStyles(selectedBaseline.rating || calculateOverallRating(selectedBaseline.technicalSkills)).text}`}>
                                            Baseline - {formatDate(selectedBaseline.timestamp)}
                                        </h3>
                                    </div>
                                    <button
                                        onClick={closeBaselineDetails}
                                        className="text-white hover:text-red-300 text-xl font-medium bg-red-600 w-8 h-8 flex items-center justify-center rounded-full shadow-sm hover:bg-red-700 transition-all duration-200 cursor-pointer"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="p-6 space-y-6 overflow-y-auto flex-1">
                            {/* Technology Experience - Blue Theme */}
                            <div className="bg-gradient-to-br from-blue-200 to-blue-300 p-4 rounded-lg border border-blue-400">
                                <h4 className="text-sm font-medium text-blue-800 mb-3">Technology Experience</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {selectedBaseline.technologyExperience?.map((exp, expIndex) => (
                                        <div key={expIndex} className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-blue-200">
                                            <div className="flex items-center justify-between">
                                                <span className="text-blue-900 font-medium">{exp.technology}</span>
                                                <span className="text-blue-700 bg-blue-200 px-2 py-1 rounded-full text-sm">{exp.years} years</span>
                                            </div>
                                        </div>
                                    ))}
                                    {(!selectedBaseline.technologyExperience || selectedBaseline.technologyExperience.length === 0) && (
                                        <p className="text-blue-500 italic col-span-full">No experience recorded</p>
                                    )}
                                </div>
                            </div>

                            {/* Certifications - Purple Theme */}
                            <div className="bg-gradient-to-br from-purple-200 to-purple-300 p-4 rounded-lg border border-purple-400">
                                <h4 className="text-sm font-medium text-purple-800 mb-3">Certifications</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {selectedBaseline.certification?.map((cert, certIndex) => (
                                        <div key={certIndex} className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-purple-200">
                                            <div className="flex items-center justify-between">
                                                <span className="text-purple-900 font-medium">{cert.title}</span>
                                                <span className="text-purple-700 bg-purple-200 px-2 py-1 rounded-full text-sm">{cert.technology}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {(!selectedBaseline.certification || selectedBaseline.certification.length === 0) && (
                                        <p className="text-purple-500 italic col-span-full">No certifications recorded</p>
                                    )}
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Total Experience - Teal Theme */}
                                <div className="bg-gradient-to-br from-teal-200 to-teal-300 p-4 rounded-lg border border-teal-400">
                                    <h4 className="text-sm font-medium text-teal-800">Total Experience</h4>
                                    <p className="mt-1 text-2xl font-bold text-teal-900">
                                        {selectedBaseline.totalExperience || 0} years
                                    </p>
                                </div>

                                {/* Communication - Indigo Theme */}
                                <div className="bg-gradient-to-br from-indigo-200 to-indigo-300 p-4 rounded-lg border border-indigo-400">
                                    <h4 className="text-sm font-medium text-indigo-800">Communication</h4>
                                    <p className="mt-1 text-2xl font-bold text-indigo-900">
                                        {selectedBaseline.communication}
                                    </p>
                                </div>

                                {/* Overall Rating - Rating-based Theme */}
                                <div className={`p-4 rounded-lg ${getStatusStyles(selectedBaseline.rating || calculateOverallRating(selectedBaseline.technicalSkills)).bg}`}>
                                    <h4 className={`text-sm font-medium ${getStatusStyles(selectedBaseline.rating || calculateOverallRating(selectedBaseline.technicalSkills)).text}`}>Overall Rating</h4>
                                    <p className={`mt-1 text-2xl font-bold ${getStatusStyles(selectedBaseline.rating || calculateOverallRating(selectedBaseline.technicalSkills)).text}`}>
                                        {selectedBaseline.rating || calculateOverallRating(selectedBaseline.technicalSkills)}/5
                                    </p>
                                </div>
                            </div>

                            {/* Feedback - Yellow Theme */}
                            <div className="bg-gradient-to-br from-yellow-200 to-yellow-300 p-4 rounded-lg border border-yellow-400">
                                <h4 className="text-sm font-medium text-yellow-800 mb-3">Feedback</h4>
                                <div className="bg-white p-4 rounded-lg border border-yellow-200">
                                    <p className="text-yellow-900 italic">
                                        "{selectedBaseline.feedback || "No feedback provided"}"
                                    </p>
                                </div>
                            </div>

                            {/* Upskill Suggestion - Green Theme */}
                            {selectedBaseline.upskillSuggestion && (
                                <div className="bg-gradient-to-br from-green-200 to-green-300 p-4 rounded-lg border border-green-400">
                                    <h4 className="text-sm font-medium text-green-800 mb-3">Upskill Suggestion</h4>
                                    <div className="bg-white p-4 rounded-lg border border-green-200">
                                        <p className="text-green-900">
                                            {selectedBaseline.upskillSuggestion}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Technical Skills - Gradient Theme */}
                            <div className="bg-gradient-to-br from-blue-200 to-purple-200 p-4 rounded-lg border border-blue-400">
                                <h4 className="text-sm font-medium text-blue-800 mb-3">Technical Skills</h4>
                                <div className="space-y-3">
                                    {selectedBaseline.technicalSkills?.map((skill, skillIndex) => (
                                        <div
                                            key={skillIndex}
                                            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-blue-200"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="text-blue-900 font-medium">{skill.technology}</span>
                                                    <span className="text-blue-600 text-sm block">{skill.category}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    {[...Array(5)].map((_, starIndex) => (
                                                        <StarIcon
                                                            key={starIndex}
                                                            className={`w-5 h-5 ${starIndex < (skill.rating || 0) ? "text-yellow-400" : "text-blue-300"}`}
                                                        />
                                                    ))}
                                                    <span className="text-sm text-blue-700 ml-2">({skill.rating || 0}/5)</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {(!selectedBaseline.technicalSkills || selectedBaseline.technicalSkills.length === 0) && (
                                        <p className="text-gray-600 italic">No technical skills recorded</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};