// AttendanceDetailsModal.js
import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaUser, FaEnvelope, FaIdCard, FaCheck, FaTimes } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch } from 'react-redux';
import { fetchProgramAttendance, createTrainingAttendance } from '../../../../features/program/programAction'; 
import YRMSLoader from '../../../helper/Loader';
import { SuccessToast, ErrorToast } from '../../../helper/ResourceToast';

const AttendanceDetailsModal = ({ onClose, training }) => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const [trainingDates, setTrainingDates] = useState([]);
  const [holidays, setHolidays] = useState([
    '2025-04-01', // Independence Day
    '2025-04-08'
  ]);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState('success');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (training) {
      fetchAttendanceData();
      generateTrainingDates();
    }
  }, [training, dispatch]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const action = await dispatch(fetchProgramAttendance(training.id));
      if (action.meta.requestStatus === 'fulfilled') {
        const dataWithIds = action.payload.map(item => ({
          ...item,
          uniqueId: item.participantTrainingId || `${item.empId}-${Date.now()}`,
          present: item.isPresent,
          reason: item.absenceReason || ''
        }));
        setAttendanceData(dataWithIds);
      } else {
        showErrorToast('Failed to load attendance data');
      }
    } catch (error) {
      showErrorToast('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const generateTrainingDates = () => {
    const startDate = new Date(training.startDate);
    const endDate = new Date(training.endDate);
    const today = new Date();
    const effectiveEndDate = endDate > today ? today : endDate;
    
    const dates = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= effectiveEndDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    setTrainingDates(dates);
    
    if (selectedDate < startDate || selectedDate > effectiveEndDate) {
      setSelectedDate(dates[0] || new Date());
    }
  };

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

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 200);
  };

  const handleAttendanceChange = (uniqueId, field, value) => {
    setAttendanceData(attendanceData.map(item => 
      item.uniqueId === uniqueId
        ? { 
            ...item, 
            [field]: value,
            ...(field === 'present' && !value ? { reason: '' } : {})
          }
        : item
    ));
  };

  const isHoliday = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const holidayStrs = holidays.map(holiday => new Date(holiday).toISOString().split('T')[0]);
    return holidayStrs.includes(dateStr);
  };

  const isWeekend = (date) => {
    return date.getDay() === 0 || date.getDay() === 6;
  };

  const filterTrainingDate = (date) => {
    return trainingDates.some(d => 
      d.getDate() === date.getDate() && 
      d.getMonth() === date.getMonth() && 
      d.getFullYear() === date.getFullYear()
    ) && !isWeekend(date) && !isHoliday(date);
  };

  const DayComponent = ({ date }) => {
    const weekend = isWeekend(date);
    const holiday = isHoliday(date);
    const isTrainingDate = trainingDates.some(d => 
      d.getDate() === date.getDate() && 
      d.getMonth() === date.getMonth() && 
      d.getFullYear() === date.getFullYear()
    );

    let dayClass = '';
    if (isTrainingDate) {
      if (holiday) {
        dayClass = 'bg-yellow-100 text-yellow-700 cursor-not-allowed';
      } else if (weekend) {
        dayClass = 'bg-gray-200 text-gray-400 cursor-not-allowed';
      } else {
        dayClass = 'bg-red-100 text-red-700';
      }
    }

    return (
      <div className={`react-datepicker__day ${dayClass} ${holiday || weekend ? 'opacity-80' : ''}`}>
        {date.getDate()}
      </div>
    );
  };

  const handleSaveAttendance = async () => {
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
      } else {
        showErrorToast('Failed to save attendance');
      }
    } catch (error) {
      showErrorToast('Failed to save attendance');
    } finally {
      setLoading(false);
    }
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
                onChange={date => setSelectedDate(date)}
                className="bg-purple-700 border-none text-white rounded px-2 py-1 focus:outline-none"
                dateFormat="MMMM d, yyyy"
                filterDate={filterTrainingDate}
                includeDates={trainingDates}
                maxDate={new Date()}
                placeholderText="Select training date"
                renderDayContents={(day, date) => (
                  <DayComponent date={date} />
                )}
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
                <span>Training Dates: {new Date(training.startDate).toLocaleDateString()} to {new Date(training.endDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-red-600 mt-1">
                <div className="w-4 h-4 bg-red-100 mr-2 border border-red-300"></div>
                <span>Training days (Mon-Fri)</span>
              </div>
              <div className="flex items-center text-yellow-600 mt-1">
                <div className="w-4 h-4 bg-yellow-100 mr-2 border border-yellow-300"></div>
                <span>Holidays</span>
              </div>
              <div className="flex items-center text-gray-600 mt-1">
                <div className="w-4 h-4 bg-gray-200 mr-2 border border-gray-300"></div>
                <span>Weekends (Sat-Sun)</span>
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
                    />
                  )}
                </div>
              </div>
            ))}
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
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              Save Attendance
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AttendanceDetailsModal;