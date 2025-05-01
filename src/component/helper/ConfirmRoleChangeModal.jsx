import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const ConfirmRoleChangeModal = ({ isOpen, onClose, onConfirm, userName, competencyName, actionType, roleName }) => {
    if (!isOpen) return null;

    const isAddAction = actionType === 1;
    const title = isAddAction ? `Confirm ${roleName} Assignment` : `Confirm ${roleName} Removal`;
    const message = isAddAction
        ? `Are you sure you want to assign the ${roleName} role to ${userName}?`
        : `Are you sure you want to remove ${userName} as a ${roleName} from ${competencyName}?`;
    const confirmButtonText = isAddAction ? `Yes, Assign ${roleName}` : `Yes, Remove ${roleName}`;
    const confirmButtonColor = isAddAction ? 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500' : 'bg-red-600 hover:bg-red-700 focus:ring-red-500';

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-labelledby="confirm-modal-title" aria-modal="true">
            <div
                className="fixed inset-0 bg-opacity-30 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                                <FaExclamationTriangle className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="confirm-modal-title">
                                    {title}
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        {message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${confirmButtonColor} text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer`}
                            onClick={onConfirm}
                        >
                            {confirmButtonText}
                        </button>
                        <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:w-auto sm:text-sm cursor-pointer"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmRoleChangeModal;