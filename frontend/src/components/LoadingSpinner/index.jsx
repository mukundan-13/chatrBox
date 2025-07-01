import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-gray-500 text-base py-5">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-pulse-circle"></div>
        <div className="absolute inset-0 border-4 border-blue-300 rounded-full animate-pulse-circle delay-200"></div>
      </div>
      <div className="mt-3 text-center">Loading</div>
    </div>
  );
}
