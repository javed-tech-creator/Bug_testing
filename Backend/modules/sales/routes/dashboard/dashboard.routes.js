import express from 'express'
import { getClientsChart, getDashboardStats, getExecutivePerformance, getLeadAnalytics, getLeadSourceMonthlyFY, getLostLeadExpectedAmount, getMonthlyLeadPerformanceFY, getPaymentStatusChart, getPendingClientPayments, getRevenueChart, getTotalRevenue } from '../../controllers/dashboard/dashboard.controller.js';
import { authWithPermissions } from '../../../../middlewares/master/authMiddleware.js';
const router = express.Router();


router.get("/stats", authWithPermissions(), getDashboardStats);
router.get("/executive-performance", authWithPermissions(), getExecutivePerformance);
router.get("/monthly-lead-count", authWithPermissions(), getMonthlyLeadPerformanceFY);
router.get("/lead-analytics",authWithPermissions(), getLeadAnalytics);
router.get("/lead-sources", authWithPermissions(), getLeadSourceMonthlyFY);
router.get("/lost-lead-amount", authWithPermissions(), getLostLeadExpectedAmount);
router.get("/pending-client-payment", authWithPermissions(), getPendingClientPayments);
router.get("/get-total-revenue", authWithPermissions(), getTotalRevenue);
router.get("/get-chart-revenue", authWithPermissions(), getRevenueChart);
router.get("/get-client-chart", authWithPermissions(), getClientsChart);
router.get("/get-payment-status", authWithPermissions(), getPaymentStatusChart);

export default router;