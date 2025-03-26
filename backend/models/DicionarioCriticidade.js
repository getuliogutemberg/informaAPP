const mongoose = require("mongoose");

const DicionarioGrupoSchema = new mongoose.Schema({
  cod_item_material: Number,
  cod_criticidade: Number,
  data_criticidade: Date,
  deletedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model("DicionarioGrupo",DicionarioGrupoSchema);