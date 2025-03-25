import ProfileCard from "../../helper/ProfileCard";
import { StarIcon } from "@heroicons/react/20/solid";

export const BaselineHistories = ({ histories, employeeName, competency, gender }) => {
  // Dummy data for all employees with timestamps
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

  // Function to format the timestamp into a readable date (e.g., "Mar 24, 2025")
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Function to calculate overall rating (average of tech skills ratings)
  const calculateOverallRating = (techSkills) => {
    if (!techSkills || techSkills.length === 0) return 0;
    const total = techSkills.reduce((sum, skill) => sum + skill.rating, 0);
    return Math.round(total / techSkills.length);
  };

  // Function to get hover effect based on overall rating
  const getHoverEffect = (overallRating) => {
    switch (overallRating) {
      case 0:
      case 1:
        return "hover:shadow-[0_0_15px_2px_rgba(255,0,0,0.5)] hover:border-red-500";
      case 2:
        return "hover:shadow-[0_0_15px_2px_rgba(255,165,0,0.5)] hover:border-orange-500";
      case 3:
        return "hover:shadow-[0_0_15px_2px_rgba(255,255,0,0.5)] hover:border-yellow-500";
      case 4:
        return "hover:shadow-[0_0_15px_2px_rgba(50,205,50,0.5)] hover:border-lime-500";
      case 5:
        return "hover:shadow-[0_0_15px_2px_rgba(0,255,0,0.5)] hover:border-green-500";
      default:
        return "hover:shadow-[0_0_15px_2px_rgba(128,128,128,0.5)] hover:border-gray-500";
    }
  };

  // Function to get color for overall rating badge
  const getRatingColor = (rating) => {
    switch (rating) {
      case 0: return "bg-gray-300";
      case 1: return "bg-red-400";
      case 2: return "bg-orange-400";
      case 3: return "bg-yellow-400";
      case 4: return "bg-lime-400";
      case 5: return "bg-green-400";
      default: return "bg-gray-300";
    }
  };

  return (
    <div className="relative">
      <ProfileCard employeeName={employeeName} competency={competency} gender={gender} />
      <h2 className="text-4xl font-extrabold text-blue-900 mb-10 text-center tracking-wide bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
        Previous Baselines
      </h2>
      {combinedHistories.length > 0 ? (
        <div className="relative">
          {/* Vertical Card Layout */}
          <div className="flex flex-col space-y-6 py-6 px-4 bg-gradient-to-b from-gray-100 to-gray-200 rounded-xl shadow-inner">
            {combinedHistories.map((history, index) => {
              const overallRating = calculateOverallRating(history.techSkills);
              return (
                <div
                  key={index}
                  className={`w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 transform transition-all duration-500 
                    ${getHoverEffect(overallRating)} border-2 border-transparent hover:scale-105 bg-gradient-to-br from-white to-gray-50`}
                >
                  {/* Card Header */}
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
                      Baseline - {formatDate(history.timestamp)}
                    </h3>
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-semibold text-white ${getRatingColor(
                        overallRating
                      )} shadow-md`}
                    >
                      {overallRating}/5
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="space-y-5">
                    {/* Employee Code */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 font-medium">Employee Code:</span>
                      <span className="text-gray-800 font-semibold">{history.employeeId}</span>
                    </div>

                    {/* Communication */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 font-medium">Communication:</span>
                      <span className="text-gray-800 font-semibold">{history.communication}</span>
                    </div>

                    {/* Feedback */}
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Feedback:</p>
                      <p className="text-gray-700 bg-gray-100 p-3 rounded-lg shadow-sm">{history.feedback}</p>
                    </div>

                    {/* Technology Ratings */}
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-2">Technology Ratings:</p>
                      <div className="space-y-3">
                        {history.techSkills.map((skill, skillIndex) => (
                          <div
                            key={skillIndex}
                            className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg shadow-sm"
                          >
                            <span className="text-gray-800 font-medium text-sm">{skill.technology}</span>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, starIndex) => (
                                <StarIcon
                                  key={starIndex}
                                  className={`w-5 h-5 ${
                                    starIndex < skill.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  } transition-colors duration-300`}
                                />
                              ))}
                              <span className="text-sm text-gray-600 ml-2 font-semibold">
                                ({skill.rating}/5)
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-600 py-12 bg-gray-100 rounded-xl shadow-inner">
          <p className="text-xl font-medium">No baseline histories available yet.</p>
        </div>
      )}
    </div>
  );
};