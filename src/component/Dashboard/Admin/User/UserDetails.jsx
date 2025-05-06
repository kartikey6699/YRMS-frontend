import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase, FaCalendarAlt, FaVenusMars, FaStar, FaCode, FaFileAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { fetchResourceDetails } from "../../../../features/resource/resourceAction";

const UserDetails = ({ activeSection, setActiveSection }) => {
    const dispatch = useDispatch();
    const { resourceDetails, loading, error } = useSelector((state) => state.resource);
    const [expandedSections, setExpandedSections] = useState({
        personal: true,
        employment: true,
        skills: true,
    });

    useEffect(() => {
        dispatch(fetchResourceDetails("883109a1-d81e-40f0-968b-e2c4e0a99fbb"));
    }, [dispatch]);

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 text-red-600 font-medium">
                Error: {error}
            </div>
        );
    }

    if (!resourceDetails) {
        return (
            <div className="text-center py-12 text-gray-600 font-medium">
                No user details available.
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                Employee Profile
            </h2>
            <div className="space-y-6">
                {/* Personal Information */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div
                        className="flex justify-between items-center p-5 bg-gradient-to-r from-indigo-600 to-indigo-500 cursor-pointer"
                        onClick={() => toggleSection("personal")}
                    >
                        <h3 className="text-xl font-semibold text-white">
                            Personal Information
                        </h3>
                        {expandedSections.personal ? (
                            <FaChevronUp className="text-white" />
                        ) : (
                            <FaChevronDown className="text-white" />
                        )}
                    </div>
                    {expandedSections.personal && (
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center">
                                <FaUser className="text-indigo-600 text-xl mr-3" />
                                <div>
                                    <span className="text-sm text-gray-500">Full Name</span>
                                    <p className="text-lg font-medium text-gray-900">
                                        {resourceDetails.employeeName}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <FaEnvelope className="text-indigo-600 text-xl mr-3" />
                                <div>
                                    <span className="text-sm text-gray-500">Email</span>
                                    <p className="text-lg font-medium text-gray-900">
                                        {resourceDetails.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <FaPhone className="text-indigo-600 text-xl mr-3" />
                                <div>
                                    <span className="text-sm text-gray-500">Phone Number</span>
                                    <p className="text-lg font-medium text-gray-900">
                                        {resourceDetails.phoneNumber}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <FaVenusMars className="text-indigo-600 text-xl mr-3" />
                                <div>
                                    <span className="text-sm text-gray-500">Gender</span>
                                    <p className="text-lg font-medium text-gray-900">
                                        {resourceDetails.gender}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <FaMapMarkerAlt className="text-indigo-600 text-xl mr-3" />
                                <div>
                                    <span className="text-sm text-gray-500">Location</span>
                                    <p className="text-lg font-medium text-gray-900">
                                        {resourceDetails.location}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Employment Details */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div
                        className="flex justify-between items-center p-5 bg-gradient-to-r from-indigo-600 to-indigo-500 cursor-pointer"
                        onClick={() => toggleSection("employment")}
                    >
                        <h3 className="text-xl font-semibold text-white">
                            Employment Details
                        </h3>
                        {expandedSections.employment ? (
                            <FaChevronUp className="text-white" />
                        ) : (
                            <FaChevronDown className="text-white" />
                        )}
                    </div>
                    {expandedSections.employment && (
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center">
                                <FaBriefcase className="text-indigo-600 text-xl mr-3" />
                                <div>
                                    <span className="text-sm text-gray-500">Employee ID</span>
                                    <p className="text-lg font-medium text-gray-900">
                                        {resourceDetails.employeeId}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <FaBriefcase className="text-indigo-600 text-xl mr-3" />
                                <div>
                                    <span className="text-sm text-gray-500">Designation</span>
                                    <p className="text-lg font-medium text-gray-900">
                                        {resourceDetails.designation}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <FaBriefcase className="text-indigo-600 text-xl mr-3" />
                                <div>
                                    <span className="text-sm text-gray-500">Business Group</span>
                                    <p className="text-lg font-medium text-gray-900">
                                        {resourceDetails.businessGroup}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <FaBriefcase className="text-indigo-600 text-xl mr-3" />
                                <div>
                                    <span className="text-sm text-gray-500">Business Unit</span>
                                    <p className="text-lg font-medium text-gray-900">
                                        {resourceDetails.businessUnit}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <FaCalendarAlt className="text-indigo-600 text-xl mr-3" />
                                <div>
                                    <span className="text-sm text-gray-500">Joining Date</span>
                                    <p className="text-lg font-medium text-gray-900">
                                        {resourceDetails.joiningDate}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <FaStar className="text-indigo-600 text-xl mr-3" />
                                <div>
                                    <span className="text-sm text-gray-500">Grade</span>
                                    <p className="text-lg font-medium text-gray-900">
                                        {resourceDetails.grade}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <FaStar className="text-indigo-600 text-xl mr-3" />
                                <div>
                                    <span className="text-sm text-gray-500">Experience</span>
                                    <p className="text-lg font-medium text-gray-900">
                                        {resourceDetails.experience} years
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <FaStar className="text-indigo-600 text-xl mr-3" />
                                <div>
                                    <span className="text-sm text-gray-500">Status</span>
                                    <p className="text-lg font-medium text-gray-900">
                                        {resourceDetails.status}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Skills & Competencies */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div
                        className="flex justify-between items-center p-5 bg-gradient-to-r from-indigo-600 to-indigo-500 cursor-pointer"
                        onClick={() => toggleSection("skills")}
                    >
                        <h3 className="text-xl font-semibold text-white">
                            Skills & Competencies
                        </h3>
                        {expandedSections.skills ? (
                            <FaChevronUp className="text-white" />
                        ) : (
                            <FaChevronDown className="text-white" />
                        )}
                    </div>
                    {expandedSections.skills && (
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center">
                                <FaCode className="text-indigo-600 text-xl mr-3" />
                                <div>
                                    <span className="text-sm text-gray-500">Competency</span>
                                    <p className="text-lg font-medium text-gray-900">
                                        {resourceDetails.competencyName}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <FaCode className="text-indigo-600 text-xl mr-3" />
                                <div>
                                    <span className="text-sm text-gray-500">Technical Skills</span>
                                    <p className="text-lg font-medium text-gray-900">
                                        {resourceDetails.techSkill
                                            .map(
                                                (skill) =>
                                                    `${skill.technology} (Rating: ${skill.rating})`
                                            )
                                            .join(", ")}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <FaFileAlt className="text-indigo-600 text-xl mr-3" />
                                <div>
                                    <span className="text-sm text-gray-500">Resume</span>
                                    <p className="text-lg font-medium text-gray-900">
                                        {resourceDetails.resumeFile}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDetails;