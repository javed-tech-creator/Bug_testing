import express from "express";
import {createNotification, getNotificationsByUserId} from '../controllers/notification.controller.js'
import { saveFcmToken, saveSubscriber } from "../controllers/subscriber.controller.js";

const router = express.Router();
router.post("/", createNotification);
router.post("/subs/:id",saveSubscriber)
router.post("/fcm/:id",saveFcmToken)
router.get("/user/:userId", getNotificationsByUserId);
export default router;
