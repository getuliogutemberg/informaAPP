"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PBIEMBEDED_1 = require("../utils/PBIEMBEDED");
const PBIEMBEDED_2 = require("../utils/PBIEMBEDED");
class PBIController {
    constructor() {
        this.getPBIToken = async (req, res) => {
            const { pageId, reportId, workspaceId } = req.params;
            try {
                // Adquire token de acesso
                const response = await PBIEMBEDED_1.msalClient.acquireTokenByClientCredential({
                    scopes: ["https://analysis.windows.net/powerbi/api/.default"],
                });
                if (!response?.accessToken) {
                    throw new Error("Falha ao obter token de acesso");
                }
                // Obtém detalhes do relatório
                const reportDetails = await (0, PBIEMBEDED_2.getReportDetails)(response.accessToken, reportId, workspaceId);
                // Gera token de embed com tratamento para null
                const embedTokenResponse = await (0, PBIEMBEDED_2.generateEmbedToken)(response.accessToken, reportDetails.datasetId, reportId);
                // Verifica se o token foi gerado
                if (!embedTokenResponse) {
                    throw new Error("Falha ao gerar token de embed");
                }
                // Retorna resposta formatada
                res.status(200).json({
                    accessToken: embedTokenResponse.token,
                    embedUrl: reportDetails.embedUrl,
                    expiry: embedTokenResponse.expiration,
                    pageId: pageId,
                });
            }
            catch (error) {
                console.error("Erro ao adquirir token:", error);
                const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
                res.status(500).json({
                    error: "Falha ao adquirir token",
                    details: errorMessage,
                });
            }
        };
    }
}
exports.default = new PBIController();
