import dotenv from 'dotenv';
import { ConfidentialClientApplication } from '@azure/msal-node';
import fetch, { Headers } from 'node-fetch';

dotenv.config({ path: '../.env' });

// Interfaces para tipagem
interface MsalConfig {
    auth: {
        clientId: string;
        clientSecret: string;
        authority: string;
    };
}

interface ReportDetails {
    id: string;
    datasetId: string;
    embedUrl: string;
    name?: string;
    [key: string]: any;
}

interface EmbedTokenRequest {
    reports: Array<{ id: string }>;
    datasets: Array<{ id: string }>;
}

interface EmbedTokenResponse {
    token: string;
    tokenId: string;
    expiration: string;
    [key: string]: any;
}

interface ErrorResponse {
    error?: {
        code?: string;
        message?: string;
    };
}

// Configuração MSAL
const msalConfig: MsalConfig = {
    auth: {
        clientId: process.env.AZURE_APP_ID || '',
        clientSecret: process.env.AZURE_APP_SECRET || '',
        authority: "https://login.microsoftonline.com/80899d73-a5f2-4a53-b252-077af6003b36",
    },
};

export const msalClient = new ConfidentialClientApplication(msalConfig);

// Configuração Power BI
export const config = {
    workspaceId: process.env.POWER_BI_WORKSPACE_ID || '',
    reportId: "0a95eaa5-9435-47c8-b12d-10b4df2858c2",
    pageId: "d7d35c6daec9e7e50737",
};

export async function getReportDetails(token: string, reportId: string, workspaceId: string): Promise<ReportDetails> {
    const url = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`;
    const headers = new Headers({ Authorization: `Bearer ${token}` });

    const response = await fetch(url, { headers });
    
    if (!response.ok) {
        throw new Error(`Erro ao buscar relatório: ${response.statusText}`);
    }

    return response.json() as Promise<ReportDetails>;
}

export async function generateEmbedToken(token: string, datasetId: string, reportId: string): Promise<EmbedTokenResponse | null> {
    const url = "https://api.powerbi.com/v1.0/myorg/GenerateToken";
    const body: EmbedTokenRequest = {
        reports: [{ id: reportId }],
        datasets: [{ id: datasetId }],
    };

    const headers = new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    });

    try {
        const response = await fetch(url, { 
            method: "POST", 
            headers, 
            body: JSON.stringify(body) 
        });

        const contentType = response.headers.get("content-type");
        let responseData: EmbedTokenResponse | ErrorResponse | string;

        if (contentType?.includes("application/json")) {
            responseData = await response.json() as EmbedTokenResponse | ErrorResponse;
        } else {
            responseData = await response.text();
        }

        if (!response.ok) {
            const errorData = responseData as ErrorResponse;
            throw new Error(
                `❌ ERRO ${response.status} - ${errorData.error?.code || "Desconhecido"}: ${errorData.error?.message || responseData}`
            );
        }

        return responseData as EmbedTokenResponse;
    } catch (error: unknown) {
        const err = error as Error;
        console.error("Erro ao adquirir token:", err.message);
        return null;
    }
}