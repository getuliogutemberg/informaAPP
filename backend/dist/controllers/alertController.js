"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Alert_1 = require("../models/Alert");
class AlertController {
    constructor() {
        this.getAllAlerts = async (req, res) => {
            try {
                // Com paranoid: true, findAll já ignora registros soft deleted
                const alerts = await Alert_1.Alert.findAll();
                return res.json(alerts);
            }
            catch (error) {
                const err = error instanceof Error ? error : new Error('Erro desconhecido');
                return res.status(500).json({
                    message: 'Erro ao buscar alertas',
                    error: err.message,
                });
            }
        };
        this.createAlert = async (req, res) => {
            const { type, title, description, color, icon } = req.body;
            if (!type || !title || !description) {
                return res.status(400).json({
                    message: 'Tipo, título e descrição são obrigatórios',
                });
            }
            try {
                const newAlert = await Alert_1.Alert.create({ type, title, description, color, icon });
                return res.status(201).json(newAlert);
            }
            catch (error) {
                const err = error instanceof Error ? error : new Error('Erro ao criar alerta');
                return res.status(400).json({
                    message: 'Erro ao criar alerta',
                    error: err.message,
                });
            }
        };
        this.updateAlert = async (req, res) => {
            try {
                const { id } = req.params;
                const { type, title, description, color, icon } = req.body;
                if (!type || !title || !description) {
                    return res.status(400).json({
                        message: 'Tipo, título e descrição são obrigatórios',
                    });
                }
                const alert = await Alert_1.Alert.findByPk(id);
                if (!alert) {
                    return res.status(404).json({ message: 'Alerta não encontrado!' });
                }
                await alert.update({ type, title, description, color, icon });
                return res.json(alert);
            }
            catch (error) {
                const err = error instanceof Error ? error : new Error('Erro ao atualizar alerta');
                console.error('Erro ao editar o alerta:', err);
                return res.status(500).json({
                    message: 'Erro ao editar o alerta',
                    error: err.message,
                });
            }
        };
        this.deleteAlert = async (req, res) => {
            try {
                const alert = await Alert_1.Alert.findByPk(req.params.id);
                if (!alert) {
                    return res.status(404).json({ message: 'Alerta não encontrado' });
                }
                await alert.destroy(); // soft delete por causa do paranoid: true
                return res.json({ message: 'Alerta removido com sucesso!' });
            }
            catch (error) {
                const err = error instanceof Error ? error : new Error('Erro ao remover alerta');
                return res.status(400).json({
                    message: 'Erro ao remover alerta',
                    error: err.message,
                });
            }
        };
    }
}
exports.default = new AlertController();
