import React, { useEffect, useState } from 'react';
import { service, factories, models, Report } from 'powerbi-client';
import axios from 'axios';


interface ReportDetails {
  accessToken: string;
  embedUrl: string;
  pageId: string;
}

const PowerBIReport: React.FC<ReportDetails> = ({ embedUrl, accessToken, pageId }) => {
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    const containerId = `powerbi-container-${pageId}`;
    const reportContainer = document.getElementById(containerId);

    if (!reportContainer || !accessToken) return;

    const config: models.IEmbedConfiguration = {
      type: 'report',
      embedUrl,
      accessToken,
      
      tokenType: models.TokenType.Embed,
      settings: {
        panes: {
          filters: { visible: false },
          pageNavigation: { visible: false },
        },
        navContentPaneEnabled: false,
        background: models.BackgroundType.Default, // Adiciona background transparente
        layoutType: models.LayoutType.Custom, // Permite layout customizado
        customLayout: { // Ajusta o layout para remover margens
          displayOption: models.DisplayOption.FitToWidth,
        },
         
      },
    };

    const powerBiService = new service.Service(
      factories.hpmFactory,
      factories.wpmpFactory,
      factories.routerFactory
    );

    
    if (report) {
      report.off('loaded');
      report.off('error');
      
    }

    try {
      const embeddedReport = powerBiService.embed(reportContainer, config) as Report;
      setReport(embeddedReport);

      embeddedReport.on('loaded', async () => {
        try {
          const pages = await embeddedReport.getPages();
          const targetPage = pages.find((page) => page.name === pageId);
          if (targetPage) {
            await targetPage.setActive();
          } else {
            console.error('Página especificada não encontrada.');
          }
        } catch (error) {
          console.error('Erro ao carregar páginas:', error);
        }
      });

      embeddedReport.on('error', (event: { detail: string }) => console.error(event.detail));
    } catch (error) {
      console.error('Erro ao embutir o relatório:', error);
    }

    return () => {
      if (report) {
        report.off('loaded');
        report.off('error');
        // report.destroy();
      }
    };
  }, [accessToken, embedUrl, pageId]); // **Agora depende corretamente do pageId**

  return <div 
    style={{
      // marginTop: "0px",
      // padding:"0",
     
      // aspectRatio: '159/91', 
      // background: 'red',
      height: "calc(100vh - 40px)", 
      width:'100%',
      maxWidth: "calc(100vw - 40px)", 
    scale: 1,
    // zoom: 1.05,
      // width: "100%", // Garante responsividade
      position: 'relative', 
    }} 
    id={`powerbi-container-${pageId}`} 
  />

};

interface DashboardPBIPageProps {
  pageId: string | null;
}

const DashboardPBI: React.FC<DashboardPBIPageProps> = ({ pageId }) => {
  const [reportDetails, setReportDetails] = useState<ReportDetails | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>()

  useEffect(() => {
    if (!pageId) return;

    const fetchReportDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getPBIToken/${pageId}`);
        setReportDetails({
          accessToken: response.data.accessToken,
          embedUrl: response.data.embedUrl,
          pageId,
        });
      } catch (error) {
        setErrorMessage('Erro ao buscar detalhes do relatório');
        console.error('Erro ao buscar detalhes do relatório:', error);
      }
    };

    fetchReportDetails();
  }, [pageId]); // **Agora observa mudanças em pageId**

  return (
    <div
      className="powerbi-container"
      style={{
        position: 'fixed',
        top: '30px',
        // right: '10px',
        // bottom: '0px',
        left: '60px',
        // border:"none",
        width: 'calc(100vw - 0px)',
        height: 'calc(100% - 0px)',
        backgroundColor: '#101C44',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0px',
        padding:'0px'
      }}
    >
      {reportDetails ? 
        
        <PowerBIReport
          
          key={reportDetails.pageId} // **Força a recriação do componente ao mudar**
          embedUrl={reportDetails.embedUrl}
          accessToken={reportDetails.accessToken}
          pageId={reportDetails.pageId}
        />
      : errorMessage ? <p style={{ display: "flex", background:"rgba(49, 131, 207, 0)",width:'100%',justifyContent:"center"}}>{errorMessage}</p> : 
        <p style={{ display: "flex", background:"rgba(49, 131, 207, 0)",width:'100%',justifyContent:"center"}}>Carregando relatório...</p>
      }
    </div>
  );
};

export default DashboardPBI;
