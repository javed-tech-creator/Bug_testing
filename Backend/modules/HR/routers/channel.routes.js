import express from "express";
import {
  createChannel,
  getAllChannels,
  getChannelById,
  updateChannel,
  softDeleteChannel,
  deleteChannelPermanently,
} from "../controllers/channel.controller.js";

const router = express.Router();

router.post("/", createChannel);
router.get("/", getAllChannels);
router.get("/:id", getChannelById);
router.put("/:id", updateChannel);
router.delete("/:id", softDeleteChannel);
router.delete("/permanent/:id", deleteChannelPermanently);

export default router;
