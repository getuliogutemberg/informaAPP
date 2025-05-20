"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Configuration_1 = __importDefault(require("../models/Configuration"));
class ConfigurationController {
    constructor() {
        this.getConfiguration = async (req, res) => {
            try {
                // Busca primeira configuração (assumindo apenas 1 registro)
                let config = await Configuration_1.default.findOne();
                if (config) {
                    // Remove campos desnecessários manualmente
                    const { id, createdAt, updatedAt, ...filteredConfig } = config.get({ plain: true });
                    return res.json(filteredConfig);
                }
                else {
                    // Cria configuração padrão caso não exista
                    const defaultConfig = {
                        notifications: true,
                        allowRegister: false,
                        allowRequireRegister: false,
                        allowNewCategory: false,
                        allowNewClassName: false,
                        addSecretKey: false,
                        addCategory: true,
                        fontFamily: 'Arial',
                        pageTitle: 'Configurações',
                        themeMode: 'light',
                        primaryColor: 56,
                        secondaryColor: 180,
                        backgroundColor: 0,
                        textColor: 0,
                        pbiKeys: {
                            clientId: "b918d10b-19f4-44c3-a58e-36e311e734ce",
                            clientSecret: "dmZ8Q~Nmgk-9wiaO2Wxe6qRc8TZI.MZ8ob3psaP5",
                            authority: "https://login.microsoftonline.com/80899d73-a5f2-4a53-b252-077af6003b36"
                        }
                    };
                    const newConfig = await Configuration_1.default.create(defaultConfig);
                    const { id, createdAt, updatedAt, ...filteredNewConfig } = newConfig.get({ plain: true });
                    return res.json(filteredNewConfig);
                }
            }
            catch (error) {
                console.error("Erro ao buscar configurações:", error);
                return res.status(500).json({ message: "Erro ao buscar configurações" });
            }
        };
        this.updateConfiguration = async (req, res) => {
            try {
                // Atualiza a primeira configuração encontrada ou cria caso não exista (upsert)
                const [affectedRows, [updatedConfig]] = await Configuration_1.default.update(req.body, {
                    where: {}, // Sem filtro: pega o primeiro registro (assumindo um registro único)
                    returning: true,
                    limit: 1,
                });
                if (affectedRows === 0) {
                    // Nenhum registro atualizado, então cria um novo
                    const createdConfig = await Configuration_1.default.create(req.body);
                    const { id, createdAt, updatedAt, ...filteredCreatedConfig } = createdConfig.get({ plain: true });
                    return res.json(filteredCreatedConfig);
                }
                const { id, createdAt, updatedAt, ...filteredConfig } = updatedConfig.get({ plain: true });
                return res.json(filteredConfig);
            }
            catch (error) {
                console.error("Erro ao atualizar configurações:", error);
                return res.status(500).json({ message: "Erro ao atualizar configurações" });
            }
        };
    }
}
exports.default = new ConfigurationController();
