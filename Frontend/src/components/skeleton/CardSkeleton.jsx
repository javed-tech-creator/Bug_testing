import React from 'react'

function CardSkeleton() {
  return (
    <>
   
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
    <div className="flex items-center gap-3 mb-4">
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-12 mb-3 animate-pulse"></div>
        <div className="flex items-center gap-2">
          <div className="h-3 bg-gray-200 rounded w-6 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
        
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
      </div>
       <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </>
      
  )
}

export default CardSkeleton