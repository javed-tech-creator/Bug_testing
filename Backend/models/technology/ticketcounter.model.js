// models/counter.model.js
import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true , trim: true,}, // e.g. "ticket"
  seq: { type: Number, default: 0 },
});

 const TicketCounterModel = mongoose.model("TicketCounter", counterSchema);
 export default TicketCounterModel

