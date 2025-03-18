import { useContext, useState, useEffect, Key } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box, CircularProgress, Alert, Dialog, DialogActions, DialogContent, DialogTitle, Stack, PaletteMode } from "@mui/material";  // Importe o Dialog
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";


interface Configuration {
  notifications: boolean;
  allowRegister: boolean;
  allowRequireRegister: boolean;
  allowNewCategory: boolean;
  allowNewClassName: boolean;
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

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [animating, setAnimating] = useState(false);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);  // Estado para controlar o modal de registro
  const [routes, setRoutes] = useState<{ _id: Key | null | undefined; path: string | undefined; requiredRole: string[] | undefined; component: string;pageId: string }[]>([]); // Estado para armazenar as rotas dinâmicas
  const [settings, setSettings] = useState<Configuration | null>(null);
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


  useEffect(() => {
    // Buscar rotas do backend
    const fetchRoutes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/routes');
        setRoutes(response.data); // Atualiza as rotas com os dados do backend
   
      } catch (error) {
        console.error('Erro ao buscar rotas:', error);
      }
    };

    fetchRoutes();
  }, []);

  useEffect(() => {
    if (user && routes.length > 0) {
      navigate(routes.filter(route => user.className !== 'OWNER' ? route.requiredRole?.includes(user.category): route)[0].path as string);
    }
  }, [user, navigate, routes]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnimating(true);
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email: username,
        password,
      });

      const { accessToken, refreshToken, user } = response.data;

      if (!accessToken || !refreshToken || !user) {
        setError("Dados inválidos recebidos.")
        
        throw new Error("Dados inválidos recebidos.");
      }

      if (user.isActive === false) {
        setError("Conta inativa.")
        setAnimating(false);
        setTimeout(() => setError(null), 5000);
        // throw new Error("Conta inativa.");
      } else {
         
      // Salva os dados no localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      // Atualiza o contexto de autenticação
      setUser(user);

      // Inicia animação ao enviar o formulário
      // Aguardar o tempo da animação antes de redirecionar
      setTimeout(() => {
      }, 100);  // Atraso para a animação
      navigate(routes[0].path as string);

      }
     
      
    } catch (err: unknown) {
      
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Ocorreu um erro inesperado.");
        setAnimating(false);
      } else {
        setError("Erro desconhecido.");
        setAnimating(false);
      }
      setTimeout(() => setError(null), 5000);
      setOpenRegisterDialog((settings?.allowRegister || settings?.allowRequireRegister) ?? false);// Abre o modal de registro caso o login falhe
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenRegisterDialog(false);  // Fecha o modal
  };

  const handleRegisterRedirect = () => {
    setOpenRegisterDialog(false);  // Fecha o modal
    navigate("/registro");  // Redireciona para a página de registro
  };
  const handleRequireRegisterRedirect = () => {
    setOpenRegisterDialog(false);  // Fecha o modal
    navigate("/solicitar-registro");  // Redireciona para a página de registro
  };


  return (
    <Box sx={{
      width: "100vw",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between-content",
      alignItems: "center",
    }}>
      <Box sx={{
          width: "50vw",
          minWidth: "500px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}>

          <motion.div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "0.5rem",
              padding: "40px 20px 20px 20px",
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              color: "#111",
              fontWeight: "bold",
              textAlign: "center",
              backdropFilter: "blur(15px)",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              background: "linear-gradient(145deg, rgba(255, 255, 255, 0.3), rgba(0, 0, 0, 0.2))",
            }}
            initial={{
              y: "500%",
              opacity: 1,
            }}
            animate={{
              opacity: 1,
              y: animating ? "-10000%" : 0,
              transition: { duration: 0.5, ease: "easeInOut" },
            }}
          >

            <Typography variant="h3" gutterBottom sx={{ marginBottom: 4, color: "#0a4a6d" }}>
              Login
            </Typography>

            <Box component="form" onSubmit={settings ? handleLogin : ()=> {}}>
              <TextField
                label="Usuário"
                type="text"
                variant="outlined"
                fullWidth
                sx={{
                  backgroundColor: "white",
                  borderRadius: "5px",
                  mb: 2,
                }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <TextField
                label="Senha"
                type="password"
                variant="outlined"
                fullWidth
                sx={{
                  backgroundColor: "white",
                  borderRadius: "5px",
                  mb: 2,
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  height: 45,
                  bgcolor: "#0a4a6d",
                  color: "#fff",
                  textTransform: "capitalize",
                  fontWeight: "bold",
                  borderRadius: "0.5rem",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    boxShadow: "0 8px 18px rgba(0, 0, 0, 0.3)",
                    transform: "translateY(-2px)",
                  },
                  "&:disabled": {
                    bgcolor: "rgba(0, 0, 0, 0.4)",
                  },
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Entrar"}
              </Button>
            </Box>
          </motion.div>

          {error && (
            <Alert
              severity="error"
              sx={{
                position: "absolute",
                top: "0px",
                backgroundColor: "#ffcccb",
                borderRadius: "5px",
                color: "#000",
                transition: "all 0.5s ease-out",
              }}
            >
              {error}
            </Alert>
          )}
        </Box>
      

      {/* Modal de Registro */}
      <Dialog
  open={openRegisterDialog}
  onClose={handleCloseDialog}
  sx={{
    "& .MuiPaper-root": {
      borderRadius: "0.5rem",
      padding: "20px",
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      backdropFilter: "blur(15px)",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      background: "linear-gradient(145deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.02))",
    },
  }}
>
  <DialogTitle sx={{ textAlign: "center",fontSize: "1.5rem", fontWeight: "bold", color: "#111" }}>
    Login Falhou
  </DialogTitle>
  <DialogContent>
    <Typography sx={{ textAlign: "center", fontSize: "1rem" , color: "#fff"}}>
      Esse usuário esta cadastrado?
    </Typography>
  </DialogContent>
  <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
  <Stack sx={{
                mt: 2,
                justifyContent: "space-between",
                width: "100%",
                flexWrap: "wrap",
              }}
              direction={{ xs: "column", sm: "row" }} // Pilha no mobile, linha em telas maiores
              spacing={2} // Espaçamento entre os botões
            > 
    
    <Button
      onClick={handleCloseDialog}
      
      sx={{ 
        flex: 1,
         mt: 2,
         height: 45,
         bgcolor: "#0a4a6d",
         color: "#fff",
         textTransform: "capitalize",
         fontWeight: "bold",
         borderRadius: "0.5rem",
         transition: "all 0.3s ease-in-out",
         "&:hover": {
           boxShadow: "0 8px 18px rgba(0, 0, 0, 0.3)",
           transform: "translateY(-2px)",
         },
         "&:disabled": {
           bgcolor: "rgba(0, 0, 0, 0.4)",
         },
        
         }} 
    >
      Sim
    </Button>
    <Button
    onClick={settings?.allowRegister ? handleRegisterRedirect : handleRequireRegisterRedirect}
      
      sx={{
        flex: 1,
        mt: 2,
        height: 45,
        bgcolor: "#555",
        color: "#fff",
        textTransform: "capitalize",
        fontWeight: "bold",
        borderRadius: "0.5rem",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          boxShadow: "0 8px 18px rgba(0, 0, 0, 0.3)",
          transform: "translateY(-2px)",
        },
        "&:disabled": {
          bgcolor: "rgba(0, 0, 0, 0.4)",
        }}}
    >
      {settings?.allowRegister ? 'Cadastrar' : 'Não'}
    </Button>
    </Stack>
  </DialogActions>
</Dialog>

    </Box>
  );
}
