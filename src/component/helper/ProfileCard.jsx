import React, { useState, useEffect } from 'react';
import backgroundImage from '../../assets/images/Profile/ProfileBg2.jpg';
import boyImage from '../../assets/images/Profile/boy.png';

const ProfileCard = ({ employeeName, competency }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleString('en-US', {
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  // Safeguard employeeName
  const safeEmployeeName = employeeName || 'Unknown Employee';

  return (
    <div className="relative w-full h-48 rounded-t-xl mb-10">
      {/* Background Image */}
      <img
        src={backgroundImage}
        className="w-full h-48 object-cover rounded-t-xl"
        alt="Background"
      />

      {/* Content */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center p-6">
        {/* Avatar */}
        <div className="relative">
          <img
            src={boyImage}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white"
          />
        </div>

        {/* Employee Details */}
        <div className="ml-6 text-white">
          <h2 className="text-2xl font-semibold flex items-center">
            {safeEmployeeName}
          </h2>
          <p className="text-sm">Software Engineer</p>
          <p className="text-sm">Business Unit 5 (BG4-BU5)</p>
          <p className="text-sm">INDORE-YASH IT PARK-SC-DC (104)</p>
          <p className="text-sm">Local time: {formattedTime}</p>
          <p className="text-sm">Cell Phone: (91) 9999988888</p>
          <p className="text-sm">{`${safeEmployeeName.toLowerCase().replace(' ', '.')}@yash.com`}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;