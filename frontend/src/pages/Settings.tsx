import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, FormControlLabel, Switch, TextField, Slider, Fade, FormControl, Select, MenuItem, InputLabel, Button } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { motion } from "framer-motion";
import { FaBell } from "react-icons/fa";
import { createTheme, ThemeProvider, PaletteMode } from "@mui/material/styles";

import axios from "axios";
import { useNavigate } from "react-router-dom";


// Tipagem de configuração
interface Configuration {
  notifications: boolean;
  allowRegister: boolean;
  allowRequireRegister: boolean;
  addSecretKey: boolean;
  addCategory: boolean;
  fontFamily: string;
  pageTitle: string;
  themeMode: PaletteMode;
  primaryColor: number;
  secondaryColor: number;
  backgroundColor: number;
  textColor: number;
  pbiKeys: {
    clientId: string;
    clientSecret: string;
    authority: string;
  };
}

export default function Settings() {
  const [settings, setSettings] = useState<Configuration | null>(null);
  const navigate = useNavigate(); // Hook para navegação
  useEffect(() => {
    // Buscar configurações do backend
    const fetchSettings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/configuration');
        setSettings(response.data); // Atualiza o estado com os dados do backend
      } catch (error) {
        console.error('Erro ao buscar configurações:', error);
      }
    };

    fetchSettings();
  }, []);

  // Tema personalizado
  const theme = createTheme({
    palette: {
      mode: settings?.themeMode || "light", // Default para "light" caso settings não seja carregado
      primary: {
        main: `hsl(${settings?.primaryColor}, 100%, 40%)`,
      },
      secondary: {
        main: `hsl(${settings?.secondaryColor}, 100%, 40%)`,
      },
      background: {
        default: settings?.themeMode === "dark" ? "#121212" : `hsl(${settings?.backgroundColor}, 20%, 95%)`,
        paper: settings?.themeMode === "dark" ? "#1c1c1c" : "#ffffff",
      },
    },
    typography: {
      fontFamily: settings?.fontFamily || "Arial", // Default para Arial
    },
  });

  

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        {/* Conteúdo Principal */}
        <Box sx={{ textAlign: "center", px: 2, ml: "80px", background: "rgba(16, 28, 68, 1)", width: "calc(100vw - 110px)", height: "calc(100vh - 50px)", mt: "70px" }}>
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: "bold", color: "white", mb: 2, pt: 4, fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" } }}>
              Configurações
            </Typography>
            <Typography variant="h6" sx={{ color: "#666", mb: 4, fontSize: { xs: "1rem", sm: "1rem", md: "1rem" } }}>
              Aqui você pode personalizar as configurações da sua plataforma. Atualize as variáveis para aplicar as alterações.
            </Typography>
          </motion.div>
          
          {settings ? <Box sx={{ display: "flex",flexDirection: "row",flexShrink:1, flexGrow:1, justifyContent: "start", flexWrap: "wrap", gap: 2, overflow: "auto", height: "calc(100vh - 235px)" }}>
         
            {[
           
            { title: "Rotas", icon: <FaBell fontSize="large" />, color: deepPurple[500], path: "/rotas" },
            
          ].map((section, index) => (
          <Fade in key={index} timeout={500}>
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
            }}>
              <Card
                sx={{
                  // minHeight: 180,
                  boxShadow: 3,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: 6,
                  }
                }}
              >
                <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Box sx={{
                    width: 56, height: 56, bgcolor: section.color, color: "white", borderRadius: "50%", 
                    display: "flex", justifyContent: "center", alignItems: "center", mb: 2
                  }}>
                    {section.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold">{section.title}</Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    
                    onClick={() => navigate(section.path)} // Correção aqui
                  >
                    Acessar
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Fade>
        ))}
        
            {Object.keys(settings).map((key, index) => {
              const setting = settings[key as keyof Configuration];
              return (
                <Fade in key={index} timeout={500}>
                  <Box sx={{ width: "fit-content",minWidth:"400px",height: "fit-content", boxShadow: 1 ,flex:1 }}>
                    <Card sx={{ boxShadow: 3, display: "flex", flexDirection: "column", justifyContent: "center" ,flex:1}}>
                      <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            bgcolor: deepPurple[500],
                            color: "white",
                            borderRadius: "50%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            mb: 2,
                          }}
                        >
                          <FaBell fontSize="large" />
                        </Box>

                        <Typography variant="h6" fontWeight="bold">{key}</Typography>

                        {/* Renderizando o tipo de controle baseado na variável */}
                        {typeof setting === "boolean" ? (
                          <FormControlLabel
                            control={<Switch checked={setting} onChange={() => {}} />}
                            label={setting ? "Ativado" : "Desativado"}
                            sx={{ mt: 2 }}
                          />
                        ) : typeof setting === "string" && key === "fontFamily" ? (
                          <FormControl sx={{ mt: 2, minWidth: 200 }}>
                            <InputLabel>Fonte</InputLabel>
                            <Select
                              value={setting}
                              onChange={() => {}}
                              label="Fonte"
                            >
                              <MenuItem value="Arial">Arial</MenuItem>
                              <MenuItem value="Verdana">Verdana</MenuItem>
                              <MenuItem value="Times New Roman">Times New Roman</MenuItem>
                              <MenuItem value="Courier New">Courier New</MenuItem>
                              <MenuItem value="Tahoma">Tahoma</MenuItem>
                            </Select>
                          </FormControl>
                        ) : typeof setting === "string" && key === "pageTitle" ? (
                          <TextField
                            value={setting}
                            onChange={() => {}}
                            label="Título da Página"
                            variant="outlined"
                            sx={{ mt: 2, width: 200 }}
                          />
                        ) : typeof setting === "number" ? (
                          <Slider
                            value={setting}
                            onChange={() => {}}
                            min={0}
                            max={360}
                            sx={{ width: 200, mt: 2 }}
                          />
                        ) : key === "pbiKeys" && typeof setting !== "string" ? (
                          <Card sx={{ mt: 2, p: 2, width: 300 }}>
    <CardContent>
      <Typography variant="h6">Credenciais do PowerBI</Typography>
      <TextField
        fullWidth
        label="Client ID"
        value={setting.clientId}
        onChange={() => {}}
        margin="dense"
      />
      <TextField
        fullWidth
        label="Client Secret"
        type="text"
        value={setting.clientSecret}
        onChange={() => {}}
        margin="dense"
      />
      <TextField
        fullWidth
        label="Authority"
        value={setting.authority}
        onChange={() => {}}
        margin="dense"
      />
    </CardContent>
  </Card>
                        ) : null}
                      </CardContent>
                    </Card>
                  </Box>
                </Fade>
              );
            })}
          </Box>: <div>Carregando configurações...</div> }

          
        
        </Box>
      </Box>
    </ThemeProvider>
  );
}
