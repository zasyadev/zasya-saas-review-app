import React, { Suspense } from "react";
import LoadingSpinner from "../../component/Loader/LoadingSpinner";

export default function SuspenceWrapper({ children }) {
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
}
