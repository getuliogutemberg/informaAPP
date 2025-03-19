import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, FormControlLabel, Switch, TextField, Slider, Fade, FormControl, Select, MenuItem, InputLabel, Alert, Button, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { FaBell } from "react-icons/fa";
import { createTheme, ThemeProvider, PaletteMode } from "@mui/material/styles";

import axios from "axios";



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
    workspaceId: string;
    reportId: string;
  };
}

export default function Settings() {
  const [settings, setSettings] = useState<Configuration | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Buscar configurações do backend
    const fetchSettings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/configuration');
        setSettings(response.data); // Atualiza o estado com os dados do backend
      } catch (error) {
        console.error('Erro ao buscar configurações:', error);
        setError('Erro ao carregar configurações');
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

  type SettingValue = 
  | boolean 
  | string 
  | number 
  | { 
      clientId: string; 
      clientSecret: string; 
      authority: string; 
    };

  type PBIKeysUpdate = Partial<{
    clientId: string;
    clientSecret: string;
    authority: string;
    workspaceId: string;
    reportId: string;
  }>;

  const handleSettingChange = <K extends keyof Configuration>(
    key: K, 
    value: K extends 'pbiKeys' ? PBIKeysUpdate : SettingValue
  ) => {
    if (!settings) return;

    if (key === "pbiKeys") {
      setSettings({
        ...settings,
        pbiKeys: { ...settings.pbiKeys, ...(value as PBIKeysUpdate) }
      });
    } else {
      setSettings({
        ...settings,
        [key]: value
      });
    }
  };

  // Save settings
  const handleSaveSettings = async () => {
    if (!settings) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.put('http://localhost:5000/configuration', settings);
      setSuccess('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      setError('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        px: 2,
        ml: "80px",
        background: "#0A1C44",
        width: "calc(100vw - 110px)",
        height: "calc(100vh - 70px)",
        mt: "60px",
        pt: 3,
        gap: 2
      }}>
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <Typography variant="h3" sx={{ 
            fontWeight: "bold", 
            color: "white", 
            mb: 2,
            fontSize:{ xs: "1.5rem", sm: "2rem", md: "2.5rem" } 
          }}>
            Configurações
          </Typography>
          <Typography variant="h6" sx={{ 
            color: "#fff", 
            mb: 4, 
            fontSize: { xs: "1rem", sm: "1rem", md: "1rem" },
            opacity: 0.7
          }}>
            Aqui você pode personalizar as configurações da sua plataforma. Atualize as variáveis para aplicar as alterações.
          </Typography>
        </motion.div>

        {error && (
          <Alert severity="error" sx={{ width: '100%' }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ width: '100%' }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {settings ? (
          <>
            <Box sx={{ 
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 2,
              overflow: "auto",
              height: "calc(100vh - 235px)"
            }}>
              {Object.keys(settings).map((key, index) => {
                const setting = settings[key as keyof Configuration];
                return (
                  <Fade in key={index} timeout={500}>
                    <Box sx={{
                      width: 400,
                      minWidth: 300,
                      height: "fit-content",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "scale(1.02)",
                        boxShadow: 6,
                      }
                    }}>
                      <Card sx={{ 
                        boxShadow: 3,
                        backgroundColor: '#1F2A4C',
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center"
                      }}>
                        <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <Box sx={{
                            width: 56,
                            height: 56,
                            bgcolor: "#0A1C44",
                            color: "white",
                            borderRadius: "50%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            mb: 2,
                          }}>
                            <FaBell fontSize="large" />
                          </Box>

                          <Typography variant="h6" fontWeight="bold" sx={{ color: '#fff' }}>{key}</Typography>

                          {typeof setting === "boolean" ? (
                            <FormControlLabel
                              control={
                                <Switch 
                                  checked={setting} 
                                  onChange={(e) => handleSettingChange(key as keyof Configuration, e.target.checked)}
                                  sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                      color: 'rgba(12, 114, 249, 1)',
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                      backgroundColor: 'rgba(12, 114, 249, 0.5)',
                                    },
                                  }}
                                />
                              }
                              label={setting ? "Ativado" : "Desativado"}
                              sx={{ mt: 2, color: '#fff' }}
                            />
                          ) : typeof setting === "string" && key === "fontFamily" ? (
                            <FormControl sx={{ mt: 2, minWidth: 200 }}>
                              <InputLabel sx={{ color: '#fff' }}>Fonte</InputLabel>
                              <Select
                                value={setting}
                                onChange={(e) => handleSettingChange(key as keyof Configuration, e.target.value)}
                                label="Fonte"
                                variant="filled"
                                sx={{ background: "#fff" }}
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
                              onChange={(e) => handleSettingChange(key as keyof Configuration, e.target.value)}
                              label="Título da Página"
                              variant="filled"
                              sx={{ mt: 2, background: "#fff" }}
                            />
                          ) : typeof setting === "number" ? (
                            <Slider
                              value={setting}
                              onChange={(_, value: number | number[]) => handleSettingChange(key as keyof Configuration, typeof value === 'number' ? value : value[0])}
                              min={0}
                              max={360}
                              sx={{ 
                                width: 200, 
                                mt: 2,
                                color: 'rgba(12, 114, 249, 1)',
                                '& .MuiSlider-thumb': {
                                  backgroundColor: '#fff',
                                },
                                '& .MuiSlider-track': {
                                  backgroundColor: 'rgba(12, 114, 249, 1)',
                                },
                                '& .MuiSlider-rail': {
                                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                },
                              }}
                            />
                          ) : key === "pbiKeys" && typeof setting !== "string" ? (
                            <Card sx={{ 
                              mt: 2, 
                              p: 2, 
                              width: 300,
                              backgroundColor: '#0A1C44'
                            }}>
                              <CardContent>
                                <Typography variant="h6" sx={{ color: '#fff' }}>Credenciais do PowerBI</Typography>
                                <TextField
                                  fullWidth
                                  label="Client ID"
                                  value={setting.clientId}
                                  onChange={(e) => handleSettingChange('pbiKeys', { clientId: e.target.value })}
                                  margin="dense"
                                  variant="filled"
                                  sx={{ background: "#fff" }}
                                />
                                <TextField
                                  fullWidth
                                  label="Client Secret"
                                  type="text"
                                  value={setting.clientSecret}
                                  onChange={(e) => handleSettingChange('pbiKeys', { clientSecret: e.target.value })}
                                  margin="dense"
                                  variant="filled"
                                  sx={{ background: "#fff" }}
                                />
                                <TextField
                                  fullWidth
                                  label="Authority"
                                  value={setting.authority}
                                  onChange={(e) => handleSettingChange('pbiKeys', { authority: e.target.value })}
                                  margin="dense"
                                  variant="filled"
                                  sx={{ background: "#fff" }}
                                />
                                <TextField
                                  fullWidth
                                  label="Workspace ID"
                                  value={setting.workspaceId}
                                  onChange={(e) => handleSettingChange('pbiKeys', { workspaceId: e.target.value })}
                                  margin="dense"
                                  variant="filled"
                                  sx={{ background: "#fff" }}
                                />
                                <TextField
                                  fullWidth
                                  label="Report ID"
                                  value={setting.reportId}
                                  onChange={(e) => handleSettingChange('pbiKeys', { reportId: e.target.value })}
                                  margin="dense"
                                  variant="filled"
                                  sx={{ background: "#fff" }}
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
            </Box>
            <Button
              variant="contained"
              onClick={handleSaveSettings}
              disabled={loading}
              sx={{
                mt: 2,
                backgroundColor: '#0A1C44',
                '&:hover': {
                  backgroundColor: '#152347'
                }
              }}
            >
              {loading ? <CircularProgress size={24} /> : "Salvar Configurações"}
            </Button>
          </>
        ) : (
          <Typography sx={{ color: '#fff' }}>Carregando configurações...</Typography>
        )}
      </Box>
    </ThemeProvider>
  );
}
