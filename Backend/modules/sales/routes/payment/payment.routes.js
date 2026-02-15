import express from 'express';
import { createPayment, getAllPayments, getPaymentById, getPaymentsByClient, getPaymentsByProject, updatePayment } from '../../controllers/payment/payment.controller.js';


const router = express.Router();

router.post('/', createPayment);
router.get('/', getAllPayments);
router.get('/:id', getPaymentById);
router.put('/:id', updatePayment);
router.get('/project/:projectId', getPaymentsByProject);
router.get('/client/:clientId', getPaymentsByClient);

export default router;