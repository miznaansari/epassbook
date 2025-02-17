const mongoose = require("mongoose");
const { Schema } = mongoose;

const QuickAccessSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId, // ✅ Foreign key reference to User
      ref: "User", // Reference to User model
      required: true,
    },
    category: {
      type: String,
      enum: ["food", "travel", "expenses", "other"], // Optional categories
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
      min: 0, // Ensure cost is not negative
    },
  },
  { timestamps: true }
);

// Create and export the QuickAccess model
const QuickAccess = mongoose.model("QuickAccess", QuickAccessSchema);
module.exports = QuickAccess;
