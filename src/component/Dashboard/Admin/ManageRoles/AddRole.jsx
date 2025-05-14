import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaChevronDown } from 'react-icons/fa';
import { createRoles, fetchFeatures } from '../../../../features/role/roleAction';
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
    const [categorySearchTerm, setCategorySearchTerm] = useState('');
    const [roleSearchTerm, setRoleSearchTerm] = useState('');
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [isRolesOpen, setIsRolesOpen] = useState(false);
    const categoriesRef = useRef(null);
    const rolesRef = useRef(null);
    const formRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState(null);

    // State for form data
    const [formData, setFormData] = useState({
        role: selectedRole?.role || '',
        selectedCategories: selectedRole?.features
            ? [...new Set(selectedRole.features.map(f => f.category))]
                .map(category => ({ value: category, label: category, type: 'category' }))
            : [],
        selectedRoles: selectedRole?.features
            ? selectedRole.features.map(f => ({
                  value: f.id,
                  label: f.name,
                  category: f.category,
                  type: 'role'
              }))
            : []
    });

    console.log('>>>' , features);

    // Extract unique categories and group features by category
    const categories = [...new Set(features.map(f => f.category || 'Uncategorized'))].map(category => ({
        value: category,
        label: category,
        type: 'category'
    }));

    const groupedFeatures = features.reduce((acc, feature) => {
        const category = feature.category || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push({
            value: feature.id,
            label: feature.name,
            category: feature.category,
            type: 'role'
        });
        return acc;
    }, {});

    // Fetch features on mount
    useEffect(() => {
        dispatch(fetchFeatures());
    }, [dispatch]);

    // Validate form on formData change
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

        if (formData.selectedRoles.length === 0) {
            newErrors.features = 'At least one role must be selected';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle closing the modal
    const handleClose = () => {
        setSelectedRole(null);
        setActiveSection("view");
    };

    // Handle clicks outside the dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                categoriesRef.current && !categoriesRef.current.contains(event.target) &&
                rolesRef.current && !rolesRef.current.contains(event.target)
            ) {
                setIsCategoriesOpen(false);
                setIsRolesOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle role name input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle category toggle
    const handleCategoryToggle = (category, e) => {
        e.stopPropagation();
        setFormData(prev => {
            const isSelected = prev.selectedCategories.some(c => c.value === category.value);
            if (isSelected) {
                // Remove category and its roles
                return {
                    ...prev,
                    selectedCategories: prev.selectedCategories.filter(c => c.value !== category.value),
                    selectedRoles: prev.selectedRoles.filter(r => r.category !== category.value)
                };
            } else {
                // Add category and all its roles
                const categoryRoles = groupedFeatures[category.value] || [];
                const newRoles = categoryRoles.filter(
                    r => !prev.selectedRoles.some(pr => pr.value === r.value)
                );
                return {
                    ...prev,
                    selectedCategories: [...prev.selectedCategories, category],
                    selectedRoles: [...prev.selectedRoles, ...newRoles]
                };
            }
        });
    };

    // Handle role toggle
    const handleRoleToggle = (role, e) => {
        e.stopPropagation();
        setFormData(prev => {
            const isSelected = prev.selectedRoles.some(r => r.value === role.value);
            if (isSelected) {
                return {
                    ...prev,
                    selectedRoles: prev.selectedRoles.filter(r => r.value !== role.value)
                };
            } else {
                return {
                    ...prev,
                    selectedRoles: [...prev.selectedRoles, role]
                };
            }
        });
    };

    // Remove a category or role
    const removeItem = (item, e) => {
        e.stopPropagation();
        setFormData(prev => {
            if (item.type === 'category') {
                return {
                    ...prev,
                    selectedCategories: prev.selectedCategories.filter(c => c.value !== item.value),
                    selectedRoles: prev.selectedRoles.filter(r => r.category !== item.value)
                };
            } else {
                return {
                    ...prev,
                    selectedRoles: prev.selectedRoles.filter(r => r.value !== item.value)
                };
            }
        });
    };

    // Handle form submission
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
                permission: formData.selectedRoles.map(role => role.value)
            };

            const createResult = await dispatch(createRoles(payload));

            if (!createResult) {
                throw new Error("Failed to get response");
            }

            setToast(<SuccessToast message={`Role ${selectedRole ? 'updated' : 'created'} successfully!`} onClose={() => setToast(null)} />);
            setFormData({ role: '', selectedCategories: [], selectedRoles: [] });
            onSuccess?.();
            setSelectedRole(null);
            setActiveSection("view");
        } catch (err) {
            setToast(<ErrorToast message={err.message || `Failed to ${selectedRole ? 'update' : 'create'} role`} onClose={() => setToast(null)} />);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Update form data when editing a role
    useEffect(() => {
        if (selectedRole) {
            setFormData({
                role: selectedRole.role,
                selectedCategories: [...new Set(selectedRole.features.map(f => f.category))]
                    .map(category => ({ value: category, label: category, type: 'category' })),
                selectedRoles: selectedRole.features.map(f => ({
                    value: f.id,
                    label: f.name,
                    category: f.category,
                    type: 'role'
                }))
            });
        }
    }, [selectedRole]);

    // Handle overlay click to close modal
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setActiveSection("view");
        }
    };

    const isFormValid = Object.keys(errors).length === 0 && formData.role && formData.selectedRoles.length > 0;

    // Filter categories and roles based on search terms
    const filteredCategories = categories.filter(category =>
        category.label.toLowerCase().includes(categorySearchTerm.toLowerCase())
    );

    const filteredRoles = features
        .map(f => ({
            value: f.id,
            label: f.name,
            category: f.category,
            type: 'role'
        }))
        .filter(role =>
            role.label.toLowerCase().includes(roleSearchTerm.toLowerCase())
        );

    return (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20 p-4 overflow-y-auto"
            onClick={handleOverlayClick}
        >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl transform transition-all h-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-200 p-6 flex-shrink-0">
                    <h3 className="text-2xl font-semibold text-gray-800">
                        {selectedRole ? "Update Role" : "Add New Role"}
                    </h3>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label="Close"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                {/* Scrollable Form Content */}
                <form
                    onSubmit={handleSubmit}
                    className="p-8 overflow-y-auto flex-1"
                    ref={formRef}
                >
                    {/* Role Field */}
                    <div className="mb-8">
                        <label className="block text-gray-700 font-medium mb-3 text-lg">
                            Role Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className={`w-full p-4 border text-lg ${errors.role ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all`}
                            placeholder="Enter role name (3-50 characters)"
                            required
                            minLength={3}
                            maxLength={50}
                        />
                        {errors.role && (
                            <p className="mt-2 text-base text-red-600">{errors.role}</p>
                        )}
                    </div>

                    {/* Categories Dropdown */}
                    <div className="mb-8" ref={categoriesRef}>
                        <label className="block text-gray-700 font-medium mb-3 text-lg">
                            Categories <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            {/* Selected Categories Area */}
                            <div
                                className={`w-full min-h-16 p-3 border ${errors.features ? 'border-red-500' : 'border-gray-300'} rounded-lg flex flex-wrap items-center cursor-pointer transition-all duration-300 ${isCategoriesOpen ? 'ring-2 ring-teal-400 border-transparent' : ''}`}
                                onClick={() => {
                                    setIsCategoriesOpen(!isCategoriesOpen);
                                    setIsRolesOpen(false);
                                }}
                                aria-expanded={isCategoriesOpen}
                                aria-haspopup="listbox"
                            >
                                {formData.selectedCategories.length === 0 ? (
                                    <span className="text-gray-400 ml-2 text-lg">Select categories...</span>
                                ) : (
                                    formData.selectedCategories.map(category => (
                                        <div
                                            key={category.value}
                                            className="bg-teal-100 text-teal-800 text-base px-3 py-1.5 rounded-lg m-1 flex items-center transform transition-transform duration-200 hover:scale-105"
                                        >
                                            {category.label}
                                            <button
                                                type="button"
                                                onClick={(e) => removeItem(category, e)}
                                                className="ml-2 text-teal-600 hover:text-teal-800"
                                                aria-label={`Remove ${category.label}`}
                                            >
                                                <FaTimes className="text-sm" />
                                            </button>
                                        </div>
                                    ))
                                )}
                                <div className="ml-auto pr-2">
                                    <FaChevronDown className={`text-gray-400 transition-transform duration-300 text-xl ${isCategoriesOpen ? 'transform rotate-180' : ''}`} />
                                </div>
                            </div>

                            {/* Categories Dropdown */}
                            {isCategoriesOpen && (
                                <div
                                    className="absolute z-20 mt-2 w-full bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden transform transition-all duration-300"
                                    role="listbox"
                                >
                                    {/* Search Input */}
                                    <div className="p-3 border-b border-gray-200">
                                        <input
                                            type="text"
                                            placeholder="Search categories..."
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-400 text-lg"
                                            value={categorySearchTerm}
                                            onChange={(e) => setCategorySearchTerm(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>

                                    {/* Categories List */}
                                    <div
                                        className="overflow-auto"
                                        style={{ maxHeight: '200px' }}
                                    >
                                        {filteredCategories.length === 0 ? (
                                            <div className="p-4 text-gray-500 text-lg text-center">
                                                No categories found
                                            </div>
                                        ) : (
                                            filteredCategories.map(category => (
                                                <div
                                                    key={category.value}
                                                    className="flex items-center px-5 py-3 hover:bg-teal-50 cursor-pointer text-lg transition-colors duration-200"
                                                    role="option"
                                                    aria-selected={formData.selectedCategories.some(c => c.value === category.value)}
                                                >
                                                    <label className="flex items-center w-full cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="form-checkbox h-5 w-5 text-teal-600 transition duration-150 ease-in-out rounded"
                                                            checked={formData.selectedCategories.some(c => c.value === category.value)}
                                                            onChange={(e) => handleCategoryToggle(category, e)}
                                                            onClick={(e) => e.stopPropagation()}
                                                            aria-label={`Select ${category.label}`}
                                                        />
                                                        <span className="ml-4 text-teal-700">{category.label}</span>
                                                    </label>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Roles Dropdown */}
                    <div className="mb-10" ref={rolesRef}>
                        <label className="block text-gray-700 font-medium mb-3 text-lg">
                            Roles <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            {/* Selected Roles Area */}
                            <div
                                className={`w-full min-h-16 p-3 border ${errors.features ? 'border-red-500' : 'border-gray-300'} rounded-lg flex flex-wrap items-center cursor-pointer transition-all duration-300 ${isRolesOpen ? 'ring-2 ring-indigo-400 border-transparent' : ''}`}
                                onClick={() => {
                                    setIsRolesOpen(!isRolesOpen);
                                    setIsCategoriesOpen(false);
                                }}
                                aria-expanded={isRolesOpen}
                                aria-haspopup="listbox"
                            >
                                {formData.selectedRoles.length === 0 ? (
                                    <span className="text-gray-400 ml-2 text-lg">Select roles...</span>
                                ) : (
                                    formData.selectedRoles.map(role => (
                                        <div
                                            key={role.value}
                                            className="bg-indigo-100 text-indigo-800 text-base px-3 py-1.5 rounded-lg m-1 flex items-center transform transition-transform duration-200 hover:scale-105"
                                        >
                                            {role.label}
                                            <button
                                                type="button"
                                                onClick={(e) => removeItem(role, e)}
                                                className="ml-2 text-indigo-600 hover:text-indigo-800"
                                                aria-label={`Remove ${role.label}`}
                                            >
                                                <FaTimes className="text-sm" />
                                            </button>
                                        </div>
                                    ))
                                )}
                                <div className="ml-auto pr-2">
                                    <FaChevronDown className={`text-gray-400 transition-transform duration-300 text-xl ${isRolesOpen ? 'transform rotate-180' : ''}`} />
                                </div>
                            </div>

                            {errors.features && (
                                <p className="mt-2 text-base text-red-600">{errors.features}</p>
                            )}

                            {/* Roles Dropdown */}
                            {isRolesOpen && (
                                <div
                                    className="absolute z-20 mt-2 w-full bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden transform transition-all duration-300"
                                    role="listbox"
                                >
                                    {/* Search Input */}
                                    <div className="p-3 border-b border-gray-200">
                                        <input
                                            type="text"
                                            placeholder="Search roles..."
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400 text-lg"
                                            value={roleSearchTerm}
                                            onChange={(e) => setRoleSearchTerm(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>

                                    {/* Roles List */}
                                    <div
                                        className="overflow-auto"
                                        style={{ maxHeight: '200px' }}
                                    >
                                        {filteredRoles.length === 0 ? (
                                            <div className="p-4 text-gray-500 text-lg text-center">
                                                No roles found
                                            </div>
                                        ) : (
                                            filteredRoles.map(role => (
                                                <div
                                                    key={role.value}
                                                    className="flex items-center px-5 py-3 hover:bg-indigo-50 cursor-pointer text-lg transition-colors duration-200"
                                                    role="option"
                                                    aria-selected={formData.selectedRoles.some(r => r.value === role.value)}
                                                >
                                                    <label className="flex items-center w-full cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out rounded"
                                                            checked={formData.selectedRoles.some(r => r.value === role.value)}
                                                            onChange={(e) => handleRoleToggle(role, e)}
                                                            onClick={(e) => e.stopPropagation()}
                                                            aria-label={`Select ${role.label}`}
                                                        />
                                                        <span className="ml-4 text-gray-700">{role.label}</span>
                                                    </label>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </form>

                {/* Fixed Footer */}
                <div className="flex justify-end space-x-4 border-t border-gray-200 p-6 flex-shrink-0">
                    <button
                        type="button"
                        onClick={() => setActiveSection("view")}
                        className="px-6 py-3 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 text-lg hover:cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="px-8 py-3 bg-gradient-to-r from-teal-600 to-indigo-600 text-white font-medium rounded-lg hover:from-teal-700 hover:to-indigo-700 transition-all duration-200 shadow-md disabled:opacity-70 disabled:cursor-not-allowed text-lg hover:cursor-pointer"
                        disabled={isSubmitting || !isFormValid}
                    >
                        {isSubmitting ? 'Processing...' : (selectedRole ? 'Update Role' : 'Save Role')}
                    </button>
                </div>
            </div>
            {toast}
        </div>
    );
};

export default AddRoleForm;