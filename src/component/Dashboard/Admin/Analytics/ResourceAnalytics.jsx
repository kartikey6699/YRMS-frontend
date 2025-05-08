import React, { useState } from 'react';
import { Pie, Bar, Doughnut, Line } from 'react-chartjs-2';
import { FaChartPie } from 'react-icons/fa';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register Chart.js components and plugins
ChartJS.register(ArcElement, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

// Static Dummy Data (20 objects)
const resources = [
  { id: 1, status: 'deployed', designation: 'Software Engineer', experience: 5, location: 'New York', employmentType: 'Permanent', technology: 'React', rating: 4.5, joiningDate: '2023-01-15', interviewScore: 85 },
  { id: 2, status: 'pool', designation: 'Data Scientist', experience: 3, location: 'San Francisco', employmentType: 'Contract', technology: 'Python', rating: 4.0, joiningDate: '2023-02-10', interviewScore: 78 },
  { id: 3, status: 'pip', designation: 'Software Engineer', experience: 7, location: 'London', employmentType: 'Probation', technology: 'Java', rating: 3.5, joiningDate: '2023-03-05', interviewScore: 90 },
  { id: 4, status: 'deployed', designation: 'Product Manager', experience: 4, location: 'New York', employmentType: 'Permanent', technology: 'None', rating: 4.8, joiningDate: '2023-04-20', interviewScore: 88 },
  { id: 5, status: 'pool', designation: 'Software Engineer', experience: 2, location: 'Bangalore', employmentType: 'Contract', technology: 'React', rating: 4.2, joiningDate: '2023-05-12', interviewScore: 82 },
  { id: 6, status: 'deployed', designation: 'Data Scientist', experience: 6, location: 'San Francisco', employmentType: 'Permanent', technology: 'Python', rating: 4.7, joiningDate: '2023-06-01', interviewScore: 87 },
  { id: 7, status: 'pool', designation: 'DevOps Engineer', experience: 4, location: 'Berlin', employmentType: 'Contract', technology: 'AWS', rating: 4.1, joiningDate: '2023-07-10', interviewScore: 80 },
  { id: 8, status: 'deployed', designation: 'Software Engineer', experience: 8, location: 'Tokyo', employmentType: 'Permanent', technology: 'Node.js', rating: 4.9, joiningDate: '2023-08-15', interviewScore: 92 },
  { id: 9, status: 'pip', designation: 'Data Analyst', experience: 3, location: 'New York', employmentType: 'Probation', technology: 'SQL', rating: 3.8, joiningDate: '2023-09-20', interviewScore: 75 },
  { id: 10, status: 'deployed', designation: 'Product Manager', experience: 6, location: 'London', employmentType: 'Permanent', technology: 'None', rating: 4.6, joiningDate: '2023-10-05', interviewScore: 89 },
  { id: 11, status: 'pool', designation: 'Software Engineer', experience: 1, location: 'Bangalore', employmentType: 'Contract', technology: 'React', rating: 4.0, joiningDate: '2023-11-12', interviewScore: 77 },
  { id: 12, status: 'deployed', designation: 'Data Scientist', experience: 5, location: 'San Francisco', employmentType: 'Permanent', technology: 'Python', rating: 4.5, joiningDate: '2023-12-01', interviewScore: 86 },
  { id: 13, status: 'pool', designation: 'Frontend Developer', experience: 3, location: 'New York', employmentType: 'Contract', technology: 'Vue.js', rating: 4.3, joiningDate: '2024-01-15', interviewScore: 81 },
  { id: 14, status: 'deployed', designation: 'Software Engineer', experience: 9, location: 'Berlin', employmentType: 'Permanent', technology: 'Java', rating: 4.8, joiningDate: '2024-02-20', interviewScore: 93 },
  { id: 15, status: 'pip', designation: 'Data Scientist', experience: 4, location: 'Tokyo', employmentType: 'Probation', technology: 'R', rating: 3.7, joiningDate: '2024-03-10', interviewScore: 76 },
  { id: 16, status: 'deployed', designation: 'Product Manager', experience: 7, location: 'San Francisco', employmentType: 'Permanent', technology: 'None', rating: 4.9, joiningDate: '2024-04-05', interviewScore: 91 },
  { id: 17, status: 'pool', designation: 'Backend Developer', experience: 2, location: 'Bangalore', employmentType: 'Contract', technology: 'Node.js', rating: 4.1, joiningDate: '2024-05-12', interviewScore: 79 },
  { id: 18, status: 'deployed', designation: 'Software Engineer', experience: 6, location: 'London', employmentType: 'Permanent', technology: 'React', rating: 4.6, joiningDate: '2024-06-01', interviewScore: 88 },
  { id: 19, status: 'pool', designation: 'Data Analyst', experience: 3, location: 'New York', employmentType: 'Contract', technology: 'SQL', rating: 4.2, joiningDate: '2024-07-10', interviewScore: 80 },
  { id: 20, status: 'deployed', designation: 'DevOps Engineer', experience: 5, location: 'Berlin', employmentType: 'Permanent', technology: 'AWS', rating: 4.7, joiningDate: '2024-08-15', interviewScore: 90 },
];

// Filter Data by Date Range
const filterByDateRange = (data, startDate, endDate, dateField) => {
  if (!startDate || !endDate) return data;
  const start = new Date(startDate);
  const end = new Date(endDate);
  return data.filter(item => {
    const date = new Date(item[dateField]);
    return date >= start && date <= end;
  });
};

// Chart Options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: { font: { size: 14, family: 'Inter, sans-serif' }, color: '#1F2937', padding: 20 },
    },
    tooltip: {
      backgroundColor: 'rgba(31, 41, 55, 0.9)',
      titleFont: { size: 14, weight: 'bold' },
      bodyFont: { size: 12 },
      padding: 12,
      cornerRadius: 8,
    },
  },
  animation: { duration: 1000, easing: 'easeInOutQuart' },
};

