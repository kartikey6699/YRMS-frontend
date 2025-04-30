import React, { useState } from "react";
import { FaStar, FaChevronDown, FaChevronUp } from "react-icons/fa";

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

  // Moved isExpanded state to an array to handle multiple histories
  const [expandedStates, setExpandedStates] = useState({});

  const toggleExpand = (publicId) => {
    setExpandedStates((prev) => ({
      ...prev,
      [publicId]: !prev[publicId],
    }));
  };

  return (
    <div className="space-y-4 h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Previous Baselines</h3>
      <div className="space-y-3">
        {sortedHistories.map((history) => {
          const overallRating = Math.round(history.rating);
          const statusStyles = getStatusStyles(overallRating);

          return (
            <div 
              key={history.publicId} 
              className={`rounded-lg overflow-hidden transition-all duration-300 ${statusStyles.gradient} border-l-4 ${statusStyles.border}`}
            >
              <div 
                onClick={() => toggleExpand(history.publicId)}
                className="p-3 flex justify-between items-center cursor-pointer hover:bg-opacity-90 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${statusStyles.bg} border ${statusStyles.border}`}>
                    <span className="text-xs font-bold">{overallRating}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-800">
                      {formatDate(history.timestamp)}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {history.technicalSkills?.length || 0} skills | {history.communication}
                    </p>
                  </div>
                </div>
                {expandedStates[history.publicId] ? (
                  <FaChevronUp className="text-gray-600 w-4 h-4" />
                ) : (
                  <FaChevronDown className="text-gray-600 w-4 h-4" />
                )}
              </div>

              {expandedStates[history.publicId] && (
                <div className="p-3 bg-white/90 border-t border-gray-200">
                  <div className="space-y-2 text-xs">
                    {/* Technical Skills */}
                    <div>
                      <h5 className="font-medium text-gray-500 mb-1">Top Skills</h5>
                      <div className="space-y-1">
                        {history.technicalSkills?.slice(0, 3).map((skill, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <span className="text-gray-700">{skill.technology}</span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, j) => (
                                <FaStar
                                  key={j}
                                  className={`${j < skill.rating ? statusStyles.star : "text-gray-300"} w-2.5 h-2.5`}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Experience */}
                    <div>
                      <h5 className="font-medium text-gray-500 mb-1">Experience</h5>
                      <div className="space-y-1">
                        {history.technologyExperience?.slice(0, 2).map((exp, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <span className="text-gray-700">{exp.technology}</span>
                            <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
                              {exp.years} yrs
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Certifications */}
                    <div>
                      <h5 className="font-medium text-gray-500 mb-1">Certifications</h5>
                      <div className="space-y-1">
                        {history.certification?.slice(0, 2).map((cert, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <span className="text-gray-700">{cert.title}</span>
                            <span className="bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-full">
                              {cert.technology}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {sortedHistories.length === 0 && (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">No previous baselines</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BaselineTimeline;