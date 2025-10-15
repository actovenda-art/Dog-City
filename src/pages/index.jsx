import Layout from "./Layout.jsx";

import Dev_Dashboard from "./Dev_Dashboard";

import Backup from "./Backup";

import Registrador from "./Registrador";

import Agenda_Monitores from "./Agenda_Monitores";

import Agenda_Comercial from "./Agenda_Comercial";

import Cadastro from "./Cadastro";

import Planos from "./Planos";

import Resumos from "./Resumos";

import Agenda_Motorista from "./Agenda_Motorista";

import Agenda_BanhoTosa from "./Agenda_BanhoTosa";

import Lancamentos from "./Lancamentos";

import Movimentacoes from "./Movimentacoes";

import Cockpit from "./Cockpit";

import Comunicados from "./Comunicados";

import RegistroAtividades from "./RegistroAtividades";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dev_Dashboard: Dev_Dashboard,
    
    Backup: Backup,
    
    Registrador: Registrador,
    
    Agenda_Monitores: Agenda_Monitores,
    
    Agenda_Comercial: Agenda_Comercial,
    
    Cadastro: Cadastro,
    
    Planos: Planos,
    
    Resumos: Resumos,
    
    Agenda_Motorista: Agenda_Motorista,
    
    Agenda_BanhoTosa: Agenda_BanhoTosa,
    
    Lancamentos: Lancamentos,
    
    Movimentacoes: Movimentacoes,
    
    Cockpit: Cockpit,
    
    Comunicados: Comunicados,
    
    RegistroAtividades: RegistroAtividades,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dev_Dashboard />} />
                
                
                <Route path="/Dev_Dashboard" element={<Dev_Dashboard />} />
                
                <Route path="/Backup" element={<Backup />} />
                
                <Route path="/Registrador" element={<Registrador />} />
                
                <Route path="/Agenda_Monitores" element={<Agenda_Monitores />} />
                
                <Route path="/Agenda_Comercial" element={<Agenda_Comercial />} />
                
                <Route path="/Cadastro" element={<Cadastro />} />
                
                <Route path="/Planos" element={<Planos />} />
                
                <Route path="/Resumos" element={<Resumos />} />
                
                <Route path="/Agenda_Motorista" element={<Agenda_Motorista />} />
                
                <Route path="/Agenda_BanhoTosa" element={<Agenda_BanhoTosa />} />
                
                <Route path="/Lancamentos" element={<Lancamentos />} />
                
                <Route path="/Movimentacoes" element={<Movimentacoes />} />
                
                <Route path="/Cockpit" element={<Cockpit />} />
                
                <Route path="/Comunicados" element={<Comunicados />} />
                
                <Route path="/RegistroAtividades" element={<RegistroAtividades />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}