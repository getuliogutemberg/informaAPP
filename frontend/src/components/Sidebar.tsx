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

import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Box } from "@mui/system";


interface SubRoute {
  path: string;
  icon: string;
  component: string;
  name: string;
  requiredRole: string[];
  pageId?: string;
  reportId?: string,
  workspaceId?: string,
}

interface MenuGroup {
  _id: string;
  name: string;
  component: string;
  icon: string;
  path: string;
  subRoutes: SubRoute[];
  requiredRole?: string[];
}
const Sidebar = () => {
  const { user  } = useContext(AuthContext);
 
  
  const [expanded, setExpanded] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  
  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get("https://informa-app.vercel.app/routes");
       
        return response.data
      } catch (error) {
        console.error("Erro ao buscar as rotas:", error);
      }
    };

    
    // Carregar os grupos de menu do backend
    const fetchMenuGroups = async () => {
      const routes = await fetchRoutes() as SubRoute[];
      // console.log(routes)
      try {
        const response = routes && [
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
            "name": "Relatórios",
            "icon": "file",
            "component": 'MenuGroup',
            "path": "/relatórios",
            "subRoutes": [
              ...routes.map((route) => ({
                path: route.path,
                icon: route.icon,
                name: route.name,
                component: route.component,
                requiredRole: route.requiredRole, // <- antes tava errado aqui
                pageId: route.pageId,
                reportId: route.reportId,
                workspaceId: route.workspaceId,
              })),
             
             
            ].filter((router) => router.component === "Dashboard Power BI" ),
            "requiredRole": ["OWNER","ADMIN","CLIENT"]
          },
         
        ];
        console.log(response)
        setMenuGroups(response);
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
      default: return <FaCog />;
    }
  };
  

  if (user ) return (
    <aside 
    onMouseLeave={()=>setExpanded(false)}
      className={`sidebar ${expanded ? "expanded" : ""}`} 
      // onMouseEnter={() => setExpanded(true)} 
      onMouseEnter={()=>setExpanded(true)}
      // onMouseLeave={() => setExpanded(false)}
    >
      
      <ul className="sidebar-list" >
      <li title="Menu" ><button onClick={()=>setExpanded(true)} className="menu-button" ><FaBars   /><span>{expanded && ""}</span></button></li>
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
                    <li key={route.path} title={route.name}>
                      <Link 
                      // onMouseLeave={()=>toggleGroup(group._id)}
                      onClick={() =>{ 
                        // setExpanded(false);
                        
                        }} to={`${group.path}${route.path}`}>
                        {getIcon(route.icon)}
                        <span>{route.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}

          {[{
            _id: "3",
            name: "Configurações",
            icon: "settings",
            component: 'Gestão de Grupos e Materiais',
            path: "/Configuração-de-Itens-Estratégicos-do-Estoque",
            subRoutes: [],
            requiredRole: ["OWNER", "ADMIN", "CLIENT"]
          }].map( (route) => (
            <li key={route.path} title={route.name}>
              <Link 
              // onMouseLeave={()=>toggleGroup(group._id)}
              onClick={() =>{ 
                // setExpanded(false);
                
                }} to={`${route.path}`}>
                {getIcon(route.icon)}
                <span>{route.name}</span>
              </Link>
            </li>
          ))}
     
<ul className="sidebar-list">

       
      </ul>
      </ul>

      <ul className="sidebar-options">
        {['ADMIN','OWNER'].includes(user.className) && <li title="Opcões"><Link to="/opções"><FaGavel /> <span>Opções</span></Link></li> }
        {['OWNER'].includes(user.className) && <li title="Administrador"><Link to="/administrador"><FaCog /><span>Administrador</span></Link></li>}
        

        
      </ul>
    </aside>
  );
};

export default Sidebar;
