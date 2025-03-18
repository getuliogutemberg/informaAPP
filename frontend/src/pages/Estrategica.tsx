import { useState } from "react";
import { materiaisEolicos } from "../assets/materiaisEolicos";
import { gruposMateriaisEolicos } from "../assets/gruposMateriaisEolicos";
import { 
  Card, 
  Typography, 
 
  TextField, 
  Select, 
  MenuItem, 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  Chip 
} from "@mui/material";

export default function TelaEstrategica() {
  const [grupoSelecionado, setGrupoSelecionado] = useState("");

  const materiaisFiltrados = grupoSelecionado
    ? materiaisEolicos.filter((m) => m.grupo === grupoSelecionado)
    : materiaisEolicos;

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      px: 2,
      ml: "80px",
      background: "#0A1C44", // Cor de fundo mais suave
      width: "calc(100vw - 110px)",
      height: "calc(100vh - 70px)",
      mt: "60px",
      pt: 3,
      gap: 2
    }}>
      {/* Filtro e Informações */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '45%',
        gap: 2
      }}>
        {/* Filtro de Tipo */}
        <Card sx={{
          display: 'flex',
          flexDirection: 'row',
          p: 2,
          gap: 2,
          backgroundColor: '#1F2A4C', // Cor de fundo para card
          
          
        }}>
          <Typography variant="h6" align="left" sx={{ color: '#fff' }}>Filtro</Typography>
          <Select 
            fullWidth 
            value={grupoSelecionado} 
            onChange={(e) => setGrupoSelecionado(e.target.value)}
            sx={{ backgroundColor: '#fff', borderRadius: '8px' }}
          >
            <MenuItem value="">Todos os Tipos</MenuItem>
            {gruposMateriaisEolicos.map((grupo) => (
              <MenuItem key={grupo.id} value={grupo.nome}>{grupo.nome}</MenuItem>
            ))}
          </Select>
        </Card>

        {/* Informações do Grupo */}
        <Card sx={{
          p: 2,
          backgroundColor: '#1F2A4C',
          overflow: 'auto'
        }}>
          <Typography variant="h6" align="left" sx={{ color: '#fff' }}>Informações do Tipo</Typography>
          
          {grupoSelecionado ? (
            gruposMateriaisEolicos.map(grupo => grupo.nome === grupoSelecionado && (
              <Box key={grupo.id} sx={{
                display: "flex",
                flexDirection: "row",
                
                gap: 2,
                padding: 2,
                
              }}>
               
                  <Box sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }} >
                    
                    <Typography variant="subtitle1" sx={{ color: '#fff' }}>Especificações:</Typography>
                    <List>
                      <ListItem sx={{color:'#fff'}}>
                        <ListItemText 
                          
                          primary="Categorias" 
                          secondary={grupo.especificacoes.categoriasDisponiveis.join(", ")} 
                        />
                      </ListItem>
                      <ListItem sx={{color:'#fff'}}>
                        <ListItemText 
                        
                          primary="Classificação de Risco" 
                          secondary={grupo.especificacoes.classificacaoRisco.join(", ")} 
                        />
                      </ListItem>
                      <ListItem sx={{color:'#fff'}}>
                        <ListItemText 
                          primary="Unidades de Medida" 
                          secondary={grupo.especificacoes.unidadesMedida.join(", ")} 
                        />
                      </ListItem>
                    </List>
                  </Box>
                
                  <Box sx={{
                    flex: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}>
                    <TextField fullWidth  value={grupo.tipo}  margin="normal" sx={{ background: '#fff', color: '#000' }} />
                    <TextField fullWidth  value={grupo.descricao}  margin="normal" multiline  sx={{ background: '#fff', color: '#000' }}  />
                    
                    
                  </Box>
              </Box>
            ))
          ) : (
            <Table size="small" sx={{  }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#0A1C44' }}>
                  <TableCell sx={{ color: '#fff' }}>Tipo</TableCell>
                  <TableCell sx={{ color: '#fff' }}>Descrição</TableCell>
                  <TableCell sx={{ color: '#fff' }}>Itens</TableCell>
                  <TableCell sx={{ color: '#fff' }}>Críticos</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gruposMateriaisEolicos.map((grupo) => {
                  const materiaisDoGrupo = materiaisEolicos.filter(m => m.grupo === grupo.nome);
                  const materiaisCriticos = materiaisDoGrupo.filter(m => m.estoque <= m.estoqueMinimo);
                  return (
                    <TableRow key={grupo.id} sx={{ '&:hover': { backgroundColor: '#0A1C44' } }}>
                      <TableCell sx={{ color: '#fff' }}>{grupo.tipo}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{grupo.descricao}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{materiaisDoGrupo.length}</TableCell>
                      <TableCell>
                        <Chip 
                          label={`${materiaisCriticos.length} críticos`}
                          color={materiaisCriticos.length > 0 ? "error" : "success"}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Card>
      </Box>

      {/* Lista de Materiais */}
      <Card sx={{
        height: '46%',
        p: 2,
        backgroundColor: '#1F2A4C',
       
        overflow: 'auto'
      }}>
        <Typography variant="h6" align="left" sx={{ mb: 0, color: '#fff' }}>Materiais em Estoque</Typography>
        <Table size="small" sx={{}}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#0A1C44' }}>
              <TableCell sx={{ color: '#fff' }}>Código</TableCell>
              <TableCell sx={{ color: '#fff' }}>Nome</TableCell>
              <TableCell sx={{ color: '#fff' }}>Categoria</TableCell>
              <TableCell sx={{ color: '#fff' }}>Risco</TableCell>
              <TableCell sx={{ color: '#fff' }}>Un.</TableCell>
              <TableCell sx={{ color: '#fff' }}>Estoque</TableCell>
              <TableCell sx={{ color: '#fff' }}>Mínimo</TableCell>
              <TableCell sx={{ color: '#fff' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materiaisFiltrados.map((material) => (
              <TableRow
                key={material.id}
                sx={{
                  backgroundColor: material.estoque <= material.estoqueMinimo ? '#0A1C44' : 'inherit',
                  '&:hover': { backgroundColor: '#0A1C44', color:"#000000"}
                }}
              >
                <TableCell sx={{ color: '#fff' }}>{material.codigo}</TableCell>
                <TableCell sx={{ color: '#fff' }}>{material.nome}</TableCell>
                <TableCell sx={{ color: '#fff' }}>{material.categoria}</TableCell>
                <TableCell sx={{ color: '#fff' }}>
                  <Chip 
                    label={material.classificacaoRisco}
                    color={
                      material.classificacaoRisco === "Alto" ? "error" :
                      material.classificacaoRisco === "Médio" ? "warning" : "success"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell sx={{ color: '#fff' }}>{material.unidadeMedida}</TableCell>
                <TableCell sx={{ color: '#fff' }}>{material.estoque}</TableCell>
                <TableCell sx={{ color: '#fff' }}>{material.estoqueMinimo}</TableCell>
                <TableCell sx={{ color: '#fff' }}>
                  {material.estoque <= material.estoqueMinimo ? (
                    <Chip label="Estoque Crítico" color="error" size="small" />
                  ) : (
                    <Chip label="Normal" color="success" size="small" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
}
