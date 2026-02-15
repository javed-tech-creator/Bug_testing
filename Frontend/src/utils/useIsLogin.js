// import { useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "../store/AuthContext";

// const isLogin = () => {
//   const { userData } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();

//   // direct return in one line
//   return userData?.id || userData?._id || (navigate(`/${location.pathname.split("/")[1]}/login`), null);
// };

// export default isLogin;
// useRequireLogin.js

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

export default function useIsLogin() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!userData?.id) {
      const route = location.pathname.split("/")[1];
      navigate(`/${route}/login`);
    }
  }, [userData, location, navigate]);

  return userData?.id || null;
}

