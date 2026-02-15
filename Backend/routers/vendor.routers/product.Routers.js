import express from "express";
const vendorRoutes = express.Router();
import {
  bulkImportProducts,
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../../controller/vendor.controller/product.Controller.js";
import authMiddleware from "../../middlewares/vendor.middlewares/authMiddlewares.js";
// import { createOrder, getOrders } from "../../controller/vendor.controller/order.Controller.js";
import { getLatestInvoices, getVendorChartsData, getVendorTopCards } from "../../controller/vendor.controller/dashboard.Controller.js";
import {
  // createVendorProfile,
  getVendorProfile,
  logout,
  updateVendorKYC,
  // updateVendorProfileImage,
} from "../../controller/vendor.controller/profiledata.Controller.js";
import {
  createCustomerProfile,
  getCustomerProfiles,
} from "../../controller/vendor.controller/customers.Controller.js";
import {
  createInvoice,
  createInvoiceTemplate,
  getInvoices,
  getNextInvoiceNumber,
  updateInvoicePayment,
} from "../../controller/vendor.controller/invoice.Controller.js";
import {
  createOrUpdateInvoiceDraft,
  deleteInvoiceDraft,
  getInvoiceDraftById,
  getInvoiceDrafts,
} from "../../controller/vendor.controller/invoiceDrafts.Controller.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../controller/vendor.controller/productCategories.Controller.js";
import {
  addBank,
  getBanks,
} from "../../controller/vendor.controller/bankDetails.Controller.js";
import multer from "multer";
import { getNotifications, markAllRead, markRead } from "../../controller/vendor.controller/notification.Controller.js";
import { errorHandler } from "../../middlewares/globalErrorHandler.js";


// Multer setup for image uploads
const storage = multer.diskStorage({
  // destination: (req, file, cb) => cb(null, path.join(__dirname,"../Product_uploads/")),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Dashboard Data details fethced
vendorRoutes.get("/dashboard-top/data", authMiddleware, getVendorTopCards); // Create product Data
vendorRoutes.get("/dashboard-chart/data", authMiddleware, getVendorChartsData);
vendorRoutes.get("/dashboard-invoices/data", authMiddleware, getLatestInvoices); //last 7 days data
// Dashboard Data details fethced End getInvoiceSequence

// Product Section Started Here
vendorRoutes.post("/product/add", authMiddleware, createProduct); // Create product Data
vendorRoutes.post("/product/import", authMiddleware, bulkImportProducts); // Create product Data in Bulk
vendorRoutes.get("/product/get", authMiddleware, getProducts); // Get List by user
vendorRoutes.get("/single-product/:id", authMiddleware, getProductById); // single product 
vendorRoutes.put("/product/update/:id", authMiddleware, updateProduct); //update product
vendorRoutes.delete("/product/delete/:id", authMiddleware, deleteProduct); //delete product
// Product Section End Here

// Vendor Notification code start 
vendorRoutes.get("/get-all-notifications", authMiddleware, getNotifications);
vendorRoutes.patch("/read-notifications/:id", authMiddleware, markRead);
vendorRoutes.patch("/read-all-notifications", authMiddleware, markAllRead);
// Vendor Notification code End 

// Vendor Profile Area code Start
// Create Profile
// vendorRoutes.post(
//   "/profile/create",
 
//   createVendorProfile
// );
// get Profile
vendorRoutes.get("/profile/get", authMiddleware, getVendorProfile);
vendorRoutes.post("/logout", authMiddleware, logout);
// Update Profile
vendorRoutes.put("/profile/update", authMiddleware, updateVendorKYC);
// PATCH request for updating only profile image

// vendorRoutes.patch(
//   "/profile-image",
//     authMiddleware,
//  upload.single("profileImage"),
//    updateVendorProfileImage
// );
// Vendor Profile Area code End

// Adding customers details start
vendorRoutes.post("/create-customers", authMiddleware, createCustomerProfile);
vendorRoutes.get("/get-customers", authMiddleware, getCustomerProfiles);
// Customer details End

// invoice code satrt
vendorRoutes.post("/create-invoices", authMiddleware, createInvoice);
vendorRoutes.get("/get-invoices", authMiddleware, getInvoices);
vendorRoutes.get("/next-invoice", authMiddleware, getNextInvoiceNumber);
vendorRoutes.put(
  "/update-invoice-payment/:invoiceId",
  authMiddleware,
  updateInvoicePayment
);
vendorRoutes.get(
  "/invoice-pdf/:invoiceId",
  authMiddleware,
  createInvoiceTemplate
);
// invoice code End

// Invoice Drafts code start
vendorRoutes.post(
  "/create-invoicedraft",
  authMiddleware,
  createOrUpdateInvoiceDraft
);
vendorRoutes.get("/get-invoicedraft", authMiddleware, getInvoiceDrafts);
vendorRoutes.get(
  "/get-single-invoicedraft/:draftId",
  authMiddleware,
  getInvoiceDraftById
);
vendorRoutes.delete(
  "/delete-invoicedraft/:draftId",
  authMiddleware,
  deleteInvoiceDraft
);
// Invoice Drafts code End

// Add and Get Product Categories Code Start
vendorRoutes.post("/add-category", authMiddleware, createCategory);
vendorRoutes.get("/get-categories", authMiddleware, getCategories);
vendorRoutes.put("/update-category/:id", authMiddleware, updateCategory);
vendorRoutes.delete("/delete-category/:id", authMiddleware, deleteCategory);
// Add and Get Product Categories Code End

// Vendor Bank Details Area Code start
vendorRoutes.post("/add-bankdetails",authMiddleware, addBank); // ➤ Add new bank
vendorRoutes.get("/get-bankdetails",authMiddleware, getBanks); // ➤ Get all banks (id, bankName, accountNumber only)
// Vendor Bank Details Area Code End


vendorRoutes.use(errorHandler);

export default vendorRoutes;
