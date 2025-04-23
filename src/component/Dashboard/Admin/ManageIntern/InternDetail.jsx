import React, { useEffect, useState, useRef } from 'react';
import { FaUser, FaBriefcase, FaChartLine, FaComment, FaTimes, FaEdit, FaSave, FaPlus, FaStar } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import AddOptionModal from "../../../helper/OptionalModal";
import { SuccessToast, ErrorToast } from '../../../helper/ResourceToast';
import { fetchInternDetails } from '../../../../features/intern/internAction';
import { fetchCompetencies, fetchResources } from '../../../../features/resource/resourceAction';
import { resetInternDetails } from '../../../../features/intern/internSlice';
import { updateIntern } from '../../../../features/intern/internAction';
import { useNavigate } from 'react-router-dom';

const InternDetail = ({ publicId, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { internDetails, loading } = useSelector((state) => state.intern);
  const { resources, competencies } = useSelector(
    (state) => state.resource
  );
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState(null);
  const initialLoadDone = useRef(false);
  const [modalField, setModalField] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      dispatch(fetchCompetencies());
      dispatch(fetchResources());
    }
  }, [publicId, internDetails, dispatch]);

  useEffect(() => {
    if (publicId?.publicId === internDetails?.publicId) {
      setFormData({
        profileImage: null,
        employeeName: internDetails.name || null,
        endDate: internDetails.endDate || null,
        startDate: internDetails.startDate || null,
        lastWorkingDay: internDetails.lastWorkingDay || null,
        mentor: internDetails.mentor || null,
        mentorId: internDetails.mentorId || null,
        location: internDetails.location || null,
        status: internDetails.status || null,
        rating: internDetails.rating || '0',
        feedback: internDetails.feedback || null,
        remark: internDetails.remark || null,
        hired: internDetails.isOffered || false,
        competency: internDetails.competency || null,
        hiredCompetency: internDetails.hiredCompetency || null,
        competencyId: internDetails.competencyId || null
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

  const parseDate = (date) => {
    if (!date) return null;
    if (date instanceof Date) return date;
    return new Date(date);
  };

  const calculateDuration = (startDate, endDate) => {
    const start = parseDate(startDate);
    const end = parseDate(endDate || new Date());

    if (!start || !end) return null;
    if (start > end) return 'Invalid date range';

    let months = (end.getFullYear() - start.getFullYear()) * 12;
    months += end.getMonth() - start.getMonth();

    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months -= 1;
      const tempDate = new Date(end);
      tempDate.setMonth(end.getMonth() - 1);
      tempDate.setDate(0);
      days += tempDate.getDate();
    }

    if (months === 0) {
      return `${days} day${days !== 1 ? 's' : ''}`;
    } else if (days === 0) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else {
      return `${months} month${months !== 1 ? 's' : ''} ${days} day${days !== 1 ? 's' : ''}`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const internData = {
        name: formData.employeeName,
        startDate: formData.startDate,
        endDate: formData.endDate,
        lastWorkingDay: formData.lastWorkingDay,
        location: formData.location,
        rating: formData.rating,
        hiredCompetency: formData.hiredCompetency,
        isOffered: formData.hired,
        feedback: formData.feedback,
        remark: formData.remark,
        mentorId: formData.mentorId,
        competencyId: formData.competencyId
      };

      const updateResult = await dispatch(updateIntern({
        publicId: internDetails?.publicId,
        internData
      }));

      if (updateResult.payload?.publicId) {
        setToast({ type: 'success', message: 'Intern updated successfully!' });
        setIsEditing(false);
        dispatch(fetchInternDetails(updateResult.payload?.publicId))
        navigate('/interns');
      } else {
        throw new Error("Failed to update intern");
      }
    } catch (err) {
      setToast({
        type: 'error',
        message: err.message || "Failed to update intern"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      profileImage: null,
      employeeName: internDetails.name || null,
      endDate: internDetails.endDate || null,
      startDate: internDetails.startDate || null,
      lastWorkingDay: internDetails.lastWorkingDay || null,
      mentor: internDetails.mentor || null,
      mentorId: internDetails.mentorId || null,
      location: internDetails.location || null,
      status: internDetails.status || null,
      rating: internDetails.rating || '0',
      feedback: internDetails.feedback || null,
      remark: internDetails.remark || null,
      hired: internDetails.isOffered || false,
      competency: internDetails.competency || null,
      hiredCompetency: internDetails.hiredCompetency || null,
      competencyId: internDetails.competencyId || null
    });
    setModalField(null)
    setIsEditing(false);
  };

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

      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20 p-4 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl border border-gray-200 max-h-[90vh] overflow-y-auto">
          {/* Redesigned Header Section */}
          <div className="flex flex-col gap-4 mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100">
            <div className="flex justify-between items-start w-full">
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

              {/* Name and Duration */}
              <div className="flex-1 min-w-0 px-4">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 w-full">
                  {/* Name */}
                  <div className="min-w-0 max-w-[70%]">
                    {isEditing ? (
                      <input
                        name="employeeName"
                        value={formData.employeeName}
                        onChange={handleInputChange}
                        className="text-2xl font-bold text-indigo-900 bg-transparent w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded px-2 py-1"
                        disabled={loading}
                      />
                    ) : (
                      <h3 className="text-2xl font-bold text-indigo-900 truncate">
                        {formData.employeeName}
                      </h3>
                    )}
                  </div>

                  {/* Duration */}
                  <div className="bg-gradient-to-r from-blue-100 to-cyan-100 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-blue-200 min-w-fit">
                    <span className="text-sm text-blue-700 font-medium">Duration:</span>
                    <span className="text-base font-semibold text-blue-900 whitespace-nowrap">
                      {calculateDuration(formData.startDate, formData.endDate) || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Dates - New Compact Layout */}
                <div className="flex flex-wrap gap-3 items-center mt-3 pl-0">
                  {/* Start and End Dates grouped together */}
                  <div className="flex flex-wrap gap-3 items-center">
                    {/* Start Date */}
                    <div className="bg-gradient-to-r from-indigo-100 to-blue-100 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-indigo-200">
                      <span className="text-sm text-indigo-700 font-medium">Start:</span>
                      {isEditing ? (
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          className="bg-white border border-blue-200 rounded-md px-1 py-1 text-sm focus:ring-1 focus:ring-blue-300"
                          disabled={loading}
                        />
                      ) : (
                        <span className="text-base font-medium text-indigo-900">
                          {formData.startDate ? new Date(formData.startDate).toLocaleDateString() : 'Not set'}
                        </span>
                      )}
                    </div>

                    {/* End Date */}
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-purple-200">
                      <span className="text-sm text-purple-700 font-medium">End:</span>
                      {isEditing ? (
                        <input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          className="bg-white border border-purple-200 rounded-md px-1 py-1 text-sm focus:ring-1 focus:ring-purple-300"
                          disabled={loading}
                        />
                      ) : (
                        <span className="text-base font-medium text-purple-900">
                          {formData.endDate ? new Date(formData.endDate).toLocaleDateString() : 'Not set'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Last Working Day (conditionally shown) */}
                  {formData.lastWorkingDay && (
                    <div className="bg-gradient-to-r from-amber-100 to-orange-100 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-amber-200">
                      <span className="text-sm text-amber-700 font-medium">LWD:</span>
                      <span className="text-base font-medium text-amber-900">
                        {new Date(formData.lastWorkingDay).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Edit/Close Buttons */}
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            <div className={`bg-gradient-to-b from-gray-50 to-white rounded-lg p-4 md:col-span-2 ${isEditing ? 'ring-2 ring-indigo-200' : ''}`}>
              <h4 className="flex items-center text-base font-medium text-indigo-700 mb-3 border-b border-indigo-100 pb-2">
                <FaUser className="text-indigo-500 mr-2 text-sm" />
                Basic Information
              </h4>
              <div className="space-y-4">
                {/* Mentor Field */}
                <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                  <label className="block text-xs text-indigo-600 mb-1 font-semibold">Mentor</label>
                  {isEditing ? (
                    <select
                      name='mentorId'
                      value={formData.mentorId || ''}
                      onChange={(e) => {
                        const selectedMentor = resources.find(m => m.publicId === e.target.value);
                        setFormData(prev => ({
                          ...prev,
                          mentorId: e.target.value,
                          mentor: selectedMentor?.employeeName || ''
                        }));
                      }}
                      className="w-full h-12 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    >
                      <option value="" disabled>Select Mentor</option>
                      {resources.map((mentor) => (
                        <option value={mentor.publicId} key={mentor.publicId}>
                          {mentor.employeeName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm font-medium text-indigo-800 truncate">
                      {formData.mentor || 'Not specified'}
                    </p>
                  )}
                </div>

                {/* Location Field - Updated with dropdown */}
                <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                  <label className="block text-xs text-indigo-600 mb-1 font-semibold">Location</label>
                  {isEditing ? (
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full h-12 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    >
                      <option value="Indore_Yash_IT_Park_SC_DC">Indore-YASH IT Park-SC-DC</option>
                      <option value="Pune_Magarpatta_DC_II">Pune-Magarpatta-DC-II</option>
                      <option value="Hyderabad_Mindspace_I_DC">Hyderabad-Mindspace I-DC</option>
                      <option value="Bangalore_Whitefield_DC">Bangalore-Whitefield-DC</option>
                      <option value="Indore_Crystal_IT_Park_DC_II">Indore-Crystal IT Park-DC-II</option>
                      <option value="Indore_BTC_CO">Indore-BTC-CO</option>
                      <option value="Pune_Hinjewadi_III_DC">Pune-Hinjewadi III-DC</option>
                    </select>
                  ) : (
                    <p className="text-sm font-medium text-indigo-800 truncate">
                      {formData.location || 'Not specified'}
                    </p>
                  )}
                </div>

                {/* Competency Field */}
                <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                  <label className="block text-xs text-indigo-600 mb-1 font-semibold">Competency</label>
                  {isEditing ? (
                    <select
                      name='competencyId'
                      value={formData.competencyId || ''}
                      onChange={(e) => {
                        const selectedCompetency = competencies.find(c => c.publicId === e.target.value);
                        setFormData(prev => ({
                          ...prev,
                          competencyId: e.target.value,
                          competency: selectedCompetency?.name || ''
                        }));
                      }}
                      className="w-full h-12 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    >
                      <option value="" disabled>Select Competency</option>
                      {competencies.map((competency) => (
                        <option value={competency.publicId} key={competency.publicId}>
                          {competency.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm font-medium text-indigo-800 truncate">
                      {formData.competency || 'Not specified'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Second Column - Performance & Feedback */}
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
                        <div className="flex mr-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleInputChange({
                                target: {
                                  name: 'rating',
                                  value: formData.rating === star ? 0 : star
                                }
                              })}
                              className="focus:outline-none relative"
                            >
                              <FaStar
                                className={`${star <= Math.floor(formData.rating) ? 'text-amber-400' : 'text-amber-200'} w-5 h-5 transition-colors`}
                              />
                              {formData.rating > star - 1 && formData.rating < star && (
                                <div
                                  className="absolute top-0 left-0 overflow-hidden"
                                  style={{ width: `${(formData.rating - (star - 1)) * 100}%` }}
                                >
                                  <FaStar className="text-amber-400 w-5 h-5" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                        <span className="ml-2 text-base font-medium text-amber-800">
                          ({formData.rating || '0'}/5)
                        </span>
                      </div>)}
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

                {formData.hired && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-100">
                    <label className="block text-xs text-purple-600 mb-1">Hired With Competency</label>
                    {isEditing ? (
                      <select
                        name="hiredCompetency"
                        value={formData.hiredCompetency || ''}
                        onChange={handleInputChange}
                        className="w-full border border-purple-200 rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-purple-300 bg-white"
                      >
                        <option value="">Select Competency</option>
                        {competencies.map((comp) => (
                          <option value={comp.name} key={comp.publicId}>
                            {comp.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-sm font-medium text-purple-800">
                        {formData.hiredCompetency || null}
                      </p>
                    )}
                  </div>
                )}

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
                        name="remark"
                        value={formData.remark}
                        onChange={handleInputChange}
                        className="w-full border border-cyan-200 rounded-md px-2 py-1.5 text-sm h-20 focus:ring-1 focus:ring-cyan-300 bg-white"
                        placeholder="Enter remarks..."
                        disabled={loading}
                      />
                    ) : (
                      <p className="text-sm text-cyan-800 whitespace-pre-wrap">
                        {formData.remark || 'No remarks available'}
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
                onClick={handleCancel}
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