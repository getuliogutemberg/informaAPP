import { useState, useContext, useEffect } from "react";
import { 
  Typography, TextField, Button, Box, Avatar, IconButton, Paper, Fade 
} from "@mui/material";
import { Edit, Save, UploadFile } from "@mui/icons-material";

import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext"; // Importe o AuthContext
import { Stack } from "@mui/system";

export default function Profile() {
  const { user } = useContext(AuthContext); // Acessando o usuário logado
  const [name, setName] = useState(user?.name || ""); // Definindo o nome inicial do usuário
  const [email, setEmail] = useState(user?.email || ""); // Definindo o e-mail inicial do usuário
  const [bio, setBio] = useState(user?.bio || ""); // Definindo a bio inicial do usuário
  const [profilePic, setProfilePic] = useState(user?.customIcon || "https://via.placeholder.com/150"); // Definindo a foto de perfil
  const [editing, setEditing] = useState(false);

  // Simulação de upload de imagem
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
    }
  };

  // Atualizar as informações do perfil quando o usuário logado mudar
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setBio(user?.bio);
      setProfilePic(user.customIcon);
    }
  }, [user]);

  return (
    <Box sx={{ background:"rgba(16, 28, 68, 1)",width:'calc(100vw - 120px)',height:"calc(100vh - 40px)",pl:"100px",pt:"130px",pr:"20px",display:"flex",flexDirection:"column",justifyContent:"start",alignItems:"center"}}>
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        <Typography variant="h3" sx={{ fontWeight: "bold", color: "#fff", mb: 0, fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" } }}>
          Configurações de Cliente
        </Typography>
        <Typography variant="h6" sx={{ color: "#666", mb: 2, fontSize: { xs: "1.0rem", sm: "1.0rem", md: "1.0rem" } }}>
          Configure as suas informações pessoais e a foto de perfil!
        </Typography>
      </motion.div>
      <Fade in timeout={1000}>
        <Paper elevation={1} sx={{ p: 2,display:"flex",flexDirection:'column',justifyContent:"center",width:"100%",maxWidth:"650px"}}>
          {/* 🔹 Foto de Perfil */}
          <Box sx={{ position: "relative", mb: 4 }}>
            <Avatar src={profilePic} sx={{ width: 120, height: 120, mx: "auto" }} />
            {editing && <IconButton
              component="label"
              sx={{
                position: "absolute",
                top: "100px",
                right: "38%",
                
                bgcolor: "white",
                boxShadow: 3
              }}
            >
              <UploadFile />
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </IconButton>}
          </Box>

          {/* 🔹 Formulário de Edição */}
          <TextField
            label="Nome"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!editing}
            sx={{ mb: 2 }}
          />
          <TextField
            label="E-mail"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!editing}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Biografia"
            fullWidth
            multiline
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            disabled={!editing}
            sx={{ mb: 2 }}
          />

          {/* 🔹 Botões de Ação */}
          <Box sx={{ mt: 2,display:"flex",justifyContent:"center", flexDirection:"column" }}>
            <Stack sx={{
              spacing: 2,
              width: "100%",
              justifyContent: "space-between"
            }} >
          <Button
                variant="contained"
                color="primary"
                onClick={() => alert("Funcionalidade de recuperar senha não implementada")}
              >
                Alterar Senha
              </Button>
            {editing ? (
              <Button 
                variant="contained" 
                color="error" 
                startIcon={<Save />}
                onClick={() => setEditing(false)}
              >
                Salvar Alterações
              </Button>
            ) : (
              <Button 
                variant="text" 
                color="primary"   
                startIcon={<Edit />}
                onClick={() => setEditing(true)}
                disabled={user?.className !== "ADMIN" && user?.className !== "BOSS" }
              >
                Editar Perfil
              </Button>
            )}

           </Stack>
          
            
      
            
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
}
