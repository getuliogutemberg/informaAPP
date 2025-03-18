import { useCallback, useContext, useEffect, useState } from "react";
import { Typography, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField, CircularProgress, Alert, IconButton, Checkbox, FormControlLabel, InputAdornment, Avatar } from "@mui/material";
import { Add, CheckCircle, Close, Delete, Edit, Search  } from "@mui/icons-material";
import { motion } from "framer-motion";
import SwapVertIcon from '@mui/icons-material/SwapVert';
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

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
  const [open, setOpen] = useState<boolean>(false); // Estado para controlar o modal de edição
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false); // Estado para controlar o modal de criação
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Estado para armazenar o usuário selecionado para edição
  const [editData, setEditData] = useState<Partial<User>>({ name: "", email: "", password: "", category: "", className: "", isActive: false });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false); // Estado para controle do modal de confirmação de exclusão
  const [userToDelete, setUserToDelete] = useState<string | null>(null); // Estado para armazenar o ID do usuário a ser deletado
  
  const [searchQuery, setSearchQuery] = useState<string>(""); // Estado para filtrar usuários
  const [sortField, setSortField] = useState<keyof User>("name"); // Estado para controle da ordenação
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Estado para controle da ordem de ordenação
  const { user  } = useContext(AuthContext);
  const isOwner = user?.className === "OWNER";
  const [formData, setFormData] = useState<Partial<User>>({ name: "", email: "", password: "", category: "" , className: "CLIENT" });
  const fetchUsers = useCallback(async () => {
    try {
      
  
      const url = isOwner 
        ? "http://localhost:5000/users" 
        : `http://localhost:5000/users?category=${user?.category}`;
        const response = await axios.get<User[]>(url);
        setUsers(response.data);
        setFormData({ name: "", email: "", password: "", category: isOwner ? "" : user?.category , className: "CLIENT" })
    } catch (error) {
      console.error("Erro ao buscar os usuários:", error);
      setError("Erro ao buscar usuários");
    }
  },[isOwner, user?.category]);

  useEffect(() => {
    
    
    fetchUsers();
  }, [fetchUsers]);

  

  const handleOpenCreateModal = () => setOpenCreateModal(true);
  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
    setFormData({ name: "", email: "", password: "", category: "" });
  };

  const handleCreateUser = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/users", { ...formData });
      fetchUsers();
      handleCloseCreateModal();
    } catch (err) {
      console.error(err);
      setError("Erro ao criar usuário");
    }
    setLoading(false);
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditData({ ...user });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
    setEditData({ name: "", email: "", password: "", category: "", className: "", isActive: false });
  };

  const handleSave = async () => {
    if (editData && editData._id) {
      try {
        await axios.put(`http://localhost:5000/users/${editData._id}`, editData);
        fetchUsers();
        handleClose();
      } catch (err) {
        console.error(err);
        setError("Erro ao atualizar usuário");
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await axios.delete(`http://localhost:5000/users/${userId}`);
      fetchUsers();
      setDeleteDialogOpen(false); // Fecha o modal após a exclusão
    } catch (err) {
      console.error(err);
      setError("Erro ao excluir usuário");
    }
  };

  const handleOpenDeleteDialog = (userId: string) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => setDeleteDialogOpen(false);

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      handleDeleteUser(userToDelete);
    }
  };

  // Função para filtrar usuários
  const filteredUsers = users
  .filter(
    (user) => {
    return user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
           user.category.toLowerCase().includes(searchQuery.toLowerCase());
  }
);

  // Função para ordenar usuários
  const sortedUsers = filteredUsers.sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'start',
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
          Lista de Usuários
        </Typography>
        <Typography variant="h6" sx={{ 
          color: "#fff", 
          mb: 4, 
          fontSize: { xs: "1rem", sm: "1rem", md: "1rem" },
          opacity: 0.7
        }}>
          Atualmente, existe {users.length} {users.length > 1 ? 'usuários' : 'usuário'} encontrados.
        </Typography>
      </motion.div>

      <Box
        component={Paper} 
        sx={{
          width: '100%',
          overflowX: "auto",
          backgroundColor: '#1F2A4C',
          borderRadius: "8px",
          display: "flex",
          flexDirection: "row",
          mb: 2
        }}
      >
        <TextField
          placeholder="Buscar Usuário"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#fff' }} />
              </InputAdornment>
            ),
          }}
          sx={{ 
            flex: 1,
            '& .MuiOutlinedInput-root': {
              color: '#fff',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
              },
            },
            '& .MuiInputBase-input::placeholder': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
          }}
        />
        <Button 
          variant="contained" 
          onClick={handleOpenCreateModal} 
          sx={{ 
            flex: 0,
            backgroundColor: '#0A1C44',
            '&:hover': {
              backgroundColor: '#152347'
            }
          }}
        >
          <Add />
        </Button>
      </Box>

      <TableContainer 
        component={Paper} 
        sx={{ 
          backgroundColor: '#1F2A4C',
          '& .MuiTableCell-root': {
            color: '#fff'
          }
        }}
      >
  <Table>
    <TableHead>
      <TableRow>
      <TableCell
         
        >
         
        </TableCell>
        <TableCell
          onClick={() => { setSortField("name"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}
          sx={{
            cursor: "pointer",
            display: { xs: "table-cell", sm: "table-cell" }, // sempre visível
          }}
        >
          Nome {sortOrder === "asc" && sortField === 'name' ? <SwapVertIcon sx={{ maxHeight: "16px" }} /> : null}
        </TableCell>
        <TableCell
          onClick={() => { setSortField("email"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}
          sx={{
            cursor: "pointer",
            display: { xs: "none", sm: "table-cell" }, // esconde em telas pequenas
          }}
        >
          Email {sortOrder === "asc" && sortField === 'email' ? <SwapVertIcon sx={{ maxHeight: "16px" }} /> : null}
        </TableCell>
        {isOwner && <TableCell
        
          onClick={() => { setSortField("category"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}
          sx={{
            cursor: "pointer",
            display: { xs: "none", sm: "table-cell" }, // esconde em telas pequenas
          }}
        >
          Categoria {sortOrder === "asc" && sortField === 'category' ? <SwapVertIcon sx={{ maxHeight: "16px" }} /> : null}
        </TableCell>}
        <TableCell
          onClick={() => { setSortField("className"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}
          sx={{
            cursor: "pointer",
            display: { xs: "none", sm: "table-cell" }, // esconde em telas pequenas
          }}
        >
          Classe {sortOrder === "asc" && sortField === 'className' ? <SwapVertIcon sx={{ maxHeight: "16px" }} /> : null}
        </TableCell>
        <TableCell
          onClick={() => { setSortField("status"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}
          sx={{
            cursor: "pointer",
            display: { xs: "none", sm: "table-cell" }, // esconde em telas pequenas
          }}
        >
          Status {sortOrder === "asc" && sortField === 'status' ? <SwapVertIcon sx={{ maxHeight: "16px" }} /> : null}
        </TableCell>
        <TableCell
          onClick={() => { setSortField("isActive"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}
          sx={{
            cursor: "pointer",
            display: { xs: "none", sm: "table-cell" }, // esconde em telas pequenas
          }}
        >
          Ativo {sortOrder === "asc" && sortField === 'isActive' ? <SwapVertIcon sx={{ maxHeight: "16px" }} /> : null}
        </TableCell>
        <TableCell
          align="right"
          sx={{
            display: { xs: "table-cell", sm: "table-cell" }, // sempre visível
          }}
        >
          Ações
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {sortedUsers.map((user) => (
        <TableRow key={user._id}>
          <TableCell sx={{ display: { xs: "table-cell", sm: "table-cell" } }}><Avatar src={user.customIcon} sx={{ width: 32, height: 32, mx: "auto" }} /></TableCell>

          <TableCell sx={{ display: { xs: "table-cell", sm: "table-cell" } }}>{user.name}</TableCell>
          <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{user.email}</TableCell>
          {isOwner && <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{user.category}</TableCell>}
          <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{user.className}</TableCell>
          <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{user.status}</TableCell>
          <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{user.isActive ? <CheckCircle /> : <Close />}</TableCell>
          <TableCell align="right" sx={{ display: { xs: "table-cell", sm: "table-cell" } }}>
            <IconButton onClick={() => handleEditClick(user)}><Edit /></IconButton>
            <IconButton onClick={() => handleOpenDeleteDialog(user._id)} color="error"><Delete /></IconButton>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>


      {/* Modal de Confirmação de Deleção */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog} PaperProps={{
          sx: {
            backgroundColor: '#1F2A4C',
            color: '#fff'
          }
        }}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza de que deseja excluir este usuário?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="secondary">Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error">Excluir</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={open} onClose={handleClose} PaperProps={{
          sx: {
            backgroundColor: '#1F2A4C',
            color: '#fff'
          }
        }}>
        <DialogTitle>Editar Usuário</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <>
              <TextField label="Nome" fullWidth value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} sx={{ mb: 2 ,mt:2}} />
              <TextField label="Email" fullWidth value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} sx={{ mb: 2 }} />
              <TextField label="Status" fullWidth value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })} sx={{ mb: 2 }} />
              {isOwner && <TextField label="Categoria" fullWidth value={editData.category} onChange={(e) => setEditData({ ...editData, category: e.target.value })} sx={{ mb: 2 }} />}
              <TextField label="Classe" fullWidth value={editData.className} onChange={(e) => setEditData({ ...editData, className: e.target.value })} sx={{ mb: 2 }} />
              <FormControlLabel control={<Checkbox checked={editData?.isActive || false} onChange={(e) => setEditData({ ...editData, isActive: e.target.checked })} />} label="Ativo" sx={{ mb: 2 }} />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} color="primary">Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Criação */}
      <Dialog open={openCreateModal} onClose={handleCloseCreateModal} PaperProps={{
          sx: {
            backgroundColor: '#1F2A4C',
            color: '#fff'
          }
        }}>
        <DialogTitle>Criar Novo Usuário</DialogTitle>
        <DialogContent>
          <TextField label="Nome" fullWidth value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} sx={{ mb: 2 ,mt:2}} />
          <TextField label="Email" fullWidth value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Senha" fullWidth type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} sx={{ mb: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateModal} color="secondary">Cancelar</Button>
          <Button onClick={handleCreateUser} color="primary" disabled={loading}>{loading ? <CircularProgress size={24} /> : 'Criar'}</Button>
        </DialogActions>
      </Dialog>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default Users;
