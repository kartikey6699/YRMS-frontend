import React, { useState } from 'react';
import { FaBook, FaCode, FaBrain, FaRocket, FaShieldAlt, FaChartLine , FaCheck} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ProfileCard from '../../../helper/ProfileCard';

const AdminCompetency = ({ competencies, loading , onClose }) => {
  const [selectedCompetency, setSelectedCompetency] = useState(null);
  const publicId = sessionStorage.getItem('userId') || '';

  const handleSelectCompetency = (competency) => {
    sessionStorage.setItem('adminCompetencyId', competency.publicId);
    sessionStorage.setItem('competencyName', competency.name);

    setSelectedCompetency(competency);
    onClose(); 
  };

  // Map competencies to icons and gradients (aligned with Dashboard styling)
  const competencyIcons = [
    { icon: FaBook, gradient: 'from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300' },
    { icon: FaCode, gradient: 'from-yellow-100 to-yellow-200 hover:from-yellow-200 hover:to-yellow-300' },
    { icon: FaBrain, gradient: 'from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300' },
    { icon: FaRocket, gradient: 'from-pink-100 to-pink-200 hover:from-pink-200 hover:to-pink-300' },
    { icon: FaShieldAlt, gradient: 'from-teal-100 to-teal-200 hover:from-teal-200 hover:to-teal-300' },
    { icon: FaChartLine, gradient: 'from-indigo-100 to-indigo-200 hover:from-indigo-200 hover:to-indigo-300' },
  ];

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden transform transition-all animate-fade-in">
        {/* Profile Card */}
        <ProfileCard publicId={publicId} />

        {/* Header Content */}
        <div className="px-8 pt-2 pb-4">
          <h2 className="text-3xl font-bold tracking-tight text-gray-800">Welcome, Admin!</h2>
          <p className="mt-2 text-lg text-gray-600">Select a competency to manage your team effectively.</p>
        </div>

        {/* Body */}
        <div className="p-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading competencies...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {competencies.map((competency, index) => {
                const { icon: Icon, gradient } = competencyIcons[index % competencyIcons.length];
                return (
                  <div
                    key={competency.publicId}
                    onClick={() => handleSelectCompetency(competency)}
                    className={`relative p-6 rounded-xl shadow-md cursor-pointer transition-all duration-300 bg-gradient-to-br ${gradient} flex items-center ${
                      selectedCompetency?.publicId === competency.publicId
                        ? 'ring-2 ring-indigo-600 shadow-lg'
                        : 'hover:-translate-y-1 hover:shadow-lg'
                    }`}
                  >
                    <Icon className="text-3xl text-indigo-600 mr-4" />
                    <h3 className="font-semibold text-lg text-gray-800">{competency.name}</h3>
                    {selectedCompetency?.publicId === competency.publicId && (
                      <span className="absolute top-2 right-2 text-indigo-600 animate-pulse">
                        <FaCheck size={20} />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCompetency;