import { Outlet } from "react-router-dom";

const CustomerLayout = () => {
  return (
    <div className="Customer-layout">
      <h1>Customer Panel</h1>
      <Outlet />
    </div>
  );
};

export default CustomerLayout;
