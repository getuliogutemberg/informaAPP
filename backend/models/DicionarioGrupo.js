const mongoose = require("mongoose");

const DicionarioCriticidadeSchema = new mongoose.Schema({
  cod_criticidade: Number,
  desc_criticidade: String,
  deletedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model("DicionarioCriticidade",DicionarioCriticidadeSchema);