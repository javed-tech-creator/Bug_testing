import express from 'express';

import { addInitialPayment, getClientPayment } from '../../controllers/payment/clientPayment.controller.js';

const router = express.Router();

router.post('/', addInitialPayment);
router.get('/', getClientPayment)

export default router;