const mongoose = require("mongoose");

const GrupoMaterialSchema = new mongoose.Schema({
  cod_item_material: Number,
  cod_grupo: Number,
  data_grupo: Date,
  deletedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model("GrupoMaterial", GrupoMaterialSchema);