const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema({
  path: { type: String, required: true },
  component: { type: String, required: true },
  name: { type: String, required: true },
  requiredRole: { type: [String], default: [] }, // Role de usuários que podem acessar
  pageId: { type: String, required: false }, // Adiciona o pageId para Dashboards, se necessário
  reportId: { type: String, required: false }, // Adiciona o pageId para Dashboards, se necessário
  workspaceId: { type: String, required: false },
  icon:{ type: String, required: false },
}, { timestamps: true });

module.exports = mongoose.model("Route", RouteSchema);
