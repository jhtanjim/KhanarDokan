import React from 'react'

const UniversalLoading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-yellow-50 to-red-100">
      <div className="flex flex-col items-center space-y-6">
        {/* Pot or bowl base */}
        <div className="relative w-24 h-24">
          {/* Bubbles */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 space-y-1 animate-bounce">
            <div className="w-3 h-3 bg-red-300 rounded-full"></div>
            <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
            <div className="w-2.5 h-2.5 bg-orange-400 rounded-full"></div>
          </div>

          {/* Pot */}
          <div className="w-full h-full bg-red-500 rounded-t-full shadow-md border-4 border-red-600"></div>

          {/* Steam */}
          <div className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 flex space-x-2 animate-pulse">
            <div className="w-2 h-6 bg-white rounded-full opacity-60"></div>
            <div className="w-1.5 h-4 bg-white rounded-full opacity-40"></div>
            <div className="w-2 h-5 bg-white rounded-full opacity-50"></div>
          </div>
        </div>

        {/* Text */}
        <p className="text-xl font-bold text-red-600 animate-pulse tracking-wide">
          Cooking your experience...
        </p>
      </div>
    </div>
  )
}

export default UniversalLoading
