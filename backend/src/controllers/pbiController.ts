import { Request, Response } from 'express';
import { msalClient } from '../utils/PBIEMBEDED';
import { getReportDetails, generateEmbedToken } from '../utils/PBIEMBEDED';

interface PBIResponse {
    accessToken: string;
    embedUrl: string;
    expiry: string;
    pageId: string;
}

interface ErrorResponse {
    error: string;
    details?: string;
}

class PBIController {
    public getPBIToken = async (req: Request, res: Response<PBIResponse | ErrorResponse>): Promise<void> => {
        const { pageId, reportId, workspaceId } = req.params;

        try {
            // Adquire token de acesso
            const response = await msalClient.acquireTokenByClientCredential({
                scopes: ["https://analysis.windows.net/powerbi/api/.default"],
            });

            if (!response?.accessToken) {
                throw new Error("Falha ao obter token de acesso");
            }

            // Obtém detalhes do relatório
            const reportDetails = await getReportDetails(
                response.accessToken, 
                reportId, 
                workspaceId
            );

            // Gera token de embed com tratamento para null
            const embedTokenResponse = await generateEmbedToken(
                response.accessToken,
                reportDetails.datasetId,
                reportId
            );

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

        } catch (error: unknown) {
            console.error("Erro ao adquirir token:", error);
            
            const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
            
            res.status(500).json({
                error: "Falha ao adquirir token",
                details: errorMessage,
            });
        }
    };
}

export default new PBIController();