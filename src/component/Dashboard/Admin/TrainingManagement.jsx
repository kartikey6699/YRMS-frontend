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
  FaSearch,
  FaBan,
  FaTrash,
  FaEdit
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import AdminAddTraining from "../Admin/Training&Upskilling/AddTrainingAdmin";
import { 
  approveProgram, 
  fetchProgramList,
  updateProgramStatus,
  updateApprovalStatus
} from "../../../features/program/programAction";
import { fetchCompetencies } from "../../../features/resource/resourceAction";
import { ErrorToast, SuccessToast } from '../../helper/ResourceToast';
import YRMSLoader from "../../helper/loader";

const TrainingManagement = () => {
  const dispatch = useDispatch();
  const { programs, loading } = useSelector((state) => state.program);
  const { competencies } = useSelector((state) => state.resource);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    approvalStatus: 'all',
    programStatus: 'all',
    programType: 'all',
    competency: 'all',
    searchQuery: ''
  });
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const [editingStatus, setEditingStatus] = useState(null);
  const [editingApproval, setEditingApproval] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
        const timer = setTimeout(() => setToast(null), 2000);
        return () => clearTimeout(timer);
    }
}, [toast]);

  // Status options for dropdowns
  const statusOptions = [
    { value: 'Hold', label: 'Hold' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Running', label: 'Running' },
    { value: 'Completed', label: 'Completed' }
  ];

  const approvalOptions = [
    { value: 'approved', label: 'Approved' },
    { value: 'pending', label: 'Pending' },
    { value: 'rejected', label: 'Rejected' }
  ];

  // Fetch programs and competencies on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchProgramList()).unwrap();
        await dispatch(fetchCompetencies()).unwrap();
      } catch (error) {
        setToast(<ErrorToast message="Failed to load training programs data" />);
      }
    };
    fetchData();
  }, [dispatch]);

  // Filter programs based on current filters
  const filteredPrograms = programs.filter(program => {
    // Filter by approval status
    if (filters.approvalStatus !== 'all' && program.approvalStatus !== filters.approvalStatus) return false;
    
    // Filter by program status
    if (filters.programStatus !== 'all' && program.status?.toLowerCase() !== filters.programStatus.toLowerCase()) return false;
    
    // Filter by program type
    if (filters.programType !== 'all' && program.type?.toLowerCase() !== filters.programType.toLowerCase()) return false;
    
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
      dispatch(fetchProgramList());
      setSelectedPrograms([]);
      setToast(<SuccessToast message="Programs approved successfully!" />);
    } catch (error) {
      setToast(<ErrorToast message={error.message || "Failed to approve programs"} />);
    }
  };

  const handleStatusChange = async (publicId, newStatus) => {
    const statusMap = {
      Hold: 1,
      Pending: 2,
      Running: 3,
      Completed: 4
    };

    const mappedStatus = statusMap[newStatus] || newStatus;

    try {
      await dispatch(updateProgramStatus({ publicId, status: mappedStatus })).unwrap();
      dispatch(fetchProgramList());
      setToast(<SuccessToast message="Status updated successfully!" />);
      setEditingStatus(null);
    } catch (error) {
      setToast(<ErrorToast message={error.message || "Failed to update status"} />);
    }
  };

  const handleApprovalChange = async (publicId, newApprovalStatus) => {
    try {
      await dispatch(updateApprovalStatus({ publicId, approvalStatus: newApprovalStatus })).unwrap();
      dispatch(fetchProgramList());
      setToast(<SuccessToast message="Approval status updated successfully!" />);
      setEditingApproval(null);
    } catch (error) {
      setToast(<ErrorToast message={error.message || "Failed to update approval status"} />);
    }
  };

  const handleDelete = async (programId) => {
    try {
      await dispatch(deleteProgram(programId)).unwrap();
      dispatch(fetchProgramList());
      setToast(<SuccessToast message="Program deleted successfully!" />);
      setShowDeleteConfirm(null);
    } catch (error) {
      setToast(<ErrorToast message={error.message || "Failed to delete program"} />);
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
    if (typeof status !== 'string') return null;
    switch (status.toLowerCase()) {
      case 'running': return <FaCheckCircle className="text-green-500" />;
      case 'pending': return <FaHourglassHalf className="text-yellow-500" />;
      case 'hold': return <FaPauseCircle className="text-orange-500" />;
      case 'completed': return <FaCheck className="text-blue-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    if (typeof status !== 'string') return 'bg-gray-100 text-gray-800';
    switch (status.toLowerCase()) {
      case 'running': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'hold': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeBadge = (type) => {
    if (!type) return null;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        type.toLowerCase() === 'training' ? 'bg-purple-100 text-purple-800' : 'bg-indigo-100 text-indigo-800'
      }`}>
        {type}
      </span>
    );
  };

  const getApprovalBadge = (approvalStatus) => {
    if (!approvalStatus) return null;
    switch (approvalStatus.toLowerCase()) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            Rejected
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  const handleCardClick = (cardType) => {
    setActiveCard(cardType);
    switch (cardType) {
      case 'total':
        setFilters({
          ...filters,
          approvalStatus: 'all',
          programStatus: 'all',
          programType: 'all'
        });
        break;
      case 'approved':
        setFilters({
          ...filters,
          approvalStatus: 'approved',
          programStatus: 'all',
          programType: 'all'
        });
        break;
      case 'pending':
        setFilters({
          ...filters,
          approvalStatus: 'pending',
          programStatus: 'all',
          programType: 'all'
        });
        break;
      case 'active':
        setFilters({
          ...filters,
          approvalStatus: 'all',
          programStatus: 'running',
          programType: 'all'
        });
        break;
      default:
        break;
    }
  };

  const getCardBgColor = (cardType) => {
    return activeCard === cardType ? 'ring-2 ring-purple-500' : '';
  };

  const countByApprovalStatus = (status) => {
    return programs.filter(p => p.approvalStatus?.toLowerCase() === status.toLowerCase()).length;
  };

  const countByProgramStatus = (status) => {
    return programs.filter(p => typeof p.status === 'string' && p.status.toLowerCase() === status.toLowerCase()).length;
  };

  // if (loading) return <YRMSLoader message="Loading training programs..." />;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {toast}
      {loading && <YRMSLoader message="Loading training programs..." />}
      {/* Header and Actions */}
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div className="flex items-center">
          <FaChalkboardTeacher className="h-8 w-8 text-purple-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Training Management</h1>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          {selectedPrograms.length > 0 && filters.approvalStatus === 'pending' && (
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

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div 
          className={`bg-white overflow-hidden shadow rounded-lg cursor-pointer transition-all ${getCardBgColor('total')}`}
          onClick={() => handleCardClick('total')}
        >
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

        <div 
          className={`bg-white overflow-hidden shadow rounded-lg cursor-pointer transition-all ${getCardBgColor('approved')}`}
          onClick={() => handleCardClick('approved')}
        >
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
                      {countByApprovalStatus('approved')}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div 
          className={`bg-white overflow-hidden shadow rounded-lg cursor-pointer transition-all ${getCardBgColor('pending')}`}
          onClick={() => handleCardClick('pending')}
        >
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
                      {countByApprovalStatus('pending')}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div 
          className={`bg-white overflow-hidden shadow rounded-lg cursor-pointer transition-all ${getCardBgColor('active')}`}
          onClick={() => handleCardClick('active')}
        >
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
                      {countByProgramStatus('running')}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
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
              onChange={(e) => {
                setFilters({...filters, approvalStatus: e.target.value});
                setActiveCard(null);
              }}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
            >
              <option value="all">All</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Program Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Program Status</label>
            <select
              value={filters.programStatus}
              onChange={(e) => {
                setFilters({...filters, programStatus: e.target.value});
                setActiveCard(null);
              }}
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
              onChange={(e) => {
                setFilters({...filters, programType: e.target.value});
                setActiveCard(null);
              }}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
            >
              <option value="all">All Types</option>
              <option value="training">Training</option>
              <option value="upskilling">Upskilling</option>
            </select>
          </div>

          {/* Competency Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Competency</label>
            <select
              value={filters.competency}
              onChange={(e) => {
                setFilters({...filters, competency: e.target.value});
                setActiveCard(null);
              }}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
            >
              <option value="all">All Competencies</option>
              {competencies.map((comp, index) => (
                <option key={`${comp.publicId}-${index}`} value={comp.publicId}>{comp.name}</option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div>
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
          </div>
        </div>
      </div>

      {/* Programs List */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gradient-to-r from-purple-50 to-indigo-50">
              <tr>
                {filters.approvalStatus === 'pending' && (
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Select
                  </th>
                )}
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Program
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Trainer
                </th>
                <th scope="col" className="px-7 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Approval
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPrograms.length === 0 ? (
                <tr>
                  <td colSpan={filters.approvalStatus === 'pending' ? 6 : 5} className="px-6 py-6 text-center text-sm text-gray-500 bg-gray-50">
                    No programs found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredPrograms.map((program, index) => (
                  <tr 
                    key={`${program.publicId}-${index}`}
                    className={`transition-colors duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-purple-50`}
                  >
                    {filters.approvalStatus === 'pending' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedPrograms.includes(program.publicId)}
                          onChange={() => toggleProgramSelection(program.publicId)}
                          className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
                        />
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-purple-100 shadow-sm">
                          {getStatusIcon(program.status)}
                        </div>
                        <div className="ml-4">
                          <div className="text-base font-medium text-gray-900">{program.programName}</div>
                          <div className="text-sm text-gray-500">{program.technology}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(program.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-base text-gray-900">{program.trainerName}</div>
                      <div className="text-sm text-gray-500">{program.competency}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingStatus === program.publicId ? (
                        <select
                          className="border border-purple-300 rounded p-1 text-sm focus:ring-purple-500 focus:border-purple-500 w-full"
                          value={program.status}
                          onChange={(e) => handleStatusChange(program.publicId, e.target.value)}
                          autoFocus
                          onBlur={() => setEditingStatus(null)}
                        >
                          {statusOptions.map((option, idx) => (
                            <option key={`${option.value}-${idx}`} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <button
                          onClick={() => setEditingStatus(program.publicId)}
                          className="hover:bg-purple-100 rounded p-1 transition-colors w-full text-center"
                        >
                          <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full shadow-sm ${getStatusColor(program.status)}`}>
                            {program.status}
                          </span>
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingApproval === program.publicId ? (
                        <select
                          className="border border-purple-300 rounded p-1 text-sm focus:ring-purple-500 focus:border-purple-500 w-full"
                          value={program.approvalStatus}
                          onChange={(e) => handleApprovalChange(program.publicId, e.target.value)}
                          autoFocus
                          onBlur={() => setEditingApproval(null)}
                        >
                          {program.approvalStatus === 'pending' && approvalOptions.map((option, idx) => (
                            <option key={`${option.value}-${idx}`} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                          {program.approvalStatus === 'approved' && approvalOptions.filter(option => option.value === 'approved').map((option, idx) => (
                            <option key={`${option.value}-${idx}`} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                          {program.approvalStatus === 'rejected' && approvalOptions.filter(option => option.value !== 'pending').map((option, idx) => (
                            <option key={`${option.value}-${idx}`} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <button
                          onClick={() => setEditingApproval(program.publicId)}
                          className="hover:bg-purple-100 rounded p-1 transition-colors w-full text-center"
                        >
                          {getApprovalBadge(program.approvalStatus)}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Training Modal */}
      {showAddModal && (
        <AdminAddTraining 
          onClose={() => setShowAddModal(false)}
          onSave={() => {
            setShowAddModal(false);
            dispatch(fetchProgramList())
              .unwrap()
              .then(() => setToast(<SuccessToast message="Training program created successfully!" />))
              .catch(error => setToast(<ErrorToast message={error.message || "Failed to create training program"} />));
          }}
          isUpskilling={false}
        />
      )}
    </div>
  );
};

export default TrainingManagement;
