"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  User,
  Mail,
  GraduationCap,
  Calendar,
  Settings,
  Shield,
  Eye,
  EyeOff,
  Save,
  Edit3,
  BookOpen,
  MessageCircle,
  Heart,
  TrendingUp,
  Award,
  Clock,
} from "lucide-react";

export default function StudentProfilePage() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showAnonymousPreference, setShowAnonymousPreference] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    faculty: user?.faculty || "",
    semester: user?.semester || 1,
    anonymousMode: false,
    notificationsEnabled: true,
    shareProgress: false,
  });

  const handleSave = () => {
    // Aquí se guardarían los cambios
    setIsEditing(false);
    // Simular guardado exitoso
    console.log("Profile updated:", profileData);
  };

  const stats = {
    postsCreated: 12,
    diaryEntries: 28,
    resourcesViewed: 15,
    daysActive: 45,
    supportGiven: 8, // reacciones positivas dadas
  };

  const recentActivity = [
    {
      type: "diary",
      title: "Nueva entrada en el diario",
      date: new Date("2025-06-23T20:30:00"),
      description: "Reflexiones sobre el progreso académico",
    },
    {
      type: "post",
      title: "Participación en el foro",
      date: new Date("2025-06-22T15:45:00"),
      description: "Compartiste consejos sobre manejo del estrés",
    },
    {
      type: "resource",
      title: "Recurso consultado",
      date: new Date("2025-06-21T10:20:00"),
      description: "Técnicas de respiración para la ansiedad",
    },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
                <p className="text-gray-600">
                  Gestiona tu información y preferencias
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                {isEditing ? "Cancelar" : "Editar Perfil"}
              </Button>
              {isEditing && (
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información personal */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información Personal
                </CardTitle>
                <CardDescription>
                  Tu información básica y datos académicos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Nombre completo
                    </label>
                    {isEditing ? (
                      <Input
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name: e.target.value,
                          })
                        }
                        placeholder="Tu nombre completo"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{profileData.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Correo electrónico
                    </label>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{profileData.email}</span>
                      <Badge variant="secondary" className="text-xs">
                        Verificado
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Facultad
                    </label>
                    {isEditing ? (
                      <select
                        value={profileData.faculty}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            faculty: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Ingeniería de Sistemas">
                          Ingeniería de Sistemas
                        </option>
                        <option value="Ingeniería Industrial">
                          Ingeniería Industrial
                        </option>
                        <option value="Ingeniería Civil">
                          Ingeniería Civil
                        </option>
                        <option value="Ingeniería Electrónica">
                          Ingeniería Electrónica
                        </option>
                      </select>
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                        <GraduationCap className="h-4 w-4 text-gray-500" />
                        <span>{profileData.faculty}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Semestre
                    </label>
                    {isEditing ? (
                      <select
                        value={profileData.semester}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            semester: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}° Semestre
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{profileData.semester}° Semestre</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferencias de privacidad */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacidad y Preferencias
                </CardTitle>
                <CardDescription>
                  Controla cómo compartes tu información y interactúas en la
                  plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {profileData.anonymousMode ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="font-medium">
                          Modo anónimo por defecto
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Tus publicaciones serán anónimas automáticamente
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={profileData.anonymousMode}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          anonymousMode: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={!isEditing}
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span className="font-medium">
                          Notificaciones habilitadas
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Recibir notificaciones sobre recursos y mensajes de
                        apoyo
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={profileData.notificationsEnabled}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          notificationsEnabled: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={!isEditing}
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        <span className="font-medium">
                          Compartir progreso general
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Permitir que tus estadísticas contribuyan a insights
                        generales (anónimo)
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={profileData.shareProgress}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          shareProgress: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={!isEditing}
                    />
                  </label>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <div className="flex items-center gap-2 text-blue-700 mb-2">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium">
                      Tu privacidad es importante
                    </span>
                  </div>
                  <p className="text-sm text-blue-600 leading-relaxed">
                    Toda tu información personal se mantiene segura y
                    confidencial. Solo el equipo de bienestar autorizado puede
                    acceder a ella cuando sea necesario para tu apoyo.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Estadísticas y actividad */}
          <div className="space-y-6">
            {/* Estadísticas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Tu Actividad
                </CardTitle>
                <CardDescription>
                  Resumen de tu participación en la plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-600">
                        Publicaciones
                      </span>
                    </div>
                    <span className="font-semibold">{stats.postsCreated}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-purple-600" />
                      <span className="text-sm text-gray-600">
                        Entradas diario
                      </span>
                    </div>
                    <span className="font-semibold">{stats.diaryEntries}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-600">
                        Recursos vistos
                      </span>
                    </div>
                    <span className="font-semibold">
                      {stats.resourcesViewed}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <span className="text-sm text-gray-600">Días activo</span>
                    </div>
                    <span className="font-semibold">{stats.daysActive}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-gray-600">
                        Apoyo brindado
                      </span>
                    </div>
                    <span className="font-semibold">{stats.supportGiven}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actividad reciente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div
                        className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                          activity.type === "diary" && "bg-purple-100",
                          activity.type === "post" && "bg-blue-100",
                          activity.type === "resource" && "bg-green-100"
                        )}
                      >
                        {activity.type === "diary" && (
                          <BookOpen className="h-4 w-4 text-purple-600" />
                        )}
                        {activity.type === "post" && (
                          <MessageCircle className="h-4 w-4 text-blue-600" />
                        )}
                        {activity.type === "resource" && (
                          <Heart className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.date.toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Opciones de cuenta */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Opciones de Cuenta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Cambiar contraseña
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Descargar mis datos
                </Button>
                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={logout}
                >
                  <User className="h-4 w-4 mr-2" />
                  Cerrar sesión
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mensaje de bienestar */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Heart className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800 mb-1">
                  Recuerda cuidar tu bienestar
                </h3>
                <p className="text-sm text-green-700 leading-relaxed">
                  Tu participación en esta plataforma muestra que te importa tu
                  bienestar mental. Seguir reflexionando y conectando con otros
                  es un gran paso hacia el crecimiento personal.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
