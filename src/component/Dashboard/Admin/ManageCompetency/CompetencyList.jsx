import React, { useState, useEffect } from 'react';
import { FaPlus, FaSort, FaSortUp, FaSortDown, FaEdit, FaTrash, FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight, FaUserCircle, FaUserPlus, FaTimes, FaUserFriends, FaUserMinus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCompetency, fetchCompetencies } from '../../../../features/resource/resourceAction';
import { fetchCompetencyAdmins, updateUserRole, fetchAvailableAdmins } from '../../../../features/role/roleAction';
import DeleteConfirmationModal from '../../../helper/DeleteConfirmationModal';
import ConfirmRoleChangeModal from '../../../helper/ConfirmRoleChangeModal';
import YRMSLoader from '../../../helper/loader';
import { ErrorToast, SuccessToast } from '../../../helper/ResourceToast';
import Select from 'react-select';

const ListCompetency = ({ setActiveSection, setSelectedCompetency, onSort, sortConfig }) => {
    const [toastState, setToastState] = useState(null);
    const dispatch = useDispatch();
    const { competencies } = useSelector((state) => state.resource);
    const { competencyAdmins, availableAdmins, roleLoading } = useSelector((state) => state.role);

    const [deleteModal, setDeleteModal] = useState({ isOpen: false, competencyId: null, competencyName: "" });
    const [adminModal, setAdminModal] = useState({ isOpen: false, competencyId: null, competencyName: "" });
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, user: null, competencyId: null, actionType: null });
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedAdminToAdd, setSelectedAdminToAdd] = useState(null);
    const itemsPerPage = 10;

    useEffect(() => {
        dispatch(fetchCompetencies());
    }, [dispatch]);

    const filteredCompetencies = competencies.filter(competency =>
        competency.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredCompetencies.length / itemsPerPage);
    const paginatedCompetencies = filteredCompetencies.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleDeleteConfirm = () => {
        setToastState({ type: "loading", message: "Deleting competency..." });
        dispatch(deleteCompetency(deleteModal.competencyId))
            .unwrap()
            .then(() => {
                setToastState({
                    type: "success",
                    message: "Competency deleted successfully!",
                });
                setTimeout(() => setToastState(null), 3000);
            })
            .catch(error => {
                setToastState({
                    type: "error",
                    message: error.message || "Failed to delete competency",
                });
                setTimeout(() => setToastState(null), 3000);
            });
        setDeleteModal({ isOpen: false, competencyId: null, competencyName: "" });
    };

    const handleOpenAdminModal = (competency) => {
        setAdminModal({
            isOpen: true,
            competencyId: competency.publicId,
            competencyName: competency.name,
        });
        dispatch(fetchCompetencyAdmins(competency.publicId));
        dispatch(fetchAvailableAdmins({ public_id: competency.publicId }));
    };

    const handleAddAdmin = () => {
        if (!selectedAdminToAdd) return;
        setConfirmModal({
            isOpen: true,
            user: selectedAdminToAdd,
            competencyId: adminModal.competencyId,
            actionType: 1,
        });
    };

    const handleRemoveAdmin = (admin) => {
        setConfirmModal({
            isOpen: true,
            user: { value: admin.userId, label: `${admin.name} (${admin.email})` },
            competencyId: adminModal.competencyId,
            actionType: 2,
        });
    };

    const handleConfirmAction = () => {
        const isAddAction = confirmModal.actionType === 1;
        setToastState({ type: "loading", message: isAddAction ? "Adding admin..." : "Removing admin..." });
        dispatch(
            updateUserRole({
                competency_id: confirmModal.competencyId,
                user_id: confirmModal.user.value,
                role: "Admin",
                action_type: confirmModal.actionType,
            })
        )
            .unwrap()
            .then(() => {
                dispatch(fetchCompetencyAdmins(adminModal.competencyId)).then(() => {
                    dispatch(fetchAvailableAdmins({ public_id: adminModal.competencyId }));
                    setToastState({
                        type: "success",
                        message: isAddAction ? "Admin added successfully!" : "Admin removed successfully!",
                    });
                    setTimeout(() => setToastState(null), 3000);
                    if (isAddAction) {
                        setSelectedAdminToAdd(null);
                    }
                    setConfirmModal({ isOpen: false, user: null, competencyId: null, actionType: null });
                });
            })
            .catch((err) => {
                setToastState({
                    type: "error",
                    message: err.message || `Failed to ${isAddAction ? 'add' : 'remove'} admin`,
                });
                setTimeout(() => setToastState(null), 3000);
                setConfirmModal({ isOpen: false, user: null, competencyId: null, actionType: null });
            });
    };

    const adminOptions = availableAdmins
        .filter(user => !competencyAdmins.some(admin => admin.publicId === user.publicId))
        .map(user => ({
            value: user.userId,
            label: `${user.name} (${user.email})`,
        }));

    const columns = [
        { key: "sno", label: "S.No" },
        { key: "name", label: "Competency Name" },
    ];

    return (
        <div className="p-6 bg-gradient-to-r overscroll-none from-blue-50 to-purple-50 rounded-xl shadow-lg">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-3xl font-bold text-blue-800">Competencies Management</h2>
                    <button
                        className="btn px-6 py-3 rounded-lg font-semibold text-lg flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
                        onClick={() => { setActiveSection('add'); setSelectedCompetency(null); }}
                    >
                        <FaPlus className="mr-2" />
                        Add Competency
                    </button>
                </div>

                <div className="mb-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search competencies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="absolute right-3 top-3 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`overflow-x-auto rounded-lg shadow-lg border border-gray-200 ${deleteModal.isOpen || adminModal.isOpen || confirmModal.isOpen ? 'filter blur-sm' : ''}`}>
                <table className="w-full border-collapse" role="grid">
                    <thead>
                        <tr className="bg-gray-100 text-gray-800">
                            {columns.map(column => (
                                <th key={column.key} className="p-3 text-left font-semibold text-sm border-b border-gray-200" scope="col" aria-sort={sortConfig.key === column.key ? sortConfig.direction : "none"}>
                                    <div className="flex items-center justify-between">
                                        <span>{column.label}</span>
                                        {column.key !== "sno" && (
                                            <button
                                                onClick={() => onSort(column.key)}
                                                className="ml-2 focus:outline-none"
                                            >
                                                {sortConfig.key === column.key ? (
                                                    sortConfig.direction === "ascending" ? (
                                                        <FaSortUp className="text-blue-600" />
                                                    ) : (
                                                        <FaSortDown className="text-blue-600" />
                                                    )
                                                ) : (
                                                    <FaSort className="text-gray-400 hover:text-blue-600" />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </th>
                            ))}
                            <th className="p-3 text-left font-semibold text-sm border-b border-gray-200" scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedCompetencies.map((competency, index) => (
                            <tr key={competency.publicId} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors`} role="row">
                                <td className="p-3 text-gray-700 text-sm text-center border-r border-gray-200">
                                    {(currentPage - 1) * itemsPerPage + index + 1}
                                </td>
                                <td className="p-3 text-blue-600 text-sm font-medium border-r border-gray-200">
                                    <button
                                        onClick={() => handleOpenAdminModal(competency)}
                                        className="hover:underline focus:outline-none"
                                    >
                                        {competency.name}
                                    </button>
                                </td>
                                <td className="p-3 text-gray-700 text-sm">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => {
                                                setSelectedCompetency(competency);
                                                setActiveSection("add");
                                            }}
                                            className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                            title="Edit"
                                        >
                                            <FaEdit size={14} />
                                        </button>
                                        <button
                                            onClick={() => setDeleteModal({
                                                isOpen: true,
                                                competencyId: competency.publicId,
                                                competencyName: competency.name
                                            })}
                                            className="flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                            title="Delete"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredCompetencies.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-200 gap-3">
                        <div className="text-sm text-gray-700 whitespace-nowrap">
                            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                            <span className="font-medium">
                                {Math.min(currentPage * itemsPerPage, filteredCompetencies.length)}
                            </span>{" "}
                            of <span className="font-medium">{filteredCompetencies.length}</span> results
                        </div>

                        <div className="flex items-center space-x-1 sm:space-x-2">
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-md ${currentPage === 1
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-blue-600 hover:bg-blue-50'
                                    }`}
                                aria-label="First page"
                            >
                                <FaAngleDoubleLeft className="text-sm sm:text-base" />
                            </button>

                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-md ${currentPage === 1
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-blue-600 hover:bg-blue-50'
                                    }`}
                                aria-label="Previous page"
                            >
                                <FaAngleLeft className="text-sm sm:text-base" />
                            </button>

                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base rounded-md ${currentPage === pageNum
                                                ? 'bg-blue-600 text-white'
                                                : 'text-blue-600 hover:bg-blue-50'
                                            }`}
                                        aria-label={`Page ${pageNum}`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-md ${currentPage === totalPages
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-blue-600 hover:bg-blue-50'
                                    }`}
                                aria-label="Next page"
                            >
                                <FaAngleRight className="text-sm sm:text-base" />
                            </button>

                            <button
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-md ${currentPage === totalPages
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-blue-600 hover:bg-blue-50'
                                    }`}
                                aria-label="Last page"
                            >
                                <FaAngleDoubleRight className="text-sm sm:text-base" />
                            </button>
                        </div>
                    </div>
                )}

                {filteredCompetencies.length === 0 && (
                    <div className="text-center py-8 bg-white">
                        <div className="text-gray-500 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-700">No competencies found</h3>
                        <p className="text-gray-500 mt-1">
                            {searchTerm ? "Try adjusting your search" : "Create your first competency by clicking 'Add Competency'"}
                        </p>
                    </div>
                )}
            </div>

            {/* Admin Management Modal */}
            {adminModal.isOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-labelledby="admin-modal-title" aria-modal="true">
                    <div
                        className="fixed inset-0 bg-opacity-30 backdrop-blur-sm transition-opacity"
                        onClick={() => setAdminModal({ isOpen: false, competencyId: null, competencyName: "" })}
                    ></div>

                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-purple-600 px-4 py-3 sm:px-6 sm:flex sm:items-center sm:justify-between">
                                <h3 className="text-lg leading-6 font-bold text-white" id="admin-modal-title">
                                    <FaUserFriends className="inline mr-2" />
                                    Manage Admins - {adminModal.competencyName}
                                </h3>
                                <button
                                    type="button"
                                    className="text-white hover:text-purple-200 focus:outline-none"
                                    onClick={() => setAdminModal({ isOpen: false, competencyId: null, competencyName: "" })}
                                >
                                    <FaTimes className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="mb-6">
                                    <h4 className="text-md font-semibold text-gray-800 mb-3">
                                        Current Admins ({competencyAdmins.length})
                                    </h4>

                                    {roleLoading ? (
                                        <div className="text-center py-4">
                                            <YRMSLoader message="Loading admins..." />
                                        </div>
                                    ) : competencyAdmins.length > 0 ? (
                                        <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
                                            {competencyAdmins.map((admin) => (
                                                <li key={admin.publicId} className="py-3 flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <FaUserCircle className="text-purple-500 text-xl mr-3" />
                                                        <span className="text-gray-700">{admin.name} ({admin.email})</span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveAdmin(admin)}
                                                        className="flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                                        title="Remove Admin"
                                                    >
                                                        <FaUserMinus size={14} />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="text-center py-4 bg-gray-50 rounded-lg">
                                            <p className="text-gray-500">No admins assigned yet</p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h4 className="text-md font-semibold text-gray-800 mb-3">Add New Admin</h4>
                                    <div className="flex items-center gap-2">
                                        <Select
                                            options={adminOptions}
                                            onChange={setSelectedAdminToAdd}
                                            value={selectedAdminToAdd}
                                            className="flex-1"
                                            placeholder="Search admins to add..."
                                            classNamePrefix="select"
                                            styles={{
                                                control: (provided) => ({
                                                    ...provided,
                                                    minHeight: '42px',
                                                    borderColor: '#E5E7EB',
                                                    boxShadow: 'none',
                                                    '&:hover': {
                                                        borderColor: '#A78BFA',
                                                    },
                                                }),
                                                menu: (provided) => ({
                                                    ...provided,
                                                    zIndex: 60,
                                                    marginTop: 4,
                                                    borderRadius: '0.5rem',
                                                }),
                                                menuPortal: (provided) => ({
                                                    ...provided,
                                                    zIndex: 60,
                                                }),
                                            }}
                                            menuPortalTarget={document.body}
                                            menuPosition="fixed"
                                        />
                                        <button
                                            onClick={handleAddAdmin}
                                            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={!selectedAdminToAdd}
                                        >
                                            <FaUserPlus className="mr-1" />
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => setAdminModal({ isOpen: false, competencyId: null, competencyName: "" })}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, competencyId: null, competencyName: "" })}
                onConfirm={handleDeleteConfirm}
                resourceName={deleteModal.competencyName}
                resourceType="competency"
            />

            <ConfirmRoleChangeModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, user: null, competencyId: null, actionType: null })}
                onConfirm={handleConfirmAction}
                userName={confirmModal.user?.label || ""}
                competencyName={adminModal.competencyName}
                actionType={confirmModal.actionType}
            />

            {toastState && (
                <>
                    {toastState.type === "loading" && (
                        <YRMSLoader message={toastState.message} />
                    )}
                    {toastState.type === "success" && (
                        <SuccessToast
                            message={toastState.message}
                            onClose={() => setToastState(null)}
                        />
                    )}
                    {toastState.type === "error" && (
                        <ErrorToast
                            message={toastState.message}
                            onClose={() => setToastState(null)}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default ListCompetency;