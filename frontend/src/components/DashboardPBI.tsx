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
       
        // background: models.BackgroundType.Transparent, 
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
    width: "calc(100vw - 80px)", 
    height: "100vh", // Garante que ocupe toda a tela
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'start', // Centraliza verticalmente
    alignItems: 'center' // Centraliza horizontalmente
  }}
>
  <div 
    style={{
      marginTop: "30px",
      aspectRatio: '16/9', 
      maxHeight: "calc(87.9vh)", 
      maxWidth: "calc(77vw)", 
      width: "100%", // Garante responsividade
      position: 'relative', 
      scale:1.05
    }} 
    id={`powerbi-container-${pageId}`} 
  />
</div>
};

interface DashboardPBIPageProps {
  pageId: string | null;
}

const DashboardPBI: React.FC<DashboardPBIPageProps> = ({ pageId }) => {
  const [reportDetails, setReportDetails] = useState<ReportDetails | null>(null);

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
        top: '60px',
        right: '0px',
        bottom: '0px',
        left: '70px',
        border:"none",
        width: 'calc(100vw - 79px)',
        // height: 'calc(100vh)',
        backgroundColor: '#101C44',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding:'10px'
      }}
    >
      {reportDetails ? (
        <div style={{ background:'transparent'}}>
        <PowerBIReport
          key={reportDetails.pageId} // **Força a recriação do componente ao mudar**
          embedUrl={reportDetails.embedUrl}
          accessToken={reportDetails.accessToken}
          pageId={reportDetails.pageId}
        /></div>
      ) : (
        <p>Carregando relatório...</p>
      )}
    </div>
  );
};

export default DashboardPBI;
