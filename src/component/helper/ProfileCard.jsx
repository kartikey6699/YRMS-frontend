import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import backgroundImage from '../../assets/images/Profile/ProfileBg2.jpg';
import boyImage from '../../assets/images/Profile/boy.png';
import { fetchResourceDetails } from '../../features/resource/resourceAction';

const ProfileCard = ({ publicId }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const dispatch = useDispatch();
  const { resourceDetails, loading, error } = useSelector((state) => state.resource);

  // Fetch resource details when component mounts or publicId changes
  useEffect(() => {
    if (publicId) {
      dispatch(fetchResourceDetails(publicId));
    }
  }, [publicId, dispatch]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format joining date if it exists
  const formattedJoiningDate = resourceDetails?.joiningDate 
    ? new Date(resourceDetails.joiningDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Not available';

  const formattedTime = currentTime.toLocaleString('en-US', {
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  if (loading) {
    return (
      <div className="relative w-full h-48 rounded-t-xl mb-10 bg-gray-200 animate-pulse">
        <div className="absolute top-0 left-0 w-full h-full flex items-center p-6">
          <div className="w-24 h-24 rounded-full bg-gray-300"></div>
          <div className="ml-6 space-y-2">
            <div className="h-6 w-48 bg-gray-300 rounded"></div>
            <div className="h-4 w-32 bg-gray-300 rounded"></div>
            <div className="h-4 w-40 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full h-48 rounded-t-xl mb-10 bg-red-50 border border-red-200 flex items-center justify-center">
        <p className="text-red-600">Error loading profile: {error}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-48 rounded-t-xl mb-10">
      <img
        src={backgroundImage}
        className="w-full h-48 object-cover rounded-t-xl"
        alt="Background"
      />

      <div className="absolute top-0 left-0 w-full h-full flex items-center p-6">
        <div className="relative">
          <img
            src={boyImage}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white"
          />
        </div>

        <div className="ml-6 text-white">
          <h2 className="text-2xl font-semibold flex items-center">
            {resourceDetails?.employeeName || 'Unknown Employee'}
          </h2>
          <p className="text-sm">Employee ID: {resourceDetails?.employeeId || 'N/A'}</p>
          <p className="text-sm">Designation: {resourceDetails?.designation || 'N/A'}</p>
          <p className="text-sm">
            Business Unit: {resourceDetails?.businessUnit || 'N/A'} 
            ({resourceDetails?.businessGroup || 'N/A'})
          </p>
          <p className="text-sm">Location: {resourceDetails?.location || 'N/A'}</p>
          <p className="text-sm">Local time: {formattedTime}</p>
          <p className="text-sm">Phone: {resourceDetails?.phoneNumber || 'N/A'}</p>
          <p className="text-sm">Email: {resourceDetails?.email || 'N/A'}</p>
          <p className="text-sm">Status: {resourceDetails?.status || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;