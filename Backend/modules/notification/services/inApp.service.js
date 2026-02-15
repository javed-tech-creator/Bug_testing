import admin from "../config/firebase.config.js";

const sendInAppNotification = async ({
  token,
  title,
  body,
  data = {},
  image
}) => {
  try {
    const message = {
      token,
      notification: { title, body },
      android: {
        notification: {
          imageUrl: image,
        },
      },
      data,
    };

    const response = await admin.messaging().send(message);
    console.log("✅ In-app notification sent:", response);
    return response;
  } catch (error) {
    console.log(error);
    console.error("❌ In-app notification failed:", error.message);
    throw error;
  }
};

export default sendInAppNotification;
