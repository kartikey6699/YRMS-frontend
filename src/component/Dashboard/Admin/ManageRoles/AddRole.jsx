import React, { useEffect, useState } from 'react'
import Select from 'react-select/base'
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeatures } from '../../../../features/role/roleAction';

const AddRole = () => {

    const dispatch = useDispatch();
    const { roles, features, roleLoading, featuresloading } = useSelector(
        (state) => state.resource
    );
    const [formData, setFormData] = useState({
        roleId: '',
        name: ""
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        dispatch(fetchFeatures());
    }, [dispatch])

    const featuresOptions = features?.data?.map(feature => ({
        value: feature.id,
        label: feature.name,
    }));

    console.log(features, "jkdfjdsfdjf")

    const handleMultiSelectChange = (selectedOptions) => {
        setFormData({
            ...formData,
            feature: selectedOptions,
        });
    };
    return (
        <div>
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Features <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <Select
                        options={featuresOptions}
                        isMulti
                        value={formData.name}
                        onChange={handleMultiSelectChange}
                        className={`basic-multi-select ${errors.name ? "border-red-500" : ""}`}
                        classNamePrefix="select"
                        placeholder="Select feature..."
                        onMenuOpen={() => {featuresOptions}}
                        styles={{
                            menu: (provided) => ({
                                ...provided,
                                maxHeight: 150,
                                overflowY: "auto",
                            }),
                        }}
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.name}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AddRole
