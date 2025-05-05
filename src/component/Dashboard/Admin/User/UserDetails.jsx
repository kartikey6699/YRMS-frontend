import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase, FaCalendarAlt, FaVenusMars, FaStar, FaCode, FaFileAlt } from "react-icons/fa";
import { fetchResourceDetails } from "../../../../features/resource/resourceAction";

const UserDetails = ({ activeSection, setActiveSection }) => {
    const dispatch = useDispatch();
    const { resourceDetails, loading, error } = useSelector((state) => state.resource);

    useEffect(() => {
        dispatch(fetchResourceDetails("883109a1-d81e-40f0-968b-e2c4e0a99fbb"));
    }, [dispatch]);

    if (loading) {
        return <div className="text-center py-12 text-gray-500">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-12 text-red-500">Error: {error}</div>;
    }

    if (!resourceDetails) {
        return <div className="text-center py-12 text-gray-500">No user details available.</div>;
    }

    return (
        <div className="p-6">
            <h3 className="text-2xl font-semibold text-gray-700 mb-6">User Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg shadow">
                    <FaUser className="text-indigo-500 text-2xl mr-4" />
                    <div>
                        <span className="text-sm text-gray-500">Name</span>
                        <p className="text-lg font-medium text-gray-800">{resourceDetails.employeeName}</p>
                    </div>
                </div>
                <div className="flex items-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg shadow">
                    <FaBriefcase className="text-indigo-500 text-2xl mr-4" />
                    <div>
                        <span className="text-sm text-gray-500">Employee ID</span>
                        <p className="text-lg font-medium text-gray-800">{resourceDetails.employeeId}</p>
                    </div>
                </div>
                <div className="flex items-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg shadow">
                    <FaBriefcase className="text-indigo-500 text-2xl mr-4" />
                    <div>
                        <span className="text-sm text-gray-500">Designation</span>
                        <p className="text-lg font-medium text-gray-800">{resourceDetails.designation}</p>
                    </div>
                </div>
                <div className="flex items-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg shadow">
                    <FaEnvelope className="text-indigo-500 text-2xl mr-4" />
                    <div>
                        <span className="text-sm text-gray-500">Email</span>
                        <p className="text-lg font-medium text-gray-800">{resourceDetails.email}</p>
                    </div>
                </div>
                <div className="flex items-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg shadow">
                    <FaPhone className="text-indigo-500 text-2xl mr-4" />
                    <div>
                        <span className="text-sm text-gray-500">Phone Number</span>
                        <p className="text-lg font-medium text-gray-800">{resourceDetails.phoneNumber}</p>
                    </div>
                </div>
                <div className="flex items-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg shadow">
                    <FaMapMarkerAlt className="text-indigo-500 text-2xl mr-4" />
                    <div>
                        <span className="text-sm text-gray-500">Location</span>
                        <p className="text-lg font-medium text-gray-800">{resourceDetails.location}</p>
                    </div>
                </div>
                <div className="flex items-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg shadow">
                    <FaBriefcase className="text-indigo-500 text-2xl mr-4" />
                    <div>
                        <span className="text-sm text-gray-500">Business Group</span>
                        <p className="text-lg font-medium text-gray-800">{resourceDetails.businessGroup}</p>
                    </div>
                </div>
                <div className="flex items-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg shadow">
                    <FaBriefcase className="text-indigo-500 text-2xl mr-4" />
                    <div>
                        <span className="text-sm text-gray-500">Business Unit</span>
                        <p className="text-lg font-medium text-gray-800">{resourceDetails.businessUnit}</p>
                    </div>
                </div>
                <div className="flex items-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg shadow">
                    <FaVenusMars className="text-indigo-500 text-2xl mr-4" />
                    <div>
                        <span className="text-sm text-gray-500">Gender</span>
                        <p className="text-lg font-medium text-gray-800">{resourceDetails.gender}</p>
                    </div>
                </div>
                <div className="flex items-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg shadow">
                    <FaCalendarAlt className="text-indigo-500 text-2xl mr-4" />
                    <div>
                        <span className="text-sm text-gray-500">Joining Date</span>
                        <p className="text-lg font-medium text-gray-800">{resourceDetails.joiningDate}</p>
                    </div>
                </div>
                <div className="flex items-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg shadow">
                    <FaStar className="text-indigo-500 text-2xl mr-4" />
                    <div>
                        <span className="text-sm text-gray-500">Grade</span>
                        <p className="text-lg font-medium text-gray-800">{resourceDetails.grade}</p>
                    </div>
                </div>
                <div className="flex items-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg shadow">
                    <FaStar className="text-indigo-500 text-2xl mr-4" />
                    <div>
                        <span className="text-sm text-gray-500">Experience</span>
                        <p className="text-lg font-medium text-gray-800">{resourceDetails.experience} years</p>
                    </div>
                </div>
                <div className="flex items-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg shadow">
                    <FaCode className="text-indigo-500 text-2xl mr-4" />
                    <div>
                        <span className="text-sm text-gray-500">Competency</span>
                        <p className="text-lg font-medium text-gray-800">{resourceDetails.competencyName}</p>
                    </div>
                </div>
                <div className="flex items-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg shadow">
                    <FaCode className="text-indigo-500 text-2xl mr-4" />
                    <div>
                        <span className="text-sm text-gray-500">Tech Skills</span>
                        <p className="text-lg font-medium text-gray-800">
                            {resourceDetails.techSkill.map(skill => `${skill.technology} (Rating: ${skill.rating})`).join(', ')}
                        </p>
                    </div>
                </div>
                <div className="flex items-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg shadow">
                    <FaFileAlt className="text-indigo-500 text-2xl mr-4" />
                    <div>
                        <span className="text-sm text-gray-500">Resume</span>
                        <p className="text-lg font-medium text-gray-800">{resourceDetails.resumeFile}</p>
                    </div>
                </div>
                <div className="flex items-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg shadow">
                    <FaStar className="text-indigo-500 text-2xl mr-4" />
                    <div>
                        <span className="text-sm text-gray-500">Status</span>
                        <p className="text-lg font-medium text-gray-800">{resourceDetails.status}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetails;