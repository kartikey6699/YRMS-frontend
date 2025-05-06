import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FaCalendarAlt, FaUser, FaEnvelope, FaIdCard, FaTimes } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch } from 'react-redux';
import { fetchProgramAttendance, createTrainingAttendance } from '../../../../features/program/programAction'; 
import YRMSLoader from '../../../helper/Loader';
import { SuccessToast, ErrorToast } from '../../../helper/ResourceToast';

const AttendanceDetailsModal = ({ onClose, training }) => {
  const dispatch = useDispatch();
  const [attendanceData, setAttendanceData] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const [holidays] = useState(['2025-04-01', '2025-04-08']);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState('success');
  const [toastMessage, setToastMessage] = useState('');

  // Calculate date boundaries
  const { startDate, endDate, effectiveEndDate, maxAllowedDate, minAllowedDate } = useMemo(() => {
    if (!training) return {};
    const today = new Date();
    const start = new Date(training.startDate);
    const end = new Date(training.endDate);
    const effectiveEnd = end > today ? today : end;
    
    // Calculate 7-day window
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return {
      startDate: start,
      endDate: end,
      effectiveEndDate: effectiveEnd,
      maxAllowedDate: today,
      minAllowedDate: sevenDaysAgo > start ? sevenDaysAgo : start
    };
  }, [training]);

  // Initialize selected date
  const getInitialDate = useCallback(() => {
    if (!training) return new Date();
    
    // Default to today if within allowed range
    const today = new Date();
    if (today >= minAllowedDate && today <= effectiveEndDate) {
      return today;
    }
    
    // Otherwise use the most recent allowed date
    return effectiveEndDate > minAllowedDate ? effectiveEndDate : minAllowedDate;
  }, [training, minAllowedDate, effectiveEndDate]);

  const [selectedDate, setSelectedDate] = useState(getInitialDate());

  // Generate valid training dates
  const generateTrainingDates = useCallback(() => {
    if (!training) return [];
    
    const dates = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= effectiveEndDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  }, [training, startDate, effectiveEndDate]);

  const trainingDates = generateTrainingDates();

  // Check if date is within allowed range
  const isDateAllowed = useCallback((date) => {
    return date >= minAllowedDate && date <= maxAllowedDate;
  }, [minAllowedDate, maxAllowedDate]);

  // Check if date is within training period
  const isDateInTrainingPeriod = useCallback((date) => {
    return date >= startDate && date <= endDate;
  }, [startDate, endDate]);

  // Check if selected date is a training date
  const isSelectedDateTrainingDate = useMemo(() => {
    return trainingDates.some(date => 
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  }, [selectedDate, trainingDates]);

  // Fetch attendance data when date changes
  useEffect(() => {
    if (training && isDateAllowed(selectedDate)) {
      fetchAttendanceData();
    }
  }, [selectedDate, training]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const action = await dispatch(
        fetchProgramAttendance({ 
          programId: training.id, 
          attendanceDate: selectedDate.toISOString().slice(0, 10) 
        })
      );
      
      if (action.meta.requestStatus === 'fulfilled') {
        const dataWithIds = action.payload.map(item => ({
          ...item,
          uniqueId: item.participantTrainingId || `${item.empId}-${Date.now()}`,
          present: item.isPresent,
          reason: item.absenceReason || ''
        }));
        setAttendanceData(dataWithIds);
      }
    } catch (error) {
      showErrorToast('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  // Toast helpers
  const showSuccessToast = (message) => {
    setToastType('success');
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const showErrorToast = (message) => {
    setToastType('error');
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // Date validation helpers
  const isHoliday = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return holidays.some(holiday => new Date(holiday).toISOString().split('T')[0] === dateStr);
  };

  const isWeekend = (date) => {
    return date.getDay() === 0 || date.getDay() === 6;
  };

  const filterTrainingDate = (date) => {
    return trainingDates.some(d => d.getTime() === date.getTime()) && 
           !isWeekend(date) && 
           !isHoliday(date);
  };

  // Custom Day Component with proper highlighting
  const DayComponent = React.memo(({ date }) => {
    const day = date.getDate();
    const weekend = isWeekend(date);
    const holiday = isHoliday(date);
    const isTrainingDate = trainingDates.some(d => d.getTime() === date.getTime());
    const isAllowed = isDateAllowed(date);
    const isSelected = selectedDate && date.getTime() === selectedDate.getTime();

    let dayClass = 'rounded-full w-6 h-6 flex items-center justify-center';
    
    if (isSelected) {
      dayClass += ' bg-blue-500 text-white';
    } else if (isTrainingDate) {
      if (!isAllowed) {
        dayClass += ' bg-gray-100 text-gray-400';
      } else if (holiday) {
        dayClass += ' bg-yellow-100 text-yellow-700';
      } else if (weekend) {
        dayClass += ' bg-gray-200 text-gray-400';
      } else {
        dayClass += ' bg-red-100 text-red-700';
      }
    }

    return (
      <div className={dayClass}>
        {day}
      </div>
    );
  });

  // Attendance handlers
  const handleAttendanceChange = (uniqueId, field, value) => {
    setAttendanceData(prev => prev.map(item => 
      item.uniqueId === uniqueId
        ? { 
            ...item, 
            [field]: value,
            ...(field === 'present' && !value ? { reason: '' } : {})
          }
        : item
    ));
  };

  const handleSaveAttendance = async () => {
    if (!isDateAllowed(selectedDate)) {
      showErrorToast("You can only update attendance for the last 7 days");
      return;
    }

    try {
      setLoading(true);
      const records = attendanceData.map(emp => ({
        attendance_date: selectedDate.toISOString().split('T')[0],
        is_present: emp.present,
        absence_reason: emp.present ? '' : emp.reason,
        participant_training_id: emp.participantTrainingId || emp.id
      }));

      const action = await dispatch(createTrainingAttendance({ records }));
      if (action.meta.requestStatus === 'fulfilled') {
        showSuccessToast('Attendance saved successfully!');
        setTimeout(() => handleClose(), 1000);
      }
    } catch (error) {
      showErrorToast('Failed to save attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date) => {
    if (isDateAllowed(date)) {
      setSelectedDate(date);
    } else {
      showErrorToast("You can only update attendance for the last 7 days");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 200);
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[1000]">
          <YRMSLoader loadingMessage="Processing attendance data..." />
        </div>
      )}
      
      {showToast && (
        <div className="fixed top-4 right-4 z-[1001]">
          {toastType === 'success' ? 
            <SuccessToast message={toastMessage} onClose={() => setShowToast(false)} /> : 
            <ErrorToast message={toastMessage} onClose={() => setShowToast(false)} />
          }
        </div>
      )}
      
      <div className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div 
          className={`bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden transform transition-all duration-200 ${isOpen ? 'scale-100' : 'scale-95'} border-2 border-purple-200`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
            <h3 className="text-xl font-bold">
              <FaUser className="inline mr-2" />
              Attendance Details - {training?.name}
            </h3>
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2" />
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                className="bg-purple-700 border-none text-white rounded px-2 py-1 focus:outline-none"
                dateFormat="MMMM d, yyyy"
                filterDate={filterTrainingDate}
                includeDates={trainingDates}
                minDate={minAllowedDate}
                maxDate={maxAllowedDate}
                placeholderText="Select training date"
                renderDayContents={(day, date) => <DayComponent date={date} />}
              />
              <button 
                onClick={handleClose}
                className="ml-4 text-white hover:text-purple-200 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
          </div>
          
          <div className="p-4 overflow-y-auto max-h-[70vh]">
            <div className="mb-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <div className="flex items-center text-yellow-800">
                <FaCalendarAlt className="mr-2" />
                <span>Training Period: {startDate?.toLocaleDateString()} to {endDate?.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-red-600 mt-1">
                <div className="w-4 h-4 bg-red-100 rounded-full mr-2 border border-red-300"></div>
                <span>Training days (Mon-Fri)</span>
              </div>
              <div className="flex items-center text-yellow-600 mt-1">
                <div className="w-4 h-4 bg-yellow-100 rounded-full mr-2 border border-yellow-300"></div>
                <span>Holidays</span>
              </div>
              <div className="flex items-center text-gray-600 mt-1">
                <div className="w-4 h-4 bg-gray-200 rounded-full mr-2 border border-gray-300"></div>
                <span>Weekends (Sat-Sun)</span>
              </div>
              <div className="flex items-center text-blue-600 mt-1">
                <div className="w-4 h-4 bg-blue-100 rounded-full mr-2 border border-blue-300"></div>
                <span>Selected Date</span>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2 font-semibold text-sm text-purple-800 border-b pb-2 mb-2">
              <div className="col-span-1">#</div>
              <div className="col-span-2">Emp ID</div>
              <div className="col-span-2">Name</div>
              <div className="col-span-2">Email</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-4">Reason for Absence</div>
            </div>
            
            {attendanceData.map((emp, index) => (
              <div key={emp.uniqueId} className="grid grid-cols-12 gap-2 items-start py-3 border-b border-gray-100 hover:bg-purple-50">
                <div className="col-span-1 text-gray-600 mt-1">{index + 1}</div>
                <div className="col-span-2 flex items-center">
                  <FaIdCard className="text-purple-600 mr-1" />
                  {emp.empId}
                </div>
                <div className="col-span-2 mt-1">{emp.name}</div>
                <div className="col-span-2 flex items-center">
                  <FaEnvelope className="text-purple-600 mr-1" />
                  <span className="truncate">{emp.email}</span>
                </div>
                <div className="col-span-1 mt-1">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={emp.present || false}
                      onChange={(e) => handleAttendanceChange(emp.uniqueId, 'present', e.target.checked)}
                      className="form-checkbox h-4 w-4 text-purple-600 transition duration-150 ease-in-out"
                      disabled={!isDateAllowed(selectedDate)}
                    />
                    <span className="ml-2">{emp.present ? 'Present' : 'Absent'}</span>
                  </label>
                </div>
                <div className="col-span-4">
                  {!emp.present && (
                    <textarea
                      value={emp.reason || ''}
                      onChange={(e) => handleAttendanceChange(emp.uniqueId, 'reason', e.target.value)}
                      placeholder="Enter detailed reason for absence..."
                      rows={3}
                      className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-y min-h-[80px]"
                      disabled={!isDateAllowed(selectedDate)}
                    />
                  )}
                </div>
              </div>
            ))}

            {!isSelectedDateTrainingDate && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-200">
                <FaTimes className="inline mr-2" />
                This date is not part of the scheduled training dates. No attendance can be recorded.
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-3 border-t">
            <button
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAttendance}
              disabled={!isDateAllowed(selectedDate) || loading || !isSelectedDateTrainingDate}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isDateAllowed(selectedDate) && isSelectedDateTrainingDate
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'bg-purple-300 cursor-not-allowed'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors`}
            >
              {loading ? 'Saving...' : 'Save Attendance'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AttendanceDetailsModal;