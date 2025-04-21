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
                    className={`fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${isPopupOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                >
                    <div
                        className={`bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${isPopupOpen ? "scale-100" : "scale-95"}`}
                    >
                        <div
                            className={`p-6 ${getStatusStyles(selectedBaseline.rating || calculateOverallRating(selectedBaseline.technicalSkills)).bg} rounded-t-xl`}
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                    {profileImage ? (
                                        <div className="relative">
                                            <img 
                                                src={`data:image/png;base64,${profileImage}`} 
                                                alt="Profile" 
                                                className="w-12 h-12 rounded-full border-2 border-white"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                                            <span className="text-gray-600 text-xl font-semibold">
                                                {employeeName ? employeeName[0] : "N/A"}
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">
                                            {employeeName || "Unknown Employee"}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {competency || "N/A"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 bg-gray-50 rounded-lg p-2">
                                    <h3 className="text-lg font-semibold text-gray-800 flex-grow">
                                        Baseline - {formatDate(selectedBaseline.timestamp)}
                                    </h3>
                                    <button
                                        onClick={closeBaselineDetails}
                                        className="text-gray-600 text-xl font-medium bg-white w-6 h-6 flex items-center justify-center rounded-full shadow-sm"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Experience */}
                                <div className="md:col-span-2">
                                    <h4 className="text-sm font-medium text-gray-500">Technology Experience</h4>
                                    <div className="mt-2 space-y-2">
                                        {selectedBaseline.technologyExperience?.map((exp, expIndex) => (
                                            <div key={expIndex} className="flex justify-between bg-gray-50 p-3 rounded-lg">
                                                <span className="text-gray-800 font-medium">{exp.technology}</span>
                                                <span className="text-gray-600">{exp.years} years</span>
                                            </div>
                                        ))}
                                        {(!selectedBaseline.technologyExperience || selectedBaseline.technologyExperience.length === 0) && (
                                            <p className="text-gray-500 italic">No experience recorded</p>
                                        )}
                                    </div>
                                </div>

                                {/* Certifications */}
                                <div className="md:col-span-2">
                                    <h4 className="text-sm font-medium text-gray-500">Certifications</h4>
                                    <div className="mt-2 space-y-2">
                                        {selectedBaseline.certification?.map((cert, certIndex) => (
                                            <div key={certIndex} className="flex justify-between bg-gray-50 p-3 rounded-lg">
                                                <span className="text-gray-800 font-medium">{cert.title}</span>
                                                <span className="text-gray-600">{cert.technology}</span>
                                            </div>
                                        ))}
                                        {(!selectedBaseline.certification || selectedBaseline.certification.length === 0) && (
                                            <p className="text-gray-500 italic">No certifications recorded</p>
                                        )}
                                    </div>
                                </div>

                                {/* Total Experience */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Total Experience</h4>
                                    <p className="mt-1 text-gray-800">
                                        {selectedBaseline.totalExperience || 0} years
                                    </p>
                                </div>

                                {/* Communication */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Communication</h4>
                                    <p className="mt-1 text-gray-800">
                                        {selectedBaseline.communication}
                                    </p>
                                </div>

                                {/* Overall Rating */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Overall Rating</h4>
                                    <p
                                        className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border-2 ${getStatusStyles(selectedBaseline.rating || calculateOverallRating(selectedBaseline.technicalSkills)).bg} ${getStatusStyles(selectedBaseline.rating || calculateOverallRating(selectedBaseline.technicalSkills)).text} ${getStatusStyles(selectedBaseline.rating || calculateOverallRating(selectedBaseline.technicalSkills)).border}`}
                                    >
                                        {selectedBaseline.rating || calculateOverallRating(selectedBaseline.technicalSkills)}/5
                                    </p>
                                </div>

                                {/* Feedback */}
                                <div className="md:col-span-2">
                                    <h4 className="text-sm font-medium text-gray-500">Feedback</h4>
                                    <p className="mt-1 text-gray-800 p-3 bg-gray-50 rounded-lg italic">
                                        "{selectedBaseline.feedback || "No feedback provided"}"
                                    </p>
                                </div>

                                {/* Upskill Suggestion */}
                                {selectedBaseline.upskillSuggestion && (
                                    <div className="md:col-span-2">
                                        <h4 className="text-sm font-medium text-gray-500">Upskill Suggestion</h4>
                                        <p className="mt-1 text-gray-800 p-3 bg-gray-50 rounded-lg">
                                            {selectedBaseline.upskillSuggestion}
                                        </p>
                                    </div>
                                )}

                                {/* Technical Skills */}
                                <div className="md:col-span-2">
                                    <h4 className="text-sm font-medium text-gray-500">Technical Skills</h4>
                                    <div className="mt-2 space-y-3">
                                        {selectedBaseline.technicalSkills?.map((skill, skillIndex) => (
                                            <div
                                                key={skillIndex}
                                                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                                            >
                                                <div>
                                                    <span className="text-gray-800 font-medium">{skill.technology}</span>
                                                    <span className="text-gray-500 text-sm block">{skill.category}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    {[...Array(5)].map((_, starIndex) => (
                                                        <StarIcon
                                                            key={starIndex}
                                                            className={`w-5 h-5 ${starIndex < (skill.rating || 0) ? "text-yellow-400" : "text-gray-300"}`}
                                                        />
                                                    ))}
                                                    <span className="text-sm text-gray-600 ml-2">({skill.rating || 0}/5)</span>
                                                </div>
                                            </div>
                                        ))}
                                        {(!selectedBaseline.technicalSkills || selectedBaseline.technicalSkills.length === 0) && (
                                            <p className="text-gray-500 italic">No technical skills recorded</p>
                                        )}
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