const mongoose = require("mongoose");
const CompanyModel = require("./companies");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: [String],
      required: false,
    },
    refreshToken: {
      type: [String],
      required: false,
    },
    role: {
      type: String,
      required: true,
    },
    comapnyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: CompanyModel,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const userModel = mongoose.model("User", UserSchema);

module.exports = userModel;
