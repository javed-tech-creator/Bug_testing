import notificationModel from "../../models/vendor.model/notification.Model.js";


export const createAndEmit = async ({ io, vendorId, type, message, meta = {} }) => {
  
const doc = await notificationModel.create({ vendorId, type, message, meta });

io.to(String(vendorId)).emit("newNotification", {
_id: doc._id,
type: doc.type,
message: doc.message,
isRead: doc.isRead,
meta: doc.meta,
createdAt: doc.createdAt,
});
return doc;
};