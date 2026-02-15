import mongoose from "mongoose";
import invoiceModel from "../../models/vendor.model/invoice.Model.js";
import InvoiceCounterModel from "../../models/vendor.model/InvoiceCounter.Model.js";
import productModel from "../../models/vendor.model/product.Model.js";
import VendorStatsModel from "../../models/vendor.model/vendorStats.Model.js";

export const getVendorTopCards = async (req, res) => {
  try {
    const vendorId = req.user._id; // vendor id from auth middleware

    // Invoices ka total (sequence counter se)
    const counters = await InvoiceCounterModel.find({ createdBy: vendorId });
    const totalInvoices = counters.reduce((acc, curr) => acc + (curr.seq || 0), 0);

    //  Products ka total
    const totalProducts = await productModel.countDocuments({ importedBy: vendorId });

    //  Vendor Stats se totalSales aur totalCustomers
    const vendorStats = await VendorStatsModel.findOne({ vendorId });
    const totalSales = vendorStats?.totalSales || 0;
    const totalCustomers = vendorStats?.totalCustomers || 0;

    res.status(200).json({
      success: true,
      totalInvoices,
      totalProducts,
      totalSales,
      totalCustomers,
    });
  } catch (error) {
    console.error("Error fetching vendor dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching vendor dashboard stats",
    });
  }
};

// last & daya ka data dahsboard par show krana h 
export const getLatestInvoices = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const filter = { createdBy: new mongoose.Types.ObjectId(req.user._id) };

    // Sirf last 7 din ka data
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    filter.createdAt = { $gte: sevenDaysAgo };

    //  Fetch invoices with pagination
    const invoices = await invoiceModel.aggregate([
      { $match: filter },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          invoiceId: 1,
          amountPaid: 1,
          grandTotal: 1,
          paymentStatus: 1,
          paymentMode: 1,
          createdAt: 1,
          customerName: "$customer.fullName",
          customerPhone: "$customer.phone",
        },
      },
    ]);

    const totalInvoices = await invoiceModel.countDocuments(filter);

    res.status(200).json({
      success: true,
      total: totalInvoices,
      page: parseInt(page),
      limit: parseInt(limit),
      data: invoices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching invoices",
      error: error.message,
    });
  }
};


export const getVendorChartsData = async (req, res) => {
  try {
    const vendorId = req.user._id;

    // 1️ Recent 6 months sales aggregation (ye real-time hi rakhenge, kyunki data limited hai)
    const recentSales = await invoiceModel.aggregate([
      { $match: { createdBy: vendorId } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalSales: { $sum: "$grandTotal" }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 }
    ]);

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const formattedSales = recentSales
      .map(item => ({
        label: `${monthNames[item._id.month - 1]} ${item._id.year}`,
        totalSales: item.totalSales
      }))
      .reverse();

    // 2️ Invoice status breakdown -> ab VendorStats se
    const vendorStats = await VendorStatsModel.findOne({ vendorId });

    let statusWithPercentage = { pending: {}, partial: {}, paid: {} };
    let totalInvoices = 0;

    if (vendorStats) {
      const { statusCount, totalInvoices: total } = vendorStats;
      totalInvoices = total;

      statusWithPercentage = {
        pending: {
          count: statusCount.pending,
          percentage: total ? ((statusCount.pending / total) * 100).toFixed(2) : 0
        },
        partial: {
          count: statusCount.partial,
          percentage: total ? ((statusCount.partial / total) * 100).toFixed(2) : 0
        },
        paid: {
          count: statusCount.paid,
          percentage: total ? ((statusCount.paid / total) * 100).toFixed(2) : 0
        }
      };
    }

    res.status(200).json({
      success: true,
      data:{
     sales: formattedSales,
      invoiceStatus: statusWithPercentage,
      totalInvoices
      }
     
    });
  } catch (err) {
    console.error("Error fetching charts data:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching vendor charts data"
    });
  }
};


// delete krne ke liye 
// Reset/Clear Vendor Stats
// export const getVendorChartsData = async (req, res) => {
//   try {
//     const vendorId = req.user._id;

//     // Vendor ka stats dhundho
//     const vendorStats = await VendorStatsModel.findOne({ vendorId });

//     if (!vendorStats) {
//       return res.status(404).json({ message: "Vendor stats not found" });
//     }

//     // Reset kar do
//     vendorStats.statusCount = { pending: 0, partial: 0, paid: 0 };
//     vendorStats.totalInvoices = 0;

//     await vendorStats.save();

//     return res.status(200).json({
//       success: true,
//       message: "Vendor stats cleared successfully",
//       data: vendorStats,
//     });
//   } catch (error) {
//     console.error("Error clearing vendor stats:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error clearing vendor stats",
//       error,
//     });
//   }
// };
