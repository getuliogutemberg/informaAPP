'use client'
import { Link, useNavigate , useLocation } from "react-router-dom";
import "./Navbar.css";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { 
   
    
   
     FaSignInAlt,  
      
      FaUser,
      FaSignOutAlt,
     
} from "react-icons/fa"; // Ícones aprimorados
import { Avatar } from "@mui/material";



const Navbar = () => {
    const { user , logout } = useContext(AuthContext);
    
    const navigate = useNavigate();
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(Boolean); 
   
    const capitalize = (str: string) => {
        return str
            .replace(/-/g, ' ') // Substitui hifens por espaços
            .split(' ') // Divide a string em palavras
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitaliza cada palavra
            .join(' '); // Junta as palavras de volta com espaço
    };

    const formattedPath = pathSegments.map((segment) => {
        return capitalize(segment);  // Capitaliza todas as palavras
    }).join(' > ');
  
    
    
   

    if (["/login","/registro","/solicitar-registro","/esqueci-senha","/redefinir-senha"].includes(location.pathname) || location.pathname.startsWith("/redefinir-senha/")) {
        return null;
    }

    


    return (
        <nav className="navbar" style={{zIndex:1000}}>
            <ul className="nav-starter" style={{
                marginLeft: user ? "100px" : "20px",
                
                transition: "all 0.1 seconds ease"
            }}>
                <>
                {/* <li><Link to="/"><FaHome /> Home</Link></li> */}
                <li style={{
                   textDecoration: 'none',
                   
                   fontWeight: 'bold',
                   fontSize: '1.5rem'
                }}>{decodeURIComponent(formattedPath)}</li>
                {/* <li><span>{formattedPath}</span></li> */}
                </>
            </ul>
            <ul className="nav-list">
                {!user ? (
                    <>
                        {/* <li title="Home"><Link to="/" className="nav-item"><FaHome /> <span className="nav-text">Home</span></Link></li>
                        <li title="Notícias"><Link to="/news" className="nav-item"><FaNewspaper /> <span className="nav-text">Notícias</span></Link></li>
                        <li title="FAQ"><Link to="/faq" className="nav-item"><FaQuestionCircle /> <span className="nav-text">FAQ</span></Link></li>
                        <li title="Contato"><Link to="/contact" className="nav-item"><FaEnvelope /> <span className="nav-text">Contato</span></Link></li> */}
                    </>
                ) : (
                    <>
                        {/* <li><Link to="/panel"><FaTachometerAlt /> Panel</Link></li> */}
                        {/* <li><Link to="/residents"><FaUsers /> Moradores</Link></li> */}
                        {/* <li><Link to="/employees"><FaUserTie /> Funcionários</Link></li> */}
                        {/* <li><Link to="/finance"><FaDollarSign /> Financeiro</Link></li> */}
                        {/* <li><Link to="/parking"><FaCar /> Estacionamento</Link></li> */}
                        {/* <li><Link to="/admin"><FaGavel /> Administração</Link></li> */}
                        {/* <li><Link to="/documents"><FaFileAlt /> Documentos</Link></li> */}
                        {/* <li><Link to="/settings"><FaCog /> Configurações</Link></li> */}
                        {/* <li title="Eventos"><Link to="/events" className="nav-item"><FaCalendarAlt /> <span className="nav-text">Eventos</span></Link></li>
                        <li title="Relatórios"><Link to="/reports" className="nav-item"><FaChartBar /> <span className="nav-text">Relatórios</span></Link></li>
                        <li title="Helpdesk"><Link to="/helpdesk" className="nav-item"><FaLifeRing /> <span className="nav-text">Helpdesk</span></Link></li>
                        <li title="Alertas"><Link to="/alerts" className="nav-item"><FaBell /> <span className="nav-text">Alertas</span></Link></li> */}
                        {/* <li title="Alertas"><Link to="/alerts" className="nav-item"><FaBell /> <span className="nav-text">Alertas</span></Link></li> */}
                        <li title="Perfil"><Link to="/cadastro" className="nav-item" style={{ display:"flex" ,gap:"10px",alignItems:'center'}}>{user.customIcon ? <Avatar alt={user.name} src={user.customIcon} sx={{ width: 24, height: 24 }} /> : <FaUser />}<span className="nav-text"> {user.name} </span></Link></li>
                        <li title="Sair"><Link to="" className="nav-item" onClick={()=>logout()}> <FaSignOutAlt /> </Link></li>
                    </>
                )}
            </ul>

            {!user && <ul className="nav-options">
                {/* {user ? (
                    // Dropdown do usuário autenticado
                    // <li className="user-menu">
                    //     <button className="user-button">
                    //         <FaUserCircle size={20} /> Usuário
                    //     </button>
                    //     <ul className="dropdown-menu">
                    //         <li><Link to="/profile"><FaUserCircle /> Perfil</Link></li>
                    //         <li><Link to="/settings"><FaCog /> Configurações</Link></li>
                    //         <li>
                    //             <button className="logout-button" onClick={()=>logout()}>
                    //                 <FaSignOutAlt /> Sair
                    //             </button>
                    //         </li>
                    //     </ul>
                    // </li>
                    <li>
                        <button className="" onClick={() => logout()}>
                            <FaSignOutAlt  /> Sair
                        </button>
                    </li>
                ) : (
                    // Botão de login para usuários não autenticados
                    <li>
                        <button className="login-button" onClick={() => navigate("/login")}>
                            <FaSignInAlt /> Login
                        </button>
                    </li>
                )} */}
                <li>
                        <button className="login-button" onClick={() => navigate("/login")}>
                            <FaSignInAlt /> <span>Login</span>
                        </button>
                    </li>
            </ul>}
        </nav>
    );
};

export default Navbar;
