import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Bar, Line } from 'react-chartjs-2';
import { FaChartBar } from 'react-icons/fa';
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { fetchTrainingAnalytics } from '../../../../features/analytics/analyticsAction';

// Register Chart.js components
ChartJS.register(BarElement, LineElement, CategoryScale, LinearScale, Tooltip, Legend);

// Filter Data by Date Range
const filterByDateRange = (data, startDate, endDate, dateField) => {
  if (!startDate) return data; // Only startDate is required for filtering
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date(); // Use current date if endDate is empty
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
    legend: { display: true },
  },
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
  const dispatch = useDispatch();
  const { trainingData, loading, error } = useSelector((state) => state.analytics);
  
  // State for toggles and date filters
  const [statusFilter, setStatusFilter] = useState('All'); // All, Training, Upskilling
  const [requesterFilter, setRequesterFilter] = useState('All'); // All, Training, Upskilling
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchTrainingAnalytics());
  }, [dispatch]);

  // Reset date filters
  const resetDates = () => {
    setStartDate('');
    setEndDate('');
  };

  // Filtered programs for Start Trends chart
  const filteredPrograms = filterByDateRange(trainingData.startTrends || [], startDate, endDate, 'startDate');

  // 1. Program Status (Bar Chart)
  const programStatusData = (() => {
    const statuses = ['Running', 'Hold', 'Pending'];
    const training = trainingData.programStatus?.Training || {};
    const upskilling = trainingData.programStatus?.Upskilling || {};
    
    const data = statuses.map(status => {
      if (statusFilter === 'Training') {
        return training[status] || 0;
      } else if (statusFilter === 'Upskilling') {
        return upskilling[status] || 0;
      } else {
        return (training[status] || 0) + (upskilling[status] || 0);
      }
    });

    return {
      labels: statuses,
      datasets: [
        {
          label: `Program Status (${statusFilter})`,
          data,
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          hoverBackgroundColor: 'rgba(37, 99, 235, 0.8)',
        },
      ],
    };
  })();

  // 2. Program Starts Over Time (Line Chart)
  const programStartData = (() => {
    const counts = {};
    filteredPrograms.forEach(p => {
      const date = new Date(p.startDate);
      const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      counts[key] = (counts[key] || 0) + 1; // Combine Training and Upskilling
    });
    const sortedKeys = Object.keys(counts).sort();
    return {
      labels: sortedKeys,
      datasets: [
        {
          label: 'Programs Started',
          data: sortedKeys.map(k => counts[k] || 0),
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          fill: true,
        },
      ],
    };
  })();

  // 3. Requesters (Bar Chart)
  const requesterData = (() => {
    const requesters = [...new Set([
      ...(Object.keys(trainingData.requesters?.Training || {})),
      ...(Object.keys(trainingData.requesters?.Upskilling || {})),
    ])];
    const training = trainingData.requesters?.Training || {};
    const upskilling = trainingData.requesters?.Upskilling || {};

    const data = requesters.map(requester => {
      if (requesterFilter === 'Training') {
        return training[requester] || 0;
      } else if (requesterFilter === 'Upskilling') {
        return upskilling[requester] || 0;
      } else {
        return (training[requester] || 0) + (upskilling[requester] || 0);
      }
    });

    return {
      labels: requesters,
      datasets: [
        {
          label: `Programs Requested (${requesterFilter})`,
          data,
          backgroundColor: 'rgba(249, 115, 22, 0.8)',
          hoverBackgroundColor: 'rgba(234, 88, 12, 0.8)',
        },
      ],
    };
  })();

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
        <FaChartBar className="text-green-600 text-3xl mr-3" />
        <h3 className="text-2xl font-semibold text-gray-800">Training & Upskilling Analytics</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Program Status Chart */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Program Status</h4>
          <p className="text-sm text-gray-600 mb-4">Status of training and upskilling programs (Running, Hold, Pending).</p>
          <div className="flex space-x-4 mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="All"
                checked={statusFilter === 'All'}
                onChange={() => setStatusFilter('All')}
                className="form-radio"
              />
              <span>All</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="Training"
                checked={statusFilter === 'Training'}
                onChange={() => setStatusFilter('Training')}
                className="form-radio"
              />
              <span>Training</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="Upskilling"
                checked={statusFilter === 'Upskilling'}
                onChange={() => setStatusFilter('Upskilling')}
                className="form-radio"
              />
              <span>Upskilling</span>
            </label>
          </div>
          <div className="relative h-80"><Bar data={programStatusData} options={barOptions} /></div>
        </div>
        {/* Program Starts Chart */}
        <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Program Starts Over Time</h4>
          <p className="text-sm text-gray-600 mb-4">Number of training/upskilling programs started between selected dates.</p>
          <div className="flex space-x-4 mb-4">
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
            <button
              onClick={resetDates}
              className="p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Reset
            </button>
          </div>
          <div className="relative h-80"><Line data={programStartData} options={lineOptions} /></div>
        </div>
        {/* Requester Chart */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Programs by Requester</h4>
          <p className="text-sm text-gray-600 mb-4">Programs requested by different stakeholders.</p>
          <div className="flex space-x-4 mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="All"
                checked={requesterFilter === 'All'}
                onChange={() => setRequesterFilter('All')}
                className="form-radio"
              />
              <span>All</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="Training"
                checked={requesterFilter === 'Training'}
                onChange={() => setRequesterFilter('Training')}
                className="form-radio"
              />
              <span>Training</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="Upskilling"
                checked={requesterFilter === 'Upskilling'}
                onChange={() => setRequesterFilter('Upskilling')}
                className="form-radio"
              />
              <span>Upskilling</span>
            </label>
          </div>
          <div className="relative h-80"><Bar data={requesterData} options={barOptions} /></div>
        </div>
      </div>
    </section>
  );
};

export default TrainingAnalytics;