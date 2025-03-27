import { Box, Typography, TextField, Button, Chip, Card, IconButton, Switch, FormControlLabel, styled, SwitchProps } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useState } from "react";

const gruposData = ["001 - ABRACADEIRA", "002 - ABRACADEIRA", "002 - ABRACADEIRA", "002 - ABRACADEIRA", "002 - ABRACADEIRA"];
const itensData = [
  { name: "ABRACADEIRA ELETROD ACO GALV D1", tag: "Estratégico" }, { name: "ABRACADEIRA ELETROD SAE1020 GALV D1.12", tag: "Estratégico" }, { name: "ABRACADEIRA ELETROD SAE1020 GALV D12" }, { name: "ABRACADEIRA ELETROD ACO GALV D2" }, { name: "ABRACADEIRA ELETROD SAE1020 GALV D34" }
];
const criterios = ["Risco de gerar indisponibilidade da UG", "Risco de gerar indisponibilidade de Sistema de Segurança", "Indisponibilidade do item gera risco de afetar o ativo", "Processo de compras superior a 6 meses", "Custo superior a R$ 10.000,00", "Mais de 1 fornecedor disponível", "Risco de ser descontinuado pelo fabricante em até 2 anos", "Item utilizado por pelo menos 10 ativos", "Alta probabilidade de uso", "Item considerado estratégico"]

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

  const [grupoBusca, setGrupoBusca] = useState("");
  const [itemBusca, setItemBusca] = useState("");

  const gruposFiltrados = gruposData.filter((grupo) =>
    grupo.toLowerCase().includes(grupoBusca.toLowerCase())
  );

  const itensFiltrados = itensData.filter((item) =>
    item.name.toLowerCase().includes(itemBusca.toLowerCase())
  );

  return (
    <Box sx={{position:'fixed',top:'62px',left:"80px", display: "flex", gap: 2, background: "#0A1C44", height: "calc(100vh - 93px)", padding: 2 ,width:'calc(100vw - 110px)'}}>
      
      {/* Grupos */}
      <Card sx={{ flex: 1, background: "#1F2A4C", padding: 2 }}>
        <Typography variant="h6" sx={{ color: "#F7F7F7"}}>Grupos</Typography>
        <TextField fullWidth placeholder="Busque um código ou nome" variant="outlined" size="small" sx={{ background: "#fff" ,borderRadius:"0.4rem",marginTop: 2 }} InputProps={{ endAdornment: <SearchIcon /> }} onChange={(e) => setGrupoBusca(e.target.value)} />
        <Box sx={{ display: "flex", gap: 1, marginY: 2 }}>
          <Chip label="Todos" sx={{background: "rgba(49, 131, 207, 1)",paddingX:'20px',height:'100%',cursor:"pointer"}} />
          <Chip label="Não preenchidos" sx={{background: "rgba(213, 226, 238, 1)",paddingX:'20px',height:'100%',cursor:"pointer"}} />
          <Chip label="Preenchidos" sx={{background: "rgba(213, 226, 238, 1)",paddingX:'20px',height:'100%',cursor:"pointer"}}/>
        </Box>
       
{gruposFiltrados.map((item, index) => (
            <Card key={index} sx={{ background: "rgba(36, 75, 127, 1)", marginBottom: 1, padding: 1, color: "#fff", cursor: "pointer" }}>
              <Typography>{item}</Typography>
            </Card>
          ))}
      </Card>

      {/* Itens */}
      <Card sx={{ flex: 1, background: "#1F2A4C", padding: 2 }}>
        <Typography variant="h6" sx={{ color: "#F7F7F7"}}>Itens</Typography>
        <TextField onChange={(e) => setItemBusca(e.target.value)} fullWidth placeholder="Busque um código ou nome" variant="outlined" size="small" sx={{ background: "#fff",borderRadius:"0.4rem",marginTop: 2  }} InputProps={{ endAdornment: <SearchIcon /> }} />
        <Box sx={{ display: "flex", gap: 1, marginY: 2 }}>
        <Chip label="Todos" sx={{background: "rgba(49, 131, 207, 1)",paddingX:'20px',height:'100%',cursor:"pointer"}} />
        <Chip label="Cadastro Padrão" sx={{background: "rgba(213, 226, 238, 1)",paddingX:'20px',height:'100%',cursor:"pointer"}} />
        <Chip label="Editados" sx={{background: "rgba(213, 226, 238, 1)",paddingX:'20px',height:'100%',cursor:"pointer"}}/>
        <Chip label="Estratégicos" sx={{background: "rgba(213, 226, 238, 1)",paddingX:'20px',height:'100%',cursor:"pointer"}}/>
          
        </Box>
        <Box sx={{display:'flex',gap:2,marginBottom:2}}>

        <Button variant="contained" sx={{background:"rgba(46, 112, 171, 1)",whiteSpace: "nowrap",paddingX:"50px"}} startIcon={<RefreshIcon />}>Restaurar padrão</Button>
        <span style={{color:"white"}}>Restaura o padrão de todas os itens sinalizados com exceções</span>
        </Box>
       
 {itensFiltrados.map((item, index) => (
            <Card key={index} sx={{ background: "rgba(36, 75, 127, 1)", marginY: 1, padding: 1, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
              <Box>
                <Typography>{item.name}</Typography>
              </Box>
              {item.tag && <Chip label={item.tag} sx={{ background: "rgba(249, 245, 147, 1)" }} />}
              <Box>
                <IconButton color="inherit"><RefreshIcon /></IconButton>
                <IconButton color="inherit"><EditIcon /></IconButton>
              </Box>
            </Card>
          ))}
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
    </Box>
  );
}
