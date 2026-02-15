import React from 'react';
import { HardHat } from 'lucide-react';

export default function WorkingOnIt() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 ">
      <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-4 flex flex-col items-center text-center max-w-md w-full">
        <HardHat className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">We’re Working On It</h1>
        <p className="text-gray-600 mb-4">
          This page is under development. We’re working hard to bring it to live soon!
        </p>
        <button
          onClick={() => window.history.back()}
          className=" px-4 py-2 bg-red-500 cursor-pointer hover:bg-red-600 text-white font-medium rounded-lg"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
