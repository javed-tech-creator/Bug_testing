import express from "express";
import accountauth from "../../routers/accounts/auth.js";
import InvoiceRoute from "../../routers/accounts/invoice.Routes.js"
import quatatione from "../../routers/accounts/quatation.Routes.js"
import vendorPayment from "../../routers/accounts/vendorPayment.Routes.js"
import vendorR from "../../routers/accounts/vendor.Routes.js"
import challanRoute from "./vendorTax/challanRoutes.js";
import PaymentRoute from "./vendorTax/paymentRoutes.js"
import TaxRoute from "./vendorTax/taxRoutes.js"
import VenderRoute from "./vendorTax/vendorRoutes.js"

import exportGst from "./vendorTax/exportExel.js";

const AccountRoutes = express.Router();

AccountRoutes.use('/account', accountauth)
AccountRoutes.use('/inv', InvoiceRoute)
AccountRoutes.use('/quat', quatatione)
AccountRoutes.use('/vendorpayment', vendorPayment)
AccountRoutes.use('/vendor', vendorR)
AccountRoutes.use('/challan', challanRoute)
AccountRoutes.use('/taxpayment', PaymentRoute)
AccountRoutes.use('/taxdeduct', TaxRoute)
AccountRoutes.use('/Vendertax', VenderRoute)
AccountRoutes.use('/exportgst', exportGst)

export default AccountRoutes;