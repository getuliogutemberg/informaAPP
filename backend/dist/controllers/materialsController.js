"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GrupoMaterial_1 = __importDefault(require("../models/GrupoMaterial"));
const CadastroMaterial_1 = require("../models/CadastroMaterial");
class MaterialController {
    async getMaterialByGroup(req, res) {
        try {
            const { cod_grupo } = req.params;
            if (!cod_grupo) {
                return res.status(400).json({
                    message: "O código do grupo é obrigatório."
                });
            }
            // Busca os materiais do grupo (onde cod_grupo bate)
            const materiaisDoGrupo = await GrupoMaterial_1.default.findAll({
                where: { cod_grupo: Number(cod_grupo) }
            });
            if (materiaisDoGrupo.length === 0) {
                return res.status(404).json({
                    message: "Nenhum material encontrado para este grupo."
                });
            }
            // Extrai os códigos dos materiais
            const codigosMateriais = materiaisDoGrupo.map(m => m.cod_item_material);
            // Busca os detalhes dos materiais pelo cod_item_material
            const materiais = await CadastroMaterial_1.CadastroMaterial.findAll({
                where: {
                    cod_item_material: codigosMateriais
                }
            });
            return res.status(200).json(materiais);
        }
        catch (error) {
            const err = error instanceof Error ? error : new Error('Erro desconhecido');
            return res.status(500).json({
                message: "Erro ao buscar materiais",
                error: err.message
            });
        }
    }
}
exports.default = new MaterialController();
