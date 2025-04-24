import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaChevronDown } from 'react-icons/fa';
import { createRoles, fetchFeatures, fetchRoles } from '../../../../features/role/roleAction';
import { useDispatch, useSelector } from 'react-redux';
import YRMSLoader from '../../../helper/loader';
import { ErrorToast, SuccessToast } from '../../../helper/ResourceToast';

const AddRoleForm = ({ setActiveSection, setSelectedRole, selectedRole, onSuccess }) => {
    const dispatch = useDispatch();
    const { features } = useSelector((state) => state.role);

    const [errors, setErrors] = useState({
        role: '',
        features: ''
    });

    useEffect(() => {
        dispatch(fetchFeatures());
    }, [dispatch]);

    const [formData, setFormData] = useState({
        role: selectedRole?.role || '',
        features: selectedRole?.features || []
    });

    useEffect(() => {
        validateForm();
    }, [formData]);

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.role.trim()) {
            newErrors.role = 'Role name is required';
        } else if (formData.role.length < 3) {
            newErrors.role = 'Role name must be at least 3 characters';
        } else if (formData.role.length > 50) {
            newErrors.role = 'Role name cannot exceed 50 characters';
        }
        
        if (formData.features.length === 0) {
            newErrors.features = 'At least one feature must be selected';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleClose = () => {
        setSelectedRole(null);
        setActiveSection("view");
    };

    const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
    const featuresRef = useRef(null);
    const formRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState(null);

    const featuresOptions = features.map((feature) => ({
        value: feature.id,
        label: feature.name,
    }));

    // Calculate dropdown height based on number of features
    const getDropdownHeight = () => {
        const optionHeight = 40; // px - height of each option
        const minVisibleOptions = 4;
        const maxHeight = 240; // px - maximum dropdown height
        
        const requiredHeight = Math.min(
            Math.max(featuresOptions.length * optionHeight, minVisibleOptions * optionHeight),
            maxHeight
        );
        
        return `${requiredHeight}px`;
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (featuresRef.current && !featuresRef.current.contains(event.target)) {
                setIsFeaturesOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFeatureToggle = (feature) => {
        setFormData(prev => {
            const isSelected = prev.features.some(f => f.value === feature.value);
            return {
                ...prev,
                features: isSelected
                    ? prev.features.filter(f => f.value !== feature.value)
                    : [...prev.features, feature]
            };
        });
    };

    const removeFeature = (featureValue, e) => {
        e.stopPropagation();
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter(f => f.value !== featureValue)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        try {
            setToast(<YRMSLoader message={selectedRole ? "Updating role..." : "Creating role..."} />);

            const payload = {
                ...(selectedRole && { id: selectedRole.id }),
                role: formData.role,
                permission: formData.features.map(feature => feature.value)
            };

            const createResult = await dispatch(createRoles(payload));

            if (!createResult) {
                throw new Error("Failed to get response");
            }

            setToast(<SuccessToast message={`Role ${selectedRole ? 'updated' : 'created'} successfully!`} onClose={() => setToast(null)} />);
            setFormData({ role: '', features: [] });
            onSuccess?.();
            setSelectedRole(null);
            setActiveSection("view");
        } catch (err) {
            setToast(<ErrorToast message={err.message || `Failed to ${selectedRole ? 'update' : 'create'} role`} onClose={() => setToast(null)} />);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (selectedRole) {
            setFormData({
                role: selectedRole.role,
                features: selectedRole.features.map(f => ({
                    value: f.id,
                    label: f.name
                }))
            });
        }
    }, [selectedRole]);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setActiveSection("view");
        }
    };

    const isFormValid = Object.keys(errors).length === 0 && formData.role && formData.features.length > 0;

    return (
        <div
            className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20 p-4 overflow-y-auto"
            onClick={handleOverlayClick}
        >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg transform transition-all h-full max-h-130 flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-200 p-4 flex-shrink-0">
                    <h3 className="text-xl font-semibold text-gray-800">
                        {selectedRole ? "Update Role" : "Add New Role"}
                    </h3>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label="Close"
                    >
                        <FaTimes className="text-lg" />
                    </button>
                </div>

                {/* Scrollable Form Content */}
                <form
                    onSubmit={handleSubmit}
                    className="p-6 overflow-y-auto flex-1"
                    ref={formRef}
                >
                    {/* Role Field */}
                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">
                            Role Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className={`w-full p-3 border ${errors.role ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all`}
                            placeholder="Enter role name (3-50 characters)"
                            required
                            minLength={3}
                            maxLength={50}
                        />
                        {errors.role && (
                            <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                        )}
                    </div>

                    {/* Features Field */}
                    <div className="mb-8" ref={featuresRef}>
                        <label className="block text-gray-700 font-medium mb-2">
                            Features <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div
                                className={`w-full min-h-12 p-2 border ${errors.features ? 'border-red-500' : 'border-gray-300'} rounded-lg flex flex-wrap items-center cursor-pointer ${isFeaturesOpen ? 'ring-2 ring-indigo-300 border-transparent' : ''}`}
                                onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
                                aria-expanded={isFeaturesOpen}
                                aria-haspopup="listbox"
                            >
                                {formData.features.length === 0 ? (
                                    <span className="text-gray-400 ml-2">Select features...</span>
                                ) : (
                                    formData.features.map(feature => (
                                        <div
                                            key={feature.value}
                                            className="bg-indigo-100 text-indigo-800 text-sm px-2 py-1 rounded m-1 flex items-center"
                                        >
                                            {feature.label}
                                            <button
                                                type="button"
                                                onClick={(e) => removeFeature(feature.value, e)}
                                                className="ml-1 text-indigo-500 hover:text-indigo-700"
                                                aria-label={`Remove ${feature.label}`}
                                            >
                                                <FaTimes className="text-xs" />
                                            </button>
                                        </div>
                                    ))
                                )}
                                <div className="ml-auto pr-2">
                                    <FaChevronDown className={`text-gray-400 transition-transform ${isFeaturesOpen ? 'transform rotate-180' : ''}`} />
                                </div>
                            </div>
                            {errors.features && (
                                <p className="mt-1 text-sm text-red-600">{errors.features}</p>
                            )}

                            {isFeaturesOpen && (
                                <div
                                    className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg py-1 border border-gray-200 overflow-auto"
                                    role="listbox"
                                    style={{ height: getDropdownHeight() }}
                                >
                                    {featuresOptions.map(feature => (
                                        <div 
                                            key={feature.value}
                                            className="h-10 flex items-center px-4 hover:bg-gray-50 cursor-pointer"
                                            role="option"
                                            aria-selected={formData.features.some(f => f.value === feature.value)}
                                        >
                                            <label className="flex items-center w-full h-full cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out rounded"
                                                    checked={formData.features.some(f => f.value === feature.value)}
                                                    onChange={() => handleFeatureToggle(feature)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    aria-label={`Select ${feature.label}`}
                                                />
                                                <span className="ml-3 text-gray-700">{feature.label}</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </form>

                {/* Fixed Footer */}
                <div className="flex justify-end space-x-3 border-t border-gray-200 p-4 flex-shrink-0">
                    <button
                        type="button"
                        onClick={() => setActiveSection("view")}
                        className="px-4 py-2.5 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={isSubmitting || !isFormValid}
                    >
                        {isSubmitting ? 'Processing...' : (selectedRole ? 'Update Role' : 'Save Role')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddRoleForm;