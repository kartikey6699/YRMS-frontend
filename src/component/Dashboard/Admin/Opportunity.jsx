import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaPlus, FaArrowLeft, FaCheck, FaTimes, FaInfoCircle, FaClock, FaSearch, FaChevronDown } from 'react-icons/fa';
import ProfileCard from '../../helper/ProfileCard';
import { createOpportunity, fetchOpportunities } from '../../../features/opportunity/opportunityAction';
import { fetchResourceDetails } from '../../../features/resource/resourceAction';
import { useDispatch, useSelector } from 'react-redux';
import YRMSLoader from '../../helper/loader';
import { SuccessToast, ErrorToast } from '../../helper/ResourceToast';

const Opportunities = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const userId = window.location.pathname.split('/').pop(); 

  const [resource, setResource] = useState(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchOpportunities(userId));
      console.log("this is the user id", userId);
      dispatch(fetchResourceDetails(userId)).then((result) => {
        if (fetchResourceDetails.fulfilled.match(result)) {
          setResource(result.payload);
        }
      });
    }
  }, [dispatch, userId]); 

  const { opportunities, loading, error } = useSelector((state) => state.opportunity);

  const [newOpportunity, setNewOpportunity] = useState({
    clientName: '',
    dateOfInterview: '',
    jobDescription: '',
    totalRounds: '',
    clearedRounds: '',
    finalResult: 'Pending',
    clientFeedback: '',
    userId: userId // Ensure userId is included in the payload
  });

  const [showForm, setShowForm] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [toast, setToast] = useState(null);

  const filteredOpportunities = opportunities.filter(opportunity => {
    const matchesSearch = opportunity.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || opportunity.finalResult === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedOpportunities = [...filteredOpportunities].sort((a, b) => 
    new Date(a.date_of_interview) - new Date(b.date_of_interview)
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'clearedRounds') {
      if (!newOpportunity.totalRounds) {
        setErrorMessage('Please enter total rounds first.');
        return;
      } else if (parseInt(value) > parseInt(newOpportunity.totalRounds)) {
        setErrorMessage('Cleared rounds cannot be greater than total rounds.');
        return;
      }
    }
    setErrorMessage('');
    setNewOpportunity((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOpportunity = async (e) => {
    e.preventDefault();
    setToast(<YRMSLoader message="Creating opportunity..." />);
    try {
      const result = await dispatch(createOpportunity(newOpportunity)); 
      if (createOpportunity.fulfilled.match(result)) {
        setToast(<SuccessToast message="Opportunity created successfully!" onClose={() => setToast(null)} />);
        dispatch(fetchOpportunities(userId));
      } else {
        const errorMessage = result.error.message || "Failed to create opportunity";
        setToast(<ErrorToast message={errorMessage} onClose={() => setToast(null)} />);
        throw new Error(errorMessage);
      }
    } catch (err) {
      setToast(<ErrorToast message={err.message || "Failed to create opportunity"} onClose={() => setToast(null)} />);
    } finally {
      setNewOpportunity({
        clientName: '',
        dateOfInterview: '',
        jobDescription: '',
        totalRounds: '',
        clearedRounds: '',
        finalResult: 'Pending',
        clientFeedback: '',
        userId: userId // Reset userId in the new opportunity
      });
      setShowForm(false);
    }
  };

  const openOpportunityDetails = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsPopupOpen(true);
  };

  const closeOpportunityDetails = () => {
    setIsPopupOpen(false);
    setTimeout(() => setSelectedOpportunity(null), 300);
  };

  const openAddForm = () => setShowForm(true);
  const closeAddForm = () => setShowForm(false);

  const getStatusStyles = (status) => {
    switch(status) {
      case 'Cleared':
        return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-700', icon: <FaCheck className="mr-1" /> };
      case 'Rejected':
        return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-700', icon: <FaTimes className="mr-1" /> };
      case 'Pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-700', icon: <FaClock className="mr-1" /> };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-700', icon: null };
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-purple-50 min-h-screen">
      {loading && <YRMSLoader />}
      {toast}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center mb-6 text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer"
      >
        <FaArrowLeft className="mr-2" /> Back to Resources
      </button>

      {resource && (
        <ProfileCard
        publicId={userId}
        />
      )}

      <h2 className="text-3xl font-bold text-blue-800 mb-6">
        Opportunities for {resource ? resource.employeeName : "Loading..."}
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
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${statusFilter === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('Cleared')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200 flex items-center ${statusFilter === 'Cleared' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
            >
              <FaCheck className="mr-1" /> Cleared
            </button>
            <button
              onClick={() => setStatusFilter('Rejected')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200 flex items-center ${statusFilter === 'Rejected' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
            >
              <FaTimes className="mr-1" /> Rejected
            </button>
            <button
              onClick={() => setStatusFilter('Pending')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200 flex items-center ${statusFilter === 'Pending' ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}`}
            >
              <FaClock className="mr-1" /> Pending
            </button>
          </div>
        </div>
      </div>

      {/* Opportunities Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
        {sortedOpportunities.length > 0 ? (
          sortedOpportunities.map((opportunity, index) => {
            const statusStyles = getStatusStyles(opportunity.finalResult);
            
            return (
              <div 
                key={opportunity.publicId} // Changed to use a unique identifier
                onClick={() => openOpportunityDetails(opportunity)}
                className={`relative rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 h-48 flex flex-col ${statusStyles.bg} border-l-4 ${statusStyles.border} hover:shadow-xl hover:translate-y-[-4px]`}
              >
                <div className="p-4 flex-1 flex flex-col">
                  <div className="mb-2 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800 break-words">
                      Opportunity-{index + 1}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(opportunity.dateOfInterview).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mt-1">
                      {opportunity.clientName}
                    </p>
                  </div>
                  <div className="mt-auto flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-600">
                      <FaInfoCircle className="mr-1" />
                      <span>Rounds: {opportunity.clearedRounds}/{opportunity.totalRounds}</span>
                    </div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border-2 ${statusStyles.bg} ${statusStyles.text} ${statusStyles.border}`}>
                      {statusStyles.icon}
                      {opportunity.finalResult}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : null
        }


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
            <div className={`p-6 ${getStatusStyles(selectedOpportunity.finalResult).bg} rounded-t-xl`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                    <span className="text-gray-600 text-xl font-semibold">
                      {resource.employeeName ? resource.employeeName[0] : "N/A"}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {resource.employeeName || "Unknown Employee"}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {resource.designation || "Position N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-lg font-semibold text-gray-800">
                    Date: {new Date(selectedOpportunity.dateOfInterview).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                  <button 
                    onClick={closeOpportunityDetails}
                    className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer transition-colors duration-200"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Client Name</h4>
                  <p className="mt-1 text-gray-800 p-3 bg-gray-50 rounded-lg">
                    {selectedOpportunity.clientName}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500">Job Description</h4>
                  <p className="mt-1 text-gray-800 p-3 bg-gray-50 rounded-lg">
                    {selectedOpportunity.jobDescription}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Final Result</h4>
                  <p className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border-2 ${getStatusStyles(selectedOpportunity.finalResult).bg} ${getStatusStyles(selectedOpportunity.finalResult).text} ${getStatusStyles(selectedOpportunity.finalResult).border}`}>
                    {getStatusStyles(selectedOpportunity.finalResult).icon}
                    {selectedOpportunity.finalResult}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Interview Rounds</h4>
                  <div className="mt-1">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className={`h-2.5 rounded-full ${getStatusStyles(selectedOpportunity.finalResult).bg}`}
                          style={{ width: `${(selectedOpportunity.clearedRounds / selectedOpportunity.totalRounds) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {selectedOpportunity.clearedRounds}/{selectedOpportunity.totalRounds}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500">Client Feedback</h4>
                  <p className="mt-1 text-gray-800 p-3 bg-gray-50 rounded-lg italic">
                    "{selectedOpportunity.clientFeedback}"
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
          <div className={`bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${showForm ? 'scale-100' : 'scale-95'} overflow-hidden`}>
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 relative">
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full transform translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full transform -translate-x-20 translate-y-20"></div>
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-white">Add New Opportunity for {resource ? resource.employeeName : "Loading..."}</h3>
                    <p className="text-indigo-100 mt-1">Add details about the interview process</p>
                  </div>
                  <button 
                    onClick={closeAddForm}
                    className="text-white hover:text-red-200 text-xl cursor-pointer transition-colors duration-200 p-1 rounded-full hover:bg-red-500"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleAddOpportunity} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Client Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="clientName"
                      value={newOpportunity.clientName}
                      onChange={handleInputChange}
                      className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 group-hover:bg-white"
                      placeholder="Tech Solutions Inc."
                      required
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Interview Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="dateOfInterview"
                      value={newOpportunity.dateOfInterview}
                      onChange={handleInputChange}
                      className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 group-hover:bg-white appearance-none"
                      required
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2 relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Job Description</label>
                  <div className="relative">
                    <textarea
                      name="jobDescription"
                      value={newOpportunity.jobDescription}
                      onChange={handleInputChange}
                      className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 group-hover:bg-white min-h-[120px]"
                      placeholder="Describe the position requirements and responsibilities..."
                      required
                    />
                    <div className="absolute left-4 top-4 text-indigo-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 ml-1">Interview Process</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                      <label className="block text-sm font-medium text-indigo-800 mb-2">Total Rounds</label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          name="totalRounds"
                          value={newOpportunity.totalRounds}
                          onChange={handleInputChange}
                          className="w-20 p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-center text-indigo-800 font-bold"
                          placeholder="0"
                          required
                          min="1"
                        />
                        <span className="ml-3 text-indigo-600">interview rounds</span>
                      </div>
                    </div>
                    
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                      <label className="block text-sm font-medium text-indigo-800 mb-2">Cleared Rounds</label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          name="clearedRounds"
                          value={newOpportunity.clearedRounds}
                          onChange={handleInputChange}
                          className="w-20 p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-center text-indigo-800 font-bold"
                          placeholder="0"
                          required
                          min="0"
                          max={newOpportunity.totalRounds || 10}
                        />
                        <span className="ml-3 text-indigo-600">rounds passed</span>
                      </div>
                      {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
                    </div>
                  </div>
                  
                  {newOpportunity.totalRounds > 0 && (
                    <div className="mt-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium text-indigo-700">Progress</span>
                        <span className="text-xs font-medium text-indigo-700">
                          {Math.round((newOpportunity.clearedRounds / newOpportunity.totalRounds) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-indigo-100 rounded-full h-2.5">
                        <div 
                          className="bg-gradient-to-r from-indigo-400 to-purple-500 h-2.5 rounded-full" 
                          style={{ width: `${Math.min(100, (newOpportunity.clearedRounds / newOpportunity.totalRounds) * 100)}%`, transition: 'width 0.3s ease' }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Final Result</label>
                  <div className="relative">
                    <select
                      name="finalResult"
                      value={newOpportunity.finalResult}
                      onChange={handleInputChange}
                      className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 group-hover:bg-white appearance-none"
                      required
                    >
                      <option value="Pending">Pending</option>
                      <option value="Cleared">Cleared</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-indigo-500 pointer-events-none">
                      <FaChevronDown />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-end">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Status Preview</label>
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border-2 ${getStatusStyles(newOpportunity.finalResult).bg} ${getStatusStyles(newOpportunity.finalResult).text} ${getStatusStyles(newOpportunity.finalResult).border}`}>
                      {getStatusStyles(newOpportunity.finalResult).icon}
                      {newOpportunity.finalResult}
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2 relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Client Feedback</label>
                  <div className="relative">
                    <textarea
                      name="clientFeedback"
                      value={newOpportunity.clientFeedback}
                      onChange={handleInputChange}
                      className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 group-hover:bg-white min-h-[100px]"
                      placeholder="Any specific feedback from the client..."
                    />
                    <div className="absolute left-4 top-4 text-indigo-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeAddForm}
                  className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 font-medium cursor-pointer flex items-center shadow-sm hover:shadow-md"
                >
                  <FaTimes className="mr-2" /> Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center cursor-pointer shadow-lg hover:shadow-xl"
                >
                  Save Opportunity
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