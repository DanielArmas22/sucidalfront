"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  MessageCircle,
  BookOpen,
  Heart,
  User,
  LogOut,
  Menu,
  X,
  Shield,
  BarChart3,
  AlertTriangle,
  Users,
  Settings,
  HelpCircle,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";

const studentNavItems = [
  {
    label: "Foro",
    href: "/student",
    icon: MessageCircle,
    description: "Comparte y conecta con otros estudiantes",
  },
  {
    label: "Mi Diario",
    href: "/student/diary",
    icon: BookOpen,
    description: "Espacio privado para tus reflexiones",
  },
  {
    label: "Recursos",
    href: "/student/resources",
    icon: Heart,
    description: "Apoyo y recursos de bienestar",
  },
  {
    label: "Mi Perfil",
    href: "/student/profile",
    icon: User,
    description: "Gestiona tu perfil y configuración",
  },
  {
    label: "Ayuda",
    href: "/help",
    icon: HelpCircle,
    description: "Guías y documentación",
  },
];

const adminNavItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: BarChart3,
    description: "Vista general y estadísticas",
  },
  {
    label: "Alertas",
    href: "/admin/alerts",
    icon: AlertTriangle,
    description: "Monitoreo de riesgo y casos prioritarios",
  },
  {
    label: "Mensajes",
    href: "/admin/messages",
    icon: MessageCircle,
    description: "Análisis de mensajes de estudiantes",
  },
  {
    label: "Usuarios",
    href: "/admin/users",
    icon: Users,
    description: "Gestión de estudiantes registrados",
  },
  {
    label: "Configuración",
    href: "/admin/settings",
    icon: Settings,
    description: "Configuración del sistema",
  },
  {
    label: "Análisis ML",
    href: "/admin/ml-analysis",
    icon: Brain,
    description: "Explicabilidad del modelo ML",
  },
  {
    label: "Ayuda",
    href: "/help",
    icon: HelpCircle,
    description: "Guías y documentación",
  },
];

export default function Navigation() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user || pathname === "/login") return null;

  const navItems = user.role === "admin" ? adminNavItems : studentNavItems;
  const isAdmin = user.role === "admin";

  return (
    <nav
      className={cn(
        "bg-white border-b border-gray-200 shadow-sm",
        isAdmin
          ? "border-l-4 border-l-blue-600"
          : "border-l-4 border-l-green-500"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <div className="flex items-center space-x-4">
            <div
              className={cn(
                "flex items-center space-x-2",
                isAdmin ? "text-blue-600" : "text-green-600"
              )}
            >
              {isAdmin ? (
                <Shield className="h-8 w-8" />
              ) : (
                <Heart className="h-8 w-8" />
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {isAdmin ? "Administrador" : "Bienestar Estudiantil"}
                </h1>
                <p className="text-sm text-gray-500">
                  {isAdmin ? "Sistema de Monitoreo" : "Espacio Seguro de Apoyo"}
                </p>
              </div>
            </div>
          </div>

          {/* Navegación desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/student" &&
                  item.href !== "/admin" &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? isAdmin
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "bg-green-100 text-green-700 border border-green-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                  title={item.description}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Usuario y logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">
                {isAdmin
                  ? "Administrador"
                  : `${user.faculty} - Semestre ${user.semester}`}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-gray-600 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:ml-2 sm:inline">Salir</span>
            </Button>

            {/* Menú móvil */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Navegación móvil */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/student" &&
                    item.href !== "/admin" &&
                    pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? isAdmin
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "bg-green-100 text-green-700 border border-green-200"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <div>
                      <div>{item.label}</div>
                      <div className="text-xs text-gray-500">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
