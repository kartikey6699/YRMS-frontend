import React, { useState } from 'react';
import ResourceAnalytics from './ResourceAnalytics';
import InternAnalytics from './InternAnalytics';
import TrainingAnalytics from './TrainingAnalytics';

const Analytics = () => {
  const [activeSection, setActiveSection] = useState('resource');

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-8">
      <h2 className="text-3xl font-bold text-indigo-800 mb-8">Analytics Dashboard</h2>
      <div className="flex space-x-4 mb-8">
        {[
          { name: 'resource', label: 'Resources', gradient: 'from-blue-600 to-indigo-600' },
          { name: 'intern', label: 'Interns', gradient: 'from-purple-600 to-indigo-600' },
          { name: 'training', label: 'Training', gradient: 'from-green-600 to-teal-600' },
        ].map(section => (
          <button
            key={section.name}
            onClick={() => setActiveSection(section.name)}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105 focus:outline-none ${
              activeSection === section.name
                ? `bg-gradient-to-r ${section.gradient} shadow-lg`
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>
      {activeSection === 'resource' && <ResourceAnalytics />}
      {activeSection === 'intern' && <InternAnalytics />}
      {activeSection === 'training' && <TrainingAnalytics />}
    </div>
  );
};

export default Analytics;