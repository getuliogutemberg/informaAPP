import { Card, CardContent, Typography, Button, Box, Fade } from "@mui/material";
import { Link } from "react-router-dom";
import { deepPurple} from "@mui/material/colors";




import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { FaBell, FaLifeRing} from "react-icons/fa";


export default function Admin() {
  const { user  } = useContext(AuthContext);
  return (
    <Box sx={{ textAlign: "center", px: 2 , ml:user && "80px", background:"rgba(16, 28, 68, 1)",width:"calc(100vw - 110px)",height:"calc(100vh - 50px)",mt:"70px"}}>
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>

        <><Typography variant="h3" sx={{ fontWeight: "bold", color: "white", mb: 2,pt:4, fontSize:{ xs: "1.5rem", sm: "2rem", md: "2.5rem" } }}>
          Controle e Gestão
        </Typography>
        <Typography variant="h6" sx={{ color: "#666", mb: 4, fontSize: { xs: "1rem", sm: "1rem", md: "1rem" } }}>
          Aqui você pode customisar o modulo de gestão de controle
        </Typography></>
       
         


      </motion.div>

      <Box sx={{
          display: "flex",
          justifyContent: "start",
          flexWrap: "wrap",
          overflow: "auto",
          height: "calc(100vh - 235px)",
          gap: 2
  
      }}>
       
        {[
        
          { title: "Usuários", icon: <FaBell fontSize="large" />, color: deepPurple[500], path: "/usuários" },
       
          { title: "Alertas", icon: <FaBell fontSize="large" />, color: deepPurple[500], path: "/alertas" },
        { title: "Chamados (HelpDesk)", icon: <FaLifeRing fontSize="large" />, color: deepPurple[500], path: "/ajuda" },

          
        ].map((section, index) => (
          <Fade in key={index} timeout={500}>
            <Box sx={{ 
              width: 400,
              minWidth: 300,
              height: "fit-content",
              // flexGrow: 1,
              boxShadow: 1,
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "scale(1.02)",
                boxShadow: 6,
              }
            }}>
              <Card
                sx={{
                  // minHeight: 180,
                  boxShadow: 3,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: 6,
                  }
                }}
              >
                <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Box sx={{
                    width: 56, height: 56, bgcolor: section.color, color: "white", borderRadius: "50%", 
                    display: "flex", justifyContent: "center", alignItems: "center", mb: 2
                  }}>
                    {section.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold">{section.title}</Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    component={Link}
                    to={section.path}
                  >
                    Acessar
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Fade>
        ))}
      </Box>
    </Box>
  );
}
