'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { mockApi } from '@/lib/mock-data'
import { AnalyticsData, RiskAlert } from '@/types'
import { getRiskColor, getRiskLabel, formatRelativeTime } from '@/lib/utils'
import { 
  BarChart3, 
  Users, 
  AlertTriangle, 
  MessageCircle,
  TrendingUp,
  TrendingDown,
  Eye,
  Shield,
  Activity,
  Calendar,
  Brain,
  Heart
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [recentAlerts, setRecentAlerts] = useState<RiskAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [analyticsData, alertsData] = await Promise.all([
        mockApi.getAnalytics(),
        mockApi.getRiskAlerts()
      ])
      
      setAnalytics(analyticsData)
      setRecentAlerts(alertsData.slice(0, 5)) // Solo las 5 más recientes
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !analytics) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const riskDistributionData = [
    { name: 'Bajo', value: analytics.riskDistribution.low, color: '#10B981' },
    { name: 'Medio', value: analytics.riskDistribution.medium, color: '#F59E0B' },
    { name: 'Alto', value: analytics.riskDistribution.high, color: '#EF4444' }
  ]

  const keywordData = analytics.topKeywords.map(kw => ({
    word: kw.word,
    count: kw.count,
    fill: kw.riskLevel === 'high' ? '#EF4444' : kw.riskLevel === 'medium' ? '#F59E0B' : '#10B981'
  }))

  const totalAlerts = analytics.riskDistribution.low + analytics.riskDistribution.medium + analytics.riskDistribution.high
  const highRiskPercentage = totalAlerts > 0 ? ((analytics.riskDistribution.high / totalAlerts) * 100).toFixed(1) : '0'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                Panel de Control
              </h1>
              <p className="text-gray-600 mt-1">
                Bienvenido, Dr. {user?.name}. Monitoreo en tiempo real del bienestar estudiantil.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                Sistema activo
              </Badge>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Eye className="h-4 w-4 mr-2" />
                Ver todas las alertas
              </Button>
            </div>
          </div>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Users className="h-5 w-5" />
                Usuarios Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.totalUsers.toLocaleString()}</div>
              <div className="text-blue-100 text-sm mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {analytics.activeUsers} activos hoy
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Publicaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.totalPosts.toLocaleString()}</div>
              <div className="text-green-100 text-sm mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +{analytics.trends[analytics.trends.length - 1]?.posts || 0} hoy
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Alertas Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.totalAlerts}</div>
              <div className="text-orange-100 text-sm mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +{analytics.trends[analytics.trends.length - 1]?.alerts || 0} hoy
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Riesgo Alto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.riskDistribution.high}</div>
              <div className="text-red-100 text-sm mt-1">
                {highRiskPercentage}% del total de alertas
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tendencias temporales */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Tendencias de los Últimos 7 Días
              </CardTitle>
              <CardDescription>
                Evolución de alertas, publicaciones y usuarios activos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value as string).toLocaleDateString('es-ES')}
                  />
                  <Line type="monotone" dataKey="alerts" stroke="#EF4444" strokeWidth={2} name="Alertas" />
                  <Line type="monotone" dataKey="posts" stroke="#10B981" strokeWidth={2} name="Publicaciones" />
                  <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} name="Usuarios" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribución de riesgo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Distribución de Riesgo
              </CardTitle>
              <CardDescription>
                Casos por nivel de riesgo detectado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Palabras clave más frecuentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Palabras Clave Detectadas
              </CardTitle>
              <CardDescription>
                Términos más frecuentes por nivel de riesgo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={keywordData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="word" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Alertas recientes y estadísticas por facultad */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alertas recientes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Alertas Recientes
              </CardTitle>
              <CardDescription>
                Casos que requieren atención prioritaria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAlerts.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">No hay alertas recientes</p>
                  </div>
                ) : (
                  recentAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`h-3 w-3 rounded-full mt-2 ${getRiskColor(alert.level)}`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{alert.userName}</span>
                          <Badge className={getRiskColor(alert.level)}>
                            {getRiskLabel(alert.level)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{alert.content.slice(0, 100)}...</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>{formatRelativeTime(alert.createdAt)}</span>
                          <span>Score: {(alert.score * 100).toFixed(1)}%</span>
                          <span className="capitalize">{alert.source}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas por facultad */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Estadísticas por Facultad
              </CardTitle>
              <CardDescription>
                Distribución de alertas por programa académico
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.facultyStats.map((faculty) => (
                  <div key={faculty.faculty} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{faculty.faculty}</span>
                      <div className="flex items-center gap-2">
                        <Badge className={getRiskColor(faculty.riskLevel)}>
                          {getRiskLabel(faculty.riskLevel)}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {faculty.alertsCount}/{faculty.totalStudents}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          faculty.riskLevel === 'high' ? 'bg-red-500' :
                          faculty.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{
                          width: `${Math.min((faculty.alertsCount / faculty.totalStudents) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mensaje informativo */}
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-800 mb-1">
                  Sistema de Monitoreo Activo
                </h3>
                <p className="text-sm text-blue-700 leading-relaxed">
                  El sistema está analizando continuamente las interacciones para detectar patrones de riesgo. 
                  Las alertas se generan usando modelos de machine learning entrenados específicamente para 
                  identificar señales de alerta temprana en el contenido compartido por los estudiantes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
