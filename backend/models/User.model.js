import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  googleId: String,

  //  active resume pointer
  activeResume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resume",
  },
  plan: {
    type: String,
    enum: ["free", "basic", "advanced", "enterprize"],
    default: "free",
  },

  planExpiry: Date,

  usage: {
    dailyCount: Number,
    monthlyCount: Number,
    lastUsed: Date,
    lastMonth: Number,
  },
  role: { type: String, enum: ["user", "admin"], default: "user" },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
