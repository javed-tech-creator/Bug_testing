import salesRoutes from "./sales.routes";
import customerRoutes from "./customer.routes";
import adminRoutes from "./admin.routes";

const allRoutes = [
  ...salesRoutes,
  ...customerRoutes,
  ...adminRoutes,
];

export default allRoutes;
