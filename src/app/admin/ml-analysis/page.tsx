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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Eye,
  Shield,
  CheckCircle,
  AlertTriangle,
  Info,
  RefreshCw,
  Download,
  FileText,
} from "lucide-react";

interface MLAnalysis {
  userId: string;
  userName: string;
  timestamp: string;
  riskScore: number;
  riskLevel: "low" | "medium" | "high";
  confidence: number;
  factors: {
    name: string;
    impact: number;
    description: string;
    type: "positive" | "negative" | "neutral";
  }[];
  recommendations: string[];
  modelVersion: string;
  dataPoints: number;
}

const mockMLAnalysis: MLAnalysis = {
  userId: "12345",
  userName: "Estudiante Anónimo",
  timestamp: "2024-01-15T14:30:00Z",
  riskScore: 0.68,
  riskLevel: "medium",
  confidence: 0.85,
  factors: [
    {
      name: "Frecuencia de Posts",
      impact: -0.12,
      description: "Disminución en la actividad de publicaciones recientes",
      type: "negative",
    },
    {
      name: "Sentimiento del Texto",
      impact: -0.25,
      description: "Análisis de sentimientos muestra tendencia negativa",
      type: "negative",
    },
    {
      name: "Patrones de Sueño",
      impact: -0.08,
      description: "Entradas de diario indican alteraciones del sueño",
      type: "negative",
    },
    {
      name: "Uso de Recursos",
      impact: 0.15,
      description: "Acceso frecuente a recursos de bienestar",
      type: "positive",
    },
    {
      name: "Interacción Social",
      impact: -0.05,
      description: "Reducción en la participación en el foro",
      type: "negative",
    },
    {
      name: "Búsqueda de Ayuda",
      impact: 0.2,
      description: "Consultas sobre recursos de apoyo profesional",
      type: "positive",
    },
  ],
  recommendations: [
    "Contactar al estudiante para una evaluación más detallada",
    "Ofrecer recursos de apoyo específicos para manejo del estrés",
    "Considerar derivación a profesional de salud mental",
    "Hacer seguimiento en 48-72 horas",
  ],
  modelVersion: "v2.1.0",
  dataPoints: 247,
};

