import Loader from "@/components/Loader";
import WebPushSubscriber from "@/components/WebPushSubscriber";
import { Suspense } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export const ProtectedRoute = ({ children, module }) => {
  const userData = useSelector((state) => state.auth.userData);
  const location = useLocation();
  if (!userData && !location.pathname.endsWith("/login")) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-2xl font-semibold">!! Please Login !!</div>
        <Suspense fallback={<Loader />}>
          <Navigate to={`/${module}/login`} replace />
        </Suspense>
      </div>
    );
  }

  return (
    <>
      {userData && <WebPushSubscriber user={userData} />}
      {children}
    </>)
};


