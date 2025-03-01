import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

import { 
    FaTachometerAlt, 
    FaCog, FaBars, 
  // FaUser,
  FaGavel,
  FaFileAlt,
  
} from "react-icons/fa"; // Ícones aprimorados
import { AuthContext } from "../context/AuthContext";
const Sidebar = () => {
  const { user  } = useContext(AuthContext);
  const [expanded, setExpanded] = useState(false);


 
  

  // Função para alternar expansão
  const toggleSidebar = () => setExpanded((prev) => !prev);

  

  if (user ) return (
    <aside 
      className={`sidebar ${expanded ? "expanded" : ""}`} 
      // onMouseEnter={() => setExpanded(true)} 
      onMouseLeave={() => setExpanded(false)}
    >
      <ul className="sidebar-list" onClick={() => setExpanded(false)}>
      <li title="Menu"><button className="menu-button" onClick={()=>toggleSidebar()} onMouseEnter={() => setExpanded(true)} ><FaBars /><span>{expanded && ""}</span></button></li>
        {/* <li title="Home"><Link to="/"><FaHome /><span>Home</span></Link></li> */}
        {user ? (
          <>
            <li title="Indicadores"><Link to="/indicadores"><FaTachometerAlt /><span>Indicadores</span></Link></li>
            <li title="Gestão"><Link to="/gestão"><FaFileAlt /><span>Gestão</span></Link></li>
            
            {/* <li title="Funcionários"><Link to="/employees"><FaUserTie /><span>Funcionários</span></Link></li>
            <li title="Moradores"><Link to="/residents"><FaUsers /><span>Moradores</span></Link></li>
            <li title="Financeiro"><Link to="/finance"><FaDollarSign /><span>Financeiro</span></Link></li>
            <li title="Documentos"><Link to="/documents"><FaFileAlt /><span>Documentos</span></Link></li>
            <li title="Estacionamento"><Link to="/parking"><LocalParkingIcon /><span>Estacionamento</span></Link></li> */}
           
          </>
        ) : (
          <>
            {/* <li><Link to="/"><FaHome /><span>Home</span></Link></li>
            <li><Link to="/news"><FaNewspaper /><span>Notícias</span></Link></li>
            <li><Link to="/faq"><FaQuestionCircle /><span>FAQ</span></Link></li>
            <li><Link to="/contact"><FaEnvelope /><span>Contato</span></Link></li> */}
          </>
        )}

      </ul>

      <ul className="sidebar-options">
        {['ADMIN','BOSS'].includes(user.className) && <li title="Controle"><Link to="/controle"><FaGavel /> <span>Controle</span></Link></li> }
        {['BOSS'].includes(user.className) && <li title="Opções"><Link to="/opções"><FaCog /><span>Opções</span></Link></li>}
        

        
      </ul>
    </aside>
  );
};

export default Sidebar;
