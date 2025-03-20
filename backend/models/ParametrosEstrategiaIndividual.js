const mongoose = require("mongoose");

const ParametrosEstrategiaIndividualSchema = new mongoose.Schema({
  cod_int_material: { type: mongoose.Schema.Types.ObjectId, ref: 'CadastroMaterial' },
  param_indisponibilidade_ug: Number,
  param_indisponibilidade_seg: Number,
  param_afeta_ativo: String,
  param_leadtime: String,
  param_diversidade_fornecedor: String,
  param_obsolecencia: String,
  param_multiplos_ativos: String,
  param_prob_uso: String,
  param_opiniao_especialista: String,
  deletedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model("ParametrosEstrategiaIndividual", ParametrosEstrategiaIndividualSchema);