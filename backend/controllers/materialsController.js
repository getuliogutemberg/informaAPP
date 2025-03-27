const cadastro_material = require("../models/CadastroMaterial");

class MaterialController {
    async getMaterialByGroup(req, res) {
        try {
            const { groupId } = req.params;

            if (!groupId) {
                return res.status(400).json({ message: "O código do grupo é obrigatório." });
            }

            const materiais = await cadastro_material.find({ 
                cod_grupo: groupId });

            if (materiais.length > 0) {
                res.status(200).json(materiais);
            } else {
                res.status(404).json({ message: "Nenhum material encontrado para este grupo." });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new MaterialController();