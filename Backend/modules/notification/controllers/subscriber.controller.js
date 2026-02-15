import mongoose from "mongoose";
import ApiError from "../../../utils/master/ApiError.js";
import User from "../../HR/models/masters/user.model.js";

export const saveSubscriber = async (req, res, next) => {
  console.log("saveSubscriber called", req.params, req.body); // debug entry
  try {
    if (!req.body || !req.params) {
      console.log("Missing params/body");
      return next(new ApiError(400, "userId and subscription are required"));
    }

    const { id } = req.params;
    const { subscription } = req.body;
    console.log("Parsed inputs", id, subscription);

    if (!id || !subscription) {
      console.log("Missing id/subscription");
      return next(new ApiError(400, "userId and subscription are required"));
    }

    if (!mongoose.isValidObjectId(id)) {
      console.log("Invalid user id", id);
      return next(new ApiError(400, "Invalid User ID"));
    }

    if (
      typeof subscription !== "object" ||
      !subscription.endpoint ||
      !subscription.keys ||
      !subscription.keys.auth ||
      !subscription.keys.p256dh
    ) {
      console.log("Invalid subscription object", subscription);
      return next(new ApiError(400, "Invalid or incomplete subscription object"));
    }

    const existingUser = await User.findById(id);
    if (!existingUser) {
      console.log("User not found", id);
      return next(new ApiError(404, "User not found"));
    }

    existingUser.webPushSubscription = subscription;
    await existingUser.save();
    console.log("Subscription saved for", id);
    return res.api(200, "Subscription updated successfully!");
  } catch (err) {
    console.error("Save subscriber failed:", err); // ensures visible log
    next(new ApiError(500, err?.message || "Internal Server Error", [], err.stack));
  }
};


export const saveFcmToken = async (req, res, next) => {
  try {
    const { id } = req.query;
    const { fcmToken } = req.body;
    if (!id || !fcmToken) {
      return next(new ApiError(400, "userId and fcmToken are required"));
    }
    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid User ID"));
    }
    if (typeof fcmToken !== "string" || fcmToken.trim() === "") {
      return next(new ApiError(400, "Invalid FCM token"));
    }
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return next(new ApiError(404, "User not found"));
    }
    existingUser.fcmToken = fcmToken;
    await existingUser.save();
    return res.api(200, "FCM token updated successfully!");
  } catch (err) {
    next(new ApiError(500, err?.message || "Internal Server Error"));
  }
};
