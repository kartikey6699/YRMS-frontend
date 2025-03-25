import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaPlus, FaArrowLeft, FaCheck, FaTimes, FaInfoCircle, FaClock, FaSearch } from 'react-icons/fa';
import ProfileCard from '../../helper/ProfileCard';

const Opportunities = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const resource = state?.resource || {
    employeeName: 'John Doe',
    competency: 'Advanced',
    gender: 'male'
  };

  const [opportunities, setOpportunities] = useState([
    {
      id: 1,
      client_name: 'Tech Solutions Inc.',
      date_of_interview: '2023-10-15',
      jd: 'Senior Frontend Developer with 5+ years of React experience',
      total_rounds: 3,
      cleared_rounds: 3,
      final_result: 'Passed',
      client_feedback: 'Excellent technical skills and communication'
    },
    {
      id: 2,
      client_name: 'Global Enterprises Corporation',
      date_of_interview: '2023-09-20',
      jd: 'Full Stack Developer with Node.js and React',
      total_rounds: 4,
      cleared_rounds: 2,
      final_result: 'Failed',
      client_feedback: 'Strong frontend skills but needs more backend experience'
    },
    {
      id: 3,
      client_name: 'Innovate Corp',
      date_of_interview: '2023-11-05',
      jd: 'React Native Mobile Developer',
      total_rounds: 2,
      cleared_rounds: 2,
      final_result: 'Passed',
      client_feedback: 'Perfect fit for our mobile team'
    },
    {
      id: 4,
      client_name: 'Data Systems Ltd',
      date_of_interview: '2023-08-10',
      jd: 'Data Visualization Specialist',
      total_rounds: 3,
      cleared_rounds: 1,
      final_result: 'Failed',
      client_feedback: 'Good technical skills but lacking in data visualization experience'
    },
    {
      id: 5,
      client_name: 'Future Tech Ventures',
      date_of_interview: '2023-12-01',
      jd: 'Cloud Solutions Architect',
      total_rounds: 5,
      cleared_rounds: 3,
      final_result: 'Pending',
      client_feedback: 'Waiting for final decision from hiring manager'
    }
  ]);

  const [newOpportunity, setNewOpportunity] = useState({
    client_name: '',
    date_of_interview: '',
    jd: '',
    total_rounds: '',
    cleared_rounds: '',
    final_result: 'Pending',
    client_feedback: ''
  });

  const [showForm, setShowForm] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  // New state for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter and search logic
  const filteredOpportunities = opportunities.filter(opportunity => {
    const matchesSearch = opportunity.client_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         opportunity.jd.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || opportunity.final_result === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort opportunities by date
  const sortedOpportunities = [...filteredOpportunities].sort((a, b) => 
    new Date(a.date_of_interview) - new Date(b.date_of_interview)
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOpportunity((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOpportunity = (e) => {
    e.preventDefault();
    setOpportunities((prev) => [
      ...prev,
      { 
        ...newOpportunity, 
        id: prev.length + 1
      }
    ]);
    setNewOpportunity({
      client_name: '',
      date_of_interview: '',
      jd: '',
      total_rounds: '',
      cleared_rounds: '',
      final_result: 'Pending',
      client_feedback: ''
    });
    setShowForm(false);
  };

  const openOpportunityDetails = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsPopupOpen(true);
  };

  const closeOpportunityDetails = () => {
    setIsPopupOpen(false);
    setTimeout(() => setSelectedOpportunity(null), 300);
  };

  const openAddForm = () => {
    setShowForm(true);
  };

  const closeAddForm = () => {
    setShowForm(false);
  };

  const getStatusStyles = (status) => {
    switch(status) {
      case 'Passed':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-700',
          icon: <FaCheck className="mr-1" />
        };
      case 'Failed':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          border: 'border-red-700',
          icon: <FaTimes className="mr-1" />
        };
      default: // Pending
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          border: 'border-yellow-700',
          icon: <FaClock className="mr-1" />
        };
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-purple-50 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center mb-6 text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer"
      >
        <FaArrowLeft className="mr-2" /> Back to Resources
      </button>

      {/* Profile Card */}
      <ProfileCard
        employeeName={resource.employeeName}
        competency={resource.competency}
        gender={resource.gender}
      />

      <h2 className="text-3xl font-bold text-blue-800 mb-6">
        Opportunities for {resource.employeeName}
      </h2>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-1/2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by client name or job description..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <span className="text-sm font-medium text-gray-700">Filter by:</span>
          <div className="flex space-x-2">
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${
                statusFilter === 'All' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('Passed')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200 flex items-center ${
                statusFilter === 'Passed' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              <FaCheck className="mr-1" /> Passed
            </button>
            <button
              onClick={() => setStatusFilter('Failed')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200 flex items-center ${
                statusFilter === 'Failed' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-red-100 text-red-800 hover:bg-red-200'
              }`}
            >
              <FaTimes className="mr-1" /> Failed
            </button>
            <button
              onClick={() => setStatusFilter('Pending')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200 flex items-center ${
                statusFilter === 'Pending' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
              }`}
            >
              <FaClock className="mr-1" /> Pending
            </button>
          </div>
        </div>
      </div>

      {/* Opportunities Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
        {sortedOpportunities.length > 0 ? (
          sortedOpportunities.map((opportunity) => {
            const statusStyles = getStatusStyles(opportunity.final_result);
            
            return (
              <div 
                key={opportunity.id}
                onClick={() => openOpportunityDetails(opportunity)}
                className={`relative rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 h-48 flex flex-col
                  ${statusStyles.bg} border-l-4 ${statusStyles.border} hover:shadow-xl hover:translate-y-[-4px]`}
              >
                <div className="p-4 flex-1 flex flex-col">
                  <div className="mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 break-words">
                      {opportunity.client_name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(opportunity.date_of_interview).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  <div className="mt-auto flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-600">
                      <FaInfoCircle className="mr-1" />
                      <span>Rounds: {opportunity.cleared_rounds}/{opportunity.total_rounds}</span>
                    </div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border-2
                      ${statusStyles.bg} ${statusStyles.text} ${statusStyles.border}`}
                    >
                      {statusStyles.icon}
                      {opportunity.final_result}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500 text-lg">No opportunities found matching your criteria</p>
          </div>
        )}

        {/* Add New Opportunity Card */}
        <div 
          onClick={openAddForm}
          className="rounded-xl shadow-lg border-2 border-dashed border-gray-300 bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 flex items-center justify-center cursor-pointer transition-all duration-300 h-48 hover:shadow-xl hover:translate-y-[-4px]"
        >
          <div className="text-center p-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md mx-auto mb-3 transition-transform duration-200 hover:scale-110">
              <FaPlus className="text-blue-500 text-xl" />
            </div>
            <p className="text-blue-600 font-medium">Add New Opportunity</p>
            <p className="text-gray-500 text-sm mt-1">Click to create new record</p>
          </div>
        </div>
      </div>

      {/* Opportunity Detail Popup */}
      {selectedOpportunity && (
        <div className={`fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${isPopupOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className={`bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${isPopupOpen ? 'scale-100' : 'scale-95'}`}>
            <div className={`p-6 ${getStatusStyles(selectedOpportunity.final_result).bg} rounded-t-xl`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {selectedOpportunity.client_name}
                  </h3>
                  <p className="text-gray-600">
                    {new Date(selectedOpportunity.date_of_interview).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <button 
                  onClick={closeOpportunityDetails}
                  className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer transition-colors duration-200"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500">Job Description</h4>
                  <p className="mt-1 text-gray-800 p-3 bg-gray-50 rounded-lg">
                    {selectedOpportunity.jd}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Final Result</h4>
                  <p className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border-2
                    ${getStatusStyles(selectedOpportunity.final_result).bg} ${getStatusStyles(selectedOpportunity.final_result).text} ${getStatusStyles(selectedOpportunity.final_result).border}`}
                  >
                    {getStatusStyles(selectedOpportunity.final_result).icon}
                    {selectedOpportunity.final_result}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Interview Rounds</h4>
                  <div className="mt-1">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className={`h-2.5 rounded-full ${getStatusStyles(selectedOpportunity.final_result).bg}`}
                          style={{ width: `${(selectedOpportunity.cleared_rounds / selectedOpportunity.total_rounds) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {selectedOpportunity.cleared_rounds}/{selectedOpportunity.total_rounds}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500">Client Feedback</h4>
                  <p className="mt-1 text-gray-800 p-3 bg-gray-50 rounded-lg italic">
                    "{selectedOpportunity.client_feedback}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Opportunity Form Popup */}
      {showForm && (
        <div className={`fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${showForm ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className={`bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${showForm ? 'scale-100' : 'scale-95'}`}>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Add New Opportunity</h3>
                <button 
                  onClick={closeAddForm}
                  className="text-white hover:text-gray-200 text-xl cursor-pointer transition-colors duration-200"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form onSubmit={handleAddOpportunity} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Name*</label>
                  <input
                    type="text"
                    name="client_name"
                    value={newOpportunity.client_name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g. Tech Solutions Inc."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interview Date*</label>
                  <input
                    type="date"
                    name="date_of_interview"
                    value={newOpportunity.date_of_interview}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Description*</label>
                  <textarea
                    name="jd"
                    value={newOpportunity.jd}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Describe the position requirements"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Rounds*</label>
                  <input
                    type="number"
                    name="total_rounds"
                    value={newOpportunity.total_rounds}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g. 3"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cleared Rounds*</label>
                  <input
                    type="number"
                    name="cleared_rounds"
                    value={newOpportunity.cleared_rounds}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g. 2"
                    required
                    min="0"
                    max={newOpportunity.total_rounds || 10}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Final Result*</label>
                  <select
                    name="final_result"
                    value={newOpportunity.final_result}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="Passed">Passed</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Feedback</label>
                  <textarea
                    name="client_feedback"
                    value={newOpportunity.client_feedback}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Any specific feedback from client"
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={closeAddForm}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center cursor-pointer hover:shadow-md"
                >
                  <FaPlus className="mr-2" /> Add Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Opportunities;