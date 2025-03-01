import { useEffect, useState } from "react";
import { Typography, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField, CircularProgress, Alert } from "@mui/material";
import { CheckCircle, Close } from "@mui/icons-material";
import { motion } from "framer-motion";
import axios from "axios";

// Tipo para o usuário
interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  category: string;
  className: string;
  position: number[];
  customIcon: string;
  createAt: string;
  updateAt: string;
  status: string;
  __v: number;
  refreshToken: string;
  isActive: boolean;
}

const Users = () => {
  // Tipando o estado de users com User[]
  const [users, setUsers] = useState<User[]>([]); // Estado para lista de usuários
  const [open, setOpen] = useState(false); // Estado para controlar o modal de edição
  const [openCreateModal, setOpenCreateModal] = useState(false); // Estado para controlar o modal de criação
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Estado para armazenar o usuário selecionado para edição
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users');
        setUsers(response.data); // Atualiza o estado com os dados recebidos
      } catch (error) {
        console.error('Erro ao buscar os usuários:', error);
      }
    };

    fetchUsers();
  }, []);

  // Função para abrir o modal de criação
  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
  };

  // Função para fechar o modal de criação
  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
    setName("");
    setEmail("");
    setPassword("");
    setCategory("");
  };

  // Função para salvar o novo usuário
  const handleCreateUser = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/users", { name, email, password, category });
      setUsers((prevUsers) => [...prevUsers, { name, email, password, category, _id: "", status: "ativo", className: "", position: [], customIcon: "", createAt: "", updateAt: "", __v: 0, refreshToken: "", isActive: true }]);
      handleCloseCreateModal();
    } catch {
      setError("Ocorreu um erro ao criar o usuário.");
    }
    setLoading(false);
  };

  // Função para abrir o modal e preencher com os dados do usuário
  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setOpen(true);
  };

  // Função para fechar o modal
  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  // Função para salvar as alterações
  const handleSave = () => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === selectedUser?._id ? { ...user, ...selectedUser } : user
      )
    );
  };

  // Função para alternar o status do usuário
  const handleToggleStatus = () => {
    if (selectedUser) {
      setSelectedUser({
        ...selectedUser,
        status: selectedUser.status === "ativo" ? "inativo" : "ativo",
      });
    }
  };

  // Função para excluir um usuário
  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== selectedUser._id));
      setOpen(false);
    }
  };

  return (
    <Box sx={{
      background: "rgba(16, 28, 68, 1)",
      width: 'calc(100vw - 120px)',
      height: "calc(100vh - 40px)",
      pl: "100px",
      pt: "130px",
      pr: "20px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "start",
      alignItems: "center"
    }}>
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        <Typography variant="h3" sx={{ fontWeight: "bold", color: "white", mb: 2, fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" } }}>
          Gestão de Usuários
        </Typography>
        <Typography variant="h6" sx={{ color: "#666", mb: 4, fontSize: { xs: "1rem", sm: "1rem", md: "1rem" } }}>
          Atualmente, você possui {users.length}  {users.length > 1 ? 'usuários' : 'usuário'}.
        </Typography>
      </motion.div>

      {/* Botão para criar novo usuário */}
      <Button variant="contained" color="primary" onClick={handleOpenCreateModal} sx={{ mb: 2 }}>
        Criar Novo Usuário
      </Button>

      {/* Tabela de Usuários */}
      {users.length > 0 ? (
        <TableContainer component={Paper}>
          <Table sx={{}} aria-label="tabela de usuários">
            <TableHead>
              <TableRow>
                <TableCell align="left">Nome</TableCell>
                <TableCell align="center" sx={{ display: { xs: "none", sm: "table-cell" } }}>Email</TableCell>
                <TableCell align="center" sx={{ display: { xs: "none", sm: "table-cell" } }}>Autorização</TableCell>
                <TableCell align="center" sx={{ display: { xs: "none", sm: "table-cell" } }}>Status</TableCell>
                <TableCell align="right">Ação</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user._id}>
                  <TableCell align="left">{user.name}</TableCell>
                  <TableCell align="center" sx={{ display: { xs: "none", sm: "table-cell" } }}>{user.email}</TableCell>
                  <TableCell align="center" sx={{ display: { xs: "none", sm: "table-cell" } }}>{user.className}</TableCell>
                  <TableCell align="center" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    {user.status === "ativo" ? <CheckCircle /> : <Close />}
                  </TableCell>
                  <TableCell align="right">
                    <Button variant="contained" size="small" color="primary" onClick={() => handleEditClick(user)}>
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : <span>Nenhum usuário.</span>}

      {/* Modal de Edição */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editar Usuário</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <>
              <TextField
                label="Nome"
                fullWidth
                value={selectedUser.name}
                onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Email"
                fullWidth
                value={selectedUser.email}
                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Autorização"
                fullWidth
                value={selectedUser.className}
                onChange={(e) => setSelectedUser({ ...selectedUser, className: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Status"
                fullWidth
                value={selectedUser.status}
                onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
                sx={{ mb: 2 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancelar</Button>
          <Button onClick={handleSave} color="primary">Salvar</Button>
          <Button onClick={handleDeleteUser} color="error">Excluir</Button>
          <Button onClick={handleToggleStatus} color="warning">Alternar Status</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Criação */}
      <Dialog open={openCreateModal} onClose={handleCloseCreateModal}>
        <DialogTitle>Criar Novo Usuário</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Senha"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Categoria"
            fullWidth
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateModal} color="secondary">Cancelar</Button>
          <Button onClick={handleCreateUser} color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default Users;
