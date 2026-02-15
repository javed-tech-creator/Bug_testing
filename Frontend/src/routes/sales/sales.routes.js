import Leads from "../modules/sales/pages/Leads";
import Projects from "../modules/sales/pages/Projects";

const salesRoutes = [
  {
    path: "/sales/leads",
    element: <Leads />,
    allowedRoles: ["sales", "admin"],
  },
  {
    path: "/sales/projects",
    element: <Projects />,
    allowedRoles: ["sales", "admin"],
  },
];

export default salesRoutes;