const barOptions = {
  ...chartOptions,
  plugins: {
    ...chartOptions.plugins,
    datalabels: {
      display: true,
      color: '#1F2937',
      font: { size: 12, weight: 'bold' },
      anchor: 'end',
      align: 'top',
      formatter: (value) => value > 0 ? value : '',
    },
  },
  scales: {
    y: { beginAtZero: true, ticks: { stepSize: 1, color: '#1F2937', font: { size: 12 } }, grid: { color: '#E5E7EB' } },
    x: { ticks: { color: '#1F2937', font: { size: 12 } }, grid: { display: false } },
  },
};

const lineOptions = {
  ...chartOptions,
  plugins: {
    ...chartOptions.plugins,
    datalabels: {
      display: true,
      color: '#1F2937',
      font: { size: 12, weight: 'bold' },
      formatter: (value) => value > 0 ? value : '',
      align: 'top',
      offset: 10,
    },
  },
  scales: {
    y: { beginAtZero: true, ticks: { stepSize: 1, color: '#1F2937', font: { size: 12 } }, grid: { color: '#E5E7EB' } },
    x: { ticks: { color: '#1F2937', font: { size: 12 }, maxRotation: 45, minRotation: 45 }, grid: { display: false } },
  },
};

const ResourceAnalytics = () => {
  // Separate date states for each chart
  const [designationStartDate, setDesignationStartDate] = useState('');
  const [designationEndDate, setDesignationEndDate] = useState('');
  const [interviewStartDate, setInterviewStartDate] = useState('');
  const [interviewEndDate, setInterviewEndDate] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('all'); // 'all', 'deployed', 'available'

  // Reset date filters
  const resetDesignationDates = () => {
    setDesignationStartDate('');
    setDesignationEndDate('');
  };
  const resetInterviewDates = () => {
    setInterviewStartDate('');
    setInterviewEndDate('');
  };

  // Filtered resources for each chart
  const designationResources = filterByDateRange(resources, designationStartDate, designationEndDate, 'joiningDate');
  const interviewResources = filterByDateRange(resources, interviewStartDate, interviewEndDate, 'joiningDate');
  const experienceResources = resources.filter(
    r => experienceFilter === 'all' || (experienceFilter === 'deployed' ? r.status === 'deployed' : r.status === 'pool')
  );

  // 1. Resources by Status (Bar Chart)
  const statusData = {
    labels: ['Pool', 'PIP', 'Deployed'],
    datasets: [
      {
        label: 'Resources by Status',
        data: [
          resources.filter(r => r.status === 'pool').length,
          resources.filter(r => r.status === 'pip').length,
          resources.filter(r => r.status === 'deployed').length,
        ],
        backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(16, 185, 129, 0.8)'],
        hoverBackgroundColor: ['rgba(37, 99, 235, 0.8)', 'rgba(217, 119, 6, 0.8)', 'rgba(5, 150, 105, 0.8)'],
      },
    ],
  };

  // 2. Resources by Designation (Bar Chart)
  const designationData = {
    labels: [...new Set(designationResources.map(r => r.designation))],
    datasets: [
      {
        label: 'Resources by Designation',
        data: [...new Set(designationResources.map(r => r.designation))].map(d => designationResources.filter(r => r.designation === d).length),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        hoverBackgroundColor: 'rgba(124, 58, 237, 0.8)',
      },
    ],
  };

  // 3. Resources by Experience (Bar Chart)
  const experienceData = {
    labels: ['0-2 Years', '3-5 Years', '6+ Years'],
    datasets: [
      {
        label: `Resources (${experienceFilter === 'all' ? 'All' : experienceFilter.charAt(0).toUpperCase() + experienceFilter.slice(1)})`,
        data: [
          experienceResources.filter(r => r.experience <= 2).length,
          experienceResources.filter(r => r.experience > 2 && r.experience <= 5).length,
          experienceResources.filter(r => r.experience > 5).length,
        ],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        hoverBackgroundColor: 'rgba(22, 163, 74, 0.8)',
      },
    ],
  };

  // 4. Location Distribution (Doughnut Chart)
  const locationData = {
    labels: [...new Set(resources.map(r => r.location))],
    datasets: [
      {
        data: [...new Set(resources.map(r => r.location))].map(l => resources.filter(r => r.location === l).length),
        backgroundColor: ['#EF4444', '#F97316', '#FBBF24', '#34D399', '#3B82F6'],
        hoverBackgroundColor: ['#DC2626', '#EA580C', '#F59E0B', '#10B981', '#2563EB'],
      },
    ],
  };

  // 5. Employment Type (Pie Chart)
  const employmentTypeData = {
    labels: ['Probation', 'Permanent', 'Contract'],
    datasets: [
      {
        data: [
          resources.filter(r => r.employmentType === 'Probation').length,
          resources.filter(r => r.employmentType === 'Permanent').length,
          resources.filter(r => r.employmentType === 'Contract').length,
        ],
        backgroundColor: ['#10B981', '#3B82F6', '#F59E0B'],
        hoverBackgroundColor: ['#059669', '#2563EB', '#D97706'],
      },
    ],
  };

  // 6. Technology Distribution (Pie Chart)
  const technologyData = {
    labels: [...new Set(resources.map(r => r.technology))],
    datasets: [
      {
        data: [...new Set(resources.map(r => r.technology))].map(t => resources.filter(r => r.technology === t).length),
        backgroundColor: ['#EF4444', '#3B82F6', '#FBBF24'],
        hoverBackgroundColor: ['#DC2626', '#2563EB', '#F59E0B'],
      },
    ],
  };

  // 7. Rating Distribution (Bar Chart)
  const ratingData = {
    labels: ['3.0-3.5', '3.6-4.0', '4.1-4.5', '4.6-5.0'],
    datasets: [
      {
        label: 'Resources by Rating',
        data: [
          resources.filter(r => r.rating >= 3.0 && r.rating <= 3.5).length,
          resources.filter(r => r.rating > 3.5 && r.rating <= 4.0).length,
          resources.filter(r => r.rating > 4.0 && r.rating <= 4.5).length,
          resources.filter(r => r.rating > 4.5 && r.rating <= 5.0).length,
        ],
        backgroundColor: 'rgba(249, 115, 22, 0.8)',
        hoverBackgroundColor: 'rgba(234, 88, 12, 0.8)',
      },
    ],
  };

  // 8. Interview Performance (Line Chart)
  const interviewData = (() => {
    const scores = {};
    interviewResources.forEach(r => {
      const date = new Date(r.joiningDate);
      const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      scores[key] = scores[key] || { total: 0, count: 0 };
      scores[key].total += r.interviewScore;
      scores[key].count++;
    });
    const sortedKeys = Object.keys(scores).sort();
    return {
      labels: sortedKeys,
      datasets: [
        {
          label: 'Average Interview Score',
          data: sortedKeys.map(k => (scores[k].total / scores[k].count).toFixed(1)),
          borderColor: '#8B5CF6',
          backgroundColor: 'rgba(139, 92, 246, 0.2)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  })();

  return (
    <section className="bg-white p-8 rounded-xl shadow-lg">
      <div className="flex items-center mb-6">
        <FaChartPie className="text-indigo-600 text-3xl mr-3" />
        <h3 className="text-2xl font-semibold text-gray-800">Resource Analytics</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Status Chart */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Resource Status</h4>
          <p className="text-sm text-gray-600 mb-4">Number of resources in Pool, PIP, or Deployed status.</p>
          <div className="relative h-80"><Bar data={statusData} options={barOptions} /></div>
        </div>
        {/* Designation Chart */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg shadow-md">
          <h4 className = "text-gray-700 mb-2">Resources by Designation</h4>
          <p className="text-sm text-gray-600 mb-4">Resources joined by designation between selected dates.</p>
          <div className="flex space-x-4 mb-4">
            <input
              type="date"
              value={designationStartDate}
              onChange={e => setDesignationStartDate(e.target.value)}
              className="p-2 border rounded"
            />
            <input
              type="date"
              value={designationEndDate}
              onChange={e => setDesignationEndDate(e.target.value)}
              className="p-2 border rounded"
            />
            <button
              onClick={resetDesignationDates}
              className="p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Reset
            </button>
          </div>
          <div className="relative h-80"><Bar data={designationData} options={barOptions} /></div>
        </div>
        {/* Experience Chart */}
        <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Resources by Experience</h4>
          <p className="text-sm text-gray-600 mb-4">Resources by experience level, filtered by deployed/available status.</p>
          <div className="flex space-x-4 mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="all"
                checked={experienceFilter === 'all'}
                onChange={() => setExperienceFilter('all')}
                className="form-radio"
              />
              <span>All</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="deployed"
                checked={experienceFilter === 'deployed'}
                onChange={() => setExperienceFilter('deployed')}
                className="form-radio"
              />
              <span>Deployed</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="available"
                checked={experienceFilter === 'available'}
                onChange={() => setExperienceFilter('available')}
                className="form-radio"
              />
              <span>Available</span>
            </label>
          </div>
          <div className="relative h-80"><Bar data={experienceData} options={barOptions} /></div>
        </div>
        {/* Location Chart */}
        <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Location Distribution</h4>
          <p className="text-sm text-gray-600 mb-4">Distribution of resources across locations.</p>
          <div className="relative h-80"><Doughnut data={locationData} options={chartOptions} /></div>
        </div>
        {/* Employment Type Chart */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Employment Type Distribution</h4>
          <p className="text-sm text-gray-600 mb-4">Resources by employment type (Probation, Permanent, Contract).</p>
          <div className="relative h-80"><Pie data={employmentTypeData} options={chartOptions} /></div>
        </div>
        {/* Technology Chart */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Technology Distribution</h4>
          <p className="text-sm text-gray-600 mb-4">Resources by technology expertise.</p>
          <div className="relative h-80"><Pie data={technologyData} options={chartOptions} /></div>
        </div>
        {/* Rating Chart */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Rating Distribution</h4>
          <p className="text-sm text-gray-600 mb-4">Resources by performance rating.</p>
          <div className="relative h-80"><Bar data={ratingData} options={barOptions} /></div>
        </div>
        {/* Interview Performance Chart */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Interview Performance Over Time</h4>
          <p className="text-sm text-gray-600 mb-4">Average interview scores between selected dates.</p>
          <div className="flex space-x-4 mb-4">
            <input
              type="date"
              value={interviewStartDate}
              onChange={e => setInterviewStartDate(e.target.value)}
              className="p-2 border rounded"
            />
            <input
              type="date"
              value={interviewEndDate}
              onChange={e => setInterviewEndDate(e.target.value)}
              className="p-2 border rounded"
            />
            <button
              onClick={resetInterviewDates}
              className="p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Reset
            </button>
          </div>
          <div className="relative h-80"><Line data={interviewData} options={lineOptions} /></div>
        </div>
      </div>
    </section>
  );
};

export default ResourceAnalytics;