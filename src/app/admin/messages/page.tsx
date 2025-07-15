"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  User,
  MessageCircle,
  BookOpen,
  AlertTriangle,
  Brain,
  Clock,
  TrendingUp,
  TrendingDown,
  Shield,
  RefreshCw,
  Languages,
  Eye,
  BarChart3,
} from "lucide-react";
import { apiService, UserMessage, PredictionResult } from "@/lib/api-service";

type RiskLevelType = "low" | "medium" | "high";

export default function AdminMessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<UserMessage | null>(
    null
  );
  const [predictionResult, setPredictionResult] =
    useState<PredictionResult | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiHealth, setApiHealth] = useState<{
    status: string;
    model_loaded: boolean;
  } | null>(null);

  useEffect(() => {
    loadMessages();
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      const health = await apiService.healthCheck();
      setApiHealth(health);
    } catch (error) {
      console.error("Error checking API health:", error);
      setError("No se puede conectar con el servicio de análisis");
    }
  };

  const loadMessages = async () => {
    try {
      setError(null);
      const response = await apiService.getAllMessages();
      setMessages(response.messages);
    } catch (error) {
      console.error("Error loading messages:", error);
      setError("Error al cargar los mensajes");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePredictMessage = async (message: UserMessage) => {
    if (!apiHealth?.model_loaded) {
      setError("El modelo de análisis no está disponible");
      return;
    }

    setIsPredicting(true);
    setError(null);
    setSelectedMessage(message);
    setPredictionResult(null);

    try {
      const result = await apiService.predictMessage(
        message.id,
        message.content
      );
      console.log("Prediction result:", result);
      setPredictionResult(result);
    } catch (error) {
      console.error("Error predicting message:", error);
      setError("Error al analizar el mensaje");
    } finally {
      setIsPredicting(false);
    }
  };

  const filteredMessages = messages.filter(
    (message) =>
      message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.user_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRiskColor = (level: RiskLevelType) => {
    switch (level) {
      case "high":
        return "bg-red-600 text-white border-red-700 shadow-lg";
      case "medium":
        return "bg-yellow-600 text-white border-yellow-700 shadow-lg";
      case "low":
        return "bg-green-600 text-white border-green-700 shadow-lg";
      default:
        return "bg-gray-600 text-white border-gray-700 shadow-lg";
    }
  };

  const getMessageTypeIcon = (type: string) => {
    const iconClasses = "h-4 w-4";
    switch (type) {
      case "diary":
        return <BookOpen className={`${iconClasses} text-purple-700`} />;
      case "post":
        return <MessageCircle className={`${iconClasses} text-blue-700`} />;
      default:
        return <MessageCircle className={`${iconClasses} text-gray-700`} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Análisis de Mensajes
            </h1>
            <p className="text-gray-700 mt-2 text-lg">
              Monitoreo y análisis de contenido de estudiantes
            </p>
          </div>
          <Button
            onClick={loadMessages}
            variant="outline"
            className="flex items-center gap-2 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
        </div>

        {/* API Status */}
        {apiHealth && (
          <Alert
            variant={apiHealth.model_loaded ? "default" : "destructive"}
            className={
              apiHealth.model_loaded
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-yellow-50 border-yellow-200 text-yellow-800"
            }
          >
            {/* <Shield className="h-4 w-4" /> */}
            <AlertDescription className="font-semibold">
              {apiHealth.model_loaded
                ? "✅ Servicio de análisis operativo"
                : "⚠️ Servicio de análisis no disponible"}
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="font-semibold text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white shadow-lg border-l-4 border-l-blue-600">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <MessageCircle className="h-8 w-8 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Total Mensajes
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {messages.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-l-4 border-l-green-600">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <User className="h-8 w-8 text-green-700" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Usuarios Activos
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {new Set(messages.map((m) => m.user_id)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-l-4 border-l-purple-600">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <BookOpen className="h-8 w-8 text-purple-700" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Entradas Diario
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {messages.filter((m) => m.type === "diary").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-l-4 border-l-orange-600">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Brain className="h-8 w-8 text-orange-700" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Análisis Pendientes
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {filteredMessages.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-white shadow-xl border border-gray-200">
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <CardTitle className="flex items-center gap-3 text-gray-900 text-xl">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                  Mensajes de Estudiantes
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-5 w-5" />
                  <Input
                    placeholder="Buscar mensajes o usuarios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 text-base border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {filteredMessages.map((message, index) => (
                    <div
                      key={message.id}
                      className={`p-6 transition-all cursor-pointer border-b border-gray-100 ${
                        selectedMessage?.id === message.id
                          ? "bg-blue-50 border-l-4 border-l-blue-600 shadow-lg"
                          : "hover:bg-gray-50 hover:border-l-4 hover:border-l-gray-300 hover:shadow-md"
                      }`}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center gap-2">
                              {getMessageTypeIcon(message.type)}
                              <span className="text-base font-bold text-gray-900">
                                {message.user_name}
                              </span>
                            </div>
                            <Badge
                              variant="outline"
                              className="text-xs font-semibold bg-gray-100 text-gray-800 border-gray-400"
                            >
                              {message.type}
                            </Badge>
                            {message.category && (
                              <Badge
                                variant="secondary"
                                className="text-xs font-semibold bg-blue-100 text-blue-800 border-blue-400"
                              >
                                {message.category}
                              </Badge>
                            )}
                          </div>
                          <p className="text-base text-gray-900 mb-3 line-clamp-3 leading-relaxed font-medium">
                            {message.content}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700 flex items-center gap-2 font-semibold">
                              <Clock className="h-4 w-4" />
                              {formatDate(message.timestamp)}
                            </span>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePredictMessage(message);
                              }}
                              disabled={
                                isPredicting || !apiHealth?.model_loaded
                              }
                              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-2 shadow-lg"
                            >
                              {isPredicting &&
                              selectedMessage?.id === message.id ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Brain className="h-4 w-4" />
                              )}
                              Analizar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredMessages.length === 0 && (
                    <div className="p-12 text-center">
                      <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-700 text-lg font-semibold">
                        No se encontraron mensajes
                      </p>
                      <p className="text-gray-600 text-sm mt-2">
                        Intenta con otros términos de búsqueda
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Panel */}
          <div className="space-y-4">
            <Card className="bg-white shadow-xl border border-gray-200">
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <CardTitle className="flex items-center gap-3 text-gray-900 text-xl">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                  Resultado del Análisis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isPredicting ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
                      <span className="text-base text-gray-800 font-semibold">
                        Analizando mensaje...
                      </span>
                    </div>
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ) : predictionResult ? (
                  <div className="space-y-6">
                    {/* Risk Level */}
                    <div className="text-center">
                      <Badge
                        className={`${getRiskColor(
                          predictionResult.risk_level as RiskLevelType
                        )} text-lg font-bold px-6 py-3`}
                      >
                        Riesgo: {predictionResult.risk_level.toUpperCase()}
                      </Badge>
                    </div>

                    {/* Prediction Details */}
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
                        <div className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">
                          Predicción
                        </div>
                        <div className="text-xl font-bold">
                          {predictionResult.prediction === "suicidal" ? (
                            <span className="text-red-700 flex items-center gap-2">
                              <TrendingUp className="h-5 w-5" />
                              Riesgo Detectado
                            </span>
                          ) : (
                            <span className="text-green-700 flex items-center gap-2">
                              <TrendingDown className="h-5 w-5" />
                              Sin Riesgo Aparente
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-300">
                        <div className="text-sm font-bold text-blue-800 mb-2 uppercase tracking-wide">
                          Nivel de Confianza
                        </div>
                        <div className="text-xl font-bold text-blue-900">
                          {(predictionResult.confidence * 100).toFixed(1)}%
                        </div>
                      </div>

                      {/* Translation Info */}
                      {predictionResult.original_text !==
                        predictionResult.translated_text && (
                        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-300">
                          <div className="text-sm font-bold text-yellow-800 mb-3 flex items-center gap-2 uppercase tracking-wide">
                            <Languages className="h-4 w-4" />
                            Texto Original → Traducido
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-yellow-800 font-semibold">
                              Original:
                            </div>
                            <div className="text-base text-yellow-900 bg-yellow-100 p-3 rounded border font-medium">
                              {predictionResult.original_text}
                            </div>
                            <div className="text-sm text-yellow-800 font-semibold">
                              Traducido:
                            </div>
                            <div className="text-base text-yellow-900 bg-white p-3 rounded border font-medium">
                              {predictionResult.translated_text}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Probabilities */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-red-50 rounded-lg border border-red-300">
                          <div className="text-sm font-bold text-red-800 mb-1 uppercase tracking-wide">
                            Prob. Riesgo
                          </div>
                          <div className="text-xl font-bold text-red-900">
                            {(
                              predictionResult.suicidal_probability * 100
                            ).toFixed(1)}
                            %
                          </div>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg border border-green-300">
                          <div className="text-sm font-bold text-green-800 mb-1 uppercase tracking-wide">
                            Prob. Normal
                          </div>
                          <div className="text-xl font-bold text-green-900">
                            {(
                              predictionResult.non_suicidal_probability * 100
                            ).toFixed(1)}
                            %
                          </div>
                        </div>
                      </div>

                      {/* Analysis Details */}
                      {predictionResult.analysis && (
                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-300">
                          <div className="text-sm font-bold text-orange-800 mb-3 uppercase tracking-wide">
                            Análisis Detallado
                          </div>
                          <div className="space-y-3 text-sm text-orange-900">
                            <div className="flex justify-between font-semibold">
                              <span>Indicadores de riesgo:</span>
                              <span className="text-lg">
                                {predictionResult.analysis.indicator_count}
                              </span>
                            </div>
                            <div className="flex justify-between font-semibold">
                              <span>Pronombres 1ra persona:</span>
                              <span className="text-lg">
                                {predictionResult.analysis.first_person_count}
                              </span>
                            </div>
                            <div className="flex justify-between font-semibold">
                              <span>Longitud del texto:</span>
                              <span className="text-lg">
                                {predictionResult.analysis.text_length}{" "}
                                caracteres
                              </span>
                            </div>
                            <div className="flex justify-between font-semibold">
                              <span>Palabras totales:</span>
                              <span className="text-lg">
                                {predictionResult.analysis.word_count}
                              </span>
                            </div>

                            {/* Processed Text */}
                            <div className="mt-4">
                              <div className="text-sm font-bold text-orange-800 mb-2">
                                Texto procesado para análisis:
                              </div>
                              <div className="text-base text-orange-900 bg-white p-3 rounded border font-medium italic">
                                "{predictionResult.processed_text}"
                              </div>
                            </div>

                            {predictionResult.analysis.indicators_found.length >
                              0 && (
                              <div className="mt-4">
                                <div className="font-bold mb-2">
                                  Palabras clave de riesgo detectadas:
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {predictionResult.analysis.indicators_found.map(
                                    (indicator, index) => (
                                      <Badge
                                        key={index}
                                        variant="outline"
                                        className="text-xs bg-red-100 border-red-400 text-red-800 font-semibold"
                                      >
                                        {indicator}
                                      </Badge>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    <Eye className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-semibold text-gray-700">
                      Selecciona un mensaje para analizar
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Haz clic en "Analizar" junto a cualquier mensaje
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
