import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaInfoCircle, FaStar, FaTimes, FaChartLine, FaUser, FaEdit, FaSave, FaPlus } from "react-icons/fa";
import { updateBaseline, fetchBaselineHistories } from "../../../features/baseline/baselineAction";
import { SuccessToast, ErrorToast } from '../../helper/ResourceToast';

export const BaselineHistories = ({ histories, employeeName, competency, gender, userId }) => {
    const dispatch = useDispatch();
    const { resourceDetails } = useSelector((state) => state.resource);
    const { technologyCategoriesWithTech } = useSelector((state) => state.baseline);
    const profileImage = resourceDetails?.profileImage;

    const [selectedBaseline, setSelectedBaseline] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    useEffect(() => {
        if (selectedBaseline) {
            setFormData({
                ...selectedBaseline,
                techSkills: convertToTechSkillsFormat(selectedBaseline.technicalSkills),
                communication: selectedBaseline.communication === 'Average' ? 1 : 
                               selectedBaseline.communication === 'Medium' ? 2 : 
                               selectedBaseline.communication === 'Fluent' ? 3 : ''
            });
        }
    }, [selectedBaseline]);

    const convertToTechSkillsFormat = (technicalSkills) => {
        if (!technicalSkills) return [{ category: "", technologies: [] }];
        
        const uniqueSkills = {};
        technicalSkills.forEach(skill => {
            if (!uniqueSkills[skill.technology]) {
                uniqueSkills[skill.technology] = {
                    category: technologyCategoriesWithTech.find(cat => cat.name === skill.category)?.publicId || "",
                    name: skill.technology,
                    rating: skill.rating.toString()
                };
            }
        });

        return Object.values(uniqueSkills).map(skill => ({
            category: skill.category,
            technologies: [{
                technology: skill.category,
                name: skill.name,
                rating: skill.rating
            }]
        }));
    };

    const convertToTechnicalSkills = (techSkills) => {
        return techSkills.flatMap(skill => 
            skill.technologies.map(tech => ({
                category: technologyCategoriesWithTech.find(cat => cat.publicId === skill.category)?.name || skill.category,
                technology: tech.name,
                rating: parseInt(tech.rating) || 0
            }))
        );
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return "N/A";
        const date = new Date(timestamp);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getStatusStyles = (rating) => {
        switch (rating) {
            case 0:
            case 1:
                return { 
                    bg: "bg-red-300", 
                    text: "text-red-900", 
                    border: "border-red-800",
                    star: "text-red-600",
                    gradient: "bg-gradient-to-r from-red-200 to-pink-200",
                    borderLight: "border-red-400"
                };
            case 2:
                return { 
                    bg: "bg-orange-300", 
                    text: "text-orange-900", 
                    border: "border-orange-800",
                    star: "text-orange-600",
                    gradient: "bg-gradient-to-r from-amber-200 to-orange-200",
                    borderLight: "border-orange-400"
                };
            case 3:
                return { 
                    bg: "bg-yellow-300", 
                    text: "text-yellow-900", 
                    border: "border-yellow-800",
                    star: "text-yellow-600",
                    gradient: "bg-gradient-to-r from-yellow-200 to-amber-200",
                    borderLight: "border-yellow-400"
                };
            case 4:
                return { 
                    bg: "bg-lime-300", 
                    text: "text-lime-900", 
                    border: "border-lime-800",
                    star: "text-lime-600",
                    gradient: "bg-gradient-to-r from-lime-200 to-green-200",
                    borderLight: "border-lime-400"
                };
            case 5:
                return { 
                    bg: "bg-green-300", 
                    text: "text-green-900", 
                    border: "border-green-800",
                    star: "text-green-600",
                    gradient: "bg-gradient-to-r from-green-200 to-emerald-200",
                    borderLight: "border-green-400"
                };
            default:
                return { 
                    bg: "bg-gray-300", 
                    text: "text-gray-900", 
                    border: "border-gray-800",
                    star: "text-gray-600",
                    gradient: "bg-gradient-to-r from-gray-200 to-slate-200",
                    borderLight: "border-gray-400"
                };
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedValue = name === 'communication' ? parseInt(value) : value;
        setFormData(prev => ({ ...prev, [name]: updatedValue }));
    };

    const handleExpChange = (index, field, value) => {
        const updatedExp = [...formData.technologyExperience];
        updatedExp[index] = { ...updatedExp[index], [field]: value };
        setFormData(prev => ({ ...prev, technologyExperience: updatedExp }));
    };

    const addExperience = () => {
        setFormData(prev => ({
            ...prev,
            technologyExperience: [...(prev.technologyExperience || []), { technology: "", years: 0 }]
        }));
    };

    const removeExperience = (index) => {
        setFormData(prev => ({
            ...prev,
            technologyExperience: prev.technologyExperience.filter((_, i) => i !== index)
        }));
    };

    const handleCertChange = (index, field, value) => {
        const updatedCert = [...formData.certification];
        updatedCert[index] = { ...updatedCert[index], [field]: value };
        setFormData(prev => ({ ...prev, certification: updatedCert }));
    };

    const addCertification = () => {
        setFormData(prev => ({
            ...prev,
            certification: [...(prev.certification || []), { title: "", technology: "" }]
        }));
    };

    const removeCertification = (index) => {
        setFormData(prev => ({
            ...prev,
            certification: prev.certification.filter((_, i) => i !== index)
        }));
    };

    const handleSkillRatingChange = (techId, newRating, cardIndex) => {
        const updatedTechSkills = [...formData.techSkills];
        const tech = updatedTechSkills[cardIndex].technologies.find(t => t.technology === techId);
        if (tech) {
            tech.rating = newRating.toString();
        }
        
        setFormData(prev => ({
            ...prev,
            techSkills: updatedTechSkills
        }));
    };

    const openBaselineDetails = (baseline) => {
        setSelectedBaseline(baseline);
        setIsPopupOpen(true);
        setIsEditing(false);
    };

    const closeBaselineDetails = () => {
        setIsPopupOpen(false);
        setIsEditing(false);
        setTimeout(() => setSelectedBaseline(null), 300);
    };

    const handleSubmit = async () => {
        try {
            const baselineData = {
                userId: userId,
                technologyExperience: formData.technologyExperience
                    ?.filter(exp => exp.technology && exp.years)
                    .map(exp => ({
                        technology: exp.technology,
                        years: parseInt(exp.years) || 0
                    })) || [],
                certification: formData.certification
                    ?.filter(cert => cert.title && cert.technology)
                    .map(cert => ({
                        title: cert.title,
                        technology: cert.technology
                    })) || [],
                totalExperience: parseInt(formData.totalExperience) || 0,
                communication: formData.communication,
                technicalSkills: convertToTechnicalSkills(formData.techSkills),
                rating: parseInt(formData.rating) || 0,
                feedback: formData.feedback,
                upskillSuggestion: formData.upskillSuggestion
            };

            const result = await dispatch(updateBaseline({
                baselineId: formData.publicId,
                baselineData
            })).unwrap();
            
            if (result) {
                // Create the updated baseline object with all required fields
                const updatedBaseline = {
                    ...result,
                    // Ensure all arrays exist and are properly formatted
                    technologyExperience: result.technologyExperience || [],
                    certification: result.certification || [],
                    technicalSkills: result.technicalSkills || [],
                    // Maintain the timestamp if not returned by API
                    timestamp: result.timestamp || formData.timestamp
                };

                // Update both states with the new data
                setSelectedBaseline(updatedBaseline);
                setFormData({
                    ...updatedBaseline,
                    techSkills: convertToTechSkillsFormat(updatedBaseline.technicalSkills),
                    communication: updatedBaseline.communication === 'Average' ? 1 : 
                                   updatedBaseline.communication === 'Medium' ? 2 : 
                                   updatedBaseline.communication === 'Fluent' ? 3 : ''
                });

                // Show success message and exit edit mode
                setToast({ type: 'success', message: 'Baseline updated successfully!' });
                setIsEditing(false);
                
                // Reload the page after successful update
                window.location.reload();
                
            } else {
                throw new Error("Failed to update baseline");
            }
        } catch (err) {
            setToast({ 
                type: 'error', 
                message: err.message || "Failed to update baseline" 
            });
        }
    };

    const handleCancel = () => {
        setFormData({
            ...selectedBaseline,
            techSkills: convertToTechSkillsFormat(selectedBaseline.technicalSkills)
        });
        setIsEditing(false);
    };

    const sortedHistories = [...histories].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

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

            {sortedHistories.map((history, index) => {
                const overallRating = Math.round(history.rating);
                const statusStyles = getStatusStyles(overallRating);

                return (
                    <div key={`${history.publicId}-${index}`} className="col-span-1">
                        <div
                            onClick={() => openBaselineDetails(history)}
                            className={`relative rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 h-48 flex flex-col ${statusStyles.gradient} border-l-4 ${statusStyles.border} hover:shadow-xl hover:translate-y-[-4px]`}
                        >
                            <div className="p-4 flex-1 flex flex-col">
                                <div className="mb-2 flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-800 break-words">
                                        Baseline-{sortedHistories.length - index}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {formatDate(history.timestamp)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        <strong>Communication:</strong> {history.communication}
                                    </p>
                                </div>
                                <div className="mt-auto flex justify-between items-center">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FaInfoCircle className="mr-1" />
                                        <span>Skills: {history.technicalSkills?.length || 0}</span>
                                    </div>
                                    <div
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusStyles.bg} border ${statusStyles.border}`}
                                    >
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar
                                                    key={i}
                                                    className={`${i < overallRating ? statusStyles.star : "text-gray-300"} w-3 h-3 mr-0.5`}
                                                />
                                            ))}
                                        </div>
                                        <span className="ml-1">{overallRating}/5</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {sortedHistories.length === 0 && (
                <div className="col-span-full text-center py-10">
                    <p className="text-gray-500 text-lg">No baseline histories available yet.</p>
                </div>
            )}

            {formData && isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl border border-gray-200 flex flex-col" 
                        style={{ maxHeight: '90vh', margin: '20px' }}>
                        
                        {/* Fixed Header Section */}
                        <div className={`sticky top-0 z-10 p-4 rounded-t-xl ${getStatusStyles(Math.round(formData.rating)).gradient}`}>
                            <div className="flex justify-between items-center gap-4">
                                <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
                                    {/* Profile Image */}
                                    <div className="relative flex-shrink-0">
                                        {profileImage ? (
                                            <img
                                                src={`data:image/png;base64,${profileImage}`}
                                                alt="Profile"
                                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center border-2 border-white shadow-lg">
                                                <FaUser className="text-indigo-500 text-xl" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Employee Details */}
                                    <div className="flex items-center gap-3 min-w-0 overflow-hidden flex-wrap">
                                        {/* Name (not editable) */}
                                        <div className="bg-white/80 px-3 py-1 rounded-lg shadow-xs min-w-0 max-w-[200px] overflow-hidden border border-indigo-100">
                                            <h3 className="text-lg font-semibold text-indigo-800 truncate">
                                                {employeeName || "Unknown Employee"}
                                            </h3>
                                        </div>

                                        {/* Competency (not editable) */}
                                        <div className="bg-white/80 px-3 py-1 rounded-lg shadow-xs flex items-center gap-2 border border-purple-100">
                                            <span className="text-xs text-purple-600 font-medium">Competency:</span>
                                            <span className="text-sm text-purple-800 font-medium truncate max-w-[120px]">
                                                {competency || 'N/A'}
                                            </span>
                                        </div>

                                        {/* Rating */}
                                        <div className={`px-3 py-1 rounded-lg shadow-xs flex items-center gap-2 border ${getStatusStyles(Math.round(formData.rating)).borderLight} bg-white/80`}>
                                            <span className="text-xs font-medium">Rating:</span>
                                            {isEditing ? (
                                                <div className="flex items-center gap-1">
                                                    <input
                                                        type="number"
                                                        name="rating"
                                                        value={formData.rating}
                                                        onChange={handleInputChange}
                                                        min="0"
                                                        max="5"
                                                        step="0.1"
                                                        className="w-12 bg-white border border-gray-200 rounded px-1 py-0.5 text-sm"
                                                    />
                                                    <span className="text-sm font-medium">/5</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaStar
                                                            key={i}
                                                            className={`${i < Math.floor(formData.rating) ? getStatusStyles(Math.round(formData.rating)).star : 'text-gray-300'} w-3.5 h-3.5`}
                                                        />
                                                    ))}
                                                    <span className="ml-1 text-sm font-medium">
                                                        ({formData.rating}/5)
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                    {!isEditing ? (
                                        <>
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="flex items-center px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 rounded-lg hover:from-indigo-200 hover:to-blue-200 text-sm font-medium transition-colors duration-200 shadow-xs border border-indigo-200"
                                            >
                                                <FaEdit className="mr-1" /> Edit
                                            </button>
                                            <button
                                                onClick={closeBaselineDetails}
                                                className="p-2 rounded-lg bg-white/80 hover:bg-white text-gray-600 flex-shrink-0 transition-colors duration-200 shadow-xs border border-gray-200"
                                            >
                                                <FaTimes size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={handleCancel}
                                                className="flex items-center px-3 py-1.5 bg-gradient-to-r from-gray-100 to-red-50 text-gray-700 rounded-lg hover:from-red-500 hover:to-red-500 hover:text-gray-100 text-sm font-medium transition-colors duration-200 shadow-xs border border-gray-200"
                                            >
                                                <FaTimes className="mr-1" /> Cancel
                                            </button>
                                            <button
                                                onClick={handleSubmit}
                                                className="flex items-center px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 text-sm font-medium transition-colors duration-200 shadow-xs border border-indigo-700"
                                            >
                                                <FaSave className="mr-1" /> Save
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="overflow-y-auto flex-1 p-4">
                            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                                {/* Left Column - Basic Info */}
                                <div className={`bg-gradient-to-b from-gray-50 to-white rounded-lg p-4 md:col-span-2 ${isEditing ? 'ring-2 ring-indigo-200' : 'ring-1 ring-indigo-200'}`}>
                                    <h4 className="flex items-center text-sm font-medium text-indigo-700 mb-3 border-b border-indigo-100 pb-2">
                                        <FaInfoCircle className="text-indigo-500 mr-2 text-xs" />
                                        Basic Information
                                    </h4>
                                    
                                    <div className="space-y-3">
                                        {/* Total Experience */}
                                        <div className="bg-indigo-50/50 p-2 rounded-lg border border-indigo-100">
                                            <label className="block text-xs text-indigo-600 mb-1 font-semibold">Total Experience</label>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    name="totalExperience"
                                                    value={formData.totalExperience || 0}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white border border-indigo-200 rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-indigo-300"
                                                    min="0"
                                                    step="0.5"
                                                />
                                            ) : (
                                                <p className="text-sm font-medium text-indigo-800">
                                                    {formData.totalExperience || 0} years
                                                </p>
                                            )}
                                        </div>

                                        {/* Communication */}
                                        <div className="bg-indigo-50/50 p-2 rounded-lg border border-indigo-100">
                                            <label className="block text-xs text-indigo-600 mb-1 font-semibold">Communication</label>
                                            {isEditing ? (
                                                <select
                                                    name="communication"
                                                    value={formData.communication || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white border border-indigo-200 rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-indigo-300"
                                                >
                                                    <option value="">Select Communication Level</option>
                                                    <option value="1">Average</option>
                                                    <option value="2">Medium</option>
                                                    <option value="3">Fluent</option>
                                                </select>
                                            ) : (
                                                <p className="text-sm font-medium text-indigo-800">
                                                    {formData.communication === 1 ? 'Average' : formData.communication === 2 ? 'Medium' : formData.communication === 3 ? 'Fluent' : 'N/A'}
                                                </p>
                                            )}
                                        </div>

                                        {/* Baseline Date */}
                                        <div className="bg-indigo-50/50 p-2 rounded-lg border border-indigo-100">
                                            <label className="block text-xs text-indigo-600 mb-1 font-semibold">Baseline Date</label>
                                            <p className="text-sm font-medium text-indigo-800">
                                                {formatDate(formData.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Detailed Info */}
                                <div className={`bg-gradient-to-b from-gray-50 to-white rounded-lg p-4 md:col-span-5 ${isEditing ? 'ring-2 ring-indigo-200' : 'ring-1 ring-indigo-200'}`}>
                                    <h4 className="flex items-center text-sm font-medium text-indigo-700 mb-3 border-b border-indigo-100 pb-2">
                                        <FaChartLine className="text-indigo-500 mr-2 text-xs" />
                                        Detailed Assessment
                                    </h4>

                                    <div className="space-y-3">
                                        {/* Technology Experience */}
                                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-100">
                                            <h4 className="text-xs font-medium text-blue-700 mb-2">Technology Experience</h4>
                                            {isEditing ? (
                                                <div className="space-y-2">
                                                    {formData.technologyExperience?.map((exp, i) => (
                                                        <div key={i} className="flex items-center gap-2">
                                                            <input
                                                                type="text"
                                                                value={exp.technology}
                                                                onChange={(e) => handleExpChange(i, 'technology', e.target.value)}
                                                                className="flex-1 bg-white border border-blue-200 rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-blue-300"
                                                                placeholder="Technology"
                                                            />
                                                            <input
                                                                type="number"
                                                                value={exp.years}
                                                                onChange={(e) => handleExpChange(i, 'years', e.target.value)}
                                                                className="w-20 bg-white border border-blue-200 rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-blue-300"
                                                                placeholder="Years"
                                                                min="0"
                                                                step="0.5"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeExperience(i)}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                <FaTimes size={12} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={addExperience}
                                                        className="flex items-center text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded"
                                                    >
                                                        <FaPlus className="mr-1" /> Add Experience
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    {formData.technologyExperience?.map((exp, i) => (
                                                        <div key={i} className="bg-white p-2 rounded-md border border-blue-200 shadow-xs">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-xs font-medium text-blue-800 truncate">{exp.technology}</span>
                                                                <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
                                                                    {exp.years} yrs
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {(!formData.technologyExperience || formData.technologyExperience.length === 0) && (
                                                        <p className="text-blue-500 italic text-xs">No experience recorded</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Certifications */}
                                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-100">
                                            <h4 className="text-xs font-medium text-purple-700 mb-2">Certifications</h4>
                                            {isEditing ? (
                                                <div className="space-y-2">
                                                    {formData.certification?.map((cert, i) => (
                                                        <div key={i} className="flex items-center gap-2">
                                                            <input
                                                                type="text"
                                                                value={cert.title}
                                                                onChange={(e) => handleCertChange(i, 'title', e.target.value)}
                                                                className="flex-1 bg-white border border-purple-200 rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-purple-300"
                                                                placeholder="Certification"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={cert.technology}
                                                                onChange={(e) => handleCertChange(i, 'technology', e.target.value)}
                                                                className="flex-1 bg-white border border-purple-200 rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-purple-300"
                                                                placeholder="Technology"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeCertification(i)}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                <FaTimes size={12} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={addCertification}
                                                        className="flex items-center text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 px-2 py-1 rounded"
                                                    >
                                                        <FaPlus className="mr-1" /> Add Certification
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    {formData.certification?.map((cert, i) => (
                                                        <div key={i} className="bg-white p-2 rounded-md border border-purple-200 shadow-xs">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-xs font-medium text-purple-800 truncate">{cert.title}</span>
                                                                <span className="text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-full truncate max-w-[80px]">
                                                                    {cert.technology}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {(!formData.certification || formData.certification.length === 0) && (
                                                        <p className="text-purple-500 italic text-xs">No certifications recorded</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Technical Skills */}
                                        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-3 rounded-lg border border-amber-100">
                                            <h4 className="text-xs font-medium text-amber-700 mb-2">Technical Skills</h4>
                                            <div className="space-y-2">
                                                {formData.techSkills?.map((skill, i) => (
                                                    <div key={i} className="bg-white p-2 rounded-md border border-amber-200 shadow-xs">
                                                        {isEditing ? (
                                                            <div className="space-y-2">
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-xs font-medium text-amber-800">
                                                                        {technologyCategoriesWithTech.find(cat => cat.publicId === skill.category)?.name || 'Uncategorized'}
                                                                    </span>
                                                                </div>
                                                                {skill.technologies.map((tech) => (
                                                                    <div key={tech.technology} className="flex justify-between items-center">
                                                                        <span className="text-xs text-amber-700">{tech.name}</span>
                                                                        <div className="flex items-center gap-1">
                                                                            <input
                                                                                type="number"
                                                                                value={tech.rating}
                                                                                onChange={(e) => handleSkillRatingChange(tech.technology, e.target.value, i)}
                                                                                min="0"
                                                                                max="5"
                                                                                step="0.1"
                                                                                className="w-12 bg-white border border-amber-200 rounded px-1 py-0.5 text-xs"
                                                                            />
                                                                            <span className="text-xs text-amber-700">/5</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="flex justify-between items-center mb-1">
                                                                    <span className="text-xs font-medium text-amber-800 truncate">
                                                                        {technologyCategoriesWithTech.find(cat => cat.publicId === skill.category)?.name || 'Uncategorized'}
                                                                    </span>
                                                                    <span className="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
                                                                        {skill.technologies.length} skills
                                                                    </span>
                                                                </div>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {skill.technologies.map((tech) => (
                                                                        <div key={tech.technology} className="flex items-center">
                                                                            <span className="text-xs text-amber-700 mr-1">{tech.name}</span>
                                                                            <div className="flex items-center">
                                                                                {[...Array(5)].map((_, i) => (
                                                                                    <FaStar
                                                                                        key={i}
                                                                                        className={`${i < (parseInt(tech.rating) || 0) ? "text-amber-400" : "text-amber-200"} w-2.5 h-2.5`}
                                                                                    />
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                ))}
                                                {(!formData.techSkills || formData.techSkills.length === 0) && (
                                                    <p className="text-amber-500 italic text-xs">No technical skills recorded</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Feedback & Upskill */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-100">
                                                <h4 className="text-xs font-medium text-green-700 mb-2">Feedback</h4>
                                                {isEditing ? (
                                                    <textarea
                                                        name="feedback"
                                                        value={formData.feedback || ''}
                                                        onChange={handleInputChange}
                                                        className="w-full bg-white border border-green-200 rounded-md px-2 py-1 text-sm h-20 focus:ring-1 focus:ring-green-300"
                                                        placeholder="Enter feedback..."
                                                    />
                                                ) : (
                                                    <div className="bg-white p-2 rounded-md border border-green-200 max-h-[100px] overflow-y-auto">
                                                        <p className="text-xs text-green-800 italic">
                                                            {formData.feedback || "No feedback provided"}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-3 rounded-lg border border-teal-100">
                                                <h4 className="text-xs font-medium text-teal-700 mb-2">Upskill Suggestion</h4>
                                                {isEditing ? (
                                                    <textarea
                                                        name="upskillSuggestion"
                                                        value={formData.upskillSuggestion || ''}
                                                        onChange={handleInputChange}
                                                        className="w-full bg-white border border-teal-200 rounded-md px-2 py-1 text-sm h-20 focus:ring-1 focus:ring-teal-300"
                                                        placeholder="Enter upskill suggestions..."
                                                    />
                                                ) : (
                                                    <div className="bg-white p-2 rounded-md border border-teal-200 max-h-[100px] overflow-y-auto">
                                                        <p className="text-xs text-teal-800">
                                                            {formData.upskillSuggestion || "No suggestions provided"}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
