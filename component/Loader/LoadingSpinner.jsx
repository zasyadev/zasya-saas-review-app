import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="loaderimg bg-no-repeat bg-cover fixed inset-0 w-full h-screen z-40 overflow-hidden bg-gray-300 opacity-600 grid place-content-center">
      <div className="px-4 max-w-md space-y-3 mb-4">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-50 h-8 w-8 md:h-12 md:w-12 mx-auto"></div>
        <h2 className="text-center text-gray-800 text-xl font-semibold">
          Loading...
        </h2>
        <p className="text-center text-gray-800 text-sm">
          This may take a few seconds, please do not close this page.
        </p>
      </div>
    </div>
  );
}
