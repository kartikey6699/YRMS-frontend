import React, { useState, useEffect } from "react";
import {
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaUserGraduate,
  FaPlus,
  FaFilter,
  FaCheckCircle,
  FaHourglassHalf,
  FaPauseCircle,
  FaCheck,
  FaTimes,
  FaSearch
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import AddTraining from "../Admin/Training&Upskilling/AddTraining";
import { 
  approveProgram, 
  fetchProgramListD,
  updateProgramStatusD 
} from "../../../features/program/programAction";
import { fetchCompetencies } from "../../../features/resource/resourceAction";
import YRMSLoader from "../../helper/Loader";
import { ErrorToast, SuccessToast } from '../../helper/ResourceToast';

const TrainingManagement = () => {
  const dispatch = useDispatch();
  const { programs, loading } = useSelector((state) => state.program);
  const { competencies } = useSelector((state) => state.resource);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    approvalStatus: 'active', // active/inactive
    programStatus: 'all', // running/pending/hold/completed/all
    programType: 'all', // training/upskilling/all
    competency: 'all',
    searchQuery: ''
  });
  const [selectedPrograms, setSelectedPrograms] = useState([]);

  // Fetch programs and competencies on mount
  useEffect(() => {
    dispatch(fetchProgramListD());
    dispatch(fetchCompetencies());
  }, [dispatch]);

  // Filter programs based on current filters
  const filteredPrograms = programs.filter(program => {
    // Filter by approval status
    if (filters.approvalStatus === 'active' && !program.isApproved) return false;
    if (filters.approvalStatus === 'inactive' && program.isApproved) return false;
    
    // Filter by program status
    if (filters.programStatus !== 'all' && program.status !== filters.programStatus) return false;
    
    // Filter by program type
    if (filters.programType !== 'all' && program.type !== (filters.programType === 'training' ? 1 : 2)) return false;
    
    // Filter by competency
    if (filters.competency !== 'all' && program.competencyId !== filters.competency) return false;
    
    // Filter by search query
    if (filters.searchQuery && 
        !program.programName.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
        !program.trainerName.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const handleApprovePrograms = async () => {
    try {
      await Promise.all(
        selectedPrograms.map(programId => 
          dispatch(approveProgram({ programId })).unwrap()
        )
      );
      dispatch(fetchProgramListD());
      setSelectedPrograms([]);
      SuccessToast("Programs approved successfully!");
    } catch (error) {
      ErrorToast(error.message || "Failed to approve programs");
    }
  };

  const handleStatusChange = async (programId, newStatus) => {
    try {
      await dispatch(updateProgramStatusD({ programId, status: newStatus })).unwrap();
      dispatch(fetchProgramListD());
      SuccessToast("Status updated successfully!");
    } catch (error) {
      ErrorToast(error.message || "Failed to update status");
    }
  };

  const toggleProgramSelection = (programId) => {
    setSelectedPrograms(prev => 
      prev.includes(programId) 
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return <FaCheckCircle className="text-green-500" />;
      case 'pending': return <FaHourglassHalf className="text-yellow-500" />;
      case 'hold': return <FaPauseCircle className="text-orange-500" />;
      case 'completed': return <FaCheck className="text-blue-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'hold': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeBadge = (type) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      type === 1 ? 'bg-purple-100 text-purple-800' : 'bg-indigo-100 text-indigo-800'
    }`}>
      {type === 1 ? 'Training' : 'Upskilling'}
    </span>
  );

  const getApprovalBadge = (isApproved) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      isApproved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {isApproved ? 'Approved' : 'Pending'}
    </span>
  );

  if (loading) return <YRMSLoader message="Loading training programs..." />;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Header and Actions */}
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div className="flex items-center">
          <FaChalkboardTeacher className="h-8 w-8 text-purple-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Training Management</h1>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          {selectedPrograms.length > 0 && filters.approvalStatus === 'inactive' && (
            <button
              onClick={handleApprovePrograms}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FaCheckCircle className="mr-2" />
              Approve Selected ({selectedPrograms.length})
            </button>
          )}
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <FaPlus className="mr-2" />
            Create Program
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Approval Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Approval Status</label>
            <select
              value={filters.approvalStatus}
              onChange={(e) => setFilters({...filters, approvalStatus: e.target.value})}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
            >
              <option value="active">Approved</option>
              <option value="inactive">Pending Approval</option>
            </select>
          </div>

          {/* Program Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Program Status</label>
            <select
              value={filters.programStatus}
              onChange={(e) => setFilters({...filters, programStatus: e.target.value})}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
            >
              <option value="all">All Statuses</option>
              <option value="running">Running</option>
              <option value="pending">Pending</option>
              <option value="hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Program Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Program Type</label>
            <select
              value={filters.programType}
              onChange={(e) => setFilters({...filters, programType: e.target.value})}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
            >
              <option value="all">All Types</option>
              <option value="training">Training</option>
              <option value="upskilling">Upskilling</option>
            </select>
          </div>

          {/* Competency Filter */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Competency</label>
            <select
              value={filters.competency}
              onChange={(e) => setFilters({...filters, competency: e.target.value})}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
            >
              <option value="all">All Competencies</option>
              {competencies.map(comp => (
                <option key={comp.publicId} value={comp.publicId}>{comp.name}</option>
              ))}
            </select>
          </div> */}

          {/* Search */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
                className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search programs..."
              />
            </div>
          </div> */}
        </div>
      </div>

      {/* Programs List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {filters.approvalStatus === 'inactive' && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Select
                  </th>
                )}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Program
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trainer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approval
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPrograms.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                    No programs found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredPrograms.map((program) => (
                  <tr key={program.publicId} className="hover:bg-gray-50">
                    {filters.approvalStatus === 'inactive' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedPrograms.includes(program.publicId)}
                          onChange={() => toggleProgramSelection(program.publicId)}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-purple-100">
                          {getStatusIcon(program.status)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{program.programName}</div>
                          <div className="text-sm text-gray-500">{program.technology}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(program.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{program.trainerName}</div>
                      <div className="text-sm text-gray-500">{program.competencyName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(program.startDate).toLocaleDateString()} - {new Date(program.endDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">{program.duration} days</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(program.status)}`}>
                        {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getApprovalBadge(program.isApproved)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {!program.isApproved && (
                        <button
                          onClick={() => handleApprovePrograms([program.publicId])}
                          className="text-green-600 hover:text-green-900 mr-3"
                          title="Approve"
                        >
                          <FaCheckCircle />
                        </button>
                      )}
                      {program.isApproved && program.status !== 'completed' && (
                        <div className="flex space-x-2">
                          <select
                            value={program.status}
                            onChange={(e) => handleStatusChange(program.publicId, e.target.value)}
                            className="text-xs border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                          >
                            <option value="running">Running</option>
                            <option value="pending">Pending</option>
                            <option value="hold">Hold</option>
                            <option value="completed">Complete</option>
                          </select>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <FaChalkboardTeacher className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Programs</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {programs.length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <FaCheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Approved</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {programs.filter(p => p.isApproved).length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <FaHourglassHalf className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Approval</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {programs.filter(p => !p.isApproved).length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <FaUserGraduate className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Programs</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {programs.filter(p => p.status === 'running').length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Training Modal */}
      {showAddModal && (
        <AddTraining 
          onClose={() => setShowAddModal(false)}
          onSave={() => {
            setShowAddModal(false);
            dispatch(fetchProgramListD());
          }}
          isUpskilling={false}
        />
      )}
    </div>
  );
};

export default TrainingManagement;