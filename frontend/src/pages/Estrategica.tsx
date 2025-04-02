import { Box, Typography, TextField, Button, Chip, Card, IconButton, Switch, FormControlLabel, styled, SwitchProps, Modal, FormControl, RadioGroup, Radio } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import ReplayIcon from "@mui/icons-material/Replay";
import { useState, useEffect } from "react";
import axios from "axios";

// const gruposData = ["001 - ABRACADEIRA", "002 - ABRACADEIRA", "003 - ABRACADEIRA", "004 - ABRACADEIRA", "005 - ABRACADEIRA"];
// const itensData = [
//   { name: "ABRACADEIRA ELETROD ACO GALV D1", tag: "Estratégico" }, { name: "ABRACADEIRA ELETROD SAE1020 GALV D1.12", tag: "Estratégico" }, { name: "ABRACADEIRA ELETROD SAE1020 GALV D12" }, { name: "ABRACADEIRA ELETROD ACO GALV D2" }, { name: "ABRACADEIRA ELETROD SAE1020 GALV D34" }
// ];
// const criterios = ["Risco de gerar indisponibilidade da UG", "Risco de gerar indisponibilidade de Sistema de Segurança", "Indisponibilidade do item gera risco de afetar o ativo", "Processo de compras superior a 6 meses", "Custo superior a R$ 10.000,00", "Mais de 1 fornecedor disponível", "Risco de ser descontinuado pelo fabricante em até 2 anos", "Item utilizado por pelo menos 10 ativos", "Alta probabilidade de uso", "Item considerado estratégico"]
interface Grupo {
  id: string;         // _id da API
  cod_grupo: number;        // cod_grupo da API
  desc_grupo: string;       // desc_grupo da API
}

interface Item {
  _id: string;                   // Identificador único do item
  cod_item_material: number;     // Código do item
  cod_itemmaterial_ext: number; // Código externo do item
  desc_material: string;         // Descrição do item
  desc_numero_itemmaterial: number; // Número do item
  cod_unidade_medida: string;   // Código da unidade de medida
  cod_classematerial: number;   // Código da classe material
  tag: string; //
}

