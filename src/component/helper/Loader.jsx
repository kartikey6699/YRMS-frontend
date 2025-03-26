// LOADER 1

import React from 'react';

const YRMSLoader = ({ loadingMessage = "Loading ..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30">
      <div className="relative w-full max-w-md px-4 py-8 rounded-xl bg-white/80 shadow-xl">
        {/* YRMS Text Logo with gradient */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-400">
            YRMS
          </h1>
          <p className="mt-2 text-gray-600">Resource Management System</p>
        </div>

        {/* Animated loading bars */}
        <div className="flex justify-center space-x-2 h-2">
          <div className="w-2 h-8 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-8 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-8 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          <div className="w-2 h-8 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          <div className="w-2 h-8 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        </div>

        {/* Circular progress indicator */}
        {/* <div className="mt-12 flex justify-center">
          <div className="relative w-16 h-16"                                   >
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        </div> */}

        {/* Optional status text */}
        <p className="mt-6 text-center text-gray-700">{loadingMessage}</p>
      </div>
    </div>
  );
};

export default YRMSLoader;


// LOADER 2


// import React from 'react';

// const YRMSLoader = () => {
//   return (
//     <div className="fixed inset-0 z-50 pointer-events-none">
//       <div className="absolute inset-0 backdrop-blur-sm bg-white/30"></div>
//       <div className="relative z-60 flex items-center justify-center h-full">
//         <div className="text-center">
//           {/* Animated YRMS Text */}
//           <div className="flex justify-center mb-4 space-x-1">
//             {['Y', 'R', 'M', 'S'].map((letter, index) => (
//               <div 
//                 key={letter}
//                 className={`text-4xl font-bold text-blue-800 
//                   animate-bounce 
//                   ${['delay-100', 'delay-200', 'delay-300', 'delay-400'][index]}`}
//                 style={{ animationDelay: `${(index + 1) * 100}ms` }}
//               >
//                 {letter}
//               </div>
//             ))}
//           </div>

//           {/* Loading Spinner */}
//           <div className="relative w-16 h-16 mx-auto">
//             <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-spin"></div>
//             <div className="absolute inset-0 border-t-4 border-blue-600 rounded-full animate-spin"></div>
            
//             {/* Inner Circles */}
//             <div className="absolute w-10 h-10 top-3 left-3 border-4 border-blue-100 rounded-full animate-pulse"></div>
//           </div>

//           {/* Loading Text */}
//           <p className="mt-4 text-base font-semibold text-blue-900 animate-pulse">
//             Loading YRMS Resources...
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default YRMSLoader;



// LOADER 3

// import React from 'react';

// const YRMSLoader = () => {
//   return (
//     <div 
//       className="fixed inset-0 flex flex-col justify-center items-center z-[9999] backdrop-blur-md bg-black bg-opacity-40" 
//       role="status" 
//       aria-live="polite"
//     >
//       <h2 className="text-white text-5xl font-bold mb-5 animate-pulse">YRMS</h2>
//       <svg className="w-[200px] h-[200px]" viewBox="0 0 100 100">
//         <circle cx="50" cy="50" r="10" fill="#3498db" />
//         <circle cx="20" cy="20" r="5" fill="#3498db" />
//         <circle cx="20" cy="80" r="5" fill="#3498db" />
//         <circle cx="80" cy="20" r="5" fill="#3498db" />
//         <circle cx="80" cy="80" r="5" fill="#3498db" />
//         <line x1="50" y1="50" x2="20" y2="20" stroke="#3498db" strokeWidth="2" />
//         <line x1="50" y1="50" x2="20" y2="80" stroke="#3498db" strokeWidth="2" />
//         <line x1="50" y1="50" x2="80" y2="20" stroke="#3498db" strokeWidth="2" />
//         <line x1="50" y1="50" x2="80" y2="80" stroke="#3498db" strokeWidth="2" />
//         <circle r="3" fill="#ecf0f1">
//           <animateMotion dur="2s" repeatCount="indefinite" path="M50,50 L20,20" />
//         </circle>
//         <circle r="3" fill="#ecf0f1">
//           <animateMotion dur="2s" repeatCount="indefinite" path="M50,50 L20,80" />
//         </circle>
//         <circle r="3" fill="#ecf0f1">
//           <animateMotion dur="2s" repeatCount="indefinite" path="M50,50 L80,20" />
//         </circle>
//         <circle r="3" fill="#ecf0f1">
//           <animateMotion dur="2s" repeatCount="indefinite" path="M50,50 L80,80" />
//         </circle>
//       </svg>
//       <p className="text-white mt-5 text-lg">Loading, please wait...</p>
//     </div>
//   );
// };

// export default YRMSLoader;


// LOADER 4

// import React from 'react';

// const YRMSLoader = () => {
//   return (
//     <div className="fixed top-0 left-0 w-full h-full bg-gray-100 bg-opacity-75 flex items-center justify-center z-50">
//       <div className="flex space-x-4">
//         {['Y', 'R', 'M', 'S'].map((letter, index) => (
//           <div
//             key={index}
//             className="text-3xl font-bold text-indigo-600"
//             style={{
//               animationName: `bounce-${index + 1}`,
//               animationDuration: '0.6s',
//               animationTimingFunction: 'ease-in-out',
//               animationIterationCount: 'infinite',
//               animationDelay: `${index * 0.15}s`,
//             }}
//           >
//             {letter}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default YRMSLoader;
