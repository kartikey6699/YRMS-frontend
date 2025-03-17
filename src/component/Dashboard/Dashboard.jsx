import React, { useState } from 'react';
import { FaCogs, FaChalkboardTeacher, FaChartLine, FaTasks } from 'react-icons/fa';
import ManageResource from './ManageResource';
import ManageTrainer from './ManageTrainer';
import ManageBaseline from './ManageBaseline';
import AssignTraining from './AssignTraining';

const Dashboard = () => {
  const [activeCard, setActiveCard] = useState(null);
  
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  let backgroundImage = '';
  let greeting = '';

  if (currentHour >= 5 && currentHour < 12) {
    backgroundImage = 'morning.jpg';
    greeting = 'Good Morning';
  } else if (currentHour >= 12 && currentHour < 17) {
    backgroundImage = 'noon.jpg';
    greeting = 'Good Afternoon';
  } else if (currentHour >= 17 && currentHour < 20) {
    backgroundImage = 'evening.jpg';
    greeting = 'Good Evening';
  } else {
    backgroundImage = 'night.jpg';
    greeting = 'Good Night';
  }

  const handleCardClick = (cardId) => {
    setActiveCard(activeCard === cardId ? null : cardId);
    setTimeout(() => {
      document.getElementById(`content-${cardId}`)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Card preview components
  const ResourcePreview = () => <span className="text-lg font-medium text-gray-800">Manage Resources</span>;
  const TrainerPreview = () => <span className="text-lg font-medium text-gray-800">Manage Trainers</span>;
  const BaselinePreview = () => <span className="text-lg font-medium text-gray-800">Manage Baseline</span>;
  const TrainingPreview = () => <span className="text-lg font-medium text-gray-800">Assign Training</span>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="relative text-center mb-12">
        <img 
          src={`src\\assets\\images\\dashboard\\${backgroundImage}`} 
          className="w-full h-56 object-cover rounded-xl shadow-lg" 
          alt="Background" 
        />
        <h1 className="text-4xl font-bold text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 drop-shadow-lg">
          {greeting}
        </h1>
      </div>
      
      <div className="text-center text-3xl font-semibold mb-10 text-gray-800">Quick Actions</div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          className="bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 p-6 rounded-xl shadow-md transition-all duration-300 flex items-center cursor-pointer transform hover:-translate-y-1"
          onClick={() => handleCardClick('resource')}
        >
          <FaCogs className="text-4xl text-blue-600 mr-4" />
          <ResourcePreview />
        </div>
        
        <div 
          className="bg-gradient-to-br from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 p-6 rounded-xl shadow-md transition-all duration-300 flex items-center cursor-pointer transform hover:-translate-y-1"
          onClick={() => handleCardClick('trainer')}
        >
          <FaChalkboardTeacher className="text-4xl text-green-600 mr-4" />
          <TrainerPreview />
        </div>
        
        <div 
          className="bg-gradient-to-br from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 p-6 rounded-xl shadow-md transition-all duration-300 flex items-center cursor-pointer transform hover:-translate-y-1"
          onClick={() => handleCardClick('baseline')}
        >
          <FaChartLine className="text-4xl text-red-600 mr-4" />
          <BaselinePreview />
        </div>
        
        <div 
          className="bg-gradient-to-br from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 p-6 rounded-xl shadow-md transition-all duration-300 flex items-center cursor-pointer transform hover:-translate-y-1"
          onClick={() => handleCardClick('training')}
        >
          <FaTasks className="text-4xl text-purple-600 mr-4" />
          <TrainingPreview />
        </div>
      </div>

      {/* Expanded Content Section */}
      {activeCard && (
        <div className="mt-8 p-6 bg-white rounded-xl shadow-lg">
          {activeCard === 'resource' && (
            <div id="content-resource">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">Manage Resources</h2>
              <ManageResource />
            </div>
          )}
          {activeCard === 'trainer' && (
            <div id="content-trainer">
              <h2 className="text-2xl font-semibold text-green-600 mb-4">Manage Trainers</h2>
              <ManageTrainer />
            </div>
          )}
          {activeCard === 'baseline' && (
            <div id="content-baseline">
              <h2 className="text-2xl font-semibold text-red-600 mb-4">Manage Baseline</h2>
              <ManageBaseline />
            </div>
          )}
          {activeCard === 'training' && (
            <div id="content-training">
              <h2 className="text-2xl font-semibold text-purple-600 mb-4">Assign Training</h2>
              <AssignTraining />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;