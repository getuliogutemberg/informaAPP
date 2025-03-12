import { useState } from "react";
// Importar os dados dos arquivos separados
import { materiaisEolicos } from "../assets/materiaisEolicos";
import { gruposMateriaisEolicos } from "../assets/gruposMateriaisEolicos";
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
    List,
    ListItem,
    ListItemText,
    Chip
  } from "@mui/material";

  export default function TelaEstrategica() {
    const [grupoSelecionado, setGrupoSelecionado] = useState("");

 
  
    // Filtrar materiais pelo grupo selecionado
  const materiaisFiltrados = grupoSelecionado 
  ? materiaisEolicos.filter((m) => m.grupo === grupoSelecionado)
  : materiaisEolicos;
  
      return (
        <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            // alignItems:"center",
            px: 2, 
            ml: "80px", 
            background: "rgba(16, 28, 68, 1)", 
            width: "calc(100vw - 110px)", 
            height: "calc(100vh - 70px)", 
            mt: "60px", 
            pt: 3,
            gap: 2
          }}>
            {/* Container Superior - 50% da altura */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              height: '45%',
              gap: 2
            }}>
              {/* Filtros - 20% da largura */}
              <Card sx={{ 
                display: 'flex',
                flexDirection: 'row',
                
                p:2,
                gap: 2,
               
                // overflow: 'auto'
              }}>
                <Typography variant="h6" align="left">Filtrar por Tipo de Material</Typography>
                <Select 
                  fullWidth 
                  value={grupoSelecionado} 
                  onChange={(e) => setGrupoSelecionado(e.target.value)}
                >
                  <MenuItem value="">Todos os Tipos</MenuItem>
                  {gruposMateriaisEolicos.map((grupo) => (
                    <MenuItem key={grupo.id} value={grupo.nome}>{grupo.nome}</MenuItem>
                  ))}
                </Select>
              </Card>
      
              {/* Informações do Grupo - 30% da largura */}
              <Card sx={{ 
                
                p: 2,
                overflow: 'auto'
              }}>
                <Typography variant="h6" align="left">Informações do Tipo</Typography>
                {grupoSelecionado ? (
                  // Conteúdo para grupo específico
                  <>
                    {gruposMateriaisEolicos.map(grupo => grupo.nome === grupoSelecionado && (
                      <Box key={grupo.id} sx={{
                        
                        display: "flex",
                        flexDirection: "row",
                        gap: 2,
                        
                        padding: 2,
                        }}>
                        <Grid container spacing={2} sx={{
                        
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        
                        padding: 2,
                        }}>
                          <Grid item xs={12}>
                            <TextField fullWidth label="Tipo" value={grupo.tipo} disabled margin="normal" />
                            <TextField fullWidth label="Descrição" value={grupo.descricao} disabled margin="normal" multiline />
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="subtitle1">Especificações:</Typography>
                            <List>
                              <ListItem>
                                <ListItemText 
                                  primary="Categorias" 
                                  secondary={grupo.especificacoes.categoriasDisponiveis.join(", ")} 
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText 
                                  primary="Classificação de Risco" 
                                  secondary={grupo.especificacoes.classificacaoRisco.join(", ")} 
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText 
                                  primary="Unidades de Medida" 
                                  secondary={grupo.especificacoes.unidadesMedida.join(", ")} 
                                />
                              </ListItem>
                            </List>
                          </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{
                        
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        
                        padding: 2,
                        }}>
                          <Grid item xs={12}>
                            <TextField fullWidth label="Tipo" value={grupo.tipo} disabled margin="normal" />
                            <TextField fullWidth label="Descrição" value={grupo.descricao} disabled margin="normal" multiline />
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="subtitle1">Especificações:</Typography>
                            <List>
                              <ListItem>
                                <ListItemText 
                                  primary="Categorias" 
                                  secondary={grupo.especificacoes.categoriasDisponiveis.join(", ")} 
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText 
                                  primary="Classificação de Risco" 
                                  secondary={grupo.especificacoes.classificacaoRisco.join(", ")} 
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText 
                                  primary="Unidades de Medida" 
                                  secondary={grupo.especificacoes.unidadesMedida.join(", ")} 
                                />
                              </ListItem>
                            </List>
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                  </>
                ) : (
                  // Tabela resumo para todos os grupos
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Descrição</TableCell>
                        <TableCell>Itens</TableCell>
                        <TableCell>Críticos</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {gruposMateriaisEolicos.map((grupo) => {
                        const materiaisDoGrupo = materiaisEolicos.filter(m => m.grupo === grupo.nome);
                        const materiaisCriticos = materiaisDoGrupo.filter(m => m.estoque <= m.estoqueMinimo);
                        return (
                          <TableRow key={grupo.id}>
                            <TableCell>{grupo.tipo}</TableCell>
                            <TableCell>{grupo.descricao}</TableCell>
                            <TableCell>{materiaisDoGrupo.length}</TableCell>
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
      
            {/* Lista de Materiais - 50% da altura */}
            <Card sx={{ 
              height: '46%',
              p: 2,
              overflow: 'auto'
            }}>
              <Typography variant="h6" align="left" sx={{ mb: 1 }}>Materiais em Estoque</Typography>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell>Categoria</TableCell>
                    <TableCell>Risco</TableCell>
                    <TableCell>Un.</TableCell>
                    <TableCell>Estoque</TableCell>
                    <TableCell>Mínimo</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {materiaisFiltrados.map((material) => (
                    <TableRow 
                      key={material.id}
                      sx={{
                        backgroundColor: material.estoque <= material.estoqueMinimo 
                          ? 'rgba(255, 0, 0, 0.1)' 
                          : 'inherit'
                      }}
                    >
                      <TableCell>{material.codigo}</TableCell>
                      <TableCell>{material.nome}</TableCell>
                      <TableCell>{material.categoria}</TableCell>
                      <TableCell>
                        <Chip 
                          label={material.classificacaoRisco}
                          color={
                            material.classificacaoRisco === "Alto" ? "error" :
                            material.classificacaoRisco === "Médio" ? "warning" : "success"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{material.unidadeMedida}</TableCell>
                      <TableCell>{material.estoque}</TableCell>
                      <TableCell>{material.estoqueMinimo}</TableCell>
                      <TableCell>
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