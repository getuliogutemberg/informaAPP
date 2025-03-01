import { useState } from "react";
import { 
 Card, CardContent, Typography, Button, Box, Fade, Chip 
} from "@mui/material";
import { Error, Warning, Info, CheckCircle } from "@mui/icons-material";
import { red, orange, blue } from "@mui/material/colors";

import { motion } from "framer-motion";

// 🔹 Lista de Alertas Fictícia
const initialAlerts = [
  { id: 1, type: "emergency", title: "Falha elétrica no painel principal!", description: "Desligue imediatamente e aguarde os técnicos.", color: red[500], icon: <Error /> },
  { id: 2, type: "maintenance", title: "Manutenção programada no sistema hidráulico", description: "Interrupção no fornecimento de água industrial amanhã das 8h às 12h.", color: orange[500], icon: <Warning /> },
  { id: 3, type: "info", title: "Treinamento sobre segurança no trabalho", description: "Treinamento obrigatório para todos os operadores na próxima terça-feira às 14h.", color: blue[500], icon: <Info /> },
  { id: 4, type: "emergency", title: "Vazamento de gás detectado na área de produção!", description: "Evacue a área imediatamente e siga para os pontos de segurança.", color: red[500], icon: <Error /> },
  { id: 5, type: "maintenance", title: "Reparo na linha de produção", description: "Manutenção no transportador de correia afetando a produção das 10h às 15h.", color: orange[500], icon: <Warning /> },
  { id: 6, type: "info", title: "Auditoria de qualidade", description: "Auditoria agendada para verificar padrões de qualidade nas fábricas amanhã.", color: blue[500], icon: <Info /> },
  { id: 7, type: "emergency", title: "Alerta de sobrecarga no sistema de energia", description: "Desligue as máquinas não essenciais até novo aviso.", color: red[500], icon: <Error /> },
  { id: 8, type: "maintenance", title: "Manutenção programada no compressor de ar", description: "Interrupção no fornecimento de ar comprimido amanhã das 9h às 11h.", color: orange[500], icon: <Warning /> },
  { id: 9, type: "info", title: "Verificação de estoque de matérias-primas", description: "Revisão dos níveis de estoque agendada para a próxima segunda-feira às 8h.", color: blue[500], icon: <Info /> },
];


export default function Alerts() {
  const [alerts, setAlerts] = useState(initialAlerts);

  // 🔹 Função para marcar alerta como lido
  const markAsRead = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  return (
    <Box sx={{ background:"rgba(16, 28, 68, 1)",width:'calc(100vw - 120px)',height:"calc(100vh - 40px)",pl:"100px",pt:"130px",pr:"20px",display:"flex",flexDirection:"column",justifyContent:"start",alignItems:"center"}}>
      
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
      <Typography variant="h3" sx={{ fontWeight: "bold", color: "white", mb: 2, fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" }}}>
      Alertas
        </Typography>
        <Typography variant="h6" sx={{ color: "#666", mb: 4, fontSize: { xs: "1rem", sm: "1rem", md: "1rem" } }}>
          Atualmente, você possui {alerts.length} alerta(s) pendente(s). Clique no botão abaixo para marcar todos como lidos.
        </Typography>
        </motion.div>
      {/* 🔹 Lista de Alertas */}
      <Box sx={{
        display: "flex",
        justifyContent: "start",
        flexWrap: "wrap",
        overflow: "auto",
        height: "calc(100vh - 235px)",
        gap: 2
      }}>
        {alerts.length === 0 ? (
          <Typography variant="h6" color="text.secondary">Nenhum alerta pendente 🎉</Typography>
        ) : (
          alerts.map((alert) => (
            <Fade in key={alert.id} timeout={500}>
              <Box sx={{
               width: 400,
               minWidth: 300,
               height: "fit-content",
               // flexGrow: 1,
               boxShadow: 1,
               transition: "transform 0.3s, box-shadow 0.3s",
               "&:hover": {
                 transform: "scale(1.02)",
                 boxShadow: 6,
               }
            }} >
                <Card
                  sx={{
                    minHeight: 160,
                    boxShadow: 3,
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": { transform: "scale(1.05)", boxShadow: 6 }
                  }}
                >
                  <CardContent>
                    <Chip
                      icon={alert.icon}
                      label={alert.type === "emergency" ? "Emergência" :
                            alert.type === "maintenance" ? "Manutenção" :
                            "Informação"}
                      sx={{
                        bgcolor: alert.color,
                        color: "white",
                        fontWeight: "bold",
                        mb: 2
                      }}
                    />
                    <Typography variant="h6" fontWeight="bold">{alert.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{alert.description}</Typography>

                    <Box sx={{ mt: 2 }}>
                      <Button 
                        variant="contained" 
                        color="success"
                        startIcon={<CheckCircle />}
                        onClick={() => markAsRead(alert.id)}
                      >
                        Marcar como lido
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Fade>
          ))
        )}
      </Box>

      {/* 🔹 Botão para retornar ao Dashboard */}
      {/* <Button sx={{position:'fixed',bottom:0,left:'50%',zIndex:1000,bgcolor:'ActiveBorder'}}>
        <Link to="/">Voltar</Link>
      </Button> */}
    </Box>
  );
}
