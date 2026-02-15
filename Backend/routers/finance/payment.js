 import express from "express";
 // import auth from "../../middlewares/finance/auth.js";
 import * as paymentController from "../../controller/finance/paymentController.js";
 
 const paymentRoutes = express.Router();
 
 // clientRoutes.use(auth);
 
paymentRoutes.post('/post', paymentController.createPayment);
paymentRoutes.get('/', paymentController.getPayments);
paymentRoutes.get('/:id', paymentController.getPaymentById);
paymentRoutes.put('/:id', paymentController.updatePayment);
paymentRoutes.delete('/:id', paymentController.deletePayment);
 
 export default paymentRoutes;
 