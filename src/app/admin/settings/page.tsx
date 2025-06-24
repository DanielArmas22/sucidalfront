"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Settings,
  Shield,
  Brain,
  Bell,
  Database,
  Users,
  Mail,
  Clock,
  AlertTriangle,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";

interface SystemSettings {
  // Configuración de alertas
  alertThresholds: {
    low: number;
    medium: number;
    high: number;
  };
  autoNotifications: boolean;
  emailNotifications: boolean;

  // Configuración ML
  mlModelVersion: string;
  confidenceThreshold: number;
  retrainingFrequency: number;

  // Configuración de datos
  dataRetentionDays: number;
  anonymizationEnabled: boolean;
  backupFrequency: number;

  // Configuración de usuarios
  maxStudentsPerPsychologist: number;
  sessionTimeoutMinutes: number;
  passwordExpiryDays: number;

  // Configuración de notificaciones
  emergencyContacts: string[];
  notificationTemplates: {
    lowRisk: string;
    mediumRisk: string;
    highRisk: string;
  };
}

const defaultSettings: SystemSettings = {
  alertThresholds: {
    low: 0.3,
    medium: 0.6,
    high: 0.8,
  },
  autoNotifications: true,
  emailNotifications: true,
  mlModelVersion: "v2.1.0",
  confidenceThreshold: 0.75,
  retrainingFrequency: 7,
  dataRetentionDays: 365,
  anonymizationEnabled: true,
  backupFrequency: 24,
  maxStudentsPerPsychologist: 50,
  sessionTimeoutMinutes: 30,
  passwordExpiryDays: 90,
  emergencyContacts: [
    "urgencias@universidad.edu.pe",
    "bienestar@universidad.edu.pe",
  ],
  notificationTemplates: {
    lowRisk:
      "Se ha detectado un nivel de riesgo bajo. Se recomienda seguimiento.",
    mediumRisk:
      "Alerta de riesgo medio detectada. Requiere intervención programada.",
    highRisk:
      "ALERTA CRÍTICA: Riesgo alto detectado. Requiere intervención inmediata.",
  },
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("alerts");
  const [showPasswords, setShowPasswords] = useState(false);
  const [saveAlert, setSaveAlert] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({
    show: false,
    type: "success",
    message: "",
  });

  // Simulación de carga de configuración
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      // En un caso real, cargaríamos desde la API
      setSettings(defaultSettings);
      setIsLoading(false);
    }, 1000);
  }, []);
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulación de guardado
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSaveAlert({
        show: true,
        type: "success",
        message: "Configuración guardada exitosamente",
      });
      setTimeout(
        () => setSaveAlert((prev) => ({ ...prev, show: false })),
        5000
      );
    } catch (error) {
      setSaveAlert({
        show: true,
        type: "error",
        message: "Error al guardar la configuración",
      });
      setTimeout(
        () => setSaveAlert((prev) => ({ ...prev, show: false })),
        5000
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportConfig = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `system-config-${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };
  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setSettings(importedSettings);
          setSaveAlert({
            show: true,
            type: "success",
            message: "Configuración importada exitosamente",
          });
          setTimeout(
            () => setSaveAlert((prev) => ({ ...prev, show: false })),
            5000
          );
        } catch (error) {
          setSaveAlert({
            show: true,
            type: "error",
            message:
              "Error al importar la configuración. Verifica que el archivo sea válido.",
          });
          setTimeout(
            () => setSaveAlert((prev) => ({ ...prev, show: false })),
            5000
          );
        }
      };
      reader.readAsText(file);
    }
  };

  const resetToDefaults = () => {
    if (
      confirm(
        "¿Estás seguro de que quieres restaurar la configuración por defecto?"
      )
    ) {
      setSettings(defaultSettings);
    }
  };

  const addEmergencyContact = () => {
    const email = prompt("Ingresa el email del contacto de emergencia:");
    if (email && email.includes("@")) {
      setSettings((prev) => ({
        ...prev,
        emergencyContacts: [...prev.emergencyContacts, email],
      }));
    }
  };

  const removeEmergencyContact = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index),
    }));
  };

  const tabs = [
    { id: "alerts", label: "Alertas", icon: Bell },
    { id: "ml", label: "Machine Learning", icon: Brain },
    { id: "data", label: "Datos y Privacidad", icon: Database },
    { id: "users", label: "Usuarios", icon: Users },
    { id: "notifications", label: "Notificaciones", icon: Mail },
    { id: "security", label: "Seguridad", icon: Shield },
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-lg">Cargando configuración...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {" "}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Configuración del Sistema
        </h1>
        <p className="text-gray-600">
          Gestiona la configuración avanzada de la plataforma de detección de
          riesgo suicida
        </p>
      </div>
      {/* Alerta de guardado */}
      {saveAlert.show && (
        <div className="mb-6">
          <Alert
            variant={saveAlert.type === "success" ? "success" : "destructive"}
            onClose={() => setSaveAlert((prev) => ({ ...prev, show: false }))}
          >
            <AlertTitle>
              {saveAlert.type === "success" ? "Éxito" : "Error"}
            </AlertTitle>
            <AlertDescription>{saveAlert.message}</AlertDescription>
          </Alert>
        </div>
      )}
      {/* Botones de acción principales */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </>
          )}
        </Button>

        <Button variant="outline" onClick={handleExportConfig}>
          <Download className="h-4 w-4 mr-2" />
          Exportar Config
        </Button>

        <div className="relative">
          <input
            type="file"
            accept=".json"
            onChange={handleImportConfig}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importar Config
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={resetToDefaults}
          className="text-red-600 hover:text-red-700"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Restaurar Defaults
        </Button>
      </div>
      {/* Navegación por pestañas */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
      {/* Contenido de las pestañas */}
      <div className="space-y-6">
        {/* Configuración de Alertas */}
        {activeTab === "alerts" && (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Umbrales de Alertas
                </CardTitle>
                <CardDescription>
                  Configura los umbrales de riesgo para la activación de alertas
                  automáticas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Riesgo Bajo
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      value={settings.alertThresholds.low}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          alertThresholds: {
                            ...prev.alertThresholds,
                            low: parseFloat(e.target.value),
                          },
                        }))
                      }
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Valor entre 0.0 y 1.0
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Riesgo Medio
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      value={settings.alertThresholds.medium}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          alertThresholds: {
                            ...prev.alertThresholds,
                            medium: parseFloat(e.target.value),
                          },
                        }))
                      }
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Valor entre 0.0 y 1.0
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Riesgo Alto
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      value={settings.alertThresholds.high}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          alertThresholds: {
                            ...prev.alertThresholds,
                            high: parseFloat(e.target.value),
                          },
                        }))
                      }
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Valor entre 0.0 y 1.0
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.autoNotifications}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          autoNotifications: e.target.checked,
                        }))
                      }
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">
                      Activar notificaciones automáticas
                    </span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          emailNotifications: e.target.checked,
                        }))
                      }
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">
                      Enviar notificaciones por email
                    </span>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Configuración de Machine Learning */}
        {activeTab === "ml" && (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Configuración del Modelo ML
                </CardTitle>
                <CardDescription>
                  Parámetros del modelo de machine learning para detección de
                  riesgo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {" "}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Versión del Modelo
                    </label>
                    <Select
                      value={settings.mlModelVersion}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          mlModelVersion: e.target.value,
                        }))
                      }
                    >
                      <option value="v1.0.0">v1.0.0 (Estable)</option>
                      <option value="v2.0.0">v2.0.0 (Mejorado)</option>
                      <option value="v2.1.0">v2.1.0 (Actual)</option>
                      <option value="v2.2.0-beta">v2.2.0-beta (Beta)</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Umbral de Confianza (
                      {(settings.confidenceThreshold * 100).toFixed(0)}%)
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="0.95"
                      step="0.05"
                      value={settings.confidenceThreshold}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          confidenceThreshold: parseFloat(e.target.value),
                        }))
                      }
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Confianza mínima para activar una alerta
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Frecuencia de Reentrenamiento (días)
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="30"
                      value={settings.retrainingFrequency}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          retrainingFrequency: parseInt(e.target.value),
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Estado del Modelo
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-blue-600">Precisión:</span>
                      <div className="font-bold">94.2%</div>
                    </div>
                    <div>
                      <span className="text-blue-600">Recall:</span>
                      <div className="font-bold">91.8%</div>
                    </div>
                    <div>
                      <span className="text-blue-600">F1-Score:</span>
                      <div className="font-bold">93.0%</div>
                    </div>
                    <div>
                      <span className="text-blue-600">
                        Último entrenamiento:
                      </span>
                      <div className="font-bold">Hace 3 días</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Configuración de Datos y Privacidad */}
        {activeTab === "data" && (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Gestión de Datos y Privacidad
                </CardTitle>
                <CardDescription>
                  Configuración de retención, anonimización y respaldo de datos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Retención de Datos (días)
                    </label>
                    <Input
                      type="number"
                      min="30"
                      max="2555"
                      value={settings.dataRetentionDays}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          dataRetentionDays: parseInt(e.target.value),
                        }))
                      }
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Días antes de eliminar datos inactivos
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Frecuencia de Respaldo (horas)
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="168"
                      value={settings.backupFrequency}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          backupFrequency: parseInt(e.target.value),
                        }))
                      }
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Intervalos entre respaldos automáticos
                    </p>
                  </div>

                  <div className="flex items-center justify-center">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.anonymizationEnabled}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            anonymizationEnabled: e.target.checked,
                          }))
                        }
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">
                        Activar anonimización automática
                      </span>
                    </label>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">
                        Consideraciones de Privacidad
                      </h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Los datos de estudiantes son sensibles. Asegúrate de
                        cumplir con las regulaciones de protección de datos
                        locales e institucionales. La anonimización puede
                        afectar la precisión del modelo ML.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Exportar Datos
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Ejecutar Respaldo
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Limpiar Datos Antiguos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Configuración de Usuarios */}
        {activeTab === "users" && (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Gestión de Usuarios
                </CardTitle>
                <CardDescription>
                  Configuración de límites y políticas de usuarios
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Máx. Estudiantes por Psicólogo
                    </label>
                    <Input
                      type="number"
                      min="10"
                      max="200"
                      value={settings.maxStudentsPerPsychologist}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          maxStudentsPerPsychologist: parseInt(e.target.value),
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Timeout de Sesión (minutos)
                    </label>
                    <Input
                      type="number"
                      min="5"
                      max="120"
                      value={settings.sessionTimeoutMinutes}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          sessionTimeoutMinutes: parseInt(e.target.value),
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Expiración de Contraseña (días)
                    </label>
                    <Input
                      type="number"
                      min="30"
                      max="365"
                      value={settings.passwordExpiryDays}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          passwordExpiryDays: parseInt(e.target.value),
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Estadísticas Actuales
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">
                        Estudiantes Activos:
                      </span>
                      <div className="font-bold text-lg">1,247</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Psicólogos:</span>
                      <div className="font-bold text-lg">25</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Administradores:</span>
                      <div className="font-bold text-lg">8</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Sesiones Activas:</span>
                      <div className="font-bold text-lg">156</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Configuración de Notificaciones */}
        {activeTab === "notifications" && (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contactos de Emergencia
                </CardTitle>
                <CardDescription>
                  Emails que recibirán notificaciones de alertas críticas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {settings.emergencyContacts.map((email, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-2"
                    >
                      {email}
                      <button
                        onClick={() => removeEmergencyContact(index)}
                        className="ml-1 hover:text-red-600"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <Button
                  onClick={addEmergencyContact}
                  variant="outline"
                  size="sm"
                >
                  + Agregar Contacto
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plantillas de Notificación</CardTitle>
                <CardDescription>
                  Personaliza los mensajes de notificación para cada nivel de
                  riesgo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-green-700">
                    Riesgo Bajo
                  </label>
                  <Textarea
                    value={settings.notificationTemplates.lowRisk}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        notificationTemplates: {
                          ...prev.notificationTemplates,
                          lowRisk: e.target.value,
                        },
                      }))
                    }
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-yellow-700">
                    Riesgo Medio
                  </label>
                  <Textarea
                    value={settings.notificationTemplates.mediumRisk}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        notificationTemplates: {
                          ...prev.notificationTemplates,
                          mediumRisk: e.target.value,
                        },
                      }))
                    }
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-red-700">
                    Riesgo Alto
                  </label>
                  <Textarea
                    value={settings.notificationTemplates.highRisk}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        notificationTemplates: {
                          ...prev.notificationTemplates,
                          highRisk: e.target.value,
                        },
                      }))
                    }
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Configuración de Seguridad */}
        {activeTab === "security" && (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Configuración de Seguridad
                </CardTitle>
                <CardDescription>
                  Configuración avanzada de seguridad y monitoreo del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-red-800">
                        Monitoreo de Seguridad
                      </h4>
                      <p className="text-sm text-red-700 mt-1">
                        Sistema de detección de anomalías y logs de acceso
                        activos. Última verificación: hace 2 minutos.
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      Activo
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-3">Logs de Acceso</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>Intentos de login:</span>
                        <span className="font-medium">247 (últimas 24h)</span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>Sesiones activas:</span>
                        <span className="font-medium">89</span>
                      </div>
                      <div className="flex justify-between p-2 bg-red-50 rounded">
                        <span>Intentos fallidos:</span>
                        <span className="font-medium text-red-600">3</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">Configuración de Logs</h5>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded"
                        />
                        <span className="text-sm">
                          Registrar accesos exitosos
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded"
                        />
                        <span className="text-sm">
                          Registrar intentos fallidos
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded"
                        />
                        <span className="text-sm">
                          Registrar cambios de configuración
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Modo debug (verbose)</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar Logs
                  </Button>
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Limpiar Logs Antiguos
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowPasswords(!showPasswords)}
                  >
                    {showPasswords ? (
                      <EyeOff className="h-4 w-4 mr-2" />
                    ) : (
                      <Eye className="h-4 w-4 mr-2" />
                    )}
                    {showPasswords ? "Ocultar" : "Mostrar"} Credenciales
                  </Button>
                </div>

                {showPasswords && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h5 className="font-medium text-yellow-800 mb-2">
                      Credenciales del Sistema
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono">
                      <div>
                        <span className="text-yellow-700">DB Host:</span>
                        <div>localhost:5432</div>
                      </div>
                      <div>
                        <span className="text-yellow-700">API Key:</span>
                        <div>sk-proj-••••••••••••••••</div>
                      </div>
                      <div>
                        <span className="text-yellow-700">JWT Secret:</span>
                        <div>••••••••••••••••••••••••</div>
                      </div>
                      <div>
                        <span className="text-yellow-700">Encryption Key:</span>
                        <div>AES256-••••••••••••••••</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
