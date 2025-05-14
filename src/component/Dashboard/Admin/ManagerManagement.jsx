import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiX, FiCheck, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { MdOutlineManageAccounts } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { fetchManagers, upsertManager, deleteManager } from '../../../features/manager/managerAction';
import { ErrorToast, SuccessToast } from '../../helper/ResourceToast';
import YRMSLoader from "../../helper/loader";

const ManagerManagement = () => {
  const dispatch = useDispatch();
  const { managers, loading, error } = useSelector(state => state.manager);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newManager, setNewManager] = useState({ name: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, id: null });
  const [toast, setToast] = useState(null);
  const recordsPerPage = 5;

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    dispatch(fetchManagers())
      .unwrap()
      .catch(error => {
        setToast(<ErrorToast message="Failed to load managers data" />);
      });
  }, [dispatch]);

  // Filter managers based on search term
  const filteredManagers = managers?.filter(manager =>
    manager.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredManagers.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredManagers.length / recordsPerPage);

  // Handle edit click
  const handleEdit = (manager) => {
    setEditingId(manager.id);
    setEditForm({
      name: manager.name
    });
  };

  // Handle edit form change
  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  // Save edited manager
  const saveEdit = async (id) => {
    try {
      await dispatch(upsertManager({ id, name: editForm.name })).unwrap();
      setEditingId(null);
      await dispatch(fetchManagers()).unwrap();
      setToast(<SuccessToast message="Manager updated successfully!" />);
    } catch (err) {
      setToast(<ErrorToast message={err.message || "Failed to update manager"} />);
    }
  };

  // Delete manager with confirmation
  const confirmDelete = (id) => {
    setDeleteConfirmation({ show: true, id });
  };

  const executeDelete = async () => {
    try {
      await dispatch(deleteManager(deleteConfirmation.id)).unwrap();
      setDeleteConfirmation({ show: false, id: null });
      await dispatch(fetchManagers()).unwrap();
      setToast(<SuccessToast message="Manager deleted successfully!" />);
    } catch (err) {
      setToast(<ErrorToast message={err.message || "Failed to delete manager"} />);
    }
  };

  // Handle add new manager form change
  const handleAddChange = (e) => {
    setNewManager({
      ...newManager,
      [e.target.name]: e.target.value
    });
  };

  // Add new manager
  const addManager = async () => {
    try {
      await dispatch(upsertManager({ name: newManager.name })).unwrap();
      setNewManager({ name: '' });
      setShowAddModal(false);
      await dispatch(fetchManagers()).unwrap();
      setToast(<SuccessToast message="Manager added successfully!" />);
    } catch (err) {
      setToast(<ErrorToast message={err.message || "Failed to add manager"} />);
    }
  };

  if (loading) {
    return <YRMSLoader />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-xl relative">
      {toast}
      
      {/* Overlay for modals */}
      {(showAddModal || deleteConfirmation.show) && (
        <div className="fixed inset-0 backdrop-blur-md z-40"></div>
      )}

      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <MdOutlineManageAccounts className="text-3xl text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-800">Manager Directory</h2>
        </div>
        <button 
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg"
          onClick={() => setShowAddModal(true)}
        >
          <FiPlus className="text-lg" /> Add Manager
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
          placeholder="Search managers by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Add Manager Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Add New Manager</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="text-xl" />
              </button>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Manager Name</label>
              <input
                type="text"
                name="name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={newManager.name}
                onChange={handleAddChange}
                placeholder="Enter manager name"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-md"
                onClick={addManager}
              >
                Add Manager
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Confirm Deletion</h3>
              <button 
                onClick={() => setDeleteConfirmation({ show: false, id: null })}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="text-xl" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this manager? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setDeleteConfirmation({ show: false, id: null })}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-md"
                onClick={executeDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Managers Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager Name</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentRecords.length > 0 ? (
              currentRecords.map((manager, index) => (
                <tr key={manager.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-500">{indexOfFirstRecord + index + 1}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === manager.id ? (
                      <input
                        type="text"
                        name="name"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full max-w-xs"
                        value={editForm.name}
                        onChange={handleEditChange}
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                          {manager.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{manager.name}</div>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingId === manager.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(manager.id)}
                          className="text-green-600 hover:text-green-800 flex items-center gap-1 px-3 py-1 rounded-md hover:bg-green-50"
                        >
                          <FiCheck /> Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-600 hover:text-gray-800 flex items-center gap-1 px-3 py-1 rounded-md hover:bg-gray-50"
                        >
                          <FiX /> Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(manager)}
                          className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50 transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => confirmDelete(manager.id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center">
                  <div className="text-gray-500 flex flex-col items-center">
                    <FiSearch className="text-3xl mb-3 text-gray-300" />
                    <p className="text-lg">No managers found</p>
                    <p className="text-sm mt-1">Try adjusting your search query</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredManagers.length > recordsPerPage && (
        <div className="flex justify-center items-center mt-6 gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-50'}`}
          >
            <FiChevronLeft />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`px-3 py-1 rounded-lg ${currentPage === number ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-indigo-50'}`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-50'}`}
          >
            <FiChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default ManagerManagement;