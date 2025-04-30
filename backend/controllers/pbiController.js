const { msalClient } = require("../utils/PBIEMBEDED");
const { getReportDetails, generateEmbedToken } = require("../utils/PBIEMBEDED"); 

class PBIController {
    getPBIToken = async (req, res) => {
        const { pageId, reportId, workspaceId } = req.params;

        try {
            const response = await msalClient.acquireTokenByClientCredential({
                scopes: ["https://analysis.windows.net/powerbi/api/.default"],
            });

            if (!response || !response.accessToken) {
                throw new Error("Falha ao obter token de acesso");
            }

            const reportDetails = await getReportDetails(response.accessToken, reportId, workspaceId);
            const embedTokenResponse = await generateEmbedToken(
                response.accessToken,
                reportDetails.datasetId,
                reportId
            );

            res.status(200).json({
                accessToken: embedTokenResponse.token,
                embedUrl: reportDetails.embedUrl,
                expiry: embedTokenResponse.expiration,
                pageId: pageId,
            });
        } catch (error) {
            console.error("Erro ao adquirir token:", error);
            res.status(500).json({
                error: "Falha ao adquirir token",
                details: error.message,
            });
        }
    };
}

module.exports = new PBIController();