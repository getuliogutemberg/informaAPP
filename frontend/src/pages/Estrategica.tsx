import { Box, Typography, TextField, Button, Chip, Card, IconButton, Switch, FormControlLabel, styled, SwitchProps, Modal } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import ReplayIcon from "@mui/icons-material/Replay";
import { useState, useEffect } from "react";
import axios from "axios";

// const gruposData = ["001 - ABRACADEIRA", "002 - ABRACADEIRA", "003 - ABRACADEIRA", "004 - ABRACADEIRA", "005 - ABRACADEIRA"];
// const itensData = [
//   { name: "ABRACADEIRA ELETROD ACO GALV D1", tag: "Estratégico" }, { name: "ABRACADEIRA ELETROD SAE1020 GALV D1.12", tag: "Estratégico" }, { name: "ABRACADEIRA ELETROD SAE1020 GALV D12" }, { name: "ABRACADEIRA ELETROD ACO GALV D2" }, { name: "ABRACADEIRA ELETROD SAE1020 GALV D34" }
// ];
const criterios = ["Risco de gerar indisponibilidade da UG", "Risco de gerar indisponibilidade de Sistema de Segurança", "Indisponibilidade do item gera risco de afetar o ativo", "Processo de compras superior a 6 meses", "Custo superior a R$ 10.000,00", "Mais de 1 fornecedor disponível", "Risco de ser descontinuado pelo fabricante em até 2 anos", "Item utilizado por pelo menos 10 ativos", "Alta probabilidade de uso", "Item considerado estratégico"]
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
const CustomSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 25,
  height: 15,
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
        color: theme.palette.grey[600],
      }),
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.7,
      ...theme.applyStyles('dark', {
        opacity: 0.3,
      }),
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 15,
    height: 15,
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
  const [criteriosState, setCriteriosState] = useState<boolean[]>(new Array(criterios.length).fill(true)); // Assume true (todos ativos) por padrão
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

// Carregar os itens apenas quando o grupo for selecionado
useEffect(() => {
  if (grupoSelecionado) {
    axios.get(`http://localhost:5000/materials/${grupoSelecionado.cod_grupo}`)
      .then(response => setItens(response.data))
      .catch(error => console.error("Erro ao buscar itens:", error));
  }
}, [grupoSelecionado]); // Vai rodar apenas quando o grupoSelecionado mudar

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
    // Restaura os critérios para o estado original (todos ativos, ou outro padrão)
    setCriteriosState(new Array(criterios.length).fill(true));
    
  };

  // Função para aplicar as mudanças (salvar ou atualizar os dados conforme necessário)
  const handleApplyChanges = () => {
    if (itemSelecionado) {
      const updatedCriterios = criterios.map((criterio, index) => ({
        criterio,
        isChecked: criteriosState[index]
      }));

      // Exemplo de ação: salvar as mudanças no item
      axios
        .put(`http://localhost:5000/materials/${itemSelecionado._id}`, { criterios: updatedCriterios })
        .then((response) => {
          console.log("Alterações aplicadas com sucesso:", response.data);
          setModalOpen(false); // Fechar o modal após a aplicação
        })
        .catch((error) => {
          console.error("Erro ao aplicar alterações:", error);
        });
    }
    setModalOpen(false)
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
      onClick={() => setGrupoSelecionado(grupo)}
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
      onClick={() =>setItemSelecionado(item)}
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
      <Card sx={{ flex: 1, background: "#1F2A4C", padding: 2 }}>
        <Typography variant="h6" sx={{ color: "#F7F7F7",marginBottom:3}}>Critérios Padrão</Typography>
        {criterios.map((criterio, index) => (
          <Box key={index} sx={{  marginY: 1 }}>
            <FormControlLabel sx={{color:'white'}} control={<CustomSwitch sx={{ m: 1 }} defaultChecked />} label={criterio} />
            
          </Box>
        ))}
          <Box sx={{ display: "flex",flexDirection:"column", alignItems: "start" }}>
        <Button variant="contained"  sx={{ marginTop: 2 ,background:"rgba(46, 112, 171, 1)"}}>Aplicar a todos os itens</Button>
        <FormControlLabel sx={{color:'white',marginTop: 2}} control={<CustomSwitch sx={{ m: 1 }} defaultChecked />} label="Exceto itens editados manualmente" />
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
      width: "400px",
      borderRadius: "8px",
      boxShadow: 3,
    }}
  >{itemSelecionado && (<Box sx={{marginBottom:5}}>
    <Typography variant="h6" sx={{ color: "#F7F7F7", marginBottom: 3 }}>
      Critérios Item {itemSelecionado.cod_item_material}
    </Typography>
    
    
      
        <Typography >{itemSelecionado.desc_material}</Typography>
        <Typography variant="caption">Última atualização: 26/07/2024</Typography>
        
      </Box>
    )}
    

    {criterios.map((criterio, index) => (
      <Box key={index} sx={{ marginTop: 1 }}>
        <FormControlLabel
          sx={{ color: "white" }}
          control={<CustomSwitch sx={{ m: 1 }} defaultChecked />}
          label={criterio}
        />
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
