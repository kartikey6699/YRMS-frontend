// BaselineHistories.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { StarIcon } from "@heroicons/react/20/solid";
import { FaInfoCircle, FaStar, FaTimes, FaChartLine } from "react-icons/fa";

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

    const getStatusGradient = (rating) => {
        if (rating >= 4) return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-100';
        if (rating >= 3) return 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-100';
        if (rating >= 2) return 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-100';
        return 'bg-gradient-to-r from-red-50 to-pink-50 border-red-100';
      };
      
      const getStatusBorder = (rating) => {
        if (rating >= 4) return 'border-green-200';
        if (rating >= 3) return 'border-blue-200';
        if (rating >= 2) return 'border-amber-200';
        return 'border-red-200';
      };
      
      const getStatusStar = (index) => {
        const rating = selectedBaseline.rating || calculateOverallRating(selectedBaseline.technicalSkills);
        if (rating >= 4) return 'text-green-400';
        if (rating >= 3) return 'text-blue-400';
        if (rating >= 2) return 'text-amber-400';
        return 'text-red-400';
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
  <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20 p-4">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl border border-gray-200 flex flex-col" 
         style={{ maxHeight: '90vh', margin: '20px' }}>
      
      {/* Fixed Header Section */}
      <div className={`sticky top-0 z-10 p-4 rounded-t-xl ${getStatusGradient(selectedBaseline.rating || calculateOverallRating(selectedBaseline.technicalSkills))}`}>
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
            {/* Profile Image */}
            <div className="relative flex-shrink-0">
              {profileImage ? (
                <img
                  src={`data:image/png;base64,${profileImage}`}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center border-2 border-white shadow-lg">
                  <FaUser className="text-indigo-500 text-xl" />
                </div>
              )}
            </div>

            {/* Employee Details */}
            <div className="flex items-center gap-3 min-w-0 overflow-hidden flex-wrap">
              {/* Name */}
              <div className="bg-white/80 px-3 py-1 rounded-lg shadow-xs min-w-0 max-w-[200px] overflow-hidden border border-indigo-100">
                <h3 className="text-lg font-semibold text-indigo-800 truncate">
                  {employeeName || "Unknown Employee"}
                </h3>
              </div>

              {/* Competency */}
              <div className="bg-white/80 px-3 py-1 rounded-lg shadow-xs flex items-center gap-2 border border-purple-100">
                <span className="text-xs text-purple-600 font-medium">Competency:</span>
                <span className="text-sm text-purple-800 font-medium truncate max-w-[120px]">
                  {competency || 'N/A'}
                </span>
              </div>

              {/* Rating */}
              <div className={`px-3 py-1 rounded-lg shadow-xs flex items-center gap-2 border ${getStatusBorder(selectedBaseline.rating || calculateOverallRating(selectedBaseline.technicalSkills))} bg-white/80`}>
                <span className="text-xs font-medium">Rating:</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`${i < Math.floor(selectedBaseline.rating || calculateOverallRating(selectedBaseline.technicalSkills)) 
                        ? getStatusStar(i) 
                        : 'text-gray-300'} w-3.5 h-3.5`}
                    />
                  ))}
                  <span className="ml-1 text-sm font-medium">
                    ({selectedBaseline.rating || calculateOverallRating(selectedBaseline.technicalSkills)}/5)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={closeBaselineDetails}
            className="p-2 rounded-lg bg-white/80 hover:bg-white text-gray-600 flex-shrink-0 transition-colors duration-200 shadow-xs border border-gray-200"
          >
            <FaTimes size={16} />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto flex-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {/* Left Column - Basic Info */}
          <div className="bg-gradient-to-b from-gray-50 to-white rounded-lg p-4 md:col-span-2 ring-1 ring-indigo-200">
            <h4 className="flex items-center text-sm font-medium text-indigo-700 mb-3 border-b border-indigo-100 pb-2">
              <FaInfoCircle className="text-indigo-500 mr-2 text-xs" />
              Basic Information
            </h4>
            
            <div className="space-y-3">
              {/* Total Experience */}
              <div className="bg-indigo-50/50 p-2 rounded-lg border border-indigo-100">
                <label className="block text-xs text-indigo-600 mb-1 font-semibold">Total Experience</label>
                <p className="text-sm font-medium text-indigo-800">
                  {selectedBaseline.totalExperience || 0} years
                </p>
              </div>

              {/* Communication */}
              <div className="bg-indigo-50/50 p-2 rounded-lg border border-indigo-100">
                <label className="block text-xs text-indigo-600 mb-1 font-semibold">Communication</label>
                <p className="text-sm font-medium text-indigo-800">
                  {selectedBaseline.communication || 'N/A'}
                </p>
              </div>

              {/* Baseline Date */}
              <div className="bg-indigo-50/50 p-2 rounded-lg border border-indigo-100">
                <label className="block text-xs text-indigo-600 mb-1 font-semibold">Baseline Date</label>
                <p className="text-sm font-medium text-indigo-800">
                  {formatDate(selectedBaseline.timestamp)}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Info */}
          <div className="bg-gradient-to-b from-gray-50 to-white rounded-lg p-4 md:col-span-5 ring-1 ring-indigo-200">
            <h4 className="flex items-center text-sm font-medium text-indigo-700 mb-3 border-b border-indigo-100 pb-2">
              <FaChartLine className="text-indigo-500 mr-2 text-xs" />
              Detailed Assessment
            </h4>

            <div className="space-y-3">
              {/* Technology Experience */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-100">
                <h4 className="text-xs font-medium text-blue-700 mb-2">Technology Experience</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedBaseline.technologyExperience?.map((exp, i) => (
                    <div key={i} className="bg-white p-2 rounded-md border border-blue-200 shadow-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-blue-800 truncate">{exp.technology}</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
                          {exp.years} yrs
                        </span>
                      </div>
                    </div>
                  ))}
                  {(!selectedBaseline.technologyExperience || selectedBaseline.technologyExperience.length === 0) && (
                    <p className="text-blue-500 italic text-xs">No experience recorded</p>
                  )}
                </div>
              </div>

              {/* Certifications */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-100">
                <h4 className="text-xs font-medium text-purple-700 mb-2">Certifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedBaseline.certification?.map((cert, i) => (
                    <div key={i} className="bg-white p-2 rounded-md border border-purple-200 shadow-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-purple-800 truncate">{cert.title}</span>
                        <span className="text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-full truncate max-w-[80px]">
                          {cert.technology}
                        </span>
                      </div>
                    </div>
                  ))}
                  {(!selectedBaseline.certification || selectedBaseline.certification.length === 0) && (
                    <p className="text-purple-500 italic text-xs">No certifications recorded</p>
                  )}
                </div>
              </div>

              {/* Technical Skills */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-3 rounded-lg border border-amber-100">
                <h4 className="text-xs font-medium text-amber-700 mb-2">Technical Skills</h4>
                <div className="space-y-2">
                  {selectedBaseline.technicalSkills?.map((skill, i) => (
                    <div key={i} className="bg-white p-2 rounded-md border border-amber-200 shadow-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-amber-800 truncate">{skill.technology}</span>
                        <span className="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
                          {skill.category}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`${i < (skill.rating || 0) ? "text-amber-400" : "text-amber-200"} w-3 h-3 mr-0.5`}
                          />
                        ))}
                        <span className="text-xs text-amber-700 ml-1">({skill.rating || 0}/5)</span>
                      </div>
                    </div>
                  ))}
                  {(!selectedBaseline.technicalSkills || selectedBaseline.technicalSkills.length === 0) && (
                    <p className="text-amber-500 italic text-xs">No technical skills recorded</p>
                  )}
                </div>
              </div>

              {/* Feedback & Upskill */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-100">
                  <h4 className="text-xs font-medium text-green-700 mb-2">Feedback</h4>
                  <div className="bg-white p-2 rounded-md border border-green-200 max-h-[100px] overflow-y-auto">
                    <p className="text-xs text-green-800 italic">
                      {selectedBaseline.feedback || "No feedback provided"}
                    </p>
                  </div>
                </div>

                {selectedBaseline.upskillSuggestion && (
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-3 rounded-lg border border-teal-100">
                    <h4 className="text-xs font-medium text-teal-700 mb-2">Upskill Suggestion</h4>
                    <div className="bg-white p-2 rounded-md border border-teal-200 max-h-[100px] overflow-y-auto">
                      <p className="text-xs text-teal-800">
                        {selectedBaseline.upskillSuggestion}
                      </p>
                    </div>
                  </div>
                )}
              </div>
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