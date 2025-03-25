import React from 'react';
import { FaUser, FaCalendar, FaBriefcase, FaMapMarkerAlt, FaUsers, FaCogs, FaStar, FaTimes } from 'react-icons/fa';

const EmployeeDetail = ({ resource, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-xl p-6 w-full max-w-4xl transform transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaUser className="mr-2 text-blue-600" /> {resource.employeeName}
          </h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800 text-2xl transition-colors">
            <FaTimes />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Basic Info */}
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center mb-3">
              <FaBriefcase className="text-blue-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Job Title</p>
                <p className="font-semibold">{resource.jobTitle}</p>
              </div>
            </div>
            <div className="flex items-center mb-3">
              <FaCalendar className="text-blue-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Joining Date</p>
                <p className="font-semibold">{new Date(resource.joiningDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaStar className="text-blue-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  resource.status === 'pool' ? 'bg-blue-100 text-blue-800' :
                  resource.status === 'deployed' ? 'bg-green-100 text-green-800' :
                  resource.status === 'pip' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {resource.status.charAt(0).toUpperCase() + resource.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Middle Column - Organization Info */}
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center mb-3">
              <FaUsers className="text-blue-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Business Group</p>
                <p className="font-semibold">{resource.businessGroup}</p>
              </div>
            </div>
            <div className="flex items-center mb-3">
              <FaUsers className="text-blue-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Business Unit</p>
                <p className="font-semibold">{resource.businessUnit}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaMapMarkerAlt className="text-blue-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-semibold">{resource.address}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Skills */}
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center mb-3">
              <FaStar className="text-blue-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Competency</p>
                <p className="font-semibold">{resource.competency}</p>
              </div>
            </div>
            <div className="flex items-center mb-3">
              <FaCogs className="text-blue-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Technologies</p>
                <p className="font-semibold">{resource.technologies.join(', ')}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaCalendar className="text-blue-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Experience</p>
                <p className="font-semibold">{resource.totalExperience} years</p>
              </div>
            </div>
          </div>
        </div>

        <button
          className="mt-6 w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center font-semibold"
          onClick={onClose}
        >
          <FaTimes className="mr-2" /> Close Details
        </button>
      </div>
    </div>
  );
};

export default EmployeeDetail;