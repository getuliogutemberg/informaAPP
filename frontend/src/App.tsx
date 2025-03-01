import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from "./components/ProtectedRoute"; // Importa a proteção de rotas

import Admin from './pages/Admin.tsx';
import Alerts from './pages/Alerts.tsx';
import Contact from './pages/Contact.tsx';
// import DashPBI from './pages/DashPBI.tsx';
import Faq from './pages/Faq.tsx';
import HelpDesk from './pages/HelpDesk.tsx';
import Login from './pages/Login';
import NotFound from './pages/NotFound.tsx';
import Profile from './pages/Profile.tsx';
import Register from './pages/Register.tsx'; 
import Settings from './pages/Settings';
import Unauthorized from './pages/Unauthorized.tsx';
import socket from  'socket.io-client';
import Users from './pages/Users.tsx';
import RoutesEdit from './pages/RoutesEdit.tsx';
import axios from 'axios';
import { Key, useEffect, useState } from 'react';
import DashPBI from './pages/DashPBI.tsx';
import RequireRegister from './pages/RequireRegister.tsx';
import { PaletteMode } from '@mui/material';

interface Configuration {
  notifications: boolean;
  allowRegister: boolean;
  allowRequireRegister: boolean;
  allowNewCategory: boolean;
  allowNewClassName: boolean;
  addSecretKey: boolean;
  addCategory: boolean;
  fontFamily: string;
  pageTitle: string;
  themeMode: PaletteMode;
  primaryColor: number;
  secondaryColor: number;
  backgroundColor: number;
  textColor: number;
  pbiKeys: {
    clientId: string;
    clientSecret: string;
    authority: string;
  };
}

// Criar uma conexão com o socket.io
socket('http://localhost:5000');

function App() {
  const [routes, setRoutes] = useState<{ _id: Key | null | undefined; path: string | undefined; requiredRole: string[] | undefined; component: string;pageId: string }[]>([]); // Estado para armazenar as rotas dinâmicas
  
  const [settings, setSettings] = useState<Configuration | null>(null);
  useEffect(() => {
    // Buscar configurações do backend
    const fetchSettings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/configuration');
        setSettings(response.data); // Atualiza o estado com os dados do backend
      } catch (error) {
        console.error('Erro ao buscar configurações:', error);
      }
    };

    fetchSettings();
  }, []);

 
  
  useEffect(() => {
    // Buscar rotas do backend
    const fetchRoutes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/routes');
        setRoutes(response.data); // Atualiza as rotas com os dados do backend
   
      } catch (error) {
        console.error('Erro ao buscar rotas:', error);
      }
    };

    fetchRoutes();
  }, []);

  
  

  
  
  return (
    <Router>
      
      <Navbar  />
      <Sidebar />
    
     <Routes>
      
     {routes.map((route: { _id: Key | null | undefined; path: string | undefined; requiredRole: string[] | undefined; component: string; pageId: string }) => (
          <Route
            key={route._id}
            path={route.path}
            element={
              <ProtectedRoute requiredRole={route.requiredRole} >
                <DashPBI pageId={route.pageId} />
              </ProtectedRoute>
            }
          />
        ))}
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<Navigate to={"/login"} />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={
            settings?.allowRegister ? <Register /> :<ProtectedRoute  >
              <Register />
           </ProtectedRoute>  
          } />
           <Route path="/solicitar-registro" element={
            settings?.allowRequireRegister ? <RequireRegister /> :<ProtectedRoute  >
              <RequireRegister />
           </ProtectedRoute>  
          } />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
        

            <Route path="/cadastro" element={ <ProtectedRoute >
              <Profile />
    
        </ProtectedRoute>} /> 

            
        <Route path="/ajuda" element={ <ProtectedRoute >
              <HelpDesk />
            </ProtectedRoute>} /> 
           
            <Route path="/alertas" element={ <ProtectedRoute >
              <Alerts />
            </ProtectedRoute>} /> 

            <Route path="/controle" element={ <ProtectedRoute requiredRole={["ADMIN","BOSS"]}  >
              <Admin />
            </ProtectedRoute>} /> 


            <Route path="/usuários" element={ <ProtectedRoute requiredRole={["ADMIN","BOSS"]}  >
              <Users />
            </ProtectedRoute>} /> 
            <Route path="/rotas" element={ <ProtectedRoute requiredRole={["BOSS"]}  >
              <RoutesEdit />
            </ProtectedRoute>} /> 
        <Route path="/opções" element={ <ProtectedRoute requiredRole={["ADMIN","BOSS"]} >
              <Settings />
    
        </ProtectedRoute>} /> 
       
        <Route path="/rota-restrita" element={ <Unauthorized/> } /> 
        <Route path="*" element={<NotFound />} />
        
      </Routes>
      
    </Router>
    
  );
}

export default App;

