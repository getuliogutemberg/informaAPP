const mongoose = require("mongoose");

const GrupoMaterialSchema = new mongoose.Schema({
  cod_item_material: { type: mongoose.Schema.Types.ObjectId, ref: 'CadastroMaterial' },
  cod_grupo: { type: mongoose.Schema.Types.ObjectId, ref: 'DicionarioGrupo' },
  data_grupo: Date,
  deletedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model("GrupoMaterial", GrupoMaterialSchema);