interface Criterio {
  cod_parametro: number;
  desc_parametro: string;
  opcoes: {
    cod_opcao: number;
    desc_opcao: string;
  }[];
  tipo: 'boolean' | 'radio';
}
const CustomSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 25,
  height: 16,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 0,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(10px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: 'rgba(46, 112, 171, 1)',
        opacity: 1,
        border: 1,
        ...theme.applyStyles('dark', {
          backgroundColor: '#2ECA45',
        }),
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[100],
      ...theme.applyStyles('dark', {
        color: theme.palette.grey[100],
      }),
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.7,
      ...theme.applyStyles('dark', {
        opacity: 0.7,
      }),
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 15,
    height: 15,
    position: 'relative',
    backgroundColor: '#888', // Cor cinza para o estado desligado
    '&::before': {
      content: '"✕"',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '10px',
      color: '#fff', // X branco
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb': {
    backgroundColor: '#fff', // Bolinha branca quando ligado
    '&::before': {
      content: '"✓"',
      color: 'rgba(46, 112, 171, 1)', // V azul
    },
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#E9E9EA',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    ...theme.applyStyles('dark', {
      backgroundColor: '#39393D',
    }),
  },
}));
export default function TelaEstrategica() {
  const [buscaItem, setBuscaItem] = useState<string>("");
  const [buscaGrupo, setBuscaGrupo] = useState("");
  const [grupoSelecionado, setGrupoSelecionado] = useState<Grupo|null>(null);
  const [itemSelecionado, setItemSelecionado] = useState<Item|null>(null);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [itens, setItens] = useState<Item[]>([]); // Para armazenar todos os itens
  const [modalOpen, setModalOpen] = useState(false); // Estado para controlar o modal
  const [filtroSelecionado, setFiltroSelecionado] = useState<"Todos" | "Não preenchidos" | "Preenchidos">("Todos");
  const [filtroItemSelecionado, setFiltroItemSelecionado] = useState<string>("Todos");
  
  const [criterios, setCriterios] = useState<Criterio[]>([
    {
      cod_parametro: 0,
      desc_parametro: "Risco de gerar indisponibilidade da UG",
      tipo: 'boolean',
      opcoes: [
        { cod_opcao: 0, desc_opcao: "FALSE" },
        { cod_opcao: 1, desc_opcao: "TRUE" }
      ]
    },
    {
      cod_parametro: 1,
      desc_parametro: "Risco de gerar indisponibilidade de Sistema de Segurança",
      tipo: 'boolean',
      opcoes: [
        { cod_opcao: 0, desc_opcao: "FALSE" },
        { cod_opcao: 1, desc_opcao: "TRUE" }
      ]
    },
    {
      cod_parametro: 2,
      desc_parametro: "Indisponibilidade do item gera risco de afetar o ativo",
      tipo: 'boolean',
      opcoes: [
        { cod_opcao: 0, desc_opcao: "FALSE" },
        { cod_opcao: 1, desc_opcao: "TRUE" }
      ]
    },
    {
      cod_parametro: 3,
      desc_parametro: "Processo de compras superior a 6 meses",
      tipo: 'radio',
      opcoes: [
        { cod_opcao: 0, desc_opcao: "1 mês" },
        { cod_opcao: 1, desc_opcao: "3 meses" },
        { cod_opcao: 2, desc_opcao: "6 meses" },
        { cod_opcao: 3, desc_opcao: "9 meses" },
        { cod_opcao: 4, desc_opcao: "12 meses" },
        { cod_opcao: 5, desc_opcao: "Acima de 12 meses" }
      ]
    },
    {
      cod_parametro: 4,
      desc_parametro: "Mais de 1 fornecedor disponível",
      tipo: 'radio',
      opcoes: [
        { cod_opcao: 0, desc_opcao: "1" },
        { cod_opcao: 1, desc_opcao: "3" },
        { cod_opcao: 2, desc_opcao: "5" },
        { cod_opcao: 3, desc_opcao: "7" },
        { cod_opcao: 4, desc_opcao: "10 ou mais" }
      ]
    },
    {
      cod_parametro: 5,
      desc_parametro: "Risco de ser descontinuado pelo fabricante em até 2 anos",
      tipo: 'radio',
      opcoes: [
        { cod_opcao: 0, desc_opcao: "N/A" },
        { cod_opcao: 1, desc_opcao: "1 ano" },
        { cod_opcao: 2, desc_opcao: "2 anos" },
        { cod_opcao: 3, desc_opcao: "3 anos ou mais" }
      ]
    },
    {
      cod_parametro: 6,
      desc_parametro: "Item utilizado por pelo menos 10 ativos",
      tipo: 'radio',
      opcoes: [
        { cod_opcao: 0, desc_opcao: "1 ativo" },
        { cod_opcao: 1, desc_opcao: "3 ativos" },
        { cod_opcao: 2, desc_opcao: "5 ativos" },
        { cod_opcao: 3, desc_opcao: "10 ou mais ativos" }
      ]
    },
    {
      cod_parametro: 7,
      desc_parametro: "Alta probabilidade de uso",
      tipo: 'radio',
      opcoes: [
        { cod_opcao: 0, desc_opcao: "Irrisória" },
        { cod_opcao: 1, desc_opcao: "Baixa" },
        { cod_opcao: 2, desc_opcao: "Média" },
        { cod_opcao: 3, desc_opcao: "Alta" },
        { cod_opcao: 4, desc_opcao: "Muito Alta" }
      ]
    },
    {
      cod_parametro: 8,
      desc_parametro: "Item considerado estratégico",
      tipo: 'boolean',
      opcoes: [
        { cod_opcao: 0, desc_opcao: "FALSE" },
        { cod_opcao: 1, desc_opcao: "TRUE" }
      ]
    }
  ]);
  const [criteriosSelecionados, setCriteriosSelecionados] = useState<Record<number, number>>(() => {
    const initialSelections: Record<number, number> = {};
    criterios.forEach(criterio => {
      initialSelections[criterio.cod_parametro] = criterio.opcoes[0].cod_opcao;
    });
    return initialSelections;
  });

  // Adicione este estado para controlar a visibilidade dos parâmetros
  const [showParametros, setShowParametros] = useState(false);

  // Carregar grupos ao montar a página
  useEffect(() => {
    axios.get("http://localhost:5000/groupDictionary")
      .then((response) => {
        setGrupos(response.data); // Carrega os grupos
        // Para cada grupo, fazer a requisição dos itens
        response.data.slice(0, 0).forEach((grupo: Grupo) => {
          axios.get(`http://localhost:5000/materials/${grupo.cod_grupo}`)
            .then((res) => {
              setItens((prevItens) => [...prevItens, ...res.data]); // Adiciona os itens ao estado
            })
            .catch((error) => console.error(`Erro ao buscar itens do grupo ${grupo.cod_grupo}:`, error));
        });
      })
      .catch((error) => console.error("Erro ao buscar grupos:", error));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5000/criterios")
      .then((response) => {
        const criteriosData = response.data;
        setCriterios(criteriosData);
        // Initialize selected values
        const initialSelections: Record<number, number> = {};
        criteriosData.forEach((criterio: Criterio) => {
          initialSelections[criterio.cod_parametro] = criterio.opcoes[0].cod_opcao;
        });
        setCriteriosSelecionados(initialSelections);
      })
      .catch((error) => console.error("Erro ao buscar critérios:", error));
  }, []);
  // Carregar os itens apenas quando o grupo for selecionado
  useEffect(() => {
    if (grupoSelecionado) {
      axios.get(`http://localhost:5000/materials/${grupoSelecionado.cod_grupo}`)
        .then(response => setItens(response.data))
        .catch(error => console.error("Erro ao buscar itens:", error));
    }
  }, [grupoSelecionado]); // Vai rodar apenas quando o grupoSelecionado mudar

  const handleApplyChanges = () => {
    if (itemSelecionado) {
      const criteriosToSave = criterios.map(criterio => ({
        cod_parametro: criterio.cod_parametro,
        cod_opcao: criteriosSelecionados[criterio.cod_parametro],
        desc_opcao: criterio.opcoes.find(op => op.cod_opcao === criteriosSelecionados[criterio.cod_parametro])?.desc_opcao
      }));

      axios
        .put(`http://localhost:5000/materials/${itemSelecionado._id}`, { criterios: criteriosToSave })
        .then((response) => {
          console.log("Alterações aplicadas com sucesso:", response.data);
          setModalOpen(false);
        })
        .catch((error) => {
          console.error("Erro ao aplicar alterações:", error);
        });
    }
    setModalOpen(false);
  };

  const gruposFiltrados = grupos.filter((grupo) => 
    grupo.cod_grupo.toString().includes(buscaGrupo) || 
    grupo.desc_grupo.toLowerCase().includes(buscaGrupo.toLowerCase())
  );
 
  const itensFiltradosComBusca = itens.filter((item) => {
    const query = buscaItem.toLowerCase();
    return (
      item.desc_material.toLowerCase().includes(query) ||
      item.cod_item_material.toString().includes(query)
    );
  });

  // Função para restaurar os padrões
  const handleRestoreDefault = () => {
    
    
  };

  

  // Função para abrir o modal com os detalhes do item selecionado
  const handleEditClick = (item: Item) => {
    setItemSelecionado(item);
    setModalOpen(true);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };


  return (
    <Box sx={{position:'fixed',top:'62px',left:"80px", display: "flex", gap: 2, background: "#0A1C44", height: "calc(100vh - 93px)", padding: 2 ,width:'calc(100vw - 110px)'}}>
      
     {/* Grupos */}
<Card sx={{ flex: 1, background: "#1F2A4C", padding: 2 }}>
  <Typography variant="h6" sx={{ color: "#F7F7F7" }}>Grupos</Typography>
  <TextField 
    fullWidth 
    placeholder="Busque um código ou nome" 
    variant="outlined" 
    size="small" 
    sx={{ background: "#fff", borderRadius: "0.4rem", marginTop: 2 }} 
    InputProps={{ endAdornment: <SearchIcon /> }} 
    onChange={(e) => setBuscaGrupo(e.target.value)} 
  />
  
  {/* Filtros */}
  <Box sx={{ display: "flex", gap: 1, marginY: 2 }}>
    {["Todos", "Não preenchidos", "Preenchidos"].map((filtro) => (
      <Chip 
        key={filtro} 
        label={filtro} 
        onClick={() => setFiltroSelecionado(filtro as "Todos" | "Não preenchidos" | "Preenchidos")}
        sx={{ 
          background: filtroSelecionado === filtro ? "rgba(49, 131, 207, 1)" : "rgba(213, 226, 238, 1)", 
          color: filtroSelecionado === filtro ? "#fff" : "#000",
          paddingX: "20px", 
          height: "100%", 
          cursor: "pointer" 
        }} 
      />
    ))}
    </Box>
  <Box sx={{ height:"calc(100vh - 260px)", overflowY: "auto", paddingRight: "5px" }}>
  {gruposFiltrados.map((grupo, index) => (
    <Card 
      key={index} 
      sx={{ 
        background: grupoSelecionado?.cod_grupo === grupo.cod_grupo ? "rgba(49, 131, 207, 1)" : "rgba(36, 75, 127, 1)", 
        marginBottom: 1, 
        padding: 1, 
        color: "#fff", 
        cursor: "pointer", 
        display: "flex", 
        flexDirection: "column",
        justifyContent: "space-between", 
        alignItems: "start", 
      }}
      onClick={() => {
        setGrupoSelecionado(grupo);
        setShowParametros(true);
        // Limpa o item selecionado quando muda de grupo
        setItemSelecionado(null);
      }}
    >
      <Typography variant="body1" sx={{  }}>
        {grupo.cod_grupo.toString().padStart(3, "0")} - {grupo.desc_grupo}
      </Typography>
      <Typography variant="caption">Última atualização: 26/07/2024</Typography>
    </Card>
  ))}
  </Box>
</Card>
      {/* Itens */}
      <Card sx={{ flex: 1, background: "#1F2A4C", padding: 2 }}>
        <Typography variant="h6" sx={{ color: "#F7F7F7"}}>Itens</Typography>
        <TextField  onChange={(e) => setBuscaItem(e.target.value)} fullWidth placeholder="Busque um código ou nome" variant="outlined" size="small" sx={{ background: "#fff",borderRadius:"0.4rem",marginTop: 2  }} InputProps={{ endAdornment: <SearchIcon /> }} />
        <Box sx={{ display: "flex", gap: 1, marginY: 2,flexWrap: "wrap" }}>
  {["Todos", "Cadastro Padrão", "Editados", "Estratégicos"].map((filtro) => (
    <Chip
      key={filtro}
      label={filtro}
      onClick={() => setFiltroItemSelecionado(filtro)}
      sx={{
        background: filtroItemSelecionado === filtro ? "rgba(49, 131, 207, 1)" : "rgba(213, 226, 238, 1)",
        color: filtroItemSelecionado === filtro ? "#fff" : "#000",
        paddingX: "20px",
        height: "100%",
        cursor: "pointer"
      }}
    />
  ))}
</Box>
        <Box sx={{display:'flex',gap:2,marginBottom:2}}>

        <Button variant="contained" sx={{background:"rgba(46, 112, 171, 1)",whiteSpace: "nowrap",paddingX:"50px"}} startIcon={<ReplayIcon />}>Restaurar padrão</Button>
        <span style={{color:"white"}}>Restaura o padrão de todas os itens sinalizados com exceções</span>
        </Box>
       
        <Box sx={{ height: "calc(100vh - 330px)", overflowY: "auto", paddingRight: "5px" }}>
  {itensFiltradosComBusca.map((item, index) => (
    <Card
      key={index}
      onDoubleClick={() => handleEditClick(item)}
      onClick={() => {
        setItemSelecionado(item);
        setShowParametros(true);
      }}
      sx={{
        background: itemSelecionado?.cod_item_material === item.cod_item_material ? "rgba(49, 131, 207, 1)" : "rgba(36, 75, 127, 1)",
        marginY: 1,
        padding: 1,
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer"
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <Typography>{item.desc_material}</Typography>
          {item.tag && <Chip label={item.tag} sx={{ background: "rgba(249, 245, 147, 1)", paddingX: '20px', height: '100%' }} />}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>
            Última atualização: 26/07/2024
          </Typography>
          <Box sx={{ display: "flex", marginLeft: "auto" }}>
            <IconButton color="inherit"><ReplayIcon /></IconButton>
            <IconButton color="inherit" onClick={() => handleEditClick(item)}><EditIcon /></IconButton>
          </Box>
        </Box>
      </Box>
    </Card>
  ))}
</Box>
      </Card>

      {/* Critérios Padrão */}
      <Card sx={{ flex: 1, background: "#1F2A4C", padding: 2, display: showParametros ? 'block' : 'block' }}>
        <Typography variant="h6" sx={{ color: "#F7F7F7",marginBottom:3}}>
          {/* {itemSelecionado ? `Critérios do Item ${itemSelecionado.desc_material}` : "Critérios Padrão do Grupo"} */}
          {"Critérios Padrão do Grupo"}
        </Typography>
        <Box sx={{ height: "calc(100vh - 280px)", overflowY: "auto", paddingRight: "5px" }}>
        {showParametros && criterios.map((criterio) => (
      <Box key={criterio.cod_parametro} sx={{ marginTop: 1 }}>
       
        {criterio.tipo === 'boolean' ? (
          <FormControlLabel
            sx={{ color: "white" ,m:1,gap: 2} }
            control={
              <CustomSwitch
                checked={criteriosSelecionados[criterio.cod_parametro] === 1}
                onChange={(e) => {
                  setCriteriosSelecionados(prev => ({
                    ...prev,
                    [criterio.cod_parametro]: e.target.checked ? 1 : 0
                  }));
                }}
              />
            }
            label={ <Typography sx={{ color: "white", marginBottom: 1 }}>
            {criterio.desc_parametro}
          </Typography>}
          />
        ) : (<>
          <Typography sx={{ color: "white", marginBottom: 1 }}>
          {criterio.desc_parametro}
        </Typography>
          <FormControl >
            <RadioGroup 
              row
              value={criteriosSelecionados[criterio.cod_parametro]}
              onChange={(e) => {
                setCriteriosSelecionados(prev => ({
                  ...prev,
                  [criterio.cod_parametro]: parseInt(e.target.value)
                }));
              }}
            >
              {criterio.opcoes.map((opcao) => (
                <FormControlLabel
                  key={opcao.cod_opcao}
                  value={opcao.cod_opcao}
                  control={<Radio 
                    sx={{
                    color: "rgba(36, 75, 127, 1)",
                    '&.Mui-checked': {
                      color: "rgba(49, 131, 207, 1)",
                    },
                  }} 
                  />}
                  label={opcao.desc_opcao}
                  sx={{ color: "white" }}
                />
              ))}
            </RadioGroup>
          </FormControl>
          </>
        )}
      </Box>
    ))}</Box>
          <Box sx={{ display: showParametros ? 'flex' : 'flex' ,flexDirection:"column", alignItems: "end",gap:2 }}>
        { (
          <>
            <Button variant="contained" sx={{ marginTop: 2 ,background:"rgba(46, 112, 171, 1)"}}>
              Aplicar a todos os itens
            </Button>
            <Box sx={{ display: "flex",flexDirection:"row", alignItems: 'baseline',gap:2}}>
              <Typography sx={{color:'white'}}>Exceto itens editados manualmente</Typography>
              <FormControlLabel sx={{color:'white'}} control={<CustomSwitch sx={{ m: 1 }} defaultChecked />} label="" />
            </Box>
          </>
        )}
      </Box>
      </Card>

      {/* Modal de Edição */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
  <Box
    sx={{
      padding: 2,
      background: "#1F2A4C",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
     
      borderRadius: "8px",
      boxShadow: 3,
    }}
  >{itemSelecionado && (<Box sx={{marginBottom:5}}>
    <Typography variant="h6" sx={{ color: "#F7F7F7", marginBottom: 3 }}>
      Critérios Item 
    </Typography>
    
    
      
        <Typography >{itemSelecionado.desc_material}</Typography>
        <Typography variant="caption">Última atualização: 26/07/2024</Typography>
        
      </Box>
    )}
    

    {criterios.map((criterio) => (
      <Box key={criterio.cod_parametro} sx={{ marginTop: 1 }}>
       
        {criterio.tipo === 'boolean' ? (
          <FormControlLabel
            sx={{ color: "white" ,m:1,gap: 2} }
            control={
              <CustomSwitch
                checked={criteriosSelecionados[criterio.cod_parametro] === 1}
                onChange={(e) => {
                  setCriteriosSelecionados(prev => ({
                    ...prev,
                    [criterio.cod_parametro]: e.target.checked ? 1 : 0
                  }));
                }}
              />
            }
            label={ <Typography sx={{ color: "white", marginBottom: 1 }}>
            {criterio.desc_parametro}
          </Typography>}
          />
        ) : (<>
          <Typography sx={{ color: "white", marginBottom: 1 }}>
          {criterio.desc_parametro}
        </Typography>
          <FormControl >
            <RadioGroup 
              row
              value={criteriosSelecionados[criterio.cod_parametro]}
              onChange={(e) => {
                setCriteriosSelecionados(prev => ({
                  ...prev,
                  [criterio.cod_parametro]: parseInt(e.target.value)
                }));
              }}
            >
              {criterio.opcoes.map((opcao) => (
                <FormControlLabel
                  key={opcao.cod_opcao}
                  value={opcao.cod_opcao}
                  control={<Radio 
                    sx={{
                    color: "rgba(36, 75, 127, 1)",
                    '&.Mui-checked': {
                      color: "rgba(49, 131, 207, 1)",
                    },
                  }} 
                  />}
                  label={opcao.desc_opcao}
                  sx={{ color: "white" }}
                />
              ))}
            </RadioGroup>
          </FormControl>
          </>
        )}
      </Box>
    ))}
    
    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
    <Button
        variant="contained"
        sx={{ marginTop: 2, background: "rgba(46, 112, 171, 1)" }}
        startIcon={<ReplayIcon />}
        onClick={handleRestoreDefault} // Restaurar padrão
      >
        Restaurar padrão
      </Button> 
      <Button
        variant="contained"
        sx={{ marginTop: 2, background: "rgba(46, 112, 171, 1)" }}
        onClick={handleApplyChanges} // Aplicar mudanças
      >
        Aplicar
      </Button> 
      {/* <Button
        variant="contained"
        sx={{ marginTop: 2, background: "rgba(46, 112, 171, 1)" }}
        onClick={handleCloseModal}
      >
        Fechar
      </Button> */}
    </Box>
  </Box>
</Modal>

    </Box>
  );
}
