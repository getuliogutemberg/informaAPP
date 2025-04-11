import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

import { 
    FaTachometerAlt, 
    FaCog, FaBars, 
  // FaUser,
  FaGavel,
  FaFileAlt,
  FaChevronDown,
  FaChevronRight,
  FaUsers,
  FaUserTie,
  FaDollarSign,
  FaCar,
  
} from "react-icons/fa"; // Ícones aprimorados
import { GoPackage } from "react-icons/go";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Box } from "@mui/system";

interface Route {
  _id: string;
  path: string;
  component: string;
  requiredRole?: string[]; // Agora o campo é opcional
  pageId: string;
  __v: number;
}

interface SubRoute {
  path: string;
  icon: string;
  component: string;
  requiredRole?: string[];
  pageId: string;
}

interface MenuGroup {
  _id: string;
  name: string;
  icon: string;
  path: string;
  subRoutes: SubRoute[];
  requiredRole?: string[];
}
const Sidebar = () => {
  const { user  } = useContext(AuthContext);
 
  const [routes, setRoutes] = useState<Route[]>([]); // Estado para lista de rotas
  const [expanded, setExpanded] = useState(false);
  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>([
    // {
    //   _id: "1",
    //   name: "Teste",
    //   icon: "parking",
    //   path: "/test",
    //   subRoutes: [],
    //   requiredRole: ["OWNER"],
    // },
    {
      _id: "2",
      "name": "Gestao",
      "icon": "",
      "path": "",
      "subRoutes": [
        {
          "path": "/indicadores",
          "icon": 'dashboard',
          "component": "Indicadores",
          "requiredRole": ["OWNER","ADMIN"],
          "pageId": "users-management"
        },
        {
          "path": "/gestão",
          "icon": 'dashboard',
          "component": "Gestão",
          "requiredRole": ["OWNER","ADMIN"],
          "pageId": "settings"
        },
        {
          "path": "/Configuração-de-Itens-Estratégicos-do-Estoque",
          "icon": 'settings',
          "component": "Configuração de Itens Estratégicos do Estoque",
          "requiredRole": ["OWNER","ADMIN"],
          "pageId": "configuration-of-strategic-items-of-the-warehouse"
          },
      ],
      "requiredRole": ["OWNER"]
    }
  ]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
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
  useEffect(() => {
    // Carregar os grupos de menu do backend
    const fetchMenuGroups = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/menu-groups');
        const data = await response.json();
        setMenuGroups(data);
      } catch (error) {
        console.error('Erro ao carregar grupos de menu:', error);
      }
    };

    fetchMenuGroups();
  }, []);

  // Função para alternar expansão
  
  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'dashboard': return <FaTachometerAlt />;
      case 'menu': return <FaBars />;
      case 'file': return <FaFileAlt />;
      case 'settings': return <FaCog />;
      case 'users': return <FaUsers />;
      case 'employees': return <FaUserTie />;
      case 'finance': return <FaDollarSign />;
      case 'parking': return <FaCar />;
      default: return null;
    }
  };
  

  if (user ) return (
    <aside 
      className={`sidebar ${expanded ? "expanded" : ""}`} 
      // onMouseEnter={() => setExpanded(true)} 
      // onMouseLeave={() => setExpanded(false)}
    >
      
      <ul className="sidebar-list" onMouseLeave={()=>setExpanded(false)}>
      <li title="Menu" ><button onClick={()=>setExpanded(true)} className="menu-button" ><FaBars  onMouseEnter={()=>setExpanded(true)} /><span>{expanded && ""}</span></button></li>
        {/* <li title="Home"><Link to="/"><FaHome /><span>Home</span></Link></li> */}
        {user && menuGroups
          // .filter(group => user.className !== 'OWNER' ? group.requiredRole?.includes(user.category) : group)
          .map((group) => (
            group.requiredRole?.includes(user.className) && <li key={group._id}  >
              
              <div 
              title={group.name}
                className="group-header"
                onClick={() => toggleGroup(group._id)}
                style={{
                  background: expandedGroups.has(group._id) ? "rgba(255, 255, 255, 0.2)" : "#3183cf",
                }}
              >
                <Box sx={{
                  fontSize: "24px"
                }} >{getIcon(group.icon)}</Box>

                {expanded && <span>{group.name}</span>}
                { (
                  expandedGroups.has(group._id) ? <FaChevronDown /> : <FaChevronRight />
                )}
              </div>
              {expandedGroups.has(group._id) && (
                <ul className="submenu" style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                  padding: "0px",
                  display: "flex",
                  flexDirection: "column",
                  
              
                }}>
                  {group.subRoutes.map((route) => (
                    route.requiredRole?.includes(user.className) && <li key={route.path} title={route.component}>
                      <Link onClick={() =>{ 
                        setExpanded(false);
                        toggleGroup(group._id)
                        }} to={`${group.path}${route.path}`}>
                        {getIcon(route.icon)}
                        <span>{route.component}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        { user ? routes.filter(route => user.className !== 'OWNER' ? route.requiredRole?.includes(user.category): route).map((route) =>
          <li title={route.path.slice(1, 2).toUpperCase() + route.path.slice(2)}><Link onClick={() => setExpanded(false)} to={route.path}>
            {route.component === "Dashboard Power BI" ? <FaTachometerAlt />:
             route.component === "Gestão de Grupos e Materiais" ? <FaFileAlt />:
             route.component === "Teste" ? <GoPackage/> :
             <></>
            }
            <span>{route.path.slice(1, 2).toUpperCase() + route.path.slice(2)}</span></Link></li>
      
          // <>
          //   <li title="Indicadores"><Link to="/indicadores"><FaTachometerAlt /><span>Indicadores</span></Link></li>
          //   <li title="Gestão"><Link to="/gestão"><FaFileAlt /><span>Gestão</span></Link></li>
          //   
            
          //   {/* <li title="Funcionários"><Link to="/employees"><FaUserTie /><span>Funcionários</span></Link></li>
          //   <li title="Moradores"><Link to="/residents"><FaUsers /><span>Moradores</span></Link></li>
          //   <li title="Financeiro"><Link to="/finance"><FaDollarSign /><span>Financeiro</span></Link></li>
          //   <li title="Documentos"><Link to="/documents"><FaFileAlt /><span>Documentos</span></Link></li>
          //   <li title="Estacionamento"><Link to="/parking"><LocalParkingIcon /><span>Estacionamento</span></Link></li> */}
           
          // </>
        ) : (
          <>
            {/* <li><Link to="/"><FaHome /><span>Home</span></Link></li>
            <li><Link to="/news"><FaNewspaper /><span>Notícias</span></Link></li>
            <li><Link to="/faq"><FaQuestionCircle /><span>FAQ</span></Link></li>
            <li><Link to="/contact"><FaEnvelope /><span>Contato</span></Link></li> */}
          </>
        )}
<ul className="sidebar-list">

       
      </ul>
      </ul>

      <ul className="sidebar-options">
        {['ADMIN','OWNER'].includes(user.className) && <li title="Controle"><Link to="/controle"><FaGavel /> <span>Controle</span></Link></li> }
        {['OWNER'].includes(user.className) && <li title="Opções"><Link to="/opções"><FaCog /><span>Opções</span></Link></li>}
        

        
      </ul>
    </aside>
  );
};

export default Sidebar;
