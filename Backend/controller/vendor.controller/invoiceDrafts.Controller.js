import DraftCounterModel from "../../models/vendor.model/invoiceDraftCounter.Model.js";
import InvoiceDraft from "../../models/vendor.model/invoiceDrafts.Model.js";

export const createOrUpdateInvoiceDraft = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const userId = req.user._id;
    const { draftId } = req.body;

    if (draftId) {
      //  1. Draft already exists → Update it
      const existingDraft = await InvoiceDraft.findOne({
        draftId,
        createdBy: userId,
      });
      if (!existingDraft) {
        return res.status(404).json({
          success: false,
          message: "Draft not found for update",
        });
      }

      // Update allowed fields
      Object.assign(existingDraft, req.body);
      await existingDraft.save();

      return res.status(200).json({
        success: true,
        message: "Draft updated successfully",
        draft: existingDraft,
      });
    }

    //  2. No draftId → Create new draft
    let counter = await DraftCounterModel.findOne({
      year: currentYear,
      createdBy: userId,
    });

    if (!counter) {
      counter = new DraftCounterModel({
        year: currentYear,
        createdBy: userId,
        seq: 1,
      });
      await counter.save();
    } else {
      counter.seq += 1;
      await counter.save();
    }

    const newDraftId = `DRAFT-${currentYear}-${String(counter.seq).padStart(
      3,
      "0"
    )}`;

    const draftData = {
      ...req.body,
      createdBy: userId,
      draftId: newDraftId,
    };

    const newDraft = new InvoiceDraft(draftData);
    await newDraft.save();

    res.status(201).json({
      success: true,
      message: "Draft created successfully",
      draft: newDraft,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error creating/updating draft",
    });
  }
};

// Get all drafts with optional date range
export const getInvoiceDrafts = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate, page = 1, limit = 10 } = req.query;

    // Base filter (current user's drafts only)
    let filter = { createdBy: userId };

    //  Date filter agar diya gaya hai
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      filter.createdAt = { $gte: start, $lte: end };
    }
    //  Aggregation with customer details
    const invoices = await InvoiceDraft.aggregate([
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
          _id: 0, //  Hide MongoDB _id
          draftId: 1, //  DraftId
          grandTotal: 1, //  Grand Total
          createdOn: "$createdAt", //  Created Date
          customerName: "$customer.fullName",
          customerPhone: "$customer.phone",
        },
      },
    ]);

    //  Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalDrafts = await InvoiceDraft.countDocuments(filter);

    const drafts = await InvoiceDraft.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      message: "Drafts fetched successfully",
      total: totalDrafts,
      page: parseInt(page),
      limit: parseInt(limit),
      data: invoices,
    });
  } catch (error) {
    console.error("Error in getInvoiceDrafts:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching drafts",
    });
  }
};

// Get and clear all drafts + reset counter
// Get and Clear all Drafts + Reset Counter
// export const getInvoiceDrafts = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const currentYear = new Date().getFullYear();
//     const { startDate, endDate } = req.query;

//     // Base filter (current user's drafts only)
//     let filter = { createdBy: userId };

//     // Date filter agar diya gaya hai
//     if (startDate && endDate) {
//       filter.createdAt = {
//         $gte: new Date(startDate), // Start date included
//         $lte: new Date(endDate),   // End date included
//       };
//     }

//     //  Drafts fetch karo (delete hone se pehle list dikhane ke liye)
//     const drafts = await InvoiceDraft.find(filter).sort({ createdAt: -1 });

//     //  Sare drafts delete karo
//     await InvoiceDraft.deleteMany(filter);

//     //  Counter reset karo
//     await DraftCounterModel.findOneAndUpdate(
//       { year: currentYear, createdBy: userId },
//       { $set: { seq: 0 } },  // seq ko 0 par reset
//       { new: true }
//     );

//     //  Response bhejo
//     res.status(200).json({
//       success: true,
//       message: "Drafts fetched and cleared successfully. Counter reset.",
//       count: drafts.length,
//       drafts, // delete hone se pehle wali list bhej di
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message || "Error fetching/clearing drafts",
//     });
//   }
// };

//  Get Single Draft by ID
export const getInvoiceDraftById = async (req, res) => {
  try {
    const { draftId } = req.params; // from route param
    const userId = req.user._id; // from auth middleware

    const draft = await InvoiceDraft.find({
      draftId: draftId,
      createdBy: userId,
    });

    if (!draft) {
      return res
        .status(404)
        .json({ success: false, message: "Draft not found" });
    }
    res.status(200).json({ success: true, draft });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Delete Draft
export const deleteInvoiceDraft = async (req, res) => {
  try {
    const { draftId } = req.params;

    const draft = await InvoiceDraft.findOneAndDelete({
      draftId,
      createdBy: req.user._id,
    });

    if (!draft) {
      return res
        .status(404)
        .json({ success: false, message: "Draft not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Draft deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
