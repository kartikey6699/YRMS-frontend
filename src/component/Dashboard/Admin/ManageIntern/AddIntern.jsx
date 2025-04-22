import React, { useEffect, useState } from 'react';
import { 
  FaArrowLeft, 
  FaUser, 
  FaEnvelope, 
  FaVenusMars, 
  FaPhone, 
  FaUserTie, 
  FaCode, 
  FaCalendarAlt, 
  FaCalendarCheck, 
  FaClock, 
  FaMapMarkerAlt, 
  FaCheckCircle 
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCompetencies, fetchResources } from '../../../../features/resource/resourceAction';
import { ErrorToast, SuccessToast } from '../../../helper/ResourceToast';
import { createIntern, fetchInterns } from '../../../../features/intern/internAction';
import YRMSLoader from '../../../helper/loader';


const AddIntern = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading } = useSelector((state) => state.intern);
    const [toast, setToast] = useState(null);
    const { resources, competencies } = useSelector((state) => state.resource);

    const [formData, setFormData] = useState({
        name: "",
        gender: "",
        location: "indore",
        email: "",
        phoneNumber: "",
        startDate: "",
        duration: "",
        endDate: "",
        mentorId: "",
        status: "",
        competencyId: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        dispatch(fetchResources());
        dispatch(fetchCompetencies());
    }, [dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const calculateEndDate = (startDate, duration) => {
        if (!startDate || !duration) return "";
        
        const date = new Date(startDate);
        date.setMonth(date.getMonth() + parseInt(duration));
        return date.toISOString().split('T')[0];
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };
        
        if (name === 'startDate' || name === 'duration') {
            newFormData.endDate = calculateEndDate(
                name === 'startDate' ? value : formData.startDate,
                name === 'duration' ? value : formData.duration
            );
        }
        
        setFormData(newFormData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            setToast(<YRMSLoader message="Creating intern..." />);

            const createResult = await dispatch(createIntern(formData));
            
            if (!createResult.payload?.publicId) {
                throw new Error("Failed to get publicId from response");
            }

            setToast(<SuccessToast message="Intern created successfully!" onClose={() => setToast(null)} />);
            dispatch(fetchInterns());

            setFormData({
                name: "",
                gender: "",
                location: "indore",
                email: "",
                phoneNumber: "",
                startDate: "",
                duration: "",
                endDate: "",
                mentorId: "",
                status: "",
                competencyId: "",
            });
            
            setTimeout(() => {
                navigate('/interns');
            }, 1500);
        } catch (err) {
            setToast(<ErrorToast message={err.message || "Failed to create intern"} onClose={() => setToast(null)} />);
        } finally {
            setIsSubmitting(false);
        }
    };

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
            
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-blue-800 mb-2">Add New Intern</h2>
                <p className="text-gray-600">Fill in the details below to register a new intern</p>
            </div>
            
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
                        <FaUser className="mr-2" /> Personal Information
                    </h3>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2 flex items-center">
                            <FaUser className="mr-2 text-blue-500" /> Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full h-12 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="Enter Name"
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2 flex items-center">
                            <FaEnvelope className="mr-2 text-blue-500" /> Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full h-12 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="Enter Email"
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2 flex items-center">
                            <FaVenusMars className="mr-2 text-blue-500" /> Gender
                        </label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="w-full h-12 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            required
                        >
                            <option value="" disabled>Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2 flex items-center">
                            <FaPhone className="mr-2 text-blue-500" /> Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            className="w-full h-12 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="Enter phone number"
                            required
                        />
                    </div>
                </div>

                {/* Professional Information Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
                        <FaUserTie className="mr-2" /> Professional Details
                    </h3>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2 flex items-center">
                            <FaUserTie className="mr-2 text-blue-500" /> Mentor
                        </label>
                        <select
                            name='mentorId'
                            value={formData.mentorId}
                            onChange={handleInputChange}
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
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2 flex items-center">
                            <FaCode className="mr-2 text-blue-500" /> Competency
                        </label>
                        <select
                            name="competencyId"
                            value={formData.competencyId}
                            onChange={handleInputChange}
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
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2 flex items-center">
                            <FaMapMarkerAlt className="mr-2 text-blue-500" /> Location
                        </label>
                        <select
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="w-full h-12 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            required
                        >
                            <option value="indore-yash-it-park-sc-dc">Indore-YASH IT Park-SC-DC</option>
                            <option value="pune-magarpatta-dc-ii">Pune-Magarpatta-DC-II</option>
                            <option value="hyderabad-mindspace-i-dc">Hyderabad-Mindspace I-DC</option>
                            <option value="bangalore-whitefield-dc">Bangalore-Whitefield-DC</option>
                            <option value="indore-crystal-it-park-dc-ii">Indore-Crystal IT Park-DC-II</option>
                            <option value="indore-btc-co">Indore-BTC-CO</option>
                        </select>
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2 flex items-center">
                            <FaCheckCircle className="mr-2 text-blue-500" /> Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="w-full h-12 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            required
                        >
                            <option value="" disabled>Select Status</option>
                            <option value="hold">Hold</option>
                            <option value="pending">Pending</option>
                            <option value="running">Running</option>
                            <option value="complete">Complete</option>
                        </select>
                    </div>
                </div>

                {/* Internship Duration Section */}
                <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
                        <FaCalendarAlt className="mr-2" /> Internship Duration
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2 flex items-center">
                                <FaCalendarAlt className="mr-2 text-blue-500" /> Start Date
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleDateChange}
                                className="w-full h-12 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                                required
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2 flex items-center">
                                <FaClock className="mr-2 text-blue-500" /> Duration (months)
                            </label>
                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleDateChange}
                                min="1"
                                className="w-full h-12 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="Enter duration"
                                required
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2 flex items-center">
                                <FaCalendarCheck className="mr-2 text-blue-500" /> End Date
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleInputChange}
                                className="w-full h-12 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-gray-100"
                                disabled
                                required
                            />
                        </div>
                    </div>
                </div>
                
                <div className="md:col-span-2 flex justify-center mt-4">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`px-8 py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105 flex items-center ${
                            isSubmitting
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        }`}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            <>
                                <FaCheckCircle className="mr-2" />
                                Submit Intern Details
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddIntern;