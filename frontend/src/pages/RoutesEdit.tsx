import { useEffect, useState } from "react";
import { Typography, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { motion } from "framer-motion";
import axios from "axios";

// Tipo para a Rota, com requiredRole opcional
interface Route {
  _id: string;
  path: string;
  component: string;
  requiredRole?: string[]; // Agora o campo é opcional
  pageId: string;
  __v: number;
}

const RoutesEdit = () => {
  const [routes, setRoutes] = useState<Route[]>([]); // Estado para lista de rotas
  const [open, setOpen] = useState(false); // Estado para controlar o modal
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null); // Estado para armazenar a rota selecionada para edição

  // Carregar as rotas do backend
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/routes");
        setRoutes(response.data); // Atualiza o estado com os dados recebidos
      } catch (error) {
        console.error("Erro ao buscar as rotas:", error);
      }
    };

    fetchRoutes();
  }, []);

  // Função para abrir o modal e preencher com os dados da rota
  const handleEditClick = (route: Route) => {
    setSelectedRoute(route);
    setOpen(true);
  };

  // Função para fechar o modal
  const handleClose = () => {
    setOpen(false);
    setSelectedRoute(null);
  };

  // Função para salvar as alterações
  const handleSave = async () => {
    if (selectedRoute) {
      try {
        await axios.put(`http://localhost:5000/routes/${selectedRoute._id}`, selectedRoute);
        setRoutes((prevRoutes) =>
          prevRoutes.map((route) =>
            route._id === selectedRoute._id ? { ...route, ...selectedRoute } : route
          )
        );
        setOpen(false);
      } catch (error) {
        console.error("Erro ao salvar a rota:", error);
      }
    }
  };

  // Função para excluir uma rota
  const handleDeleteRoute = async () => {
    if (selectedRoute) {
      try {
        await axios.delete(`http://localhost:5000/routes/${selectedRoute._id}`);
        setRoutes((prevRoutes) => prevRoutes.filter((route) => route._id !== selectedRoute._id));
        setOpen(false);
      } catch (error) {
        console.error("Erro ao excluir a rota:", error);
      }
    }
  };

  return (
    <Box
      sx={{
        background: "rgba(16, 28, 68, 1)",
        width: "calc(100vw - 120px)",
        height: "calc(100vh - 40px)",
        pl: "100px",
        pt: "130px",
        pr: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            color: "white",
            mb: 2,
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
          }}
        >
          Gestão de Rotas
        </Typography>
        <Typography
          variant="h6"
          sx={{ color: "#666", mb: 4, fontSize: { xs: "1rem", sm: "1rem", md: "1rem" } }}
        >
          Atualmente, você possui {routes.length} rota(s).
        </Typography>
      </motion.div>

      {/* Tabela de Rotas */}
      {routes.length > 0 ? (
        <TableContainer component={Paper}>
          <Table aria-label="tabela de rotas">
            <TableHead>
              <TableRow>
                <TableCell align="left">Caminho</TableCell>
                <TableCell align="center" sx={{ display: { xs: "none", sm: "table-cell" } }}>Componente</TableCell>
                <TableCell align="center" sx={{ display: { xs: "none", sm: "table-cell" } }}>Autorização</TableCell>
                <TableCell align="right">Ação</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {routes.map((route) => (
                <TableRow key={route._id}>
                  <TableCell align="left">{route.path}</TableCell>
                  <TableCell align="center" sx={{ display: { xs: "none", sm: "table-cell" } }}>{route.component}</TableCell>
                  <TableCell align="center" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    {route.requiredRole ? route.requiredRole.join(", ") : "Nenhuma"}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={() => handleEditClick(route)}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <span>Nenhuma rota disponível.</span>
      )}

      {/* Modal de Edição */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editar Rota</DialogTitle>
        <DialogContent>
          {selectedRoute && (
            <>
              <TextField
                label="Caminho"
                fullWidth
                value={selectedRoute.path}
                onChange={(e) => setSelectedRoute({ ...selectedRoute, path: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Componente"
                fullWidth
                value={selectedRoute.component}
                onChange={(e) => setSelectedRoute({ ...selectedRoute, component: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Autorização"
                fullWidth
                value={selectedRoute.requiredRole ? selectedRoute.requiredRole.join(", ") : ""}
                onChange={(e) =>
                  setSelectedRoute({
                    ...selectedRoute,
                    requiredRole: e.target.value ? e.target.value.split(",").map((role) => role.trim()) : [],
                  })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                label="Page ID"
                fullWidth
                value={selectedRoute.pageId}
                onChange={(e) => setSelectedRoute({ ...selectedRoute, pageId: e.target.value })}
                sx={{ mb: 2 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSave} color="primary">
            Salvar
          </Button>
          <Button onClick={handleDeleteRoute} color="error" startIcon={<Delete />}>
            Apagar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoutesEdit;
