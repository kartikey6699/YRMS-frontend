import React, { useState } from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { FaChartBar } from 'react-icons/fa';
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
const trainingPrograms = [
  { id: 1, name: 'React Training', type: 'Training', technology: 'React', status: 'Running', startDate: '2023-01-10', endDate: '2023-03-10', requester: 'HR' },
  { id: 2, name: 'Python Upskilling', type: 'Upskilling', technology: 'Python', status: 'Completed', startDate: '2023-02-15', endDate: '2023-04-15', requester: 'Tech Lead' },
  { id: 3, name: 'Java Training', type: 'Training', technology: 'Java', status: 'Running', startDate: '2023-03-01', endDate: '2023-05-01', requester: 'HR' },
  { id: 4, name: 'Data Science Upskilling', type: 'Upskilling', technology: 'Python', status: 'Completed', startDate: '2023-04-10', endDate: '2023-06-10', requester: 'Manager' },
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

const TrainingAnalytics = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredPrograms = filterByDateRange(trainingPrograms, startDate, endDate, 'startDate');

  // 1. Programs Status Over Time (Line Chart)
  const programStatusData = (() => {
    const counts = {};
    filteredPrograms.forEach(p => {
      const date = new Date(p.startDate);
      const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      counts[key] = counts[key] || { running: 0, completed: 0 };
      counts[key][p.status.toLowerCase()]++;
    });
    const sortedKeys = Object.keys(counts).sort();
    return {
      labels: sortedKeys,
      datasets: [
        { label: 'Running', data: sortedKeys.map(k => counts[k].running || 0), borderColor: '#3B82F6', backgroundColor: 'rgba(59, 130, 246, 0.2)', fill: true },
        { label: 'Completed', data: sortedKeys.map(k => counts[k].completed || 0), borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.2)', fill: true },
      ],
    };
  })();

  // 2. Programs by Technology (Pie Chart)
  const programTechData = {
    labels: [...new Set(filteredPrograms.map(p => p.technology))],
    datasets: [
      {
        data: [...new Set(filteredPrograms.map(p => p.technology))].map(t => filteredPrograms.filter(p => p.technology === t).length),
        backgroundColor: ['#EF4444', '#3B82F6', '#FBBF24'],
        hoverBackgroundColor: ['#DC2626', '#2563EB', '#F59E0B'],
      },
    ],
  };

  // 3. Programs Started (Bar Chart)
  const programStartData = {
    labels: [...new Set(filteredPrograms.map(p => p.type))],
    datasets: [
      {
        label: 'Programs Started',
        data: [...new Set(filteredPrograms.map(p => p.type))].map(t => filteredPrograms.filter(p => p.type === t).length),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        hoverBackgroundColor: 'rgba(22, 163, 74, 0.8)',
      },
    ],
  };

  // 4. Programs by Requester (Bar Chart)
  const programRequesterData = {
    labels: [...new Set(filteredPrograms.map(p => p.requester))],
    datasets: [
      {
        label: 'Programs Requested',
        data: [...new Set(filteredPrograms.map(p => p.requester))].map(r => filteredPrograms.filter(p => p.requester === r).length),
        backgroundColor: 'rgba(249, 115, 22, 0.8)',
        hoverBackgroundColor: 'rgba(234, 88, 12, 0.8)',
      },
    ],
  };

  return (
    <section className="bg-white p-8 rounded-xl shadow-lg">
      <div className="flex items-center mb-6">
        <FaChartBar className="text-green-600 text-3xl mr-3" />
        <h3 className="text-2xl font-semibold text-gray-800">Training & Upskilling Analytics</h3>
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
        {/* Program Status Chart */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Program Status Over Time</h4>
          <p className="text-sm text-gray-600 mb-4">Number of training/upskilling programs running or completed between selected dates.</p>
          <div className="relative h-80"><Line data={programStatusData} options={lineOptions} /></div>
        </div>
        {/* Technology Chart */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Programs by Technology</h4>
          <p className="text-sm text-gray-600 mb-4">Distribution of programs by technology focus.</p>
          <div className="relative h-80"><Pie data={programTechData} options={chartOptions} /></div>
        </div>
        {/* Programs Started Chart */}
        <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Programs Started</h4>
          <p className="text-sm text-gray-600 mb-4">Number of training/upskilling programs started.</p>
          <div className="relative h-80"><Bar data={programStartData} options={barOptions} /></div>
        </div>
        {/* Requester Chart */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Programs by Requester</h4>
          <p className="text-sm text-gray-600 mb-4">Programs requested by different stakeholders.</p>
          <div className="relative h-80"><Bar data={programRequesterData} options={barOptions} /></div>
        </div>
      </div>
    </section>
  );
};

export default TrainingAnalytics;