// // src/routes/PrivateRoute.jsx
// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../../../store/AuthContext";

// const PrivateRoute = () => {
//   const { userData } = useAuth();

//   return userData?.token ? <Outlet /> : <Navigate to="/vendor/login" replace />;
// };

// export default PrivateRoute;
