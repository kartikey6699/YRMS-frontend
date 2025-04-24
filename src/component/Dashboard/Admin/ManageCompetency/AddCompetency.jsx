import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { createCompetency, updateCompetency } from '../../../../features/resource/resourceAction';
import YRMSLoader from '../../../helper/loader';
import { ErrorToast, SuccessToast } from '../../../helper/ResourceToast';

const AddCompetency = ({ setActiveSection, setSelectedCompetency, selectedCompetency, onSuccess }) => {
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({ name: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState(null);

    const [formData, setFormData] = useState({
        name: selectedCompetency?.name || ''
    });

    useEffect(() => {
        validateForm();
    }, [formData]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Competency name is required';
        } else if (formData.name.length < 3) {
            newErrors.name = 'Competency name must be at least 3 characters';
        } else if (formData.name.length > 50) {
            newErrors.name = 'Competency name cannot exceed 50 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleClose = () => {
        setSelectedCompetency(null);
        setActiveSection("view");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            setToast(<YRMSLoader message={selectedCompetency ? "Updating competency..." : "Creating competency..."} />);

            let result;
            if (selectedCompetency) {
                result = await dispatch(updateCompetency({
                    id: selectedCompetency.publicId,
                    name: formData.name
                }));
            } else {
                result = await dispatch(createCompetency(formData.name));
            }

            if (!result) throw new Error("Failed to get response");

            setToast(<SuccessToast message={`Competency ${selectedCompetency ? 'updated' : 'created'} successfully!`} onClose={() => setToast(null)} />);
            setFormData({ name: '' });
            onSuccess?.();
            setSelectedCompetency(null);
            setActiveSection("view");
        } catch (err) {
            setToast(<ErrorToast message={err.message || `Failed to ${selectedCompetency ? 'update' : 'create'} competency`} onClose={() => setToast(null)} />);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (selectedCompetency) {
            setFormData({ name: selectedCompetency.name });
        }
    }, [selectedCompetency]);

    const isFormValid = Object.keys(errors).length === 0 && formData.name;

    return (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20 p-4 overflow-y-auto">
            <div className={`bg-white rounded-xl shadow-xlw-full max-w-[95vw] sm:max-w-[80vw] md:max-w-[70vw] lg:max-w-[70vw] xl:max-w-[50vw]transform transition-allh-automax-h-[90vh] sm:max-h-[80vh] md:max-h-[80vh]flex flex-colmx-2
  `}>
                <div className="flex justify-between items-center border-b border-gray-200 p-4 flex-shrink-0">
                    <h3 className="text-xl font-semibold text-gray-800">
                        {selectedCompetency ? "Update Competency" : "Add New Competency"}
                    </h3>
                    <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 transition-colors">
                        <FaTimes className="text-lg" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">
                            Competency Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all`}
                            placeholder="Enter competency name (3-50 characters)"
                            required
                            minLength={3}
                            maxLength={50}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>
                </form>

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
                        {isSubmitting ? 'Processing...' : (selectedCompetency ? 'Update Competency' : 'Save Competency')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddCompetency;