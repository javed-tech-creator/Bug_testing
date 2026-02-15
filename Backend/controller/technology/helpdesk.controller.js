import ticketModel from "../../models/technology/helpdeskIT.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import TicketCounterModel from "../../models/technology/ticketcounter.model.js";
import ApiError from "../../utils/master/ApiError.js";
import mongoose from "mongoose";
import { getPaginationParams } from "../../utils/pageLimitValidation.js";

async function getNextTicketId() {
  const counter = await TicketCounterModel.findOneAndUpdate(
    { name: "ticket" }, // sab tickets ke liye ek hi sequence
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `TCK-${String(counter.seq).padStart(3, "0")}`;
}

//  Create Ticket (sirf Employee kar sakta hai)
export const createTicket = async (req, res, next) => {
  const { priority, description, ticketType } = req.body;

  try {
    // 1️ Validate required fields
    if (!priority || !description || !ticketType) {
      return next(
        new ApiError(400, "priority, description, and ticketType are required")
      );
    }

    if (!req.user._id || !mongoose.Types.ObjectId.isValid(req.user._id)) {
      return next(new ApiError(400, "Invalid License / Ticket ID"));
    }

    const allowedPriorities = ["High", "Medium", "Low"];
    if (!allowedPriorities.includes(priority)) {
      return next(
        new ApiError(
          400,
          `priority must be one of: ${allowedPriorities.join(", ")}`
        )
      );
    }

    // 3 Validate ticketType (agar aapka schema me enum hai to)
    const allowedTypes = ["Hardware", "Software", "Internet", "Email", "Other"];
    if (!allowedTypes.includes(ticketType)) {
      return next(
        new ApiError(
          400,
          `ticketType must be one of: ${allowedTypes.join(", ")}`
        )
      );
    }

    // Priority ke hisaab se SLA Timer
    let slaTimer = "";
    if (priority === "High") slaTimer = "4 hours";
    else if (priority === "Medium") slaTimer = "8 hours";
    else if (priority === "Low") slaTimer = "24 hours";

    if (!req.file) {
      return next(new ApiError(400, "No file uploaded"));
    }

    // Upload new image
    const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: "helpdesk",
      public_id: `attachment${Date.now()}`,
      use_filename: true,
      resource_type: "auto", // image/video auto detect
    });

    //  Remove local temp file safely
    try {
      fs.unlinkSync(req.file.path);
    } catch (err) {
      console.warn(" Temp file delete failed:", err.message);
    }

    //  Global ticketId generate
    const ticketId = await getNextTicketId();

    const ticket = new ticketModel({
      priority,
      issueDescription: description,
      ticketType,
      raisedBy: req.user._id, // jis employee ne ticket banaya
      slaTimer,
      ticketId,
      attachment: {
        url: cloudinaryResponse.secure_url, // File ka URL (image/video)
        type: cloudinaryResponse.resource_type, // MIME type (image/png, video/mp4)
        name: req.file.originalname, // File name (optional)
      },
    });

    await ticket.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Complaint ticket registered Succesfully",
        data: ticket,
      });
  } catch (error) {
    next(error);
  }
}; 

