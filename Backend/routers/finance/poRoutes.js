import express from 'express';
import * as poController from "../../controller/finance/poController.js";

const poRoute = express.Router();

poRoute.post('/', poController.createPurchaseOrder);
poRoute.get('/', poController.getPOs);
poRoute.get('/:id', poController.getPOById);
poRoute.put('/:id', poController.updatePO);
poRoute.delete('/:id', poController.deletePO);

export default poRoute;

    