import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router'
import { fetchResources } from '../../../../features/resource/resourceAction';

const AddIntern = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { interns, internDetails, loading, error } = useSelector((state) => state.intern);
    const { resources } = useSelector(
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
        mentor: "",
        status: "",
        rating: "",
        feedback: "",
        remark: "",
        competency: "",
        offered: "pool",
    });

    useEffect(() => {
        dispatch(fetchResources());
    }, [dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    console.log("men", resources)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setToast(<YRMSLoader message="Creating intern..." />);
            
            const createResult = await dispatch(createResource(formData));

            if (!createResult.payload?.publicId) {
                throw new Error("Failed to get publicId from response");
            }

            console.log(formData)
            setToast(<SuccessToast message="Intern created successfully!" onClose={() => setToast(null)} />);

            setToast(<YRMSLoader message="Refreshing data..." />);
            dispatch(fetchResources());

            setFormData({
                name: "",
                gender: "",
                location: "indore",
                email: "",
                phoneNumber: "",
                startDate: "",
                endDate: "",
                mentor: "",
                status: "",
                rating: "",
                feedback: "",
                remark: "",
                competency: "",
                offered: "pool",
            })
        }
        catch (err) {
            setToast(<ErrorToast message={err.message || "Failed to create intern"} onClose={() => setToast(null)} />);
        }
    }


    return (
        <div className='p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg mb-6'>
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
                            name="status"
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
                            onChange={handleInputChange}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="Select location"
                            required
                        >
                            {resources.map((mentor) => (
                                <option value={mentor.id} selected>{mentor.name}</option>
                            ))}
                        </select>

                    </div>
                    <div className="pt-3">
                        <label className="block text-gray-700 font-medium mb-2">Competency</label>
                        <select
                            name="status"
                            onChange={handleInputChange}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            required
                        >
                            <option value="" selected>Select type</option>
                            <option value="runnning">Python</option>
                            <option value="complete">Java</option>
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
                            name="status"
                            onChange={handleInputChange}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            required
                        >
                            <option value="" selected>Select type</option>
                            <option value="runnning">Running</option>
                            <option value="complete">Complete</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Rating</label>
                        <input
                            type="number"
                            name="rating"
                            onChange={handleInputChange}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="1-5"
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
                            <option value="provision">Indore</option>
                            <option value="permanent">Pune</option>
                            <option value="temporary">Hydrabad</option>
                        </select>
                    </div>
                    <div className='pt-10'>
                        <label className="block text-gray-700 mt-8 font-medium mb-2">
                            <input
                                type="checkbox"
                                name="offered"
                                onChange={handleInputChange}
                                className="mr-2"
                                required
                            />
                            offered
                        </label>
                    </div>
                </div>
                <div className="md:col-span-2 flex justify-center mt-8">
                    <button
                        type="submit"
                        onSubmit={handleSubmit}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddIntern
