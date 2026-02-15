import express from 'express';
import * as vendor from '../../controller/finance/vendorController.js';

const venderRoute = express.Router();

venderRoute.post('/post', vendor.createVendor);
venderRoute.get('/get', vendor.getVendors);
venderRoute.get('/:id', vendor.getVendorById);
venderRoute.put('/:id',vendor.updateVendor);
venderRoute.delete('/:id', vendor.deleteVendor);

export default venderRoute; 
 
