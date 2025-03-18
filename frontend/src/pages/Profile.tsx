import { useState, useContext, useEffect } from "react";
import { 
  Typography, TextField, Button, Box, Avatar, IconButton, Paper, Fade, 
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";
import { Edit, Save, UploadFile } from "@mui/icons-material";

import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext"; // Importe o AuthContext
import { Stack } from "@mui/system";
import axios from "axios";

export default function Profile() {
  const { user, setUser } = useContext(AuthContext); // Adicione setUser do contexto
  const [name, setName] = useState(user?.name || ""); // Definindo o nome inicial do usuário
  const [email, setEmail] = useState(user?.email || ""); // Definindo o e-mail inicial do usuário
  const [bio, setBio] = useState(user?.bio || ""); // Definindo a bio inicial do usuário
  const [profilePic, setProfilePic] = useState(user?.customIcon || "https://via.placeholder.com/150"); // Definindo a foto de perfil
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false); // Novo estado para loading
  const [error, setError] = useState<string | null>(null); // Novo estado para erros
  // Simulação de upload de imagem
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

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
  
// Nova função para salvar alterações
const handleSaveChanges = async () => {
  if (!user?._id) return;
  
  setLoading(true);
  setError(null);
  
  try {
    const response = await axios.put(`http://localhost:5000/users/${user._id}`, {
      name,
      email,
      bio,
      customIcon: profilePic
    });

    // Atualiza o usuário no contexto
    setUser(response.data);
    setEditing(false);
  } catch (err) {
    setError("Erro ao salvar alterações. Tente novamente.");
    console.error("Erro ao atualizar perfil:", err);
  } finally {
    setLoading(false);
  }

  
};

const handleChangePassword = async () => {
  // Validações básicas
  if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
    setPasswordError("Todos os campos são obrigatórios");
    return;
  }

  if (passwordData.newPassword !== passwordData.confirmPassword) {
    setPasswordError("As senhas não coincidem");
    return;
  }

  if (passwordData.newPassword.length < 6) {
    setPasswordError("A nova senha deve ter pelo menos 6 caracteres");
    return;
  }

  setPasswordLoading(true);
  setPasswordError(null);

  try {
    await axios.put(`http://localhost:5000/users/${user?._id}/password`, {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });

    // Limpa o formulário e fecha o modal
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setOpenPasswordModal(false);
    // Opcional: mostrar mensagem de sucesso
  } catch (error) {
    if (axios.isAxiosError(error)) {
      setPasswordError(error.response?.data?.message || "Erro ao alterar senha");
    } else {
      setPasswordError("Erro inesperado ao alterar senha");
    }
  } finally {
    setPasswordLoading(false);
  }
};
  return (
    <Box sx={{ background:"rgba(16, 28, 68, 1)",width:'calc(100vw - 120px)',height:"calc(100vh - 40px)",pl:"100px",pt:"130px",pr:"20px",display:"flex",flexDirection:"column",justifyContent:"start",alignItems:"center"}}>
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        <Typography variant="h3" sx={{ fontWeight: "bold", color: "#fff", mb: 0, fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" } }}>
          Configurações da Conta
        </Typography>
        <Typography variant="h6" sx={{ color: "#666", mb: 2, fontSize: { xs: "1.0rem", sm: "1.0rem", md: "1.0rem" } }}>
          Configure as suas informações pessoais e a foto de perfil!
        </Typography>
      </motion.div>
      {error && (
        <Alert severity="error" sx={{ mb: 2, width: "100%", maxWidth: "650px" }}>
          {error}
        </Alert>
      )}
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
            disabled={!editing || user?.className !== "ADMIN" && user?.className !== "OWNER" }

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
            {editing && <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenPasswordModal(true)}
      >
        Alterar Senha
      </Button>}
            {editing ? (
              <Button 
                variant="contained" 
                color="error" 
                startIcon={<Save />}
                onClick={handleSaveChanges}
                disabled={loading}
              >
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            ) : (
              <Button 
                variant="text" 
                color="primary"   
                startIcon={<Edit />}
                onClick={() => setEditing(true)}
                // disabled={user?.className !== "ADMIN" && user?.className !== "OWNER" }
              >
                Editar Perfil
              </Button>
            )}

           </Stack>
           <Dialog open={openPasswordModal} onClose={() => setOpenPasswordModal(false)}>
        <DialogTitle>Alterar Senha</DialogTitle>
        <DialogContent>
          {passwordError && (
            <Alert severity="error" sx={{ mb: 2, mt: 2 }}>
              {passwordError}
            </Alert>
          )}
          <TextField
            label="Senha Atual"
            type="password"
            fullWidth
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            sx={{ mb: 2, mt: 2 }}
          />
          <TextField
            label="Nova Senha"
            type="password"
            fullWidth
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Confirmar Nova Senha"
            type="password"
            fullWidth
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setOpenPasswordModal(false);
              setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
              });
              setPasswordError(null);
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleChangePassword}
            variant="contained" 
            color="primary"
            disabled={passwordLoading}
          >
            {passwordLoading ? "Alterando..." : "Alterar Senha"}
          </Button>
        </DialogActions>
      </Dialog>
            
      
            
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
}
