import React, { useState } from 'react';
import { 
  FaUser, 
  FaCalendar, 
  FaBriefcase, 
  FaUsers, 
  FaCogs, 
  FaStar, 
  FaTimes, 
  FaEdit,
  FaSave,
  FaCode,
  FaDownload,
  FaUpload
} from 'react-icons/fa';

const EmployeeDetail = ({ resource, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(resource);
  const [resumeFile, setResumeFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTechChange = (e) => {
    setFormData(prev => ({
      ...prev,
      technologies: e.target.value.split(',').map(tech => tech.trim())
    }));
  };

  const handleSubmit = () => {
    setIsEditing(false);
    console.log('Updated data:', formData);
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    setResumeFile(file);
    console.log('Uploading resume:', file);
  };

  const handleResumeDownload = () => {
    console.log('Downloading resume for:', resource.employeeName);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/20">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-5xl transform transition-all duration-500 scale-95 hover:scale-100 border-2 border-blue-300/50">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl font-bold text-gray-800 flex items-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            <FaUser className="mr-3 text-blue-600" /> {resource.employeeName}
          </h3>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-all duration-300"
              title={isEditing ? "Cancel" : "Edit"}
            >
              <FaEdit />
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-all duration-300"
              title="Close"
            >
              <FaTimes />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Employment Details Section */}
          <div className={`bg-gray-50 rounded-xl p-6 shadow-sm transition-all duration-300 ${isEditing ? 'ring-2 ring-blue-200' : ''}`}>
            <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaBriefcase className="mr-2 text-blue-500" /> Employment Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <FaUser className="text-blue-500 mr-3" />
                {isEditing ? (
                  <input
                    name="employeeId"
                    value={formData.employeeId || ''}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-300"
                    placeholder="Employee ID"
                  />
                ) : (
                  <div>
                    <p className="text-sm text-gray-600">Employee ID</p>
                    <p className="font-semibold text-gray-800">{resource.employeeId || 'EMP123'}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <FaBriefcase className="text-blue-500 mr-3" />
                {isEditing ? (
                  <input
                    name="designation"
                    value={formData.designation || ''}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-300"
                    placeholder="Designation"
                  />
                ) : (
                  <div>
                    <p className="text-sm text-gray-600">Designation</p>
                    <p className="font-semibold text-gray-800">{resource.designation || 'Senior Developer'}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <FaCalendar className="text-blue-500 mr-3" />
                {isEditing ? (
                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate || ''}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-300"
                  />
                ) : (
                  <div>
                    <p className="text-sm text-gray-600">Joining Date</p>
                    <p className="font-semibold text-gray-800">{new Date(resource.joiningDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <FaCalendar className="text-blue-500 mr-3" />
                {isEditing ? (
                  <input
                    name="totalExperience"
                    value={formData.totalExperience || ''}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-300"
                    placeholder="Experience (years)"
                  />
                ) : (
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-semibold text-gray-800">{resource.totalExperience} years</p>
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <FaStar className="text-blue-500 mr-3" />
                {isEditing ? (
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="pool">Pool</option>
                    <option value="deployed">Deployed</option>
                    <option value="pip">PIP</option>
                  </select>
                ) : (
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
                )}
              </div>
              <div className="flex items-center">
                <FaUsers className="text-blue-500 mr-3" />
                {isEditing ? (
                  <input
                    name="grade"
                    value={formData.grade || ''}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-300"
                    placeholder="Grade (E1, E2)"
                  />
                ) : (
                  <div>
                    <p className="text-sm text-gray-600">Grade</p>
                    <p className="font-semibold text-gray-800">{resource.grade || 'E1'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Technologies Section */}
          <div className={`bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow-sm transition-all duration-300 ${isEditing ? 'ring-2 ring-blue-200' : ''}`}>
            <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaCode className="mr-2 text-blue-500" /> Technologies
            </h4>
            {isEditing ? (
              <textarea
                name="technologies"
                value={formData.technologies?.join(', ') || 'Python, Flask, Django'}
                onChange={handleTechChange}
                className="w-full h-40 border rounded-lg p-3 focus:ring-2 focus:ring-blue-300 resize-none bg-white/80 backdrop-blur-sm"
                placeholder="Enter technologies separated by commas"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {(formData.technologies || ['Python', 'Flask', 'Django']).map((tech, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-all duration-200 shadow-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer with Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex gap-4">
            <label className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all duration-300 cursor-pointer">
              <FaUpload className="mr-2" />
              Upload Resume
              <input
                type="file"
                onChange={handleResumeUpload}
                className="hidden"
                accept=".pdf,.doc,.docx"
              />
            </label>
            <button
              onClick={handleResumeDownload}
              className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all duration-300"
            >
              <FaDownload className="mr-2" />
              Download Resume
            </button>
          </div>
          <button
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center font-semibold shadow-md"
            onClick={isEditing ? handleSubmit : onClose}
          >
            {isEditing ? (
              <>
                <FaSave className="mr-2" /> Update Details
              </>
            ) : (
              <>
                <FaTimes className="mr-2" /> Close Details
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;