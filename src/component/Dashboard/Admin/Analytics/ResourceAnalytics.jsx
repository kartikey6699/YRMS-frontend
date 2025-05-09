import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Pie, Bar, Doughnut } from 'react-chartjs-2';
import { FaChartPie } from 'react-icons/fa';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { fetchResourceAnalytics } from '../../../../features/analytics/analyticsAction';

// Register Chart.js components and plugins
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

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

const ResourceAnalytics = () => {
  const dispatch = useDispatch();
  const { resourceData, loading, error } = useSelector((state) => state.analytics);
  
  // Date states for Designation chart
  const [designationStartDate, setDesignationStartDate] = useState('');
  const [designationEndDate, setDesignationEndDate] = useState('');

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchResourceAnalytics());
  }, [dispatch]);

  // Reset date filters
  const resetDesignationDates = () => {
    setDesignationStartDate('');
    setDesignationEndDate('');
  };

  // Filtered resources for Designation chart
  const designationResources = filterByDateRange(
    resourceData.designationDistribution || [],
    designationStartDate,
    designationEndDate,
    'joiningDate'
  );

  // 1. Deployment Status (Bar Chart)
  const statusData = {
    labels: ['Pool', 'PIP', 'Deployed'],
    datasets: [
      {
        label: 'Resources by Status',
        data: [
          resourceData.deploymentStatus?.pool || 0,
          resourceData.deploymentStatus?.pip || 0,
          resourceData.deploymentStatus?.deployed || 0,
        ],
        backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(16, 185, 129, 0.8)'],
        hoverBackgroundColor: ['rgba(37, 99, 235, 0.8)', 'rgba(217, 119, 6, 0.8)', 'rgba(5, 150, 105, 0.8)'],
      },
    ],
  };

  // 2. Designation Distribution (Bar Chart)
  const designationData = {
    labels: [...new Set(designationResources.map(r => r.designation))],
    datasets: [
      {
        label: 'Resources by Designation',
        data: [...new Set(designationResources.map(r => r.designation))].map(
          d => designationResources.filter(r => r.designation === d).length
        ),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        hoverBackgroundColor: 'rgba(124, 58, 237, 0.8)',
      },
    ],
  };

  // 3. Experience Deployment (Stacked Bar Chart)
  const experienceData = {
    labels: Object.keys(resourceData.experienceDeployment || {}),
    datasets: [
      {
        label: 'Available',
        data: Object.values(resourceData.experienceDeployment || {}).map(e => e.available),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        hoverBackgroundColor: 'rgba(37, 99, 235, 0.8)',
      },
      {
        label: 'Deployed',
        data: Object.values(resourceData.experienceDeployment || {}).map(e => e.deployed),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        hoverBackgroundColor: 'rgba(5, 150, 105, 0.8)',
      },
    ],
  };

  // 4. Location Distribution (Doughnut Chart)
  const locationData = {
    labels: Object.keys(resourceData.locationDistribution || {}),
    datasets: [
      {
        data: Object.values(resourceData.locationDistribution || {}),
        backgroundColor: ['#EF4444', '#F97316', '#FBBF24', '#34D399', '#3B82F6'],
        hoverBackgroundColor: ['#DC2626', '#EA580C', '#F59E0B', '#10B981', '#2563EB'],
      },
    ],
  };

  // 5. Employment Type Distribution (Pie Chart)
  const employmentTypeData = {
    labels: Object.keys(resourceData.employmentTypeDistribution || {}),
    datasets: [
      {
        data: Object.values(resourceData.employmentTypeDistribution || {}),
        backgroundColor: ['#10B981', '#3B82F6', '#F59E0B'],
        hoverBackgroundColor: ['#059669', '#2563EB', '#D97706'],
      },
    ],
  };

  // 6. Rating Distribution (Bar Chart)
  const ratingData = {
    labels: Object.keys(resourceData.ratingDistribution || {}),
    datasets: [
      {
        label: 'Resources by Rating',
        data: Object.values(resourceData.ratingDistribution || {}),
        backgroundColor: 'rgba(249, 115, 22, 0.8)',
        hoverBackgroundColor: 'rgba(234, 88, 12, 0.8)',
      },
    ],
  };

  // 7. Interview Performance (Bar Chart)
  const interviewData = {
    labels: ['Total', 'Cleared', 'Rejected'],
    datasets: [
      {
        label: 'Interview Performance',
        data: [
          resourceData.interviewPerformance?.total || 0,
          resourceData.interviewPerformance?.cleared || 0,
          resourceData.interviewPerformance?.rejected || 0,
        ],
        backgroundColor: ['rgba(107, 114, 128, 0.8)', 'rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.8)'],
        hoverBackgroundColor: ['rgba(75, 85, 99, 0.8)', 'rgba(22, 163, 74, 0.8)', 'rgba(220, 38, 38, 0.8)'],
      },
    ],
  };

  // Handle loading and error states
  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">Error: {error}</div>;
  }

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
          <h4 className="text-lg font-medium text-gray-700 mb-2">Resources by Designation</h4>
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
          <p className="text-sm text-gray-600 mb-4">Resources by experience level, showing available and deployed.</p>
          <div className="relative h-80"><Bar data={experienceData} options={{ ...barOptions, plugins: { ...barOptions.plugins, legend: { display: true } } }} /></div>
        </div>
        {/* Location Chart */}
        <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-lg shadow-md">
          <h4 className="text-lg: ; font-medium text-gray-700 mb-2">Location Distribution</h4>
          <p className="text-sm text-gray-600 mb-4">Distribution of resources across locations.</p>
          <div className="relative h-80"><Doughnut data={locationData} options={chartOptions} /></div>
        </div>
        {/* Employment Type Chart */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Employment Type Distribution</h4>
          <p className="text-sm text-gray-600 mb-4">Resources by employment type (Probation, Permanent, Contract).</p>
          <div className="relative h-80"><Pie data={employmentTypeData} options={chartOptions} /></div>
        </div>
        {/* Rating Chart */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Rating Distribution</h4>
          <p className="text-sm text-gray-600 mb-4">Resources by performance rating.</p>
          <div className="relative h-80"><Bar data={ratingData} options={barOptions} /></div>
        </div>
        {/* Interview Performance Chart */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Interview Performance</h4>
          <p className="text-sm text-gray-600 mb-4">Total, cleared, and rejected interviews.</p>
          <div className="relative h-80"><Bar data={interviewData} options={barOptions} /></div>
        </div>
      </div>
    </section>
  );
};

export default ResourceAnalytics;