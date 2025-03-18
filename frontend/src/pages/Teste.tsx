import { useState } from "react";
import { 
    Card, 
    Typography, 
    Box, 
    TextField, 
    Select, 
    MenuItem, 
    Table, 
    TableHead, 
    TableBody, 
    TableRow, 
    TableCell,
    Grid,
    // List,
    // ListItem,
    // ListItemText,
    Chip,
    Button
} from "@mui/material";

// Dados de exemplo para teste
const dadosTeste = [
  { id: 1, nome: "Item 1", categoria: "A", status: "Ativo" },
  { id: 2, nome: "Item 2", categoria: "B", status: "Inativo" },
  { id: 3, nome: "Item 3", categoria: "A", status: "Ativo" },
  { id: 4, nome: "Item 4", categoria: "C", status: "Pendente" },
];

const categorias = ["A", "B", "C"];

export default function Teste() {
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
    const [novoItem, setNovoItem] = useState({ nome: "", categoria: "", status: "" });
    const [dados, setDados] = useState(dadosTeste);
  
    // Filtrar itens pela categoria selecionada
    const itensFiltrados = categoriaSelecionada 
      ? dados.filter((item) => item.categoria === categoriaSelecionada)
      : dados;

    // Função para adicionar novo item
    const adicionarItem = () => {
      if (novoItem.nome && novoItem.categoria && novoItem.status) {
        setDados([...dados, { ...novoItem, id: dados.length + 1 }]);
        setNovoItem({ nome: "", categoria: "", status: "" });
      }
    };
  
    return (
        <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            px: 2, 
            ml: "80px", 
            background: "rgba(16, 28, 68, 1)", 
            width: "calc(100vw - 110px)", 
            height: "calc(100vh - 70px)", 
            mt: "60px", 
            pt: 3,
            gap: 2
        }}>
            {/* Seção Superior */}
            <Card sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Adicionar Novo Item
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Nome"
                            value={novoItem.nome}
                            onChange={(e) => setNovoItem({ ...novoItem, nome: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Select
                            fullWidth
                            value={novoItem.categoria}
                            onChange={(e) => setNovoItem({ ...novoItem, categoria: e.target.value })}
                            displayEmpty
                        >
                            <MenuItem value="">Selecione uma categoria</MenuItem>
                            {categorias.map((cat) => (
                                <MenuItem key={cat} value={cat}>Categoria {cat}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Select
                            fullWidth
                            value={novoItem.status}
                            onChange={(e) => setNovoItem({ ...novoItem, status: e.target.value })}
                            displayEmpty
                        >
                            <MenuItem value="">Selecione um status</MenuItem>
                            <MenuItem value="Ativo">Ativo</MenuItem>
                            <MenuItem value="Inativo">Inativo</MenuItem>
                            <MenuItem value="Pendente">Pendente</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Button 
                            fullWidth 
                            variant="contained" 
                            onClick={adicionarItem}
                            sx={{ height: '100%' }}
                        >
                            Adicionar
                        </Button>
                    </Grid>
                </Grid>
            </Card>

            {/* Seção de Filtro */}
            <Card sx={{ p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                        <Typography variant="subtitle1">Filtrar por Categoria:</Typography>
                    </Grid>
                    <Grid item xs={12} md={9}>
                        <Select
                            fullWidth
                            value={categoriaSelecionada}
                            onChange={(e) => setCategoriaSelecionada(e.target.value)}
                        >
                            <MenuItem value="">Todas as Categorias</MenuItem>
                            {categorias.map((cat) => (
                                <MenuItem key={cat} value={cat}>Categoria {cat}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                </Grid>
            </Card>

            {/* Tabela de Dados */}
            <Card sx={{ p: 2, flex: 1, overflow: 'auto' }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nome</TableCell>
                            <TableCell>Categoria</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {itensFiltrados.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.nome}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={`Categoria ${item.categoria}`}
                                        color="primary"
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={item.status}
                                        color={
                                            item.status === "Ativo" ? "success" :
                                            item.status === "Inativo" ? "error" : "warning"
                                        }
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </Box>
    );
}