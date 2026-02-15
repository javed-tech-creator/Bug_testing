import React from 'react';

const ChartSkeleton = () => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100  mx-auto relative overflow-hidden">
      {/* Menu dots skeleton */}
      <div className="flex justify-end mb-4">
        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Chart area skeleton */}
      <div className="mb-6">
        {/* Y-axis labels skeleton */}
        <div className="flex items-end justify-between h-44 relative">
          {/* Y-axis numbers */}
          <div className="flex flex-col justify-between h-full py-2 mr-3">
            <div className="h-3 w-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 w-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 w-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 w-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 w-8 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Chart bars/dots skeleton */}
          <div className="flex-1 h-full relative">
            {/* Horizontal grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-2">
              <div className="h-px bg-gray-100"></div>
              <div className="h-px bg-gray-100"></div>
              <div className="h-px bg-gray-100"></div>
              <div className="h-px bg-gray-100"></div>
              <div className="h-px bg-gray-100"></div>
            </div>

            {/* Chart points/line skeleton */}
            <div className="flex items-end justify-between h-full px-2 py-2">
              <div className="w-2 h-2 bg-blue-200 rounded-full animate-pulse"></div>
              <div className="w-2 h-4 bg-blue-200 rounded-full animate-pulse"></div>
              <div className="w-2 h-16 bg-blue-200 rounded-full animate-pulse"></div>
              <div className="w-2 h-20 bg-blue-200 rounded-full animate-pulse"></div>
              <div className="w-2 h-32 bg-blue-200 rounded-full animate-pulse"></div>
              <div className="w-2 h-24 bg-blue-200 rounded-full animate-pulse"></div>
              <div className="w-2 h-12 bg-blue-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* X-axis labels skeleton */}
        <div className="flex justify-between mt-3 ml-11 gap-4">
          <div className="h-3 w-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Title skeleton */}
      <div className="mb-2">
        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Subtitle skeleton */}
      <div className="mb-4">
        <div className="h-4 w-36 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Updated time skeleton */}
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>

      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default ChartSkeleton;