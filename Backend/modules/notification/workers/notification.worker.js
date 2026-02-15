import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.config.js";
import Notification from "../models/notification.model.js";
import sendEmail from "../services/email.service.js";
import sendSMS from "../services/sms.service.js";
import sendWhatsAppMessage from "../services/whatsapp.service.js";
import sendInAppNotification from "../services/inApp.service.js";
import sendPushToWeb from "../services/push.service.js";
import User from "../../HR/models/masters/user.model.js";

export const startNotificationWorker = () => {
  console.log("✅ Notification worker started...");

  const worker = new Worker(
    "notificationQueue",
    async (job) => {
      const { notificationId, channels, data, userIds } = job.data;

      const notification = await Notification.findById(notificationId);
      if (!notification) throw new Error("Notification not found");

      console.log(`📨 Processing job ${job.id} for users:`, userIds.length);

      const users = await User.find({ _id: { $in: userIds } });

      const channelStatus = {};
      let failedReason = null;

      for (const user of users) {
        for (const channel of channels) {
          try {
            // Skip channel if user has disabled preference
            if (user.preferences?.[channel] === false) {
              channelStatus[channel] = "skipped";
              continue;
            }

            switch (channel) {
              case "mobile":
              case "inApp":
                if (user.fcmToken)
                  await sendInAppNotification({
                    token: user.fcmToken,
                    title: data.title,
                    body: data.body,
                    icon: data.icon,
                    image: data?.image,
                  });
                else channelStatus[channel] = "no_token";
                break;

              case "web":
                if (user.webPushSubscription)
                  await sendPushToWeb(
                    user.webPushSubscription,
                    data.title,
                    data.body,
                    {
                      icon: data.icon,
                      image: data.image,
                      url: data.url,
                    }
                  );
                else channelStatus[channel] = "no_subscription";
                break;

              case "email":
                if (user.email)
                  await sendEmail({
                    to: user.email,
                    subject: data.title,
                    html: `<p>${data.body}</p>`,
                  });
                else channelStatus[channel] = "no_email";
                break;

              case "sms":
                if (user.phone)
                  await sendSMS({
                    to: user.phone,
                    message: data.body,
                  });
                else channelStatus[channel] = "no_phone";
                break;

              case "whatsapp":
                if (user.phone && user.whatsappConsent)
                  await sendWhatsAppMessage({
                    to: user.phone,
                    contentSid: data.contentSid,
                    contentVariables: data.contentVariables || {},
                  });
                else channelStatus[channel] = "no_consent";
                break;

              default:
                channelStatus[channel] = "unknown_channel";
            }

            channelStatus[channel] = channelStatus[channel] || "sent";
          } catch (err) {
            console.error(`❌ Error sending via ${channel}:`, err.message);
            channelStatus[channel] = "failed";
            failedReason = err.message;
          }
        }
      }

      // Update DB
      await Notification.findByIdAndUpdate(notificationId, {
        status: failedReason ? "failed" : "sent",
        channelStatus,
        failedReason: failedReason || null,
      });

      console.log(`✅ Notification ${notificationId} processed`);
    },
    { connection: redisConnection }
  );

  worker.on("completed", (job) =>
    console.log(`✅ Job ${job.id} completed successfully`)
  );

  worker.on("failed", (job, err) =>
    console.error(`❌ Job ${job.id} failed:`, err.message)
  );
};