export default function MLExplainabilityPage() {
  const [analysis, setAnalysis] = useState<MLAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  useEffect(() => {
    // Simulación de carga de análisis
    setTimeout(() => {
      setAnalysis(mockMLAnalysis);
      setIsLoading(false);
    }, 1500);
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600 bg-green-100 border-green-200";
      case "medium":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "high":
        return "text-red-600 bg-red-100 border-red-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getFactorColor = (type: string) => {
    switch (type) {
      case "positive":
        return "text-green-600 bg-green-50 border-green-200";
      case "negative":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const regenerateAnalysis = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Simulación de nuevo análisis con datos ligeramente diferentes
      const newAnalysis = {
        ...mockMLAnalysis,
        timestamp: new Date().toISOString(),
        riskScore: Math.random() * 0.4 + 0.3, // Score entre 0.3 y 0.7
        confidence: Math.random() * 0.2 + 0.8, // Confianza entre 0.8 y 1.0
        dataPoints: Math.floor(Math.random() * 100) + 200,
      };
      newAnalysis.riskLevel =
        newAnalysis.riskScore < 0.4
          ? "low"
          : newAnalysis.riskScore < 0.7
          ? "medium"
          : "high";
      setAnalysis(newAnalysis);
      setIsLoading(false);
    }, 2000);
  };

  const exportAnalysis = () => {
    if (!analysis) return;

    const exportData = {
      ...analysis,
      exportedAt: new Date().toISOString(),
      exportedBy: "Administrador del Sistema",
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `ml-analysis-${analysis.userId}-${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Brain className="h-12 w-12 animate-pulse text-blue-600 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900">
              Analizando patrones...
            </p>
            <p className="text-sm text-gray-600">Procesando datos con ML</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error al cargar análisis
          </h3>
          <p className="text-gray-600 mb-4">
            No se pudo cargar el análisis de ML
          </p>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Intentar de nuevo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Análisis de Explicabilidad ML
        </h1>
        <p className="text-gray-600">
          Comprende cómo el modelo de machine learning determina el nivel de
          riesgo
        </p>
      </div>

      {/* Botones de acción */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Button onClick={regenerateAnalysis} disabled={isLoading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Nuevo Análisis
        </Button>
        <Button variant="outline" onClick={exportAnalysis}>
          <Download className="h-4 w-4 mr-2" />
          Exportar Análisis
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
        >
          <Eye className="h-4 w-4 mr-2" />
          {showTechnicalDetails ? "Ocultar" : "Mostrar"} Detalles Técnicos
        </Button>
      </div>

      {/* Alerta de privacidad */}
      <div className="mb-6">
        <Alert variant="info">
          <Shield className="h-4 w-4" />
          <AlertTitle>Privacidad y Confidencialidad</AlertTitle>
          <AlertDescription>
            Este análisis utiliza datos anonimizados y está sujeto a
            confidencialidad profesional. Solo personal autorizado puede acceder
            a esta información.
          </AlertDescription>
        </Alert>
      </div>

      <div className="grid gap-6">
        {/* Resumen del análisis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Resumen del Análisis
            </CardTitle>
            <CardDescription>
              Análisis generado el{" "}
              {new Date(analysis.timestamp).toLocaleString("es-ES")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {(analysis.riskScore * 100).toFixed(1)}%
                </div>
                <div
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(
                    analysis.riskLevel
                  )}`}
                >
                  Riesgo{" "}
                  {analysis.riskLevel === "low"
                    ? "Bajo"
                    : analysis.riskLevel === "medium"
                    ? "Medio"
                    : "Alto"}
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {(analysis.confidence * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">
                  Confianza del Modelo
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {analysis.dataPoints}
                </div>
                <div className="text-sm text-gray-600">Puntos de Datos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Factores de análisis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Factores de Análisis
            </CardTitle>
            <CardDescription>
              Principales factores que influyen en la puntuación de riesgo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.factors.map((factor, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${getFactorColor(
                    factor.type
                  )}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{factor.name}</h4>
                      {factor.type === "positive" ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : factor.type === "negative" ? (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      ) : (
                        <BarChart3 className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <Badge
                      variant={
                        factor.type === "positive" ? "default" : "destructive"
                      }
                    >
                      {factor.impact > 0 ? "+" : ""}
                      {(factor.impact * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <p className="text-sm">{factor.description}</p>

                  {/* Barra de impacto */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          factor.type === "positive"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${Math.abs(factor.impact) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recomendaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Recomendaciones de Intervención
            </CardTitle>
            <CardDescription>
              Acciones sugeridas basadas en el análisis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysis.recommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="text-sm text-blue-900">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detalles técnicos */}
        {showTechnicalDetails && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Detalles Técnicos del Modelo
              </CardTitle>
              <CardDescription>
                Información técnica sobre el modelo de machine learning
                utilizado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Información del Modelo</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Versión:</span>
                      <span className="font-medium">
                        {analysis.modelVersion}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Algoritmo:</span>
                      <span className="font-medium">Random Forest + NLP</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Características:</span>
                      <span className="font-medium">156 variables</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Precisión:</span>
                      <span className="font-medium">94.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recall:</span>
                      <span className="font-medium">91.8%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Métricas de Rendimiento</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">F1-Score:</span>
                      <span className="font-medium">93.0%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">AUC-ROC:</span>
                      <span className="font-medium">0.956</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Datos de entrenamiento:
                      </span>
                      <span className="font-medium">125,000 casos</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Última actualización:
                      </span>
                      <span className="font-medium">3 días</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tiempo de proceso:</span>
                      <span className="font-medium">127ms</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-yellow-800">
                      Limitaciones del Modelo
                    </h5>
                    <p className="text-sm text-yellow-700 mt-1">
                      Este modelo es una herramienta de apoyo y no reemplaza el
                      juicio clínico profesional. Los resultados deben ser
                      interpretados por personal capacitado y siempre requieren
                      validación humana antes de tomar decisiones de
                      intervención.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
