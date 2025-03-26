import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { Link } from 'react-router'
const AddIntern = () => {
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
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 font-medium mb-2">Name</label>
                        <input
                            type="text"
                            name="name"
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
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="Enter Email"
                            required
                        />
                    </div>
                </div>
                <div className="row">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="Enter phone number"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Mentor</label>
                        <input
                            type="text"
                            name="mentor"
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="Enter Mentor name"
                            required
                        />
                    </div>
                </div>
                <div className="row">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">End Date</label>
                        <input
                            type="date"
                            name="endDate"
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
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none"
                            placeholder="Enter feedback"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">remark</label>
                        <textarea
                            name="remark"
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
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            required
                        >
                            <option value="" selected>Select location</option>
                            <option value="provision">Indore</option>
                            <option value="permanent">Pune</option>
                            <option value="temporary">Hydrabad</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">stipen</label>
                        <input
                            type="number"
                            name="stipen"
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="value"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">offered</label>
                        <input
                            type="checkbox"
                            name="offered"
                            className=""
                            required
                        />
                    </div>
                </div>
                <div className="md:col-span-2 flex justify-center mt-8">
                    <button
                        type="submit"
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
