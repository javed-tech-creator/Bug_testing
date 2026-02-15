import express from "express";
const router = express.Router()

import LeadRoutes from './lead.routes.js'
router.use('/lead',LeadRoutes);

import clientRoutes from './client.routes.js'
router.use('/client',clientRoutes);

import clientMappingRoutes from './clientMapping.routes.js'
router.use('/client-mapping', clientMappingRoutes);

import projectRoutes from './project.routes.js'
router.use('/project',projectRoutes);

import clientQuotationRoutes from './clientQuotation.routes.js'
router.use('/client-quotation',clientQuotationRoutes);

import clientPaymentRoutes from './payment/clientPayment.routes.js'
router.use("/client-payment",clientPaymentRoutes)

import paymentRoutes from './payment/payment.routes.js'
router.use("/payment", paymentRoutes)

import targetRoutes from './target.routes.js'
router.use('/target',targetRoutes);

import reportingRoutes from './reporting.routes.js'
router.use('/reporting',reportingRoutes);

import dashboardRoutes from './dashboard/dashboard.routes.js'
router.use('/dashboard',dashboardRoutes);

export default router