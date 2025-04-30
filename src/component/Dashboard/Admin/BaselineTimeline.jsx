import React, { useState } from "react";
import { FaStar, FaChevronDown, FaChevronUp, FaChartLine, FaInfoCircle, FaAward } from "react-icons/fa";

const BaselineTimeline = ({ histories }) => {
  const getStatusStyles = (rating) => {
    switch (rating) {
      case 0:
      case 1:
        return { 
          bg: "bg-red-300", 
          text: "text-red-900", 
          border: "border-red-800",
          star: "text-red-600",
          gradient: "bg-gradient-to-r from-red-200 to-pink-200",
          borderLight: "border-red-400"
        };
      case 2:
        return { 
          bg: "bg-orange-300", 
          text: "text-orange-900", 
          border: "border-orange-800",
          star: "text-orange-600",
          gradient: "bg-gradient-to-r from-amber-200 to-orange-200",
          borderLight: "border-orange-400"
        };
      case 3:
        return { 
          bg: "bg-yellow-300", 
          text: "text-yellow-900", 
          border: "border-yellow-800",
          star: "text-yellow-600",
          gradient: "bg-gradient-to-r from-yellow-200 to-amber-200",
          borderLight: "border-yellow-400"
        };
      case 4:
        return { 
          bg: "bg-lime-300", 
          text: "text-lime-900", 
          border: "border-lime-800",
          star: "text-lime-600",
          gradient: "bg-gradient-to-r from-lime-200 to-green-200",
          borderLight: "border-lime-400"
        };
      case 5:
        return { 
          bg: "bg-green-300", 
          text: "text-green-900", 
          border: "border-green-800",
          star: "text-green-600",
          gradient: "bg-gradient-to-r from-green-200 to-emerald-200",
          borderLight: "border-green-400"
        };
      default:
        return { 
          bg: "bg-gray-300", 
          text: "text-gray-900", 
          border: "border-gray-800",
          star: "text-gray-600",
          gradient: "bg-gradient-to-r from-gray-200 to-slate-200",
          borderLight: "border-gray-400"
        };
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Sort from oldest to newest
  const sortedHistories = [...histories].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  const [expandedStates, setExpandedStates] = useState({});

  const toggleExpand = (publicId) => {
    setExpandedStates((prev) => ({
      ...prev,
      [publicId]: !prev[publicId],
    }));
  };

  // Section colors for better visual hierarchy
  const sectionColors = {
    skills: "bg-emerald-50 border-l-4 border-emerald-300",
    experience: "bg-blue-50 border-l-4 border-blue-300",
    certifications: "bg-purple-50 border-l-4 border-purple-300",
    feedback: "bg-indigo-50 border-l-4 border-indigo-300",
    communication: "bg-amber-50 border-l-4 border-amber-300"
  };

  return (
    <div className="space-y-4 h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Baseline History</h3>
      <div className="space-y-3">
        {sortedHistories.map((history) => {
          const overallRating = Math.round(history.rating);
          const statusStyles = getStatusStyles(overallRating);
          const isExpanded = expandedStates[history.publicId];

          return (
            <div 
              key={history.publicId} 
              className={`rounded-lg overflow-hidden transition-all duration-300 ${statusStyles.gradient} border-l-4 ${statusStyles.border}`}
            >
              {/* Header */}
              <div 
                onClick={() => toggleExpand(history.publicId)}
                className="p-3 flex justify-between items-center cursor-pointer hover:bg-opacity-90 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${statusStyles.bg} border ${statusStyles.border}`}>
                    <span className="text-xs font-bold">{overallRating}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-800">
                      {formatDate(history.timestamp)}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {history.technicalSkills?.length || 0} skills • {history.communication} • {history.totalExperience} yrs
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <FaChevronUp className="text-gray-600 w-4 h-4" />
                ) : (
                  <FaChevronDown className="text-gray-600 w-4 h-4" />
                )}
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="p-3 bg-white/90 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    
                    {/* Left Column */}
                    <div className="space-y-3">
                      {/* Skills Section */}
                      <div className={`p-3 rounded ${sectionColors.skills}`}>
                        <div className="flex items-center mb-2">
                          <FaStar className="text-emerald-500 mr-2 text-sm" />
                          <h5 className="text-xs font-semibold text-emerald-700">TECHNICAL SKILLS</h5>
                        </div>
                        <div className="space-y-2">
                          {history.technicalSkills?.map((skill, i) => (
                            <div key={i} className="flex justify-between items-center bg-white p-2 rounded border border-emerald-100">
                              <span className="text-xs text-gray-700">{skill.technology}</span>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, j) => (
                                  <FaStar
                                    key={j}
                                    className={`${j < skill.rating ? "text-amber-400" : "text-gray-300"} w-3 h-3`}
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                          {(!history.technicalSkills || history.technicalSkills.length === 0) && (
                            <p className="text-xs text-gray-400 italic">No skills recorded</p>
                          )}
                        </div>
                      </div>

                      {/* Experience Section */}
                      <div className={`p-3 rounded ${sectionColors.experience}`}>
                        <div className="flex items-center mb-2">
                          <FaChartLine className="text-blue-500 mr-2 text-sm" />
                          <h5 className="text-xs font-semibold text-blue-700">EXPERIENCE</h5>
                        </div>
                        <div className="space-y-2">
                          {history.technologyExperience?.map((exp, i) => (
                            <div key={i} className="flex justify-between items-center bg-white p-2 rounded border border-blue-100">
                              <span className="text-xs text-gray-700">{exp.technology}</span>
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                {exp.years} yrs
                              </span>
                            </div>
                          ))}
                          {(!history.technologyExperience || history.technologyExperience.length === 0) && (
                            <p className="text-xs text-gray-400 italic">No experience recorded</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-3">
                      {/* Certifications Section */}
                      <div className={`p-3 rounded ${sectionColors.certifications}`}>
                        <div className="flex items-center mb-2">
                          <FaAward className="text-purple-500 mr-2 text-sm" />
                          <h5 className="text-xs font-semibold text-purple-700">CERTIFICATIONS</h5>
                        </div>
                        <div className="space-y-2">
                          {history.certification?.map((cert, i) => (
                            <div key={i} className="flex justify-between items-center bg-white p-2 rounded border border-purple-100">
                              <span className="text-xs text-gray-700">{cert.title}</span>
                              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                                {cert.technology}
                              </span>
                            </div>
                          ))}
                          {(!history.certification || history.certification.length === 0) && (
                            <p className="text-xs text-gray-400 italic">No certifications</p>
                          )}
                        </div>
                      </div>

                      {/* Communication Section */}
                      <div className={`p-3 rounded ${sectionColors.communication}`}>
                        <div className="flex items-center mb-2">
                          <FaInfoCircle className="text-amber-500 mr-2 text-sm" />
                          <h5 className="text-xs font-semibold text-amber-700">COMMUNICATION</h5>
                        </div>
                        <div className="bg-white p-2 rounded border border-amber-100">
                          <p className="text-xs text-gray-700 capitalize">
                            {history.communication?.toLowerCase() || "Not specified"}
                          </p>
                        </div>
                      </div>

                      {/* Feedback Section */}
                      {history.feedback && (
                        <div className={`p-3 rounded ${sectionColors.feedback}`}>
                          <div className="flex items-center mb-2">
                            <FaInfoCircle className="text-indigo-500 mr-2 text-sm" />
                            <h5 className="text-xs font-semibold text-indigo-700">FEEDBACK</h5>
                          </div>
                          <div className="bg-white p-2 rounded border border-indigo-100">
                            <p className="text-xs text-gray-700">
                              {history.feedback}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Suggestion Section */}
                      {history.upskillSuggestion && (
                        <div className={`p-3 rounded ${sectionColors.feedback}`}>
                          <div className="flex items-center mb-2">
                            <FaInfoCircle className="text-indigo-500 mr-2 text-sm" />
                            <h5 className="text-xs font-semibold text-indigo-700">SUGGESTION</h5>
                          </div>
                          <div className="bg-white p-2 rounded border border-indigo-100">
                            <p className="text-xs text-gray-700">
                              {history.upskillSuggestion}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {sortedHistories.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm">No baseline history available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BaselineTimeline;