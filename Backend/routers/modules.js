// routers/modules.js

import { Router } from "express";

import vendorRoutes from "../routers/vendor.routers/product.Routers.js";
import recceRoute from "../modules/recce/routes/index.routes.js";
import techRouter from "./technology/tech.router.js";
import marketingRouter from "./marketing/marketing.router.js";
import FinanceRoutes from "./finance/allRoute.js";
import AccountRoutes from "./accounts/allRoute.js";
import SalesRoutes from "../modules/sales/routes/index.routes.js";
import ProjectRoutes from "../modules/project/routes/index.routes.js";
import notificationRoutes from "../modules/notification/routes/notification.routes.js";
import hrRoutes from "../modules/HR/routers/index.routes.js";
import designRoutes from "../modules/design/routers/index.routes.js";
import adminRoutes from "../modules/admin/routers/index.routers.js";
// import quotationRoutes from "../modules/quotation/routes/index.routes.js";
const router = Router();

router.use("/account", AccountRoutes);
router.use("/sales", SalesRoutes);
router.use("/project", ProjectRoutes);
router.use("/recce", recceRoute);
router.use("/vendor", vendorRoutes);
router.use("/tech", techRouter);
router.use("/marketing", marketingRouter);
router.use("/hr", hrRoutes);
router.use("/notification", notificationRoutes);
router.use("/admin", adminRoutes);
router.use("/design", designRoutes);
router.use("/", FinanceRoutes);
// router.use("/quotation", quotationRoutes);

export default router;
