import { CircleCheckBig } from 'lucide-react'

export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <div className="flex justify-center mb-4">
          <CircleCheckBig className="w-28 h-28 text-green-500 mx-auto mb-2" />
        </div>
        
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="text-center">
          <h3 className="text-xl font-bold text-violet-600 mb-4">
            {title}
          </h3>

          {children}
        </div>
      </div>
    </div>
  )
}

