import React, { useState } from 'react';

const ManageBaseline = () => {
  const [activeSection, setActiveSection] = useState('view');
  const [formData, setFormData] = useState({
    employeeName: '',
    competency: '',
    tExp: [{ technology: '', years: '' }], // Array to store multiple tech/exp pairs
    status: '',
    webFramework: '',
    dataLibrary: '',
    database: '',
    frontend: '',
    other: '',
    cloud: '',
    certification: '',
    currentStatus: '',
    feedback: '',
    totalChance: '',
    unnamed17: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExpChange = (index, field, value) => {
    const updatedExp = [...formData.tExp];
    updatedExp[index][field] = value;
    setFormData(prev => ({
      ...prev,
      tExp: updatedExp
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      tExp: [...prev.tExp, { technology: '', years: '' }]
    }));
  };

  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      tExp: prev.tExp.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({
      employeeName: '',
      competency: '',
      tExp: [{ technology: '', years: '' }],
      status: '',
      webFramework: '',
      dataLibrary: '',
      database: '',
      frontend: '',
      other: '',
      cloud: '',
      certification: '',
      currentStatus: '',
      feedback: '',
      totalChance: '',
      unnamed17: ''
    });
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <div className="flex justify-between mb-6">
        <button
          className={`px-4 py-2 rounded-lg font-semibold ${activeSection === 'view' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'} hover:bg-red-600 hover:text-white transition-colors`}
          onClick={() => setActiveSection('view')}
        >
          View Baselining Details
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold ${activeSection === 'add' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'} hover:bg-red-600 hover:text-white transition-colors`}
          onClick={() => setActiveSection('add')}
        >
          Add Member
        </button>
      </div>

      {activeSection === 'add' ? (
        <div>
          <h2 className="text-2xl font-semibold text-red-600 mb-6">Add New Member</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Employee Name</label>
              <input
                type="text"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter employee name"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Competency</label>
              <input
                type="text"
                name="competency"
                value={formData.competency}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g., Python"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-1">Total Experience</label>
              {formData.tExp.map((exp, index) => (
                <div key={index} className="flex items-center space-x-4 mb-2">
                  <input
                    type="text"
                    value={exp.technology}
                    onChange={(e) => handleExpChange(index, 'technology', e.target.value)}
                    className="w-1/2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Technology (e.g., Python)"
                  />
                  <input
                    type="text"
                    value={exp.years}
                    onChange={(e) => handleExpChange(index, 'years', e.target.value)}
                    className="w-1/4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Years (e.g., 2)"
                  />
                  {formData.tExp.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addExperience}
                className="mt-2 px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Add New
              </button>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select Status</option>
                <option value="Pool">Pool</option>
                <option value="Deployed">Deployed</option>
                <option value="PIP">PIP</option>
                <option value="Hold">Hold</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Web Framework</label>
              <input
                type="text"
                name="webFramework"
                value={formData.webFramework}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g., Django, DRF"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Data Library</label>
              <input
                type="text"
                name="dataLibrary"
                value={formData.dataLibrary}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g., Numpy"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Database</label>
              <input
                type="text"
                name="database"
                value={formData.database}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g., Mysql"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Frontend</label>
              <input
                type="text"
                name="frontend"
                value={formData.frontend}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g., React, Angular"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Other</label>
              <input
                type="text"
                name="other"
                value={formData.other}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g., CI/CD, GIT"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Cloud</label>
              <input
                type="text"
                name="cloud"
                value={formData.cloud}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g., AWS/Azure"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Certification</label>
              <input
                type="text"
                name="certification"
                value={formData.certification}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g., JSON"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Current Status</label>
              <input
                type="text"
                name="currentStatus"
                value={formData.currentStatus}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g., Upskill suggestion"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Feedback</label>
              <input
                type="text"
                name="feedback"
                value={formData.feedback}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g., Comment"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Total Chance</label>
              <input
                type="text"
                name="totalChance"
                value={formData.totalChance}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g., Opportunities"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Additional Details</label>
              <textarea
                name="unnamed17"
                value={formData.unnamed17}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g., 1- Client, 2- Date..."
                rows="3"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold text-red-600 mb-6">Baselining Details</h2>
          <p className="text-gray-600">No baseline details available yet. Add members to see details here.</p>
        </div>
      )}
    </div>
  );
};

export default ManageBaseline;