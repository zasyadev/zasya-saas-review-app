import React from "react";

export function LoadingSpinner() {
  return (
    <>
      <div className="loaderimg bg-no-repeat bg-cover fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-40 overflow-hidden bg-gray-300 opacity-600 flex flex-col items-center justify-center">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-50 h-12 w-12 mb-4 "></div>
        <h2 className="text-center text-gray-50 text-xl font-semibold">
          Loading...
        </h2>
        <p className="w-1/3 text-center text-gray-50 text-sm">
          This may take a few seconds, please donot close this page.
        </p>
      </div>
    </>
  );
}
