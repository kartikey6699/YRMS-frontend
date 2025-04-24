import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaChevronDown } from 'react-icons/fa';
import { createRoles, fetchFeatures, fetchRoles } from '../../../../features/role/roleAction';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResources } from '../../../../features/resource/resourceAction';
import YRMSLoader from '../../../helper/loader';
import { ErrorToast, SuccessToast } from '../../../helper/ResourceToast';

const AddRoleForm = ({ setActiveSection }) => {
    const dispatch = useDispatch();

    const { features } = useSelector(
        (state) => state.role
    );

    useEffect(() => {
        dispatch(fetchFeatures());
    }, [dispatch]);

    const [formData, setFormData] = useState({
        role: '',
        features: []
    });

    const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
    const featuresRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState(null);

    const featuresOptions = features.map((feature) => ({
        value: feature.id,
        label: feature.name,
    }));

    // Close dropdown when clicking outside
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

    const handleSubmit = async(e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            setToast(<YRMSLoader message="Creating intern..." />);


        // Create new payload with role and permission (array of feature IDs)
        const payload = {
            role: formData.role,
            permission: formData.features.map(feature => feature.value)
        };

        console.log(payload, "Submitted payload");
        const createResult = await dispatch(createRoles(payload));

        if (!createResult) {
            throw new Error("Failed to get publicId from response");
        }

        setToast(<SuccessToast message="Role created successfully!" onClose={() => setToast(null)} />);
        setFormData({
            role: '',
            features: []
        });
        


        setActiveSection("view"); // Close form by switching to view section
        } catch (err) {
            setToast(<ErrorToast message={err.message || "Failed to create intern"} onClose={() => setToast(null)} />);
        } finally {
            setIsSubmitting(false);
        }

    };

    // Handle clicking the overlay (outside the form)
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setActiveSection("view");
        }
    };

    return (
        <div
            className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20 p-4"
            onClick={handleOverlayClick}
        >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-200 p-4">
                    <h3 className="text-xl font-semibold text-gray-800">Add New Role</h3>
                    <button
                        onClick={() => setActiveSection("view")}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <FaTimes className="text-lg" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Role Field */}
                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">
                            Role Name
                        </label>
                        <input
                            type="text"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all"
                            placeholder="Enter role name"
                            required
                        />
                    </div>

                    {/* Features Field */}
                    <div className="mb-8" ref={featuresRef}>
                        <label className="block text-gray-700 font-medium mb-2">
                            Features
                        </label>
                        <div className="relative">
                            {/* Input-like container that shows selected features */}
                            <div
                                className={`w-full min-h-12 p-2 border border-gray-300 rounded-lg flex flex-wrap items-center cursor-pointer ${isFeaturesOpen ? 'ring-2 ring-indigo-300 border-transparent' : ''}`}
                                onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
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

                            {/* Dropdown with checkboxes */}
                            {isFeaturesOpen && (
                                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg py-1 border border-gray-200 max-h-60 overflow-auto">
                                    {featuresOptions.map(feature => (
                                        <label
                                            key={feature.value}
                                            className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out rounded"
                                                checked={formData.features.some(f => f.value === feature.value)}
                                                onChange={() => handleFeatureToggle(feature)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <span className="ml-3 text-gray-700">{feature.label}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer with Save Button */}
                    <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4">
                        <button
                            type="button"
                            onClick={() => setActiveSection("view")}
                            className="px-4 py-2.5 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
                        >
                            Save Role
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddRoleForm;