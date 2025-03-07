const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  event: { type: String, required: true },
  description: { type: String, required: true },
  creationDate: { type: Date, default: Date.now, required: true },
});

const catchLocationSchema = new mongoose.Schema({
  site: { type: String, required: true },
  department: { type: String, required: true },
  creationUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  events: [eventSchema], // Array of events
});

const GoodCatch = mongoose.model("GoodCatch", catchLocationSchema); // Use catchLocationSchema here

module.exports = GoodCatch;                                    