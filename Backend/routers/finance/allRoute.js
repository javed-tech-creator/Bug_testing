import express from "express";
 import authRoutes from '../../routers/finance/auth.js'
 import billingRoutes from '../../routers/finance/billing.js'
 import clientRoutes from '../../routers/finance/clients.js'
 import productRoutes from '../../routers/finance/products.js'
 import projectRoutes from '../../routers/finance/projects.js' 
 import paymentRoute from '../../routers/finance/paymentRoutes.js'
 import venderRoute from "../../routers/finance/vendorRoutes.js";
 import poRoute from "../../routers/finance/poRoutes.js"; 
 import payoutRoute from "../../routers/finance/expencePayout.js"
 import ledgerRoutes from "../../routers/finance/ledger.js";
 import CategoryRoute from "../../routers/finance/expence/categoryRoute.js"
 import BRoute from "../../routers/finance/expence/budgetRoute.js"
 import ERoute from "../../routers/finance/expence/expenceRoute.js"

const FinanceRoutes = express.Router();

FinanceRoutes.use('/auth', authRoutes);
FinanceRoutes.use('/clients', clientRoutes);
FinanceRoutes.use('/projects', projectRoutes);
FinanceRoutes.use('/products', productRoutes);
FinanceRoutes.use('/billing', billingRoutes);
FinanceRoutes.use('/payment', paymentRoute);
FinanceRoutes.use('/vender', venderRoute);
FinanceRoutes.use('/purchase', poRoute); 
FinanceRoutes.use('/payout', payoutRoute);
FinanceRoutes.use('/ledger', ledgerRoutes);
FinanceRoutes.use('/category', CategoryRoute);
FinanceRoutes.use('/budgets', BRoute);
FinanceRoutes.use('/expences', ERoute);

export default FinanceRoutes;