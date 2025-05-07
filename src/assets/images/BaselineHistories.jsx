import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaInfoCircle, FaStar, FaTimes, FaChartLine, FaUser, FaEdit, FaSave, FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { updateBaseline, fetchBaselineHistories } from "../../../features/baseline/baselineAction";
import { SuccessToast, ErrorToast } from '../../helper/ResourceToast';

const groupSkillsByCategory = (technicalSkills) => {
    if (!technicalSkills || technicalSkills.length === 0) return {};

    return technicalSkills.reduce((acc, skill) => {
        if (!acc[skill.category]) {
            acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
    }, {});
};

export const BaselineHistories = ({ histories, employeeName, competency, gender, userId }) => {
    const dispatch = useDispatch();
    const { resourceDetails } = useSelector((state) => state.resource);
    const { technologyCategoriesWithTech } = useSelector((state) => state.baseline);
    const profileImage = resourceDetails?.profileImage;

    const [editingBaselineId, setEditingBaselineId] = useState(null);
    const [selectedBaseline, setSelectedBaseline] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(null);
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState(null);
    const [expandedAccordion, setExpandedAccordion] = useState(null);

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
            setErrors({}); // Reset errors when selecting a new baseline
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

    const validateField = (name, value, index = null, field = null) => {
        let error = '';
        if (name === 'communication') {
            if (!value || ![1, 2, 3].includes(parseInt(value))) {
                error = 'Please select a valid communication level';
            }
        } else if (name === 'totalExperience') {
            if (!value || parseInt(value) <= 0) {
                error = 'Total experience must be a positive number';
            }
        } else if (name === 'rating') {
            if (!value || parseInt(value) < 0 || parseInt(value) > 5) {
                error = 'Rating must be between 0 and 5';
            }
        } else if (name === 'feedback' && value && value.trim() === '') {
            error = 'Feedback cannot be empty if provided';
        } else if (name === 'upskillSuggestion' && value && value.trim() === '') {
            error = 'Upskill suggestion cannot be empty if provided';
        } else if (name === 'technologyExperience') {
            if (field === 'technology' && (!value || value.trim() === '')) {
                error = 'Technology name is required';
            } else if (field === 'years' && (!value || parseInt(value) <= 0)) {
                error = 'Years must be a positive number';
            }
        } else if (name === 'certification') {
            if (field === 'title' && (!value || value.trim() === '')) {
                error = 'Certification title is required';
            } else if (field === 'technology' && (!value || value.trim() === '')) {
                error = 'Technology name is required';
            }
        } else if (name === 'techSkills') {
            if (field === 'category' && (!value || value.trim() === '')) {
                error = 'Category is required';
            } else if (field === 'rating' && (value < 0 || value > 5)) {
                error = 'Rating must be between 0 and 5';
            }
        }
        return error;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedValue = name === 'communication' ? parseInt(value) : value;
        setFormData(prev => ({ ...prev, [name]: updatedValue }));

        // Validate on key press
        const error = validateField(name, updatedValue);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleExpChange = (index, field, value) => {
        const updatedExp = [...formData.technologyExperience];
        updatedExp[index] = { ...updatedExp[index], [field]: value };
        setFormData(prev => ({ ...prev, technologyExperience: updatedExp }));

        // Validate on key press
        const error = validateField('technologyExperience', value, index, field);
        setErrors(prev => ({
            ...prev,
            technologyExperience: {
                ...prev.technologyExperience,
                [index]: {
                    ...prev.technologyExperience?.[index],
                    [field]: error
                }
            }
        }));
    };

    const addExperience = () => {
        setFormData(prev => ({
            ...prev,
            technologyExperience: [...(prev.technologyExperience || []), { technology: "", years: 0 }]
        }));
        setErrors(prev => ({
            ...prev,
            technologyExperience: {
                ...prev.technologyExperience,
                [(prev.technologyExperience?.length || 0)]: {}
            }
        }));
    };

    const removeExperience = (index) => {
        setFormData(prev => ({
            ...prev,
            technologyExperience: prev.technologyExperience.filter((_, i) => i !== index)
        }));
        setErrors(prev => {
            const updated = { ...prev.technologyExperience };
            delete updated[index];
            return { ...prev, technologyExperience: updated };
        });
    };

    const handleCertChange = (index, field, value) => {
        const updatedCert = [...formData.certification];
        updatedCert[index] = { ...updatedCert[index], [field]: value };
        setFormData(prev => ({ ...prev, certification: updatedCert }));

        // Validate on key press
        const error = validateField('certification', value, index, field);
        setErrors(prev => ({
            ...prev,
            certification: {
                ...prev.certification,
                [index]: {
                    ...prev.certification?.[index],
                    [field]: error
                }
            }
        }));
    };

    const addCertification = () => {
        setFormData(prev => ({
            ...prev,
            certification: [...(prev.certification || []), { title: "", technology: "" }]
        }));
        setErrors(prev => ({
            ...prev,
            certification: {
                ...prev.certification,
                [(prev.certification?.length || 0)]: {}
            }
        }));
    };

    const removeCertification = (index) => {
        setFormData(prev => ({
            ...prev,
            certification: prev.certification.filter((_, i) => i !== index)
        }));
        setErrors(prev => {
            const updated = { ...prev.certification };
            delete updated[index];
            return { ...prev, certification: updated };
        });
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

        // Validate on key press
        const error = validateField('techSkills', newRating, cardIndex, 'rating');
        setErrors(prev => ({
            ...prev,
            techSkills: {
                ...prev.techSkills,
                [cardIndex]: {
                    ...prev.techSkills?.[cardIndex],
                    rating: error
                }
            }
        }));
    };

    const handleSkillCategoryChange = (index, value) => {
        const updatedTechSkills = [...formData.techSkills];
        updatedTechSkills[index].category = value;
        setFormData(prev => ({ ...prev, techSkills: updatedTechSkills }));

        // Validate on key press
        const error = validateField('techSkills', value, index, 'category');
        setErrors(prev => ({
            ...prev,
            techSkills: {
                ...prev.techSkills,
                [index]: {
                    ...prev.techSkills?.[index],
                    category: error
                }
            }
        }));
    };

    const toggleAccordion = (index) => {
        setExpandedAccordion(expandedAccordion === index ? null : index);
    };

    const startEditing = (baseline) => {
        setEditingBaselineId(baseline.publicId);
        setSelectedBaseline(baseline);
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setEditingBaselineId(null);
        setSelectedBaseline(null);
        setIsEditing(false);
        setFormData(null);
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate communication
        newErrors.communication = validateField('communication', formData.communication);

        // Validate totalExperience
        newErrors.totalExperience = validateField('totalExperience', formData.totalExperience);

        // Validate rating
        newErrors.rating = validateField('rating', formData.rating);

        // Validate feedback
        newErrors.feedback = validateField('feedback', formData.feedback);

        // Validate upskillSuggestion
        newErrors.upskillSuggestion = validateField('upskillSuggestion', formData.upskillSuggestion);

        // Validate technologyExperience
        newErrors.technologyExperience = {};
        formData.technologyExperience?.forEach((exp, index) => {
            newErrors.technologyExperience[index] = {
                technology: validateField('technologyExperience', exp.technology, index, 'technology'),
                years: validateField('technologyExperience', exp.years, index, 'years')
            };
        });

        // Validate certification
        newErrors.certification = {};
        formData.certification?.forEach((cert, index) => {
            newErrors.certification[index] = {
                title: validateField('certification', cert.title, index, 'title'),
                technology: validateField('certification', cert.technology, index, 'technology')
            };
        });

        // Validate techSkills
        newErrors.techSkills = {};
        formData.techSkills?.forEach((skill, index) => {
            newErrors.techSkills[index] = {
                category: validateField('techSkills', skill.category, index, 'category'),
                rating: skill.technologies.some(tech => validateField('techSkills', tech.rating, index, 'rating'))
                    ? 'Invalid rating in technologies'
                    : ''
            };
        });

        setErrors(newErrors);

        // Check if there are any errors
        return !Object.values(newErrors).some(error => 
            typeof error === 'string' ? error : 
            Object.values(error).some(e => 
                typeof e === 'string' ? e : 
                Object.values(e).some(ee => ee)
            )
        );
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            setToast(<ErrorToast message="Please fix all validation errors before saving" onClose={() => setToast(null)} />);
            return;
        }

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

            await dispatch(updateBaseline({
                baselineId: formData.publicId,
                baselineData
            })).unwrap();

            setToast(<SuccessToast message="Baseline updated successfully!" onClose={() => setToast(null)} />);
            setEditingBaselineId(null);
            setSelectedBaseline(null);
            setIsEditing(false);
            setFormData(null);
            setErrors({});
            dispatch(fetchBaselineHistories(userId));
        } catch (error) {
            setToast(<ErrorToast message={error.message || "Failed to update baseline"} onClose={() => setToast(null)} />);
        }
    };

    // Check if Save button should be disabled
    const isSaveDisabled = Object.values(errors).some(error => 
        typeof error === 'string' ? error : 
        Object.values(error).some(e => 
            typeof e === 'string' ? e : 
            Object.values(e).some(ee => ee)
        )
    );

    // Sort from oldest to newest
    const sortedHistories = [...histories].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    // More compact section colors
    const sectionColors = {
        experience: "border-l-4 border-blue-300 bg-blue-50/50",
        certification: "border-l-4 border-purple-300 bg-purple-50/50",
        skills: "border-l-4 border-emerald-300 bg-emerald-50/50",
        communication: "border-l-4 border-amber-300 bg-amber-50/50",
        feedback: "border-l-4 border-indigo-300 bg-indigo-50/50",
        suggestion: "border-l-4 border-teal-300 bg-teal-50/50"
    };

    return (
        <>
            <div className="fixed top-4 right-4 z-60">
                {toast}
            </div>

            <div className="space-y-3">
                {sortedHistories.map((history, index) => {
                    const overallRating = Math.round(history.rating);
                    const statusStyles = getStatusStyles(overallRating);
                    const isExpanded = expandedAccordion === index;
                    const isEditing = editingBaselineId === history.publicId;

                    return (
                        <div key={`${history.publicId}-${index}`}
                            className={`rounded-lg overflow-hidden transition-all duration-300 ${statusStyles.gradient} border-l-4 ${statusStyles.border}`}>

                            {/* Compact Accordion Header */}
                            <div
                                onClick={() => !isEditing && toggleAccordion(index)}
                                className="p-3 flex justify-between items-center cursor-pointer hover:bg-opacity-90 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-800">
                                            Baseline {index + 1} - <span className="text-gray-600">{formatDate(history.timestamp)}</span>
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex items-center gap-1 bg-gradient-to-r from-blue-100 to-indigo-100 px-2 py-1 rounded-full">
                                                <span className="text-xs font-semibold text-blue-800">Overall:</span>
                                                <span className="text-xs font-bold text-blue-600">{overallRating}/5</span>
                                            </div>
                                            <span className="text-2xs text-gray-500">
                                                {history.technicalSkills?.length || 0} skills • {history.communication} • {history.totalExperience} yrs
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                    {!isEditing && isExpanded ? (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                startEditing(history);
                                            }}
                                            className="p-2 rounded-full bg-white/80 hover:bg-white text-indigo-600 transition-colors"
                                            title="Edit"
                                        >
                                            <FaEdit className="w-3 h-3" />
                                        </button>
                                    ) : (
                                        <>
                                            {isEditing && (
                                                <>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            cancelEditing();
                                                        }}
                                                        className="p-2 rounded-full bg-white/80 hover:bg-white text-red-600 transition-colors"
                                                        title="Cancel"
                                                    >
                                                        <FaTimes className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleSubmit();
                                                        }}
                                                        className={`p-2 rounded-full bg-white/80 hover:bg-white transition-colors ${isSaveDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-green-600'}`}
                                                        title="Save"
                                                        disabled={isSaveDisabled}
                                                    >
                                                        <FaSave className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </>
                                    )}
                                    {!isEditing && (
                                        isExpanded ? (
                                            <FaChevronUp className="text-gray-600 w-4 h-4" />
                                        ) : (
                                            <FaChevronDown className="text-gray-600 w-4 h-4" />
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Compact Accordion Content */}
                            <div className={`p-3 bg-white/90 border-t border-gray-200 transition-all duration-300 ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-2 custom-scrollbar">

                                    {/* Left Column - Experience & Certifications */}
                                    <div className="space-y-3">
                                        {/* Experience Section */}
                                        <div className={`p-2 rounded ${sectionColors.experience}`}>
                                            <h4 className="text-2xs font-semibold text-blue-600 mb-1 flex items-center">
                                                <FaChartLine className="mr-1 text-xs" /> EXPERIENCE
                                            </h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                {isEditing ? (
                                                    <div className="space-y-2">
                                                        {formData.technologyExperience?.map((exp, i) => (
                                                            <div key={i} className="space-y-1">
                                                                <div className="flex items-center gap-2">
                                                                    <input
                                                                        type="text"
                                                                        value={exp.technology}
                                                                        onChange={(e) => handleExpChange(i, 'technology', e.target.value)}
                                                                        className={`flex-1 p-2 border rounded text-sm ${errors.technologyExperience?.[i]?.technology ? 'border-red-500' : ''}`}
                                                                        placeholder="Technology"
                                                                    />
                                                                    <input
                                                                        type="number"
                                                                        value={exp.years}
                                                                        onChange={(e) => handleExpChange(i, 'years', parseInt(e.target.value) || 0)}
                                                                        className={`w-20 p-2 border rounded text-sm ${errors.technologyExperience?.[i]?.years ? 'border-red-500' : ''}`}
                                                                        placeholder="Years"
                                                                    />
                                                                    <button
                                                                        onClick={() => removeExperience(i)}
                                                                        className="text-red-500 hover:text-red-700"
                                                                        title="Remove"
                                                                    >
                                                                        <FaTimes className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                                {errors.technologyExperience?.[i]?.technology && (
                                                                    <p className="text-xs text-red-500">{errors.technologyExperience[i].technology}</p>
                                                                )}
                                                                {errors.technologyExperience?.[i]?.years && (
                                                                    <p className="text-xs text-red-500">{errors.technologyExperience[i].years}</p>
                                                                )}
                                                            </div>
                                                        ))}
                                                        <button
                                                            onClick={addExperience}
                                                            className="text-blue-600 text-xs flex items-center hover:text-blue-800 mt-2"
                                                        >
                                                            <FaPlus className="mr-1" /> Add Experience
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {history.technologyExperience?.map((exp, i) => (
                                                            <div key={i} className="flex justify-between items-center bg-white p-2 rounded border border-blue-100">
                                                                <span className="text-sm text-gray-700">{exp.technology}</span>
                                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                                                    {exp.years} yrs
                                                                </span>
                                                            </div>
                                                        ))}
                                                        {(!history.technologyExperience || history.technologyExperience.length === 0) && (
                                                            <p className="text-xs text-gray-400 italic">No experience recorded</p>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Certification Section */}
                                        <div className={`p-2 rounded ${sectionColors.certification}`}>
                                            <h4 className="text-2xs font-semibold text-purple-600 mb-1 flex items-center">
                                                <FaInfoCircle className="mr-1 text-xs" /> CERTIFICATIONS
                                            </h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                {isEditing ? (
                                                    <div className="space-y-2">
                                                        {formData.certification?.map((cert, i) => (
                                                            <div key={i} className="space-y-1">
                                                                <div className="flex items-center gap-2">
                                                                    <input
                                                                        type="text"
                                                                        value={cert.title}
                                                                        onChange={(e) => handleCertChange(i, 'title', e.target.value)}
                                                                        className={`flex-1 p-2 border rounded text-sm ${errors.certification?.[i]?.title ? 'border-red-500' : ''}`}
                                                                        placeholder="Title"
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        value={cert.technology}
                                                                        onChange={(e) => handleCertChange(i, 'technology', e.target.value)}
                                                                        className={`flex-1 p-2 border rounded text-sm ${errors.certification?.[i]?.technology ? 'border-red-500' : ''}`}
                                                                        placeholder="Technology"
                                                                    />
                                                                    <button
                                                                        onClick={() => removeCertification(i)}
                                                                        className="text-red-500 hover:text-red-700"
                                                                        title="Remove"
                                                                    >
                                                                        <FaTimes className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                                {errors.certification?.[i]?.title && (
                                                                    <p className="text-xs text-red-500">{errors.certification[i].title}</p>
                                                                )}
                                                                {errors.certification?.[i]?.technology && (
                                                                    <p className="text-xs text-red-500">{errors.certification[i].technology}</p>
                                                                )}
                                                            </div>
                                                        ))}
                                                        <button
                                                            onClick={addCertification}
                                                            className="text-purple-600 text-xs flex items-center hover:text-purple-800 mt-2"
                                                        >
                                                            <FaPlus className="mr-1" /> Add Certification
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {history.certification?.map((cert, i) => (
                                                            <div key={i} className="flex justify-between items-center bg-white p-2 rounded border border-purple-100">
                                                                <span className="text-sm text-gray-700">{cert.title}</span>
                                                                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                                                                    {cert.technology}
                                                                </span>
                                                            </div>
                                                        ))}
                                                        {(!history.certification || history.certification.length === 0) && (
                                                            <p className="text-xs text-gray-400 italic">No certifications</p>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Communication Section */}
                                        <div className={`p-2 rounded ${sectionColors.communication}`}>
                                            <h4 className="text-2xs font-semibold text-amber-600 mb-1 flex items-center">
                                                <FaUser className="mr-1 text-xs" /> COMMUNICATION
                                            </h4>
                                            {isEditing ? (
                                                <div className="space-y-1">
                                                    <select
                                                        name="communication"
                                                        value={formData.communication}
                                                        onChange={handleInputChange}
                                                        className={`w-full p-2 border rounded text-sm bg-white ${errors.communication ? 'border-red-500' : ''}`}
                                                    >
                                                        <option value="">Select Level</option>
                                                        <option value="1">Average</option>
                                                        <option value="2">Medium</option>
                                                        <option value="3">Fluent</option>
                                                    </select>
                                                    {errors.communication && (
                                                        <p className="text-xs text-red-500">{errors.communication}</p>
                                                    )}
                                                </div>
                                            )  : (
                                                <div className="bg-white p-2 rounded border border-amber-100">
                                                    <p className="text-sm text-gray-700 capitalize">
                                                        {history.communication?.toLowerCase() || "Not specified"}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Total Experience */}
                                        <div className={`p-2 rounded ${sectionColors.experience}`}>
                                            <h4 className="text-2xs font-semibold text-blue-600 mb-1 flex items-center">
                                                <FaChartLine className="mr-1 text-xs" /> TOTAL EXPERIENCE
                                            </h4>
                                            {isEditing ? (
                                                <div className="space-y-1">
                                                    <input
                                                        type="number"
                                                        name="totalExperience"
                                                        value={formData.totalExperience || ''}
                                                        onChange={handleInputChange}
                                                        className={`w-full p-2 border rounded text-sm ${errors.totalExperience ? 'border-red-500' : ''}`}
                                                        placeholder="Total Years"
                                                    />
                                                    {errors.totalExperience && (
                                                        <p className="text-xs text-red-500">{errors.totalExperience}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="bg-white p-2 rounded border border-blue-100">
                                                    <p className="text-sm text-gray-700">
                                                        {history.totalExperience} years
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Column - Skills & Feedback */}
                                    <div className="space-y-3">
                                        {/* Skills Section */}
                                        <div className={`p-2 rounded ${sectionColors.skills}`}>
                                            <h4 className="text-2xs font-semibold text-emerald-600 mb-1 flex items-center">
                                                <FaStar className="mr-1 text-xs" /> SKILLS
                                            </h4>
                                            <div>
                                                {isEditing ? (
                                                    <div className="space-y-3">
                                                        {formData.techSkills?.map((skill, i) => (
                                                            <div key={i} className="space-y-2">
                                                                <div className="space-y-1">
                                                                    <select
                                                                        value={skill.category}
                                                                        onChange={(e) => handleSkillCategoryChange(i, e.target.value)}
                                                                        className={`flex-1 p-2 border rounded text-sm bg-white ${errors.techSkills?.[i]?.category ? 'border-red-500' : ''}`}
                                                                    >
                                                                        <option value="">Select Category</option>
                                                                        {technologyCategoriesWithTech.map(cat => (
                                                                            <option key={cat.publicId} value={cat.publicId}>
                                                                                {cat.name}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                    {errors.techSkills?.[i]?.category && (
                                                                        <p className="text-xs text-red-500">{errors.techSkills[i].category}</p>
                                                                    )}
                                                                </div>
                                                                {skill.technologies.map((tech, techIdx) => (
                                                                    <div key={techIdx} className="flex items-center gap-2 ml-4 bg-white p-2 rounded border border-emerald-100">
                                                                        <span className="text-sm flex-1">{tech.name}</span>
                                                                        <div className="flex items-center">
                                                                            <input
                                                                                type="number"
                                                                                value={tech.rating}
                                                                                onChange={(e) => handleSkillRatingChange(tech.technology, e.target.value, i)}
                                                                                min="0"
                                                                                max="5"
                                                                                className={`w-12 p-1 border rounded text-center ${errors.techSkills?.[i]?.rating ? 'border-red-500' : ''}`}
                                                                            />
                                                                            {errors.techSkills?.[i]?.rating && (
                                                                                <p className="text-xs text-red-500 ml-2">{errors.techSkills[i].rating}</p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {(() => {
                                                            const groupedSkills = groupSkillsByCategory(history.technicalSkills);
                                                            const categories = Object.keys(groupedSkills);

                                                            if (categories.length === 0) {
                                                                return <p className="text-xs text-gray-400 italic">No skills recorded</p>;
                                                            }

                                                            return categories.map((category) => (
                                                                <div key={category} className="space-y-2">
                                                                    <h5 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                                        {category}
                                                                    </h5>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {groupedSkills[category].map((skill, i) => (
                                                                            <div
                                                                                key={i}
                                                                                className="flex items-center bg-white px-3 py-2 rounded border border-emerald-100"
                                                                                style={{ minWidth: '120px', maxWidth: '160px' }}
                                                                            >
                                                                                <span className="text-xs text-gray-700 truncate flex-1">{skill.technology}</span>
                                                                                <div className="flex items-center ml-2">
                                                                                    {[...Array(5)].map((_, starIndex) => (
                                                                                        <FaStar
                                                                                            key={starIndex}
                                                                                            className={`${starIndex < skill.rating ? "text-amber-400" : "text-gray-300"} w-3 h-3`}
                                                                                        />
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ));
                                                        })()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Combined Feedback & Suggestion Section */}
                                        <div className="space-y-3">
                                            <div className={`p-2 rounded ${sectionColors.feedback}`}>
                                                <h4 className="text-2xs font-semibold text-indigo-600 mb-1 flex items-center">
                                                    <FaEdit className="mr-1 text-xs" /> FEEDBACK
                                                </h4>
                                                {isEditing ? (
                                                    <div className="space-y-1">
                                                        <textarea
                                                            value={formData.feedback}
                                                            onChange={(e) => handleInputChange({ target: { name: 'feedback', value: e.target.value } })}
                                                            className={`w-full p-2 border rounded text-sm bg-white ${errors.feedback ? 'border-red-500' : ''}`}
                                                            rows="3"
                                                            placeholder="Enter feedback..."
                                                        />
                                                        {errors.feedback && (
                                                            <p className="text-xs text-red-500">{errors.feedback}</p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="bg-white p-3 rounded border border-indigo-100">
                                                        <p className="text-sm text-gray-700">
                                                            {history.feedback || <span className="text-gray-400 italic">No feedback provided</span>}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className={`p-2 rounded ${sectionColors.suggestion}`}>
                                                <h4 className="text-2xs font-semibold text-teal-600 mb-1 flex items-center">
                                                    <FaInfoCircle className="mr-1 text-xs" /> SUGGESTION
                                                </h4>
                                                {isEditing ? (
                                                    <div className="space-y-1">
                                                        <textarea
                                                            value={formData.upskillSuggestion}
                                                            onChange={(e) => handleInputChange({ target: { name: 'upskillSuggestion', value: e.target.value } })}
                                                            className={`w-full p-2 border rounded text-sm bg-white ${errors.upskillSuggestion ? 'border-red-500' : ''}`}
                                                            rows="3"
                                                            placeholder="Enter upskill suggestions..."
                                                        />
                                                        {errors.upskillSuggestion && (
                                                            <p className="text-xs text-red-500">{errors.upskillSuggestion}</p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="bg-white p-3 rounded border border-teal-100">
                                                        <p className="text-sm text-gray-700">
                                                            {history.upskillSuggestion || <span className="text-gray-400 italic">No suggestions provided</span>}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {sortedHistories.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-gray-500 text-lg">No baseline histories available yet.</p>
                    </div>
                )}
            </div>
        </>
    );
};