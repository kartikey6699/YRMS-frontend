import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'

export const SuccessToast = ({ message, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 w-80 animate-fade-in">
      <div className="rounded-lg bg-white shadow-lg ring-1 ring-green-100 overflow-hidden">
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-6 w-6 text-green-500" />
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-gray-900">Success!</p>
              <p className="mt-1 text-sm text-gray-500">{message}</p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={onClose}
                className="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="bg-green-50 px-4 py-3">
          <div className="h-1 w-full bg-green-200 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-green-500 rounded-full animate-progress`}
              style={{ animationDuration: '3s' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}