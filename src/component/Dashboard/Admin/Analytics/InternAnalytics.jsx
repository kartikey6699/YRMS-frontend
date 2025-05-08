import React, { useState } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { FaUsers } from 'react-icons/fa';
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

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

// Static Dummy Data
const interns = [
  { id: 1, status: 'deployed', designation: 'Intern Developer', mentor: 'John Doe', location: 'New York', joiningDate: '2023-01-20' },
  { id: 2, status: 'pool', designation: 'Intern Analyst', mentor: 'Jane Smith', location: 'San Francisco', joiningDate: '2023-02-15' },
  { id: 3, status: 'pip', designation: 'Intern Developer', mentor: 'John Doe', location: 'London', joiningDate: '2023-03-10' },
  { id: 4, status: 'deployed', designation: 'Intern Designer', mentor: 'Alice Brown', location: 'Bangalore', joiningDate: '2023-04-05' },
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
  scales: {
    y: { beginAtZero: true, ticks: { stepSize: 1, color: '#1F2937', font: { size: 12 } }, grid: { color: '#E5E7EB' } },
    x: { ticks: { color: '#1F2937', font: { size: 12 } }, grid: { display: false } },
  },
};

const lineOptions = {
  ...chartOptions,
  scales: {
    y: { beginAtZero: true, ticks: { stepSize: 1, color: '#1F2937', font: { size: 12 } }, grid: { color: '#E5E7EB' } },
    x: { ticks: { color: '#1F2937', font: { size: 12 }, maxRotation: 45, minRotation: 45 }, grid: { display: false } },
  },
};

const InternAnalytics = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredInterns = filterByDateRange(interns, startDate, endDate, 'joiningDate');

  // 1. Interns by Status (Line Chart)
  const internStatusData = (() => {
    const counts = {};
    filteredInterns.forEach(i => {
      const date = new Date(i.joiningDate);
      const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      counts[key] = counts[key] || { pool: 0, pip: 0, deployed: 0 };
      counts[key][i.status]++;
    });
    const sortedKeys = Object.keys(counts).sort();
    return {
      labels: sortedKeys,
      datasets: [
        { label: 'Pool', data: sortedKeys.map(k => counts[k].pool), borderColor: '#3B82F6', backgroundColor: 'rgba(59, 130, 246, 0.2)', fill: true },
        { label: 'PIP', data: sortedKeys.map(k => counts[k].pip), borderColor: '#F59E0B', backgroundColor: 'rgba(245, 158, 11, 0.2)', fill: true },
        { label: 'Deployed', data: sortedKeys.map(k => counts[k].deployed), borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.2)', fill: true },
      ],
    };
  })();

  // 2. Interns by Designation (Bar Chart)
  const internDesignationData = {
    labels: [...new Set(filteredInterns.map(i => i.designation))],
    datasets: [
      {
        label: 'Interns by Designation',
        data: [...new Set(filteredInterns.map(i => i.designation))].map(d => filteredInterns.filter(i => i.designation === d).length),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        hoverBackgroundColor: 'rgba(124, 58, 237, 0.8)',
      },
    ],
  };

  // 3. Interns by Mentor (Bar Chart)
  const mentorData = {
    labels: [...new Set(filteredInterns.map(i => i.mentor))],
    datasets: [
      {
        label: 'Interns by Mentor',
        data: [...new Set(filteredInterns.map(i => i.mentor))].map(m => filteredInterns.filter(i => i.mentor === m).length),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        hoverBackgroundColor: 'rgba22, 163, 74, 0.8)',
      },
    ],
  };

  // 4. Location Distribution (Doughnut Chart)
  const internLocationData = {
    labels: [...new Set(filteredInterns.map(i => i.location))],
    datasets: [
      {
        data: [...new Set(filteredInterns.map(i => i.location))].map(l => filteredInterns.filter(i => i.location === l).length),
        backgroundColor: ['#EF4444', '#F97316', '#FBBF24', '#34D399'],
        hoverBackgroundColor: ['#DC2626', '#EA580C', '#F59E0B', '#10B981'],
      },
    ],
  };

  return (
    <section className="bg-white p-8 rounded-xl shadow-lg">
      <div className="flex items-center mb-6">
        <FaUsers className="text-purple-600 text-3xl mr-3" />
        <h3 className="text-2xl font-semibold text-gray-800">Intern Analytics</h3>
      </div>
      <div className="mb-6 flex space-x-4">
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className="p-2 border rounded"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Status Chart */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Intern Status Over Time</h4>
          <p className="text-sm text-gray-600 mb-4">Number of interns in Pool, PIP, or Deployed status between selected dates.</p>
          <div className="relative h-80"><Line data={internStatusData} options={lineOptions} /></div>
        </div>
        {/* Designation Chart */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Interns by Designation</h4>
          <p className="text-sm text-gray-600 mb-4">Interns joined by designation between selected dates.</p>
          <div className="relative h-80"><Bar data={internDesignationData} options={barOptions} /></div>
        </div>
        {/* Mentor Chart */}
        <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Interns by Mentor</h4>
          <p className="text-sm text-gray-600 mb-4">Number of interns assigned to each mentor.</p>
          <div className="relative h-80"><Bar data={mentorData} options={barOptions} /></div>
        </div>
        {/* Location Chart */}
        <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Location Distribution</h4>
          <p className="text-sm text-gray-600 mb-4">Distribution of interns across locations.</p>
          <div className="relative h-80"><Doughnut data={internLocationData} options={chartOptions} /></div>
        </div>
      </div>
    </section>
  );
};

export default InternAnalytics;