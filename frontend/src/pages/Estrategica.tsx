import { useState } from "react";
import { materiaisEolicos } from "../assets/materiaisEolicos";
import { gruposMateriaisEolicos } from "../assets/gruposMateriaisEolicos";
import { 
  Card, 
  Typography, 
  Select, 
  MenuItem, 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  Box, 
  Grid,
  Stack,
  Button,
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
      px: 2,
      ml: "80px",
      background: "#0A1C44",
      width: "calc(100vw - 110px)",
      height: "calc(100vh - 60px)",
      mt: "60px",
      overflow: 'hidden',
    }}>
      {/* <Box sx={{ pt: 3, pb: 2 }}>
        <Typography variant="h4" sx={{ color: '#fff' }}>Estratégica</Typography>
      </Box> */}

      <Box sx={{ 
        flex: 1,
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(0, 0, 0, 0.1)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '4px',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.3)',
          },
        },
      }}>
        <Grid container spacing={2} sx={{ minHeight: '100%' }}>
          {/* Coluna da Esquerda - Filtro e Info Geral */}
          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              {/* Filtro Grupo */}
              <Card sx={{
                p: 2,
                backgroundColor: '#1F2A4C',
              }}>
                <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>Filtro Grupo</Typography>
                <Select 
                  fullWidth 
                  value={grupoSelecionado} 
                  onChange={(e) => setGrupoSelecionado(e.target.value)}
                  sx={{ backgroundColor: '#fff', borderRadius: '8px' }}
                >
                  <MenuItem value="">Todos os Grupos</MenuItem>
                  {gruposMateriaisEolicos.map((grupo) => (
                    <MenuItem key={grupo.id} value={grupo.nome}>{grupo.nome}</MenuItem>
                  ))}
                </Select>
              </Card>

              {/* Info Geral Grupo */}
              <Card sx={{
                p: 2,
                backgroundColor: '#1F2A4C',
                flex: 1,
                overflow: 'auto'
              }}>
                <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>Info Geral Grupo</Typography>
                {grupoSelecionado && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ color: '#fff', mb: 1 }}>
                      Grupo: {grupoSelecionado}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: '#fff', opacity: 0.7, mb: 2 }}>
                      ID: {gruposMateriaisEolicos.find(g => g.nome === grupoSelecionado)?.id}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#fff', mb: 2 }}>
                      Quantidade de Itens: {materiaisFiltrados.length}
                    </Typography>
                  </Box>
                )}
              </Card>
            </Stack>
          </Grid>

          {/* Coluna Central - Parâmetros do Grupo */}
          <Grid item xs={12} md={4}>
            <Card sx={{
              p: 2,
              backgroundColor: '#1F2A4C',
              height: '100%',
              overflow: 'auto',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(0, 0, 0, 0.1)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.3)',
                },
              },
            }}>
              <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>Preenchimento Parâmetros Grupo</Typography>
              {grupoSelecionado && (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#fff' }}>Código</TableCell>
                      <TableCell sx={{ color: '#fff' }}>Unidade</TableCell>
                      <TableCell sx={{ color: '#fff' }}>Classe</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {materiaisFiltrados.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell sx={{ color: '#fff' }}>{material.codigoExterno}</TableCell>
                        <TableCell sx={{ color: '#fff' }}>{material.unidadeMedida}</TableCell>
                        <TableCell sx={{ color: '#fff' }}>{material.classeId}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>
          </Grid>

          {/* Coluna da Direita - Edição Item a Item */}
          <Grid item xs={12} md={4}>
            <Card sx={{
              p: 2,
              backgroundColor: '#1F2A4C',
              height: '100%',
              overflow: 'auto',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(0, 0, 0, 0.1)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.3)',
                },
              },
            }}>
              <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>Edição Parâmetro Item a Item</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#fff' }}>Item</TableCell>
                    <TableCell sx={{ color: '#fff' }}>Número</TableCell>
                    <TableCell sx={{ color: '#fff' }}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {materiaisFiltrados.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell sx={{ color: '#fff' }}>
                        {material.nome}
                        <Chip 
                          label={material.grupo}
                          size="small"
                          sx={{ 
                            ml: 1,
                            backgroundColor: 'rgba(12, 114, 249, 0.2)',
                            color: '#fff',
                            borderColor: 'rgba(12, 114, 249, 1)'
                          }}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#fff' }}>{material.numeroItem}</TableCell>
                      <TableCell>
                        <Button 
                          variant="contained" 
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(12, 114, 249, 0.8)',
                            '&:hover': {
                              backgroundColor: 'rgba(12, 114, 249, 1)'
                            }
                          }}
                        >
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
