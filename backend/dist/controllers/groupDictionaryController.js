"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DicionarioGrupo_1 = __importDefault(require("../models/DicionarioGrupo"));
class GroupDictionaryController {
    async getGroupDictionaries(req, res) {
        try {
            const grupos = await DicionarioGrupo_1.default.findAll();
            if (grupos.length > 0) {
                return res.status(200).json(grupos);
            }
            else {
                return res.status(404).json({
                    message: "Grupo não encontrado"
                });
            }
        }
        catch (error) {
            const err = error instanceof Error ? error : new Error('Erro desconhecido');
            return res.status(500).json({
                message: "Erro ao buscar grupos",
                error: err.message
            });
        }
    }
}
exports.default = new GroupDictionaryController();
