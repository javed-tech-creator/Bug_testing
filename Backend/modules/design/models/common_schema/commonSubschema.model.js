export const remarkSchema = {
  rating: { type: Number, default: null },
  title: { type: String, default: "" },
  remark: { type: String, default: "" },
};

export const feedbackSchema = {
  feedback: { type: String, default: "" },
  rating: { type: Number, default: null },

  final_decision: {
    type: String,
    enum: ["accepted", "decline", "flag", "pending"],
    default: "pending",
  },

  decline_remark: { type: String, default: "" },

  flag_type: {
    type: String,
    enum: ["blue", "yellow", "red", ""],
    default: "",
  },

  flag_remark: { type: String, default: "" },
};
