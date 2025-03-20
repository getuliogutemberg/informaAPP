const mongoose = require("mongoose");

const CadastroMaterialSchema = new mongoose.Schema({
  cod_item_material: Number,
  cod_itemmaterial_ext: Number,
  desc_material: String,
  desc_numero_itemmaterial: String,
  cod_unidade_medida: { type: mongoose.Schema.Types.ObjectId, ref: 'UnidadeMedida' },
  cod_classematerial: { type: mongoose.Schema.Types.ObjectId, ref: 'ClasseMaterial' },
  deletedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model("CadastroMaterial", CadastroMaterialSchema);
