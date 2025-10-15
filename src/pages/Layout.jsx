

import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  LogOut,
  Shield,
  Database,
  ClipboardCheck,
  Calendar,
  UserPlus,
  CreditCard,
  BarChart3,
  Car,
  Scissors,
  DollarSign,
  TrendingUp,
  PieChart,
  Bell,
  FileText,
  Menu,
  X
} from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await User.logout();
    window.location.reload();
  };

  const menuItems = [
    { title: "Gestão de Usuários", url: createPageUrl("Dev_Dashboard"), icon: Shield },
    { title: "Backup", url: createPageUrl("Backup"), icon: Database },
    { title: "Registrador", url: createPageUrl("Registrador"), icon: ClipboardCheck },
    { title: "Agenda - Monitores", url: createPageUrl("Agenda_Monitores"), icon: Calendar },
    { title: "Agenda - Comercial", url: createPageUrl("Agenda_Comercial"), icon: Calendar },
    { title: "Cadastro", url: createPageUrl("Cadastro"), icon: UserPlus },
    { title: "Planos", url: createPageUrl("Planos"), icon: CreditCard },
    { title: "Resumos", url: createPageUrl("Resumos"), icon: BarChart3 },
    { title: "Agenda - Motorista", url: createPageUrl("Agenda_Motorista"), icon: Car },
    { title: "Agenda - Banho & Tosa", url: createPageUrl("Agenda_BanhoTosa"), icon: Scissors },
    { title: "Lançamentos", url: createPageUrl("Lancamentos"), icon: DollarSign },
    { title: "Movimentações Futuras", url: createPageUrl("Movimentacoes"), icon: TrendingUp },
    { title: "Cockpit", url: createPageUrl("Cockpit"), icon: PieChart },
    { title: "Comunicados", url: createPageUrl("Comunicados"), icon: Bell },
    { title: "Registro de Atividades", url: createPageUrl("RegistroAtividades"), icon: FileText }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200 fixed h-screen">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d30bcc5ca43f0f9b7df581/b25f6333e_Capturadetela2025-09-24192240.png"
              alt="Dog City Brasil"
              className="h-10 w-10"
            />
            <div>
              <h1 className="text-lg font-bold text-gray-900">Dog City Brasil</h1>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPageName === item.url.split('?')[0].split('/').pop();
            
            return (
              <Link
                key={item.title}
                to={item.url}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        {currentUser && (
          <div className="p-4 border-t border-gray-200">
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-900 truncate">{currentUser.full_name}</p>
              <p className="text-xs text-gray-600 truncate">{currentUser.email}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full border-gray-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        )}
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d30bcc5ca43f0f9b7df581/b25f6333e_Capturadetela2025-09-24192240.png"
              alt="Dog City Brasil"
              className="h-8 w-8"
            />
            <div>
              <h1 className="text-sm font-bold text-gray-900">Dog City Brasil</h1>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed top-16 left-0 right-0 bottom-0 bg-white overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <nav className="p-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPageName === item.url.split('?')[0].split('/').pop();
                
                return (
                  <Link
                    key={item.title}
                    to={item.url}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </Link>
                );
              })}
            </nav>

            {currentUser && (
              <div className="p-4 border-t border-gray-200">
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-900">{currentUser.full_name}</p>
                  <p className="text-xs text-gray-600">{currentUser.email}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full border-gray-300"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 mt-16 md:mt-0">
        {children}
      </main>
    </div>
  );
}

