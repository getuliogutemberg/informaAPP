const { GroupParams } = require("../models/ParametrosEstrategiaGrupo");

const getGroupParamsById = async (req, res) => {
    try {
        const codGrupo = req.params.cod_grupo;

        const groupParams = await GroupParams.findOne({
            where: { cod_grupo: codGrupo },
        });

        if (groupParams) {
            res.status(200).json(groupParams);
        } else {
            res.status(404).json({ message: "Grupo não encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createGroupParams = async (req, res) => {
    try {
        const {
            param_indisponibilidade_ug,
            param_indisponibilidade_seg,
            param_afeta_ativo,
            param_leadtime,
            param_diversidade_fornecedor,
            param_obsolecencia,
            param_multiplos_ativos,
            param_prob_uso,
            param_opiniao_especialista,
        } = req.body;

        const newGroupParams = await GroupParams.create({
            cod_grupo,
            param_indisponibilidade_ug,
            param_indisponibilidade_seg,
            param_afeta_ativo,
            param_leadtime,
            param_diversidade_fornecedor,
            param_obsolecencia,
            param_multiplos_ativos,
            param_prob_uso,
            param_opiniao_especialista,
        });

        res.status(201).json(newGroupParams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateGroupParams = async (req, res) => {
    try {
        const codGrupo = req.params.cod_grupo;

        const {
            param_indisponibilidade_ug,
            param_indisponibilidade_seg,
            param_afeta_ativo,
            param_leadtime,
            param_diversidade_fornecedor,
            param_obsolecencia,
            param_multiplos_ativos,
            param_prob_uso,
            param_opiniao_especialista,
        } = req.body;

        const updatedGroupParams = await GroupParams.update( 
            {
                cod_grupo,
                param_indisponibilidade_ug,
                param_indisponibilidade_seg,
                param_afeta_ativo,
                param_leadtime,
                param_diversidade_fornecedor,
                param_obsolecencia,
                param_multiplos_ativos,
                param_prob_uso,
                param_opiniao_especialista,
            },
            {
                where: { cod_grupo: codGrupo },
            }
        );

        if (updatedGroupParams) {
            res.status(200).json({ message: "Grupo atualizado com sucesso" });
        } else {
            res.status(404).json({ message: "Grupo não encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteGroupParams = async (req, res) => {
    try {
        const codGrupo = req.params.cod_grupo;

        const deletedGroupParams = await GroupParams.destroy({
            where: { cod_grupo: codGrupo },
        });

        if (deletedGroupParams) {
            res.status(200).json({ message: "Grupo excluído com sucesso" });
        } else {
            res.status(404).json({ message: "Grupo não encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getGroupParamsById,
    createGroupParams,
    updateGroupParams,
    deleteGroupParams,
};

