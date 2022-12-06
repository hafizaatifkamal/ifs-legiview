const mongoose = require("mongoose");

const UserRoleSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      unique: true,
    },
    permission: {
      type: [String],
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const userRoleModel = mongoose.model("UserRole", UserRoleSchema);

module.exports = userRoleModel;
