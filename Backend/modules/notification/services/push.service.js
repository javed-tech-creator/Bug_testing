import webPush from "web-push";
import dotenv from "dotenv";
dotenv.config();

webPush.setVapidDetails(
  process.env.VAPID_SUBJECT || "mailto:admin@example.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const sendPushToWeb = async (subscription, title, body, data = {}) => {
  if (!subscription || !subscription.endpoint)
    throw new Error("Invalid web push subscription");

  try {
    const payload = JSON.stringify({
      title,
      body,
      icon: data?.icon,
      image: data.image || null,
      url: data?.url ,
      data,
    });
    const response = await webPush.sendNotification(subscription, payload);

    console.log("✅ Web push sent successfully");
    return { success: true, statusCode: response.statusCode || 201 };
  } catch (err) {
    console.error(
      "❌ Web push failed:",
      err.statusCode || 500,
      err.body || err.message
    );
    throw err;
  }
};

export default sendPushToWeb;
