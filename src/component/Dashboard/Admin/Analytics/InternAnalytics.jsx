import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import { fetchInternAnalytics } from '../../../../features/analytics/analyticsAction';

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

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

const InternAnalytics = ({ competencyId }) => {
  const dispatch = useDispatch();
  const { internData, loading, error } = useSelector((state) => state.analytics);

  // State for date filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Refs for chart instances
  const statusChartRef = useRef(null);
  const joiningChartRef = useRef(null);
  const mentorChartRef = useRef(null);
  const locationChartRef = useRef(null);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchInternAnalytics(competencyId));
  }, [dispatch, competencyId]);

  // Cleanup chart instances on unmount
  useEffect(() => {
    return () => {
      if (statusChartRef.current) {
        statusChartRef.current.destroy();
        statusChartRef.current = null;
      }
      if (joiningChartRef.current) {
        joiningChartRef.current.destroy();
        joiningChartRef.current = null;
      }
      if (mentorChartRef.current) {
        mentorChartRef.current.destroy();
        mentorChartRef.current = null;
      }
      if (locationChartRef.current) {
        locationChartRef.current.destroy();
        locationChartRef.current = null;
      }
    };
  }, []);

  // Reset date filters
  const resetDates = () => {
    setStartDate('');
    setEndDate('');
  };

  // Filtered programs for Joining Trends chart
  const filteredJoiningTrends = filterByDateRange(internData.joiningTrends || [], startDate, endDate, 'startDate');

  // 1. Status Distribution (Bar Chart)
  const statusData = {
    labels: Object.keys(internData.statusDistribution || {}),
    datasets: [
      {
        label: 'Intern Status',
        data: Object.values(internData.statusDistribution || {}),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        hoverBackgroundColor: 'rgba(37, 99, 235, 0.8)',
      },
    ],
  };

  // 2. Joining Trends (Line Chart)
  const joiningTrendsData = (() => {
    const counts = {};
    filteredJoiningTrends.forEach(j => {
      const date = new Date(j.startDate);
      const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      counts[key] = (counts[key] || 0) + 1;
    });
    const sortedKeys = Object.keys(counts).sort();
    return {
      labels: sortedKeys,
      datasets: [
        {
          label: 'Interns Joined',
          data: sortedKeys.map(k => counts[k] || 0),
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          fill: true,
        },
      ],
    };
  })();

  // 3. Mentor Distribution (Bar Chart)
  const mentorData = {
    labels: Object.keys(internData.mentorDistribution || {}),
    datasets: [
      {
        label: 'Interns by Mentor',
        data: Object.values(internData.mentorDistribution || {}),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        hoverBackgroundColor: 'rgba(22, 163, 74, 0.8)',
      },
    ],
  };

  // 4. Location Distribution (Doughnut Chart)
  const locationData = (() => {
    const locations = Object.entries(internData.locationDistribution || {})
      .filter(([_, count]) => count > 0)
      .map(([location]) => location);
    const counts = Object.values(internData.locationDistribution || {})
      .filter(count => count > 0);
    return {
      labels: locations,
      datasets: [
        {
          label: 'Interns by Location',
          data: counts,
          backgroundColor: ['#EF4444', '#F97316', '#FBBF24', '#34D399'],
          hoverBackgroundColor: ['#DC2626', '#EA580C', '#F59E0B', '#10B981'],
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
        <FaUsers className="text-purple-600 text-3xl mr-3" />
        <h3 className="text-2xl font-semibold text-gray-800">Intern Analytics</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Status Distribution Chart */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Intern Status Distribution</h4>
          <p className="text-sm text-gray-600 mb-4">Distribution of interns by status (Complete, Running, Offered, Pending, Hold).</p>
          <div className="relative h-80">
            <Bar
              data={statusData}
              options={barOptions}
              ref={(el) => {
                if (el) {
                  statusChartRef.current = el.chart;
                }
              }}
            />
          </div>
        </div>
        {/* Joining Trends Chart */}
        <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Intern Joining Trends</h4>
          <p className="text-sm text-gray-600 mb-4">Number of interns joined between selected dates.</p>
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
          <div className="relative h-80">
            <Line
              data={joiningTrendsData}
              options={lineOptions}
              ref={(el) => {
                if (el) {
                  joiningChartRef.current = el.chart;
                }
              }}
            />
          </div>
        </div>
        {/* Mentor Distribution Chart */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Interns by Mentor</h4>
          <p className="text-sm text-gray-600 mb-4">Number of interns assigned to each mentor.</p>
          <div className="relative h-80">
            <Bar
              data={mentorData}
              options={barOptions}
              ref={(el) => {
                if (el) {
                  mentorChartRef.current = el.chart;
                }
              }}
            />
          </div>
        </div>
        {/* Location Distribution Chart */}
        <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Location Distribution</h4>
          <p className="text-sm text-gray-600 mb-4">Distribution of interns across locations.</p>
          <div className="relative h-80">
            <Doughnut
              data={locationData}
              options={chartOptions}
              ref={(el) => {
                if (el) {
                  locationChartRef.current = el.chart;
                }
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default InternAnalytics;