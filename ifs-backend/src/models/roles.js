const mongoose = require("mongoose");

const RolesSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const rolesModel = mongoose.model("Role", RolesSchema);

module.exports = rolesModel;
