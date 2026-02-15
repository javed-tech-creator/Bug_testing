import mongoose from "mongoose";
import ApiError from "../../../utils/master/ApiError.js";
import Notification from "../models/notification.model.js";
import User from "../../HR/models/masters/user.model.js";
import { notificationQueue } from "../queue/notification.queue.js";

export const sendNotification = async ({ channels, data, userIds, options }) => {
  if (!channels || !Array.isArray(channels) || channels.length === 0) {
    throw new Error("Channels array is required");
  }

  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    throw new Error("userIds array is required");
  }

  if (!data || typeof data !== "object") {
    throw new Error("data object is required");
  }

  const title = typeof data.title === "string" ? data.title.trim() : "";
  const body = typeof data.body === "string" ? data.body.trim() : "";
  const html = typeof data.html === "string" ? data.html : null;

  if (!title || !body) throw new Error("data.title and data.body are required");

  // set default type
  const type = options?.type || "transactional";
  const priorityMap = { "opt-in": "high", transactional: "high", marketing: "low", info: "normal" };
  const priority = priorityMap[type] || "normal";

  // create notification document
  const notificationDoc = await Notification.create({
    title,
    body,
    html,
    channels,
    userId: userIds,
    status: "pending",
    type,
    priority,
    scheduledAt: options?.scheduleAt || null,
  });

  // enqueue
  const jobOptions = {
    attempts: 3,
    removeOnComplete: true,
    ...(options?.scheduleAt ? { delay: new Date(options.scheduleAt).getTime() - Date.now() } : {}),
  };
console.log("iasdfhajidfhasd")
  await notificationQueue.add(
    "sendNotification",
    {
      notificationId: notificationDoc._id,
      channels,
      data: { title, body, html },
      userIds,
      options,
    },
    jobOptions
  );

  return notificationDoc;
};



export const createNotification = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    const payload = req.body;
if (!payload || Object.keys(payload).length === 0) {
  return next(new ApiError(400, "Request body is required"));
}

    const { channels, data, userIds, options } = payload;

    if (!data || typeof data !== "object") {
      return next(new ApiError(400, "data object is required"));
    }

    const title = typeof data.title === "string" ? data.title.trim() : "";
    const body = typeof data.body === "string" ? data.body.trim() : "";

    if (!title || !body) {
      return next(new ApiError(400, "data.title and data.body are required"));
    }

    // --- Field size limits (production safety)
    if (title.length > 255) return next(new ApiError(400, "title too long (max 255 chars)"));
    if (body.length > 2000) return next(new ApiError(400, "body too long (max 2000 chars)"));
    if (data.image && typeof data.image === "string" && data.image.length > 2000) {
      return next(new ApiError(400, "image URL too long"));
    }
    if (data.link && typeof data.link === "string" && data.link.length > 2000) {
      return next(new ApiError(400, "link URL too long"));
    }
    if (!Array.isArray(channels) || channels.length === 0) {
      return next(new ApiError(400, "channels array is required"));
    }
    const validChannels = ["mobile", "inApp", "web", "email", "sms", "whatsapp"];
    for (const ch of channels) {
      if (typeof ch !== "string" || !validChannels.includes(ch)) {
        return next(new ApiError(400, `invalid channel: ${ch}`));
      }
    }
console.log("c2")
    // --- Validate userIds
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return next(new ApiError(400, "userIds array is required"));
    }
    // limit recipients to avoid accidental blast
    const MAX_RECIPIENTS = 500;
    if (userIds.length > MAX_RECIPIENTS) {
      return next(new ApiError(400, `too many recipients. max ${MAX_RECIPIENTS}`));
    }
    const invalidIds = userIds.filter((id) => !mongoose.isValidObjectId(id));
    if (invalidIds.length) {
      return next(new ApiError(400, `invalid userIds: ${invalidIds.join(", ")}`));
    }
console.log("c3")
    // --- Validate options
    const allowedTypes = ["opt-in", "transactional", "marketing", "info"];
    const type = options?.type ? String(options.type) : "info";
    if (!allowedTypes.includes(type)) {
      return next(new ApiError(400, `invalid options.type. allowed: ${allowedTypes.join(", ")}`));
    }

    let scheduledAt = null;
    if (options?.scheduleAt) {
      const d = new Date(options.scheduleAt);
      if (Number.isNaN(d.getTime())) {
        return next(new ApiError(400, "options.scheduleAt must be a valid date"));
      }
      if (d.getTime() < Date.now()) {
        return next(new ApiError(400, "options.scheduleAt must be in the future"));
      }
      scheduledAt = d;
    }
