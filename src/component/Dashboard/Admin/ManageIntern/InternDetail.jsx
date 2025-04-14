import React, { useEffect, useState, useRef } from 'react';
import { FaUser, FaBriefcase, FaChartLine, FaComment, FaTimes, FaEdit, FaSave, FaPlus, FaStar } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from "../../../helper/Dropdown";
import AddOptionModal from "../../../helper/OptionalModal";
import { SuccessToast, ErrorToast } from '../../../helper/ResourceToast';
import { fetchInternDetails } from '../../../../features/intern/internAction';
import { fetchCompetencies } from '../../../../features/resource/resourceAction';
import { resetInternDetails } from '../../../../features/intern/internSlice';

const InternDetail = ({ publicId, onClose }) => {
  const dispatch = useDispatch();
  const { interns, internDetails, loading, error } = useSelector((state) => state.intern);
  const { resources, competencies } = useSelector(
    (state) => state.resource
  );
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState(null);
  const initialLoadDone = useRef(false);
  const locationConst = ['Indore', 'Pune'];
  const [modalField, setModalField] = useState(null);
  const [formData, setFormData] = useState(null);

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
        profileImage: null,
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
        hired: false,
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

  // Helper function to parse date strings (handles both Date objects and strings)
  const parseDate = (date) => {
    if (!date) return null;
    if (date instanceof Date) return date;
    return new Date(date);
  };

  // Calculate duration between two dates in "X months Y days" format
  const calculateDuration = (startDate, endDate) => {
    const start = parseDate(startDate);
    const end = parseDate(endDate || new Date()); // Use current date if endDate not provided

    if (!start || !end) return 'N/A';
    if (start > end) return 'Invalid date range';

    let months = (end.getFullYear() - start.getFullYear()) * 12;
    months -= start.getMonth();
    months += end.getMonth();

    const days = end.getDate() - start.getDate();

    // Adjust for negative days
    if (days < 0) {
      months -= 1;
      // Get last day of previous month
      const tempDate = new Date(end);
      tempDate.setMonth(end.getMonth() - 1);
      tempDate.setDate(0);
      const daysInLastMonth = tempDate.getDate();
      return `${months} months`;
    }

    return `${months} months`;
  };

  // Calculate working days (Monday to Friday) between two dates
  const calculateWorkingDays = (startDate, endDate) => {
    const start = parseDate(startDate);
    const end = parseDate(endDate || new Date()); // Use current date if endDate not provided

    if (!start || !end) return 'N/A';
    if (start > end) return 'Invalid date range';

    // Clone dates to avoid modifying originals
    let current = new Date(start);
    current.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    let workingDays = 0;

    while (current <= end) {
      const day = current.getDay();
      // Sunday = 0, Saturday = 6
      if (day !== 0 && day !== 6) {
        workingDays++;
      }
      current.setDate(current.getDate() + 1);
    }

    return `${workingDays} days`;
  };


  const handleSubmit = async () => {
    console.log(formData)
  }
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
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl border border-gray-200">
          {/* Header Section with Creative Colors */}
          <div className="flex justify-between items-center mb-6 gap-4 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100">
            <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
              {/* Profile Image */}
              <div className="relative flex-shrink-0">
                {formData.profileImage ? (
                  <img
                    src={`data:image/png;base64,${formData.profileImage}`}
                    alt="Profile"
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center border-2 border-white shadow-lg">
                    <FaUser className="text-indigo-500 text-2xl" />
                  </div>
                )}
              </div>

              {/* Employee Details */}
              <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                {/* Name */}
                <div className="bg-gradient-to-r from-white to-indigo-50 px-4 py-2 rounded-lg shadow-xs min-w-0 max-w-35 overflow-hidden border border-indigo-100">
                  {isEditing ? (
                    <input
                      name="employeeName"
                      value={formData.employeeName}
                      onChange={handleInputChange}
                      className="text-xl font-semibold text-indigo-800 bg-transparent w-full min-w-0 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      disabled={loading}
                    />
                  ) : (
                    <h3 className="text-xl font-semibold text-indigo-800 truncate">
                      {formData.employeeName}
                    </h3>
                  )}
                </div>

                {/* Date Info */}
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-2 py-2 rounded-lg shadow-xs flex items-center gap-2 border border-indigo-100">
                    <span className="text-sm text-indigo-600 font-medium">Start:</span>
                    {isEditing ? (
                      <input
                        type="date"
                        name="lastWorkingDay"
                        value={formData.lastWorkingDay}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-blue-200 rounded-md px-1 py-1 text-sm focus:ring-1 focus:ring-blue-300"
                        disabled={loading}
                      />
                    ) : (
                    <span className="text-base text-indigo-800 font-medium">
                      {formData.startDate ? new Date(formData.startDate).toLocaleDateString() : 'N/A'}
                    </span>
                    )}
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-2 py-2 rounded-lg shadow-xs flex items-center gap-2 border border-purple-100">
                    <span className="text-sm text-purple-600 font-medium">End:</span>
                    {isEditing ? (
                      <input
                        type="date"
                        name="lastWorkingDay"
                        value={formData.lastWorkingDay}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-blue-200 rounded-md px-1 py-1 text-sm focus:ring-1 focus:ring-blue-300"
                        disabled={loading}
                      />
                    ) : (
                    <span className="text-base text-purple-800 font-medium">
                      {formData.endDate ? new Date(formData.endDate).toLocaleDateString() : 'N/A'}
                    </span>
                    )}
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-3 py-2 rounded-lg shadow-xs flex items-center gap-2 border border-blue-100">
                    <span className="text-sm text-blue-600 font-medium">Duration:</span>
                    <span className="text-base text-blue-800 font-medium">
                      {calculateDuration(formData.startDate, formData.endDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Block - Actions (Only show close button when not editing) */}
            {!isEditing && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 rounded-lg hover:from-indigo-200 hover:to-blue-200 text-base font-medium transition-colors duration-200 shadow-xs border border-indigo-200"
                >
                  <FaEdit className="mr-2" /> Edit
                </button>
                <button
                  onClick={onClose}
                  className="p-2.5 rounded-lg bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 text-gray-600 flex-shrink-0 transition-colors duration-200 shadow-xs border border-gray-200"
                >
                  <FaTimes size={18} />
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">

            <div className={`bg-gradient-to-b from-gray-50 to-white rounded-lg p-4 md:col-span-2 ${isEditing ? 'ring-2 ring-indigo-200' : ''}`}>
              <h4 className="flex items-center text-base font-medium text-indigo-700 mb-3 border-b border-indigo-100 pb-2">
                <FaUser className="text-indigo-500 mr-2 text-sm" />
                Basic Information
              </h4>
              <div className="space-y-4"> {/* Increased spacing */}
                <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                  <label className="block text-xs text-indigo-600 mb-1 font-semibold">Mentor</label>
                  {isEditing ? (
                    <input
                      name="mentor"
                      value={formData.mentor}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-indigo-200 rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-indigo-300"
                      disabled={loading}
                    />
                  ) : (
                    <p className="text-sm font-medium text-indigo-800 truncate">
                      {formData.mentor || 'Not specified'}
                    </p>
                  )}
                </div>

                <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                  <label className="block text-xs text-indigo-600 mb-1 font-semibold">Location</label>
                  {isEditing ? (
                    <input
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-indigo-200 rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-indigo-300"
                      disabled={loading}
                    />
                  ) : (
                    <p className="text-sm font-medium text-indigo-800 truncate">
                      {formData.location || 'Not specified'}
                    </p>
                  )}
                </div>

                <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                  <label className="block text-xs text-indigo-600 mb-1 font-semibold">Competency</label>
                  {isEditing ? (
                    <Dropdown
                      name="competency"
                      value={formData.competency}
                      options={competencies}
                      onChange={handleInputChange}
                      setModalField={setModalField}
                    />
                  ) : (
                    <p className="text-sm font-medium text-indigo-800 truncate">
                      {formData.competency || 'Not specified'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Second Column - Performance & Feedback (now wider) */}
            <div className={`bg-gradient-to-b from-gray-50 to-white rounded-lg p-4 md:col-span-5 ${isEditing ? 'ring-2 ring-indigo-200' : ''}`}>
              <h4 className="flex items-center text-base font-medium text-indigo-700 mb-3 border-b border-indigo-100 pb-2">
                <FaChartLine className="text-indigo-500 mr-2 text-sm" />
                Performance & Feedback
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {/* Editable Rating */}
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-3 rounded-lg border border-amber-100">
                    <label className="block text-xs text-amber-600 mb-1 font-semibold">Rating</label>
                    {isEditing ? (
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleInputChange({ target: { name: 'rating', value: star } })}
                            className="focus:outline-none"
                          >
                            <FaStar
                              className={`${star <= formData.rating ? 'text-amber-400' : 'text-amber-200'} w-5 h-5 mr-1 transition-colors`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-base font-medium text-amber-800">
                          ({formData.rating || '0'}/5)
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={`${star <= formData.rating ? 'text-amber-400' : 'text-amber-200'} w-5 h-5 mr-1`}
                          />
                        ))}
                        <span className="ml-2 text-base font-medium text-amber-800">
                          ({formData.rating || '0'}/5)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* LWD Field */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-100">
                    <label className="block text-xs text-blue-600 mb-1 font-semibold">LWD</label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="lastWorkingDay"
                        value={formData.lastWorkingDay}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-blue-200 rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-blue-300"
                        disabled={loading}
                      />
                    ) : (
                      <p className="text-sm font-medium text-blue-800">
                        {formData.lastWorkingDay ? new Date(formData.lastWorkingDay).toLocaleDateString() : 'Not specified'}
                      </p>
                    )}
                  </div>

                  {/* Hired Status */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-100">
                    <label className="block text-xs text-green-600 mb-1 font-semibold">Hired</label>
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="hired"
                            checked={formData.hired === true}
                            onChange={() => handleInputChange({ target: { name: 'hired', value: true } })}
                            className="text-green-500 focus:ring-green-500"
                          />
                          <span className="ml-2 text-sm text-green-700">Yes</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="hired"
                            checked={formData.hired === false}
                            onChange={() => handleInputChange({ target: { name: 'hired', value: false } })}
                            className="text-red-500 focus:ring-red-500"
                          />
                          <span className="ml-2 text-sm text-red-700">No</span>
                        </label>
                      </div>
                    ) : (
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${formData.hired
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {formData.hired ? 'Hired' : 'Not Hired'}
                      </div>
                    )}
                  </div>
                </div>

                {formData.hired && (<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-100">
                  <label className="block text-xs text-purple-600 mb-1">Hired With Competency</label>
                  {isEditing ? (
                    <Dropdown
                      name="hiredCompetency"
                      value={formData.competency}
                      options={competencies}
                      onChange={handleInputChange}
                      setModalField={setModalField}
                    />
                  ) : (
                    <p className="text-sm font-medium text-purple-800">
                      {formData.hiredWithCompetency || 'N/A'}
                    </p>
                  )}
                </div>
                )}
                {/* ... (rest of the performance & feedback content remains the same) ... */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-3 rounded-lg border border-indigo-100">
                    <label className="block text-xs text-indigo-600 mb-1">Feedback</label>
                    {isEditing ? (
                      <textarea
                        name="feedback"
                        value={formData.feedback}
                        onChange={handleInputChange}
                        className="w-full border border-indigo-200 rounded-md px-2 py-1.5 text-sm h-20 focus:ring-1 focus:ring-indigo-300 bg-white"
                        placeholder="Enter feedback..."
                        disabled={loading}
                      />
                    ) : (
                      <p className="text-sm text-indigo-800 whitespace-pre-wrap">
                        {formData.feedback || 'No feedback available'}
                      </p>
                    )}
                  </div>
                  <div className="bg-gradient-to-r from-cyan-50 to-teal-50 p-3 rounded-lg border border-cyan-100">
                    <label className="block text-xs text-cyan-600 mb-1">Remarks</label>
                    {isEditing ? (
                      <textarea
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleInputChange}
                        className="w-full border border-cyan-200 rounded-md px-2 py-1.5 text-sm h-20 focus:ring-1 focus:ring-cyan-300 bg-white"
                        placeholder="Enter remarks..."
                        disabled={loading}
                      />
                    ) : (
                      <p className="text-sm text-cyan-800 whitespace-pre-wrap">
                        {formData.remarks || 'No remarks available'}
                      </p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Footer Actions - Save/Cancel when editing */}
          {isEditing && (
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-gray-100 to-red-50 text-gray-700 rounded-lg hover:from-red-500 hover:to-red-500 hover:text-gray-100 text-base font-medium transition-colors duration-200 shadow-xs border border-gray-200"
              >
                <FaTimes className="mr-2" /> Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 text-base font-medium transition-colors duration-200 shadow-xs border border-indigo-700"
                disabled={loading}
              >
                <FaSave className="mr-2" /> {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
          {modalField && (
            <AddOptionModal
              field={modalField}
              options={competencies}
              onClose={() => setModalField(null)}
              setToast={setToast}
            />
          )}

        </div>
      </div>
    </>
  );
};

export default InternDetail;