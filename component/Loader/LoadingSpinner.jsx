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

export function PulseLoader(isDouble = false) {
  return (
    <div className="border shadow bg-white rounded-md p-2 mt-4 w-full mx-auto">
      <div className="w-full  rounded-md  p-2 mt-2 template-wrapper">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-4 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded"></div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="h-4 bg-slate-200 rounded"></div>
              </div>
              {isDouble && <div className="h-4 bg-slate-200 rounded"></div>}
            </div>
            {isDouble && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-4 bg-slate-200 rounded"></div>
                </div>
                <div className="h-4 bg-slate-200 rounded"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