//  Get All Tickets (Employee -> sirf apne, Manager/HOD -> sabhi)
export const getTickets = async (req, res, next) => {
  try {
        const { page, limit, skip } = getPaginationParams(req);
 
        if (!req.user._id || !mongoose.Types.ObjectId.isValid(req.user._id)) {
  return next(new ApiError(400, "Invalid User / ID"));
}

    let filter = {};
    let projection = ""; // yeh decide karega kaunse fields bhejne hain

    if (req.user.role === "techEngineer") {
      filter = { "assignedTo.employeeId": req.user._id };

      // sirf columnConfig ke fields
      projection =
        "ticketId attachment raisedBy ticketType priority issueDescription createdAt slaTimer status resolutionNotes";
    } else if (["Manager", "HOD","techManager"].includes(req.user.role)) {
      filter = {}; // all tickets
      projection = ""; // managers ko full data
    } else {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }

    //  Get paginated tickets
    const tickets = await ticketModel
      .find(filter)
      .select(projection)
      .populate({
        path: "raisedBy",
        select: "name role department", // sirf name of user jisne ticket raise kiya
      })
      .populate({
        path: "history.updatedBy",
        select: "name role", // sirf name bhejna
      })
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    //  Count total tickets (for frontend pagination)
    const total = await ticketModel.countDocuments(filter);

    res.status(200).json({
      success: true,
    total, 
    page: Number(page),
    totalPages: Math.ceil(total / limit),
      data: tickets,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Assign / Patch Ticket (Manager/HOD)

export const patchTicket = async (req, res, next) => {
  try {    
    const { id } = req.params;
    const { department, role, name, employeeId } = req.body;

    // 1️ Validate Ticket ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid Ticket ID"));
    }

      if (!req.user._id || !mongoose.Types.ObjectId.isValid(req.user._id)) {
      return next(new ApiError(400, "Invalid User Id"));
    }

    // 2️ Required fields validation
    if (!department || !role || !name || !employeeId) {
      return next(
        new ApiError(
          400,
          "All fields are required: department, role, name, employeeId"
        )
      );
    }

    // 3️ Validate employeeId
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return next(new ApiError(400, "Invalid Employee ID"));
    }

    // 4️ Ticket exist karta hai ya nahi (aur deleted to nahi hai)
    const ticket = await ticketModel.findById(id);
    if (!ticket) {
      return next(new ApiError(404, "Ticket not found"));
    }

    // 5️ Already resolved/closed tickets assign na ho
    if (["Resolved", "Closed"].includes(ticket.status)) {
      return next(
        new ApiError(400, "Resolved/Closed tickets cannot be reassigned")
      );
    }

  // 6 Same person ko dobara assign na ho if (ticket.assignedTo?.employeeId?.toString() === employeeId)
    if (
     ticket.assignedTo?.department === department && ticket.assignedTo?.role === role && ticket.assignedTo?.name === name
    ) {
      return next(
        new ApiError(400, "Ticket is already assigned to this employee")
      );
    }

     const newAssignment = {
      department,
      role,
      name,
      employeeId,
      date: new Date(),
    };

    let statusCode;
    let message;

    // 7 First time assign
    if (!ticket.assignedTo || !ticket.assignedTo.employeeId) {
      ticket.assignedTo = newAssignment;
      ticket.status = "In-Progress"; // pehli bar assign pe hi change hoga
      ticket.resolutionNotes ="The support team has started working on this request.";

      // History add
      ticket.history.push({
        status: "In-Progress",
        resolutionNotes:"The support team has started working on this request.",
        updatedBy: req.user._id,
        updatedAt: new Date(),
      });

      statusCode = 201;
      message = "Ticket assigned successfully";
    } else{
     //  Purana assignment ko reassignments me push karo
      ticket.reassignments.push(ticket.assignedTo);

      // Replace assignedTo with new assignment
      ticket.assignedTo = newAssignment;
      
      statusCode = 200;
      message = "Ticket reassigned successfully";
    }
   

    const updatedTicket = await ticket.save();

    return res.status(statusCode).json({
      success: true,
      message,
      data: updatedTicket,
    });
  } catch (error) {
    next(error);
  }
};

// patch ticket status
export const updateTicketStatus = async (req, res, next) => {
  try {
    const { id } = req.params; // Ticket ID from URL
    const { status, resolutionNotes } = req.body;

    // 1️ Validate Ticket ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid Ticket Mongoose ID"));
    }
    
    if (!req.user?._id || !mongoose.Types.ObjectId.isValid(req.user?._id)) {
      return next(new ApiError(400, "Invalid User Id"));
    }

    // 2️ Allowed status list
    const allowedStatus = [
      "In-Progress",
      "On-Hold",
      "Resolved",
      "Closed",
    ];

    // Agar status diya hai but valid nahi hai
    if (status && !allowedStatus.includes(status)) {
      return next(new ApiError(400, "Invalid status value"));
    }

    // 3️ Ticket find karo
    const ticket = await ticketModel.findById(id);
    if (!ticket) {
      return next(new ApiError(404, "Ticket not found"));
    }

    // 4️ Agar ticket pehle se Closed hai to update mat hone do
    if (ticket.status === "Closed" || ticket.status === "Resolved" ) {
      return next(new ApiError(400, "Closed/Resolved tickets cannot be updated"));
    }

    // 5️ Status update (agar diya gaya hai)
    if (status) ticket.status = status;

    // 6️ Resolution notes update
    if (resolutionNotes && resolutionNotes.trim() !== "") {
      ticket.resolutionNotes = resolutionNotes;
    }

    // 7️ History push
    ticket.history.push({
      status: status || ticket.status, // latest status
      resolutionNotes: resolutionNotes || ticket.resolutionNotes,
      updatedBy: req.user?._id || null, // jisne update kiya
      updatedAt: new Date(),
    });

    // 8️ Save ticket
    await ticket.save();

    return res.status(200).json({
      success: true,
      message: "Ticket status updated successfully",
      data: ticket,
    });
  } catch (error) {
    next(error); // Global error handler ko pass karo
  }
};
