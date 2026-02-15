import { v4 as uuidv4 } from "uuid";
import orderModel from "../../models/vendor.model/order.Model.js";


// create orders 
// export const createOrder = async (req, res) => {
//   try {
//     const {
//       products, // Array of product objects with totalCost, discount, netCost
//       overallAmount,
//       overallDiscount,
//       shippingCharges = 0,
//       grandTotal,
//       importedBy,
//       paymentStatus = "Unpaid",
//       paymentMethod = "Cash",
//       deliveryAddress,
//     } = req.body;

//     const orderedBy = req.user._id; // It will come from DSS HR Middleware 

//     if (!products || products.length === 0) {
//       return res.status(400).json({ message: "Products are required." });
//     }

//     if (grandTotal == null || overallAmount == null) {
//       return res.status(400).json({ message: "Amount fields are required." });
//     }

//     // Optional: Basic sanity check
//     const sumTotalCost = products.reduce((sum, p) => sum + (p.totalCost || 0), 0);
//     const sumDiscount = products.reduce((sum, p) => sum + (p.discount || 0), 0);
//     const sumNet = products.reduce((sum, p) => sum + (p.netCost || 0), 0);
//     const expectedGrand = sumTotalCost - sumDiscount + shippingCharges;

//     if (
//       sumTotalCost !== overallAmount ||
//       sumDiscount !== overallDiscount ||
//       expectedGrand !== grandTotal
//     ) {
//       return res.status(400).json({
//         message: "Mismatch in totals. Please check product-level and summary values.",
//         debug: {
//           sumTotalCost,
//           sumDiscount,
//           expectedGrand,
//         },
//       });
//     }

//     // Generate invoice ID
//     const invoiceId = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${uuidv4().slice(0, 6).toUpperCase()}`;

//     const newOrder = new orderModel({
//       products,
//       importedBy,
//       orderedBy,
//       invoiceId,
//       paymentStatus,
//       paymentMethod,
//       shippingCharges,
//       overallAmount,
//       overallDiscount,
//       grandTotal,
//       deliveryAddress,
//     });

//     await newOrder.save();

//     res.status(201).json({
//       message: "Order created successfully",
//       order: newOrder,
//     });

//   } catch (error) {
//     console.error("Order creation failed:", error);
//     res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// };

// fetch order 
// export const getOrders = async (req, res) => {
//   try {
//     const vendorId = req.user._id; // Assuming vendor is logged in

//     const orders = await orderModel.find({ importedBy: vendorId })
//       .populate("products.product") // get full product details
//       .sort({ createdAt: -1 }); // latest orders first

//     res.status(200).json({ orders });

//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     res.status(500).json({ message: "Failed to get orders", error: error.message });
//   }
// };
