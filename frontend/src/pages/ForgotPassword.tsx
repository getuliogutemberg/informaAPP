import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box, CircularProgress, Alert } from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (!email) {
      setError("Email é obrigatório!");
      setLoading(false);
      return;
    }    try {
      const response = await axios.post("http://localhost:5000/forgot-password", {
        email
      });
      
      setMessage(response.data.message);
      
      // Limpar a mensagem após 5 segundos
      setTimeout(() => {
        setMessage(null);
      }, 5000);
      
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Erro inesperado. Tente novamente.");
      } else {
        setError("Erro inesperado. Tente novamente.");
      }
    }
    setLoading(false);
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
          width: "100vw",
          height: "100vh",
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
              backgroundColor: "rgba(83, 83, 83, 0.1)",
              color: "#111",
              fontWeight: "bold",
              textAlign: "center",
              backdropFilter: "blur(15px)",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              background: "linear-gradient(145deg, rgba(255, 255, 255, 0.3), rgba(0, 0, 0, 0.2))",
            }}
            initial={{
              y: "500%",
              opacity: 1,
            }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: "easeInOut" },
            }}
          >            <Typography variant="h3" gutterBottom sx={{ marginBottom: 4, color: "#F5f5f5", fontWeight: 'bold' }}>
              SIGMA
            </Typography>
              <Typography 
              variant="h5" 
              sx={{ 
                mb: 1, 
                color: "#ffffff", 
                fontWeight: "bold",
                textAlign: "center",
                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)"
              }}
            >
              Recuperar Senha
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3, 
                color: "#f0f0f0", 
                textAlign: "center",
                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)"
              }}
            >
              Digite seu email para receber instruções de recuperação
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                label="Email"
                type="email"
                variant="filled"
                fullWidth
                sx={{
                  backgroundColor: "white",
                  borderRadius: "5px",
                  mb: 2,
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />              <Button
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
                {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Enviar Instruções"}
              </Button>              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Button
                  variant="text"
                  onClick={() => navigate("/login")}
                  sx={{
                    color: "#ffffff",
                    textTransform: "none",
                    textDecoration: "underline",
                    fontSize: "0.9rem",
                    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      textDecoration: "underline",
                    },
                  }}
                >
                  Voltar para o Login
                </Button>
              </Box>
            </Box>
          </motion.div>            {error && (
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

          {message && (
            <Alert
              severity="success"
              sx={{
                position: "absolute",
                top: "0px",
                backgroundColor: "#d4edda",
                borderRadius: "5px",
                color: "#000",
                transition: "all 0.5s ease-out",
              }}
            >
              {message}
            </Alert>
          )}
        </Box>
    </Box>
  );
}
