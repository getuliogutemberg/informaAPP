const { IndividualParams } = require("../models/ParametrosEstrategiaIndividual");

const createIndividualParams = async (req, res) => {
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

        const newIndividualParams = await IndividualParams.create({
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

        res.status(201).json(newIndividualParams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getIndividualParams = async (req, res) => {
    try {
        const codGrupo = req.params.cod_grupo;

        const individualParams = await IndividualParams.findOne({
            where: { cod_grupo: codGrupo },
        });

        if (individualParams) {
            res.status(200).json(individualParams);
        } else {
            res.status(404).json({ message: "Parâmetros não encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateIndividualParams = async (req, res) => {
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

        const updatedIndividualParams = await IndividualParams.update( 
            {
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

        if (updatedIndividualParams) {
            res.status(200).json({ message: "Parâmetros atualizado com sucesso" });
        } else {
            res.status(404).json({ message: "Parâmetros não encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteIndividualParams = async (req, res) => {
    try {
        const codGrupo = req.params.cod_grupo;

        const deletedGroupParams = await IndividualParams.destroy({
            where: { cod_grupo: codGrupo },
        });

        if (deletedGroupParams) {
            res.status(200).json({ message: "Parâmetros excluído com sucesso" });
        } else {
            res.status(404).json({ message: "Parâmetros não encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createIndividualParams,
    getIndividualParams,
    updateIndividualParams,
    deleteIndividualParams,
};