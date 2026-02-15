import notificationModel from "../../models/vendor.model/notification.Model.js";

export const getNotifications = async (req, res) => { 
  const vendorId = req.user._id;

  // Current date/time se 3 din pehle ka date/time
  const sevenDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  const [items, total] = await Promise.all([
    notificationModel
      .find({ 
        vendorId, 
        createdAt: { $gte: sevenDaysAgo } // last 3 din ke notifications
      })
      .sort({ createdAt: -1 }),
    notificationModel.countDocuments({ 
      vendorId, 
      createdAt: { $gte: sevenDaysAgo } 
    }),
  ]);

  res.json({ notifications: items, total });
};


export const markRead = async (req, res) => {
const vendorId = req.user._id;
const { id } = req.params;
const n = await notificationModel.findOneAndUpdate({ _id: id, vendorId }, { isRead: true }, { new: true });
if (!n) return res.status(404).json({ message: "Not found" });
res.json({ notification: n });
};


export const markAllRead = async (req, res) => {
const vendorId = req.user._id;
await notificationModel.updateMany({ vendorId, isRead: false }, { isRead: true });
res.json({ ok: true });
};