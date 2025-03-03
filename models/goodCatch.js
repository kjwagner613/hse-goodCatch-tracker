const mongoose = require("mongoose");
const {
  companySites,
  eventCategories,
  corpDepartments,
} = require("../constants");

const eventSchema = new mongoose.Schema({
  event: {
    type: String,
    enum: eventCategories,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const goodCatchSchema = new mongoose.Schema({
  site: {
    type: String,
    enum: companySites,
    required: true,
  },
  department: {
    type: String,
    enum: corpDepartments,
    required: true,
  },
  creationUser: {
    // ✅ ADD THIS BACK!
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // Make optional if needed
  },
  events: [eventSchema],
});

const GoodCatch = mongoose.model("GoodCatch", goodCatchSchema);
module.exports = GoodCatch;
