import React from "react";

const ErrorBox = ({ error }) => {
  return (
    error && <p className="text-red-600 text-sm my-2 font-medium">{error}</p>
  );
};

export default ErrorBox;
