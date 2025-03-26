import { 
    CpuChipIcon, 
    PuzzlePieceIcon, 
    XMarkIcon,
    ArrowPathIcon,
    ServerStackIcon
  } from '@heroicons/react/24/solid'
  import { useEffect } from 'react'
  
  const ResourceToast = ({ type, message, onClose }) => {
    useEffect(() => {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }, [onClose])
  
    const config = {
      success: {
        icon: <ServerStackIcon className="h-6 w-6 text-green-400" />,
        bgColor: 'bg-gradient-to-br from-green-50 to-white',
        borderColor: 'border-l-4 border-green-500',
        progressColor: 'bg-green-400',
        title: 'Success',
        decoration: (
          <div className="absolute -left-2 -top-2 h-16 w-16 rounded-full bg-green-100 opacity-30"></div>
        )
      },
      error: {
        icon: <CpuChipIcon className="h-6 w-6 text-red-500" />,
        bgColor: 'bg-gradient-to-br from-red-50 to-white',
        borderColor: 'border-l-4 border-red-500',
        progressColor: 'bg-red-400',
        title: 'Error',
        decoration: (
          <div className="absolute -right-2 -bottom-2 h-16 w-16 rounded-full bg-red-100 opacity-30"></div>
        )
      }
    }
  
    return (
      <div className="fixed top-4 right-4 z-50 w-80 animate-fade-in">
        <div className={`relative overflow-hidden rounded-lg p-4 shadow-lg ${config[type].bgColor} ${config[type].borderColor}`}>
          {/* Decorative elements */}
          {config[type].decoration}
          <div className="absolute right-2 top-2">
            <PuzzlePieceIcon className="h-10 w-10 text-gray-200" />
          </div>
          
          {/* Content */}
          <div className="relative flex items-start">
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
              {config[type].icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900">{config[type].title}</p>
                <button
                  onClick={onClose}
                  className="ml-4 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-600">{message}</p>
            </div>
          </div>
          
          {/* Animated progress bar with creative twist */}
          <div className="mt-3 flex items-center">
            <ArrowPathIcon className="mr-2 h-3 w-3 animate-spin text-gray-400" />
            <div className="h-1.5 flex-1 rounded-full bg-gray-200">
              <div 
                className={`h-full rounded-full ${config[type].progressColor} animate-progress`}
                style={{ animationDuration: '3s' }}
              />
            </div>
            <span className="ml-2 text-xs text-gray-500">syncing</span>
          </div>
        </div>
      </div>
    )
  }
  
  // Pre-configured exports
  export const SuccessToast = (props) => <ResourceToast type="success" {...props} />
  export const ErrorToast = (props) => <ResourceToast type="error" {...props} />