let recipients;
try {
  recipients = await User.find({ _id: { $in: userIds } }).lean();
} catch (err) {
  return next(new ApiError(500, err.message));
}

    // --- Check channel-specific recipient readiness, collect errors (do not early-return inside loop)
    const recipientErrors = [];
    for (const recipient of recipients) {
      const rId = String(recipient._id);
      for (const ch of channels) {
        if (ch === "mobile" || ch === "inApp") {
          // support both single token and array field names
          const hasFcm = !!(recipient.fcmToken || (Array.isArray(recipient.fcmToken) && recipient.fcmToken.length));
          if (!hasFcm) recipientErrors.push({ userId: rId, channel: ch, reason: "missing fcmToken" });
        }
        if (ch === "web") {
          const hasWeb = !!(recipient.webPushSubscription || recipient.webPushSubscription?.length);
          if (!hasWeb) recipientErrors.push({ userId: rId, channel: ch, reason: "missing webPushSubscription" });
        }
        if (ch === "email") {
          if (!recipient.email) recipientErrors.push({ userId: rId, channel: ch, reason: "missing email" });
        }
        if (ch === "sms") {
          if (!recipient.phone) recipientErrors.push({ userId: rId, channel: ch, reason: "missing phone" });
        }
        if (ch === "whatsapp") {
          if (!recipient.phone || !recipient.whatsappConsent) {
            recipientErrors.push({ userId: rId, channel: ch, reason: "missing phone or whatsappConsent" });
          }
        }
      }
    }
    if (recipientErrors.length) {
      return next(new ApiError(400, "recipient validation failed", { details: recipientErrors }));
    }
console.log("c7")
    // --- Determine priority
    const priorityMap = { "opt-in": "high", transactional: "high", marketing: "low", info: "normal" };
    const priority = priorityMap[type] || "normal";

    // --- Transaction: save notification then enqueue. If queue fails update status.
    session.startTransaction();
    const notificationDoc = await Notification.create(
      [
        {
          title,
          body,
          image: data.image || null,
          link: data.link || null,
          type,
          priority,
          channels,
          userId: userIds,
          status: scheduledAt ? "queued" : "pending",
          scheduledAt,
        },
      ],
      { session }
    );
    // commit DB transaction before queueing to ensure notification exists
    await session.commitTransaction();
    session.endSession();
console.log("c8")
    // --- Queue job
    const jobOptions = {
      attempts: 3,
      removeOnComplete: true,
      ...(scheduledAt ? { delay: scheduledAt.getTime() - Date.now() } : {}),
    };

    try {
      await notificationQueue.add(
        "sendNotification",
        {
          notificationId: notificationDoc[0]._id,
          channels,
          data: { title, body, image: data.image, link: data.link },
          userIds,
          options: { type, scheduleAt: scheduledAt },
        },
        jobOptions
      );
    } catch (qErr) {
      // mark notification as failed to enqueue. Do NOT throw raw error. Log and update DB.
      console.error("Notification queue error:", qErr);
      await Notification.findByIdAndUpdate(
        notificationDoc[0]._id,
        { status: "failed_to_enqueue", queueError: String(qErr?.message || qErr) },
        { new: true }
      );
      return next(new ApiError(500, "failed to enqueue notification job"));
    }
    return res.status(201).json({
      success: true,
      message: scheduledAt ? "Notification scheduled and queued" : "Notification queued",
      notificationId: notificationDoc[0]._id,
    });
  } catch (err) {
    console.log(err)
    // ensure session cleanup
    try {
      await session.abortTransaction();
      session.endSession();
    } catch (e) {
      /* ignore */
      console.log(e)
    }
    console.error("createNotification error:", err);
    return next(new ApiError(500, err?.message || "Internal Server Error"));
  }
};


export const getNotificationsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, status, sort = "newest" } = req.query;

    // --- Validate userId
    if (!mongoose.isValidObjectId(userId)) {
      return next(new ApiError(400, "Invalid userId"));
    }
     const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return next(new ApiError(404, "User not found"));
    }


    // --- Build filter
    const filter = { userId: userId };
    if (status) {
      const validStatuses = ["pending", "sent", "failed", "queued"];
      if (!validStatuses.includes(status)) {
        return next(new ApiError(400, `Invalid status. Allowed: ${validStatuses.join(", ")}`));
      }
      filter.status = status;
    }

    // --- Pagination setup
    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = sort === "oldest" ? 1 : -1;

    // --- Fetch notifications
    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .populate("userId", "name email phone") // optional
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Notification.countDocuments(filter),
    ]);

    // --- Response
    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
      data: notifications,
    });
  } catch (err) {
    console.error("getNotificationsByUserId error:", err);
    return next(new ApiError(500, err?.message || "Internal Server Error"));
  }
};