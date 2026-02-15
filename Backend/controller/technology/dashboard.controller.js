import mongoose from "mongoose";
import assetModel from "../../models/technology/asset.model.js";
import ticketModel from "../../models/technology/helpdeskIT.model.js";
import licenseModel from "../../models/technology/licensesoftware.model.js";
import networkInfrastructureModel from "../../models/technology/networkInfrastructure.model.js";
import VendorManagementModel from "../../models/technology/vendormanagement.model.js";

export const getSummary = async (req, res) => {
  try {
    let totalAssets, licenses,resolvedTickets,onHoldTickets ,openTickets, activeAmc,progressTickets;

    if (req.user.role === "techEngineer") {
      //  Sirf uss engineer ke assigned assets
      totalAssets = await assetModel.countDocuments({ "assignedTo.employeeId": req.user._id });

      //  Sirf uss engineer ke assigned licenses
      licenses = await licenseModel.countDocuments({ "assignedTo.employeeId": req.user._id });

      //  Sirf uss engineer ke assigned tickets (jo abhi open hain)
      progressTickets = await ticketModel.countDocuments({
        status: "In-Progress",
        "assignedTo.employeeId": req.user._id,
      });
        onHoldTickets = await ticketModel.countDocuments({
        status: "On-Hold",
        "assignedTo.employeeId": req.user._id,
      });
       resolvedTickets = await ticketModel.countDocuments({
        status: "Resolved",
        "assignedTo.employeeId": req.user._id,
      });

      // Tech engineer ko AMC data ki zarurat nahi
      activeAmc = 0;
      openTickets= 0;
    } else {
      resolvedTickets = 0;
      //  Admin / Managers ke liye full data
      totalAssets = await assetModel.countDocuments();
      licenses = await licenseModel.countDocuments();
      openTickets = await ticketModel.countDocuments({ status: "Open" });
      activeAmc = await VendorManagementModel.countDocuments({
        contractEnd: { $gte: new Date() },
      });
    }

    res.status(200).json({
      success: true,
      message: "Dashboard top cards Data Fetched successfully",
      data: { totalAssets, licenses,onHoldTickets, progressTickets,resolvedTickets, openTickets, activeAmc },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


export const getAssetsDistribution = async (req, res) => {
  try {
    const statuses = ["In Use", "Repair", "Spare", "Scrap"];

    let result;

    if (req.user.role === "techEngineer") {
      //  Sirf uss engineer ke assigned assets ka distribution
      result = await Promise.all(
        statuses.map(async (status) => {
          const count = await assetModel.countDocuments({
            status,
            "assignedTo.employeeId": req.user._id,
          });
          return { name: status, value: count };
        })
      );
    } else {
      //  Admin ke liye poore system ka data
      result = await Promise.all(
        statuses.map(async (status) => {
          const count = await assetModel.countDocuments({ status });
          return { name: status, value: count };
        })
      );
    }

    res.status(200).json({
      success: true,
      message: "Asset distribution data successfully fetched",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



export const getTicketsByDepartment = async (req, res) => {
  try {
    const departments = ["IT", "Finance", "HR"];

    const result = await ticketModel.aggregate([
      // Join Registration collection
      {
        $lookup: {
          from: "registrations",   // Registration collection ka naam (lowercase + plural by default)
          localField: "raisedBy",  // Ticket ka field
          foreignField: "_id",     // Registration ka _id
          as: "raisedByUser"
        }
      },
      { $unwind: "$raisedByUser" }, // array ko object banane ke liye

      // Filter by department
      {
        $match: { "raisedByUser.department": { $in: departments } }
      },

      // Group by department + status
      {
        $group: {
          _id: { department: "$raisedByUser.department", status: "$status" },
          count: { $sum: 1 }
        }
      }
    ]);

    // Format result
    const formatted = departments.map(dep => {
      const openObj = result.find(r => r._id.department === dep && r._id.status === "Open");
      const resolvedObj = result.find(r => r._id.department === dep && r._id.status === "Resolved");
      return {
        department: dep,
        open: openObj ? openObj.count : 0,
        resolved: resolvedObj ? resolvedObj.count : 0
      };
    });

    res.status(200).json({
      success: true,
      data: formatted,
      message: "Department ticket fetched successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// get expiry details 


function daysLeft(expiryDate) {
  const today = new Date();
  const diff = new Date(expiryDate) - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getDaysFromRenewalAlert(renewalAlert) {
  switch (renewalAlert) {
    case "15 days before expiry": return 15;
    case "30 days before expiry": return 30;
    case "45 days before expiry": return 45;
    case "60 days before expiry": return 60;
    default: return 0;
  }
}

export const getExpiryNotifications = async (req, res) => {
  try {
    const today = new Date();
    const alertDate7 = new Date();
    alertDate7.setDate(today.getDate() + 7); // 7 din ka range

    let notifications = [];

    //  Assets (7 din ka alert)
    const assets = await assetModel.find({
      warranty_end: { $gte: today, $lte: alertDate7 },
    });
    assets.forEach((item) => {
      const left = daysLeft(item.warranty_end);
      notifications.push({
        id:item._id,
        type: "Asset",
        name: `${item.type} (${item.model})`,
        expiryDate: item.warranty_end,
        daysLeft: left,
        status: left <= 3 ? "Critical" : "Warning",
      });
    });

    //  Licenses (renewalAlert ke hisaab se)
    const licenses = await licenseModel.find();
    licenses.forEach((item) => {
      if (item.validityEnd && item.renewalAlert) {
        const daysBefore = getDaysFromRenewalAlert(item.renewalAlert);
        const alertStart = new Date(item.validityEnd);
        alertStart.setDate(alertStart.getDate() - daysBefore);

        if (today >= alertStart && today <= item.validityEnd) {
          const left = daysLeft(item.validityEnd);
          notifications.push({
            id:item._id,
            type: "License",
            name: item.softwareName,
            expiryDate: item.validityEnd,
            daysLeft: left,
            status: left <= 3 ? "Critical" : "Warning",
          });
        }
      }
    });

    //  Networks (7 din ka alert)
    const networks = await networkInfrastructureModel.find({
      nextServiceDue: { $gte: today, $lte: alertDate7 },
    });
    networks.forEach((item) => {
      const left = daysLeft(item.nextServiceDue);
      notifications.push({
        id:item._id,
        type: "Network",
        name: item.deviceType,
        expiryDate: item.nextServiceDue,
        daysLeft: left,
        status: left <= 3 ? "Critical" : "Warning",
      });
    });

    //  Vendor AMCs (7 din ka alert for contractEnd & nextServiceDue)
    const vendorAmcs = await VendorManagementModel.find({
        contractEnd: { $gte: today, $lte: alertDate7 } ,
    });
    vendorAmcs.forEach((item) => {
      if (item.contractEnd) {
        const left = daysLeft(item.contractEnd);
        notifications.push({
          id:item._id,
          type: "Vendor AMC",
          name: `${item.companyName} (${item.vendorId})`,
          expiryDate: item.contractEnd,
          daysLeft: left,
          status: left <= 3 ? "Critical" : "Warning",
        });
      }
      if (item.nextServiceDue) {
        const left = daysLeft(item.nextServiceDue);
        notifications.push({
          id:item._id,
          type: "Vendor AMC",
          name: item.vendorName,
          expiryDate: item.nextServiceDue,
          daysLeft: left,
          status: left <= 3 ? "Critical" : "Warning",
        });
      }
    });

    //  Response
    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("Error fetching expiry notifications:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};



export const getTicketTrends = async (req, res) => {
  try {
    const matchStage =
      req.user.role === "techEngineer"
        ? { "assignedTo.employeeId": new mongoose.Types.ObjectId(req.user._id) }
        : {};

    const result = await ticketModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.date",
          counts: {
            $push: { status: "$_id.status", value: "$count" },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Convert into your desired format
    const finalData = result.map((day) => {
      const row = { date: day._id, OnHold: 0, InProgress: 0, Resolved: 0 };

      day.counts.forEach((c) => {
        if (c.status === "On-Hold") row.OnHold = c.value;
        if (c.status === "In-Progress") row.InProgress = c.value;
        if (c.status === "Resolved") row.Resolved = c.value;
      });

      return row;
    });

    res.status(200).json({
      success: true,
      message: "Ticket trends fetched successfully",
      data: finalData,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

