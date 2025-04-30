import React, { useState, useEffect } from "react";
import { FaUsersCog, FaUserTie, FaUserPlus, FaSearch, FaArrowLeft } from "react-icons/fa";
import { FiUserCheck, FiUserX } from "react-icons/fi";
import { RiShieldUserLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, fetchTrainers, updateUserRole } from "../../../features/role/roleAction";
import { SuccessToast, ErrorToast } from "../../helper/ResourceToast";
import ConfirmRoleChangeModal from "../../helper/ConfirmRoleChangeModal";

const AccessManagement = ({ activeSection, setActiveSection }) => {
  const dispatch = useDispatch();
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showToast, setShowToast] = useState({ show: false, type: "", message: "" });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState(1); // 1 for add, 2 for remove
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  
  // Get data from Redux store
  const { 
    users, 
    trainers, 
    loading: apiLoading, 
    error 
  } = useSelector(state => state.role);
  
  const competency_id = "157be53f-9955-4078-b75b-fa9fe16da0e5"; // This should come from props or context

  useEffect(() => {
    if (activeSection === "view") {
      dispatch(fetchTrainers());
    }
  }, [activeSection, dispatch]);

  useEffect(() => {
    if (error) {
      setShowToast({ show: true, type: "error", message: error });
    }
  }, [error]);

  const handleFetchUsers = () => {
    dispatch(fetchUsers());
    setActiveSection("add");
  };

  const handleCreateTrainer = () => {
    if (!selectedUser) return;
    
    setActionType(1);
    setShowConfirmModal(true);
  };

  const handleRemoveTrainer = (trainer) => {
    setSelectedTrainer(trainer);
    setActionType(2);
    setShowConfirmModal(true);
  };

  const confirmRoleChange = () => {
    setShowConfirmModal(false);
    
    if (actionType === 1) {
      // Add trainer
      dispatch(updateUserRole({
        competency_id,
        user_id: selectedUser.userId,
        role: "trainer",
        action_type: 1
      }))
      .unwrap()
      .then(() => {
        setShowToast({ 
          show: true, 
          type: "success", 
          message: `${selectedUser.name} has been successfully added as a trainer!` 
        });
        dispatch(fetchTrainers()); // Refresh trainers list
        setSelectedUser(null);
        setActiveSection("view");
      })
      .catch((error) => {
        setShowToast({ 
          show: true, 
          type: "error", 
          message: error || "Failed to add trainer" 
        });
      });
    } else {
      // Remove trainer
      dispatch(updateUserRole({
        competency_id,
        user_id: selectedTrainer.userId,
        role: "trainer",
        action_type: 2
      }))
      .unwrap()
      .then(() => {
        setShowToast({ 
          show: true, 
          type: "success", 
          message: `${selectedTrainer.name} has been successfully removed as a trainer!` 
        });
        dispatch(fetchTrainers()); // Refresh trainers list
        setSelectedTrainer(null);
      })
      .catch((error) => {
        setShowToast({ 
          show: true, 
          type: "error", 
          message: error || "Failed to remove trainer" 
        });
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Toast Notification */}
      {showToast.show && (
        showToast.type === "success" ? 
          <SuccessToast 
            message={showToast.message} 
            onClose={() => setShowToast({...showToast, show: false})} 
          /> : 
          <ErrorToast 
            message={showToast.message} 
            onClose={() => setShowToast({...showToast, show: false})} 
          />
      )}
      
      {/* Confirmation Modal */}
      <ConfirmRoleChangeModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmRoleChange}
        userName={actionType === 1 ? selectedUser?.name : selectedTrainer?.name}
        competencyName="this competency" // Replace with actual competency name if available
        actionType={actionType}
      />
      
      {activeSection === "view" ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
              <RiShieldUserLine className="mr-2 text-blue-500" /> Trainer Management
            </h3>
            <button 
              onClick={handleFetchUsers}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition flex items-center"
              disabled={apiLoading}
            >
              <FaUserPlus className="mr-2" /> Create New Trainer
            </button>
          </div>
          
          {/* Current Trainers List */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b">
              <h4 className="font-medium text-blue-800 flex items-center">
                <FaUserTie className="mr-2" /> Current Trainers
              </h4>
            </div>
            
            {apiLoading && trainers.length === 0 ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading trainers...</p>
              </div>
            ) : trainers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No trainers found. Click "Create New Trainer" to add one.
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {trainers.map(trainer => (
                  <li key={trainer.userId} className="p-4 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{trainer.name}</h4>
                        <p className="text-sm text-gray-600">{trainer.email}</p>
                        <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {trainer.competency || "General"}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveTrainer(trainer)}
                        className="p-2 text-red-500 hover:text-red-700 transition"
                        title="Remove Trainer"
                        disabled={apiLoading}
                      >
                        <FiUserX size={20} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <button 
            onClick={() => setActiveSection("view")}
            className="flex items-center text-blue-500 hover:text-blue-700 transition"
            disabled={apiLoading}
          >
            <FaArrowLeft className="mr-1" /> Back to Trainers
          </button>
          
          <h3 className="text-2xl font-semibold text-gray-800">Create New Trainer</h3>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b">
              <h4 className="font-medium text-blue-800">Select User to Promote as Trainer</h4>
            </div>
            
            <div className="p-4">
              {/* Search and filter */}
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={apiLoading}
                />
              </div>
              
              {apiLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading users...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No users found matching your search.
                </div>
              ) : (
                <ul className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredUsers.map(user => (
                    <li 
                      key={user.userId} 
                      className={`p-3 border rounded-lg cursor-pointer transition ${selectedUser?.userId === user.userId ? 'bg-blue-100 border-blue-300' : 'hover:bg-gray-50'}`}
                      onClick={() => !apiLoading && setSelectedUser(user)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{user.name}</h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        {selectedUser?.userId === user.userId && (
                          <FiUserCheck className="text-green-500" size={20} />
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="p-4 bg-gray-50 border-t flex justify-end space-x-3">
              <button 
                onClick={() => setActiveSection("view")}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
                disabled={apiLoading}
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateTrainer}
                disabled={!selectedUser || apiLoading}
                className={`px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg transition flex items-center ${!selectedUser ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-600 hover:to-blue-700'}`}
              >
                {apiLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <FiUserCheck className="mr-2" /> Create Trainer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessManagement;