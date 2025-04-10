import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router'
import { fetchCompetencies, fetchResources } from '../../../../features/resource/resourceAction';
import { ErrorToast, SuccessToast } from '../../../helper/ResourceToast';
import YRMSLoader from '../../../helper/loader';
import { createIntern, fetchInterns } from '../../../../features/intern/internAction';

const AddIntern = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { interns, internDetails, loading, error } = useSelector((state) => state.intern);
    const [toast, setToast] = useState(null);
    const [offered, setIsOffered] = useState(false);
    const { resources, competencies } = useSelector(
        (state) => state.resource
    );

    const [formData, setFormData] = useState({
        name: "",
        gender: "",
        location: "indore",
        email: "",
        phoneNumber: "",
        startDate: "",
        endDate: "",
        mentorId: "",
        status: "",
        ratting: "",
        feedback: "",
        remark: "",
        competencyId: "",
        isOffered: null,
});

    useEffect(() => {
        dispatch(fetchResources());
        dispatch(fetchCompetencies());
    }, [dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setToast(<YRMSLoader message="Creating intern..." />);

            const createResult = await dispatch(createIntern(formData));
            
            console.log(formData)
            if (!createResult.payload?.publicId) {
                throw new Error("Failed to get publicId from response");
            }

            setToast(<SuccessToast message="Intern created successfully!" onClose={() => setToast(null)} />);

            setToast(<YRMSLoader message="Refreshing data..." />);
            dispatch(fetchInterns());

              setFormData({
                name: "",
                gender: "",
                location: "indore",
                email: "",
                phoneNumber: "",
                startDate: "",
                endDate: "",
                mentorId: "",
                status: "",
                ratting: "",
                feedback: "",
                remark: "",
                competencyId: "",
                isOffered: null
            })
            navigate('/interns')
        }
        catch (err) {
            setToast(<ErrorToast message={err.message || "Failed to create intern"} onClose={() => setToast(null)} />);
        }
    }


    return (
        <div className='p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg mb-6'>
            {loading && <YRMSLoader />}
            {toast}

            <div className="flex justify-between items-center mb-6">
                <Link
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    to='/interns'
                >
                    <FaArrowLeft className="mr-2" />
                    Back to Intern List
                </Link>
            </div>
            <h2 className="text-3xl font-bold text-blue-800 mb-6">Add New Intern</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information Section */}
                <div className="row">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Name</label>
                        <input
                            type="text"
                            name="name"
                            onChange={handleInputChange}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="Enter Name"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            onChange={handleInputChange}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="Enter Email"
                            required
                        />
                    </div>
                    <div className="pt-3">
                        <label className="block text-gray-700 font-medium mb-2">Gender</label>
                        <select
                            type="text"
                            name="gender"
                            onChange={handleInputChange}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            required
                        >
                            <option value="" selected>Select type</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                </div>
                <div className="row">
                    <div className="pt-3">
                        <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            onChange={handleInputChange}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="Enter phone number"
                            required
                        />
                    </div>
                    <div className="pt-3">
                        <label className="block text-gray-700 font-medium mb-2">Mentor</label>
                        <select
                            type="text"
                            name='mentorId'
                            onChange={handleInputChange}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="Select location"
                            required
                        >
                            <option value="" selected>Select type</option>
                            {resources.map((mentor, index) => (
                                <option
                                    value={mentor.publicId}
                                    key={index}
                                    selected={mentor.selected}
                                >
                                    {mentor.employeeName}
                                </option>
                            ))}
                        </select>

                    </div>
                    <div className="pt-3">
                        <label className="block text-gray-700 font-medium mb-2">Competency</label>
                        <select
                            type="text"
                            name="competencyId"
                            onChange={handleInputChange}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            required
                        >
                            <option value="" selected>Select type</option>
                            {competencies.map((competency, index) => (
                                <option
                                    value={competency.publicId}
                                    key={index}
                                    selected={competency.selected}
                                >
                                    {competency.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="row">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            onChange={handleInputChange}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">End Date</label>
                        <input
                            type="date"
                            name="endDate"
                            onChange={handleInputChange}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            required
                        />
                    </div>
                </div>
                <div className="row">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Status</label>
                        <select
                            type="text"
                            name="status"
                            onChange={handleInputChange}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            required
                        >
                            <option value="" selected>Select type</option>
                            <option value="running">Running</option>
                            <option value="complete">Complete</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Rating</label>
                        <input
                            type="number"
                            name="ratting"
                            onChange={handleInputChange}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="1-5"
                            min="1"
                            max="5"
                            required
                        />
                    </div>
                </div>
                <div className="row">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Feedback</label>
                        <textarea
                            name="feedback"
                            onChange={handleInputChange}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none"
                            placeholder="Enter feedback"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">remark</label>
                        <textarea
                            name="remark"
                            onChange={handleInputChange}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none"
                            placeholder="Enter remark"
                            rows="3"
                        />
                    </div>
                </div>
                <div className="row">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Location</label>
                        <select
                            name="location"
                            onChange={handleInputChange}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            required
                        >
                            <option value="" selected>Select location</option>
                            <option value="indore">Indore</option>
                            <option value="pune">Pune</option>
                            <option value="hydrabad">Hydrabad</option>
                        </select>
                    </div>
                    <div className='pt-10'>
                        <label className="block text-gray-700 mt-8 font-medium mb-2">
                            <input
                                type="checkbox"
                                name="isOffered"
                                onClick={(obj) => setIsOffered(!obj ? true : false)}
                                onChange={handleInputChange}
                                value={offered}
                                className="mr-2"
                                required
                            />
                            offered
                        </label>
                    </div>
                </div>
                <div className="md:col-span-2 flex justify-center mt-8">
                    <input
                        type="button"
                        value="Submit"
                        onClick={handleSubmit}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
                    />
                </div>
            </form>
        </div>
    )
}

export default AddIntern
