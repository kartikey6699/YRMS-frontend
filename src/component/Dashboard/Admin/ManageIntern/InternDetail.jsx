import React, { useEffect, useState, useRef } from 'react';
import { FaTimes, FaEdit, FaSave, FaCode, FaBriefcase } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { SuccessToast, ErrorToast } from '../../../helper/ResourceToast';
import { fetchInternDetails } from '../../../../features/intern/internAction';
import { fetchCompetencies } from '../../../../features/resource/resourceAction';
import { resetInternDetails } from '../../../../features/intern/internSlice';

const InternDetail = ({ publicId, onClose }) => {
    const dispatch = useDispatch();
    const { interns, internDetails, loading, error } = useSelector((state) => state.intern);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(null);
    const [toast, setToast] = useState(null);
    const initialLoadDone = useRef(false);
    const locationConst = ['Indore', 'Pune'];
    console.log("internDetails: ", internDetails)
    console.log("publicId: ", publicId)
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    useEffect(() => {
        if (!initialLoadDone.current && (!internDetails || internDetails.publicId !== publicId?.publicId)) {
            initialLoadDone.current = true;
            dispatch(fetchInternDetails(publicId?.publicId));
            dispatch(fetchCompetencies()); // Fetch competencies when component mounts
        }
    }, [publicId, internDetails, dispatch]);


    //for temporary case user object picked from list later on actual api data will be updated
    useEffect(() => {
        if (publicId === publicId) {
            setFormData({
                employeeName: publicId.name || 'N/A',
                endDate: publicId.endDate || 'N/A',
                startDate: publicId.startDate || 'N/A',
                email: publicId.email || 'N/A',
                mentor: publicId.mentor || 'N/A',
                location: publicId.location || 'N/A',
                status: publicId.status || 'N/A',
                ratting: publicId.ratting || 'N/A',
                feedback: publicId.feedback || 'N/A',
                remark: publicId.remark || 'N/A',
                competency: publicId.competency || 'N/A'
            });
        }
    }, [internDetails, publicId]);

    useEffect(() => {
        return () => {
            initialLoadDone.current = false;
            if (!publicId) {
                dispatch(resetInternDetails());
            }
        };
    }, [dispatch, publicId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // const handleSubmit = async () => {
    //     try {
    //         const updatedData = {
    //             employeeName: formData.employeeName,
    //             employeeId: formData.employeeId,
    //             email: formData.email,
    //             location: formData.location,
    //             startDate: formData.startDate,
    //             endDate: formData.endDate,
    //             status: formData.status
    //         };
    //         await dispatch(updateIntern({ publicId, internData: updatedData })).unwrap();
    //         setToast({ type: 'success', message: 'Intern details updated successfully!' });
    //         setIsEditing(false);
    //     } catch (error) {
    //         setToast({ type: 'error', message: error || 'Failed to update intern details' });
    //     }
    // };

    if (!formData) {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20 p-4">
                <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl">
                    Loading employee details...
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="fixed top-4 right-4 z-60">
                {toast?.type === 'success' && (
                    <SuccessToast message={toast.message} onClose={() => setToast(null)} />
                )}
                {toast?.type === 'error' && (
                    <ErrorToast message={toast.message} onClose={() => setToast(null)} />
                )}
            </div>
            <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20 p-4">
                <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl border border-gray-200">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            {isEditing ? (
                                <input
                                    name="employeeName"
                                    value={formData.employeeName}
                                    onChange={handleInputChange}
                                    className="text-xl font-semibold text-gray-800 border rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-300"
                                    disabled={loading}
                                />
                            ) : (
                                <h3 className="ml-6 text-md font-semibold text-gray-800">
                                    {formData.employeeName.charAt(0).toUpperCase() + formData.employeeName.slice(1)}
                                </h3>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-sm"
                                disabled={loading}
                            >
                                {isEditing ? (
                                    <>
                                        <FaTimes className="mr-1" /> Cancel
                                    </>
                                ) : (
                                    <>
                                        <FaEdit className="mr-1" /> Edit
                                    </>
                                )}
                            </button>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
                                disabled={loading}
                            >
                                <FaTimes size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 p-2 md:grid-cols-3">
                        <div className={`bg-gray-50 rounded-lg p-4 col-span-4 ${isEditing ? 'ring-1 ring-blue-200' : ''}`}>
                            <h4 className="flex justify-left items-center text-md text-base font-medium text-gray-800 mb-3">
                                <FaBriefcase className="text-blue-500 mr-2 text-sm" />
                                Employment Details
                            </h4>
                            <div className="space-y-3">
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-md text-gray-500 mb-1">Employee Name</label>
                                        {isEditing ? (
                                            <input
                                                name="employeeName"
                                                value={formData.employeeName}
                                                onChange={handleInputChange}
                                                className="w-full border rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-300"
                                                disabled={loading}
                                            />
                                        ) : (
                                            <p className="text-md font-medium text-gray-800">{formData.employeeName || 'N/A'}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-md text-gray-500 mb-1">Email</label>
                                        {isEditing ? (
                                            <input
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full border rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-300"
                                                disabled={loading}
                                            />
                                        ) : (
                                            <p className="text-md font-medium text-gray-800">{formData.email || 'N/A'}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-md text-gray-500 mb-1">Start Date</label>
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                name="startDate"
                                                value={formData.startDate}
                                                onChange={handleInputChange}
                                                className="w-full border rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-300"
                                                disabled={loading}
                                            />
                                        ) : (
                                            <p className="text-md font-medium text-gray-800">{formData.startDate ? new Date(formData.startDate).toLocaleDateString() : 'N/A'}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-md text-gray-500 mb-1">End Date</label>
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                name="endDate"
                                                value={formData.endDate}
                                                onChange={handleInputChange}
                                                className="w-full border rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-300"
                                                disabled={loading}
                                            />
                                        ) : (
                                            <p className="text-md font-medium text-gray-800">{formData.endDate ? new Date(formData.endDate).toLocaleDateString() : 'N/A'}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-md text-gray-500 mb-1">Mentor</label>
                                        {isEditing ? (
                                            <input
                                                name="mentor"
                                                value={formData.mentor}
                                                onChange={handleInputChange}
                                                className="w-full border rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-300"
                                                disabled={loading}
                                            />
                                        ) : (
                                            <p className="text-md font-medium text-gray-800">{formData.mentor || 'N/A'}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-md text-gray-500 mb-1">Location</label>
                                        {isEditing ? (
                                            <input
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                className="w-full border rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-300"
                                                disabled={loading}
                                            />
                                        ) : (
                                            <p className="text-md font-medium text-gray-800">{formData.location || 'N/A'}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-md text-gray-500 mb-1">Rating</label>
                                        {isEditing ? (
                                            <input
                                                name="rating"
                                                value={formData.rating}
                                                onChange={handleInputChange}
                                                className="w-full border rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-300"
                                                disabled={loading}
                                            />
                                        ) : (
                                            <p className="text-md font-medium text-gray-800">{formData.rating || 'N/A'}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-md text-gray-500 mb-1">Feedback</label>
                                        {isEditing ? (
                                            <textarea
                                                name="feedback"
                                                value={formData.feedback}
                                                onChange={handleInputChange}
                                                className="w-full border rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-300"
                                                disabled={loading}
                                            />
                                        ) : (
                                            <p className="text-md font-medium text-gray-800">{formData.feedback || 'N/A'}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-md text-gray-500 mb-1">Remark</label>
                                        {isEditing ? (
                                            <textarea
                                                name="remark"
                                                value={formData.remark}
                                                onChange={handleInputChange}
                                                className="w-full border rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-300"
                                                disabled={loading}
                                            />
                                        ) : (
                                            <p className="text-md font-medium text-gray-800">{formData.remark || 'N/A'}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-md text-gray-500 mb-1">Competency</label>
                                        {isEditing ? (
                                            <input
                                                name="competency"
                                                value={formData.competency}
                                                onChange={handleInputChange}
                                                className="w-full border rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-300"
                                                disabled={loading}
                                            />
                                        ) : (
                                            <p className="text-md font-medium text-gray-800">{formData.competency || 'N/A'}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>




                    {/* <div className="mt-4 flex justify-between items-center">
                        <div className="flex gap-2">
                            <label className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 text-sm cursor-pointer">
                                <FaUpload className="mr-1 text-xs" />
                                Upload Resume
                                <input
                                    type="file"
                                    onChange={handleResumeUpload}
                                    className="hidden"
                                    accept=".pdf,.doc,.docx"
                                    disabled={loading}
                                />
                            </label>
                            <button
                                onClick={handleResumeDownload}
                                className="flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-md hover:bg-green-100 text-sm"
                                disabled={loading}
                            >
                                <FaDownload className="mr-1 text-xs" />
                                Download Resume
                            </button>
                        </div>

                        <button
                            className="flex items-center px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium disabled:bg-blue-400"
                            onClick={isEditing ? handleSubmit : onClose}
                            disabled={loading}
                        >
                            {isEditing ? (
                                <>
                                    <FaSave className="mr-1" /> {loading ? 'Saving...' : 'Save'}
                                </>
                            ) : (
                                'Close'
                            )}
                        </button>
                    </div> */}
                </div>
            </div>
        </>
    );
};

export default InternDetail;