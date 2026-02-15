import express from 'express';
import * as expencePayout from "../../controller/finance/expencePayoutController.js";

const payoutRoute = express.Router();

payoutRoute.post('/', expencePayout.createPayout);
payoutRoute.get('/', expencePayout.getPayouts);
payoutRoute.put('/:id/status', expencePayout.updatePayoutStatus);
payoutRoute.delete('/:id', expencePayout.deletePayout);

export default payoutRoute;
