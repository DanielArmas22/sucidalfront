'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'
import { mockApi } from '@/lib/mock-data'
import { RiskAlert, Intervention } from '@/types'
import { getRiskColor, getRiskLabel, formatRelativeTime, formatDate, cn } from '@/lib/utils'
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  Eye,
  MessageSquare,
  Phone,
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Send,
  Plus,
  BarChart3,
  TrendingUp,
  Users,
  Activity
} from 'lucide-react'

type AlertStatusFilter = 'all' | 'new' | 'in-progress' | 'resolved' | 'false-positive'
type RiskLevelFilter = 'all' | 'low' | 'medium' | 'high'

export default function AdminAlertsPage() {
  const { user } = useAuth()
  const [alerts, setAlerts] = useState<RiskAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<AlertStatusFilter>('all')
  const [riskFilter, setRiskFilter] = useState<RiskLevelFilter>('all')
  const [selectedAlert, setSelectedAlert] = useState<RiskAlert | null>(null)
  const [showInterventionForm, setShowInterventionForm] = useState(false)
  const [newIntervention, setNewIntervention] = useState({
    type: 'message' as Intervention['type'],
    description: '',
    notes: ''
  })
  const [alertNotes, setAlertNotes] = useState('')

  useEffect(() => {
    loadAlerts()
  }, [])

  const loadAlerts = async () => {
    try {
      const data = await mockApi.getRiskAlerts()
      setAlerts(data)
    } catch (error) {
      console.error('Error loading alerts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (alertId: string, status: RiskAlert['status'], notes?: string) => {
    try {
      await mockApi.updateAlertStatus(alertId, status, notes)
      await loadAlerts()
      if (selectedAlert?.id === alertId) {
        const updatedAlert = alerts.find(a => a.id === alertId)
        if (updatedAlert) {
          setSelectedAlert({ ...updatedAlert, status, notes: notes || updatedAlert.notes })
        }
      }
    } catch (error) {
      console.error('Error updating alert status:', error)
    }
  }

  const handleAddIntervention = async () => {
    if (!selectedAlert || !user) return
    
    const intervention: Intervention = {
      id: Math.random().toString(36).substring(7),
      alertId: selectedAlert.id,
      type: newIntervention.type,
      description: newIntervention.description,
      performedBy: user.name,
      performedAt: new Date(),
      notes: newIntervention.notes,
      status: 'completed'
    }

    // Simular agregar intervención
    const updatedAlert = {
      ...selectedAlert,
      interventions: [...selectedAlert.interventions, intervention]
    }
    setSelectedAlert(updatedAlert)
    
    setNewIntervention({ type: 'message', description: '', notes: '' })
    setShowInterventionForm(false)
  }

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter
    const matchesRisk = riskFilter === 'all' || alert.level === riskFilter
    return matchesSearch && matchesStatus && matchesRisk
  })

  const alertStats = {
    total: alerts.length,
    new: alerts.filter(a => a.status === 'new').length,
    inProgress: alerts.filter(a => a.status === 'in-progress').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
    high: alerts.filter(a => a.level === 'high').length
  }

  const getStatusIcon = (status: RiskAlert['status']) => {
    switch (status) {
      case 'new':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'false-positive':
        return <XCircle className="h-4 w-4 text-gray-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusLabel = (status: RiskAlert['status']) => {
    switch (status) {
      case 'new':
        return 'Nueva'
      case 'in-progress':
        return 'En progreso'
      case 'resolved':
        return 'Resuelta'
      case 'false-positive':
        return 'Falso positivo'
      default:
        return 'Desconocido'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                Gestión de Alertas de Riesgo
              </h1>
              <p className="text-gray-600 mt-1">
                Monitoreo y seguimiento de casos que requieren atención especializada
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                {alertStats.new} nuevas alertas
              </Badge>
            </div>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total</p>
                  <p className="text-2xl font-bold">{alertStats.total}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Nuevas</p>
                  <p className="text-2xl font-bold">{alertStats.new}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">En progreso</p>
                  <p className="text-2xl font-bold">{alertStats.inProgress}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Resueltas</p>
                  <p className="text-2xl font-bold">{alertStats.resolved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Riesgo Alto</p>
                  <p className="text-2xl font-bold">{alertStats.high}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de alertas */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filtros */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar por nombre, email o contenido..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as AlertStatusFilter)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">Todos los estados</option>
                      <option value="new">Nuevas</option>
                      <option value="in-progress">En progreso</option>
                      <option value="resolved">Resueltas</option>
                      <option value="false-positive">Falsos positivos</option>
                    </select>
                    <select
                      value={riskFilter}
                      onChange={(e) => setRiskFilter(e.target.value as RiskLevelFilter)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">Todos los riesgos</option>
                      <option value="high">Alto</option>
                      <option value="medium">Medio</option>
                      <option value="low">Bajo</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lista de alertas */}
            <div className="space-y-4">
              {filteredAlerts.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No se encontraron alertas
                    </h3>
                    <p className="text-gray-600">
                      Intenta con otros filtros de búsqueda
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredAlerts.map((alert) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    isSelected={selectedAlert?.id === alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))
              )}
            </div>
          </div>

          {/* Panel de detalles */}
          <div className="space-y-6">
            {selectedAlert ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Detalles del Caso
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Estudiante</label>
                      <p className="text-gray-900">{selectedAlert.userName}</p>
                      <p className="text-sm text-gray-600">{selectedAlert.userEmail}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Nivel de Riesgo</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getRiskColor(selectedAlert.level)}>
                          {getRiskLabel(selectedAlert.level)}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          Score: {(selectedAlert.score * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Estado</label>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon(selectedAlert.status)}
                        <span>{getStatusLabel(selectedAlert.status)}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Fecha de Detección</label>
                      <p className="text-gray-900">{formatDate(selectedAlert.createdAt)}</p>
                      <p className="text-sm text-gray-600">{formatRelativeTime(selectedAlert.createdAt)}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Fuente</label>
                      <div className="flex items-center gap-2 mt-1">
                        {selectedAlert.source === 'post' && <MessageSquare className="h-4 w-4" />}
                        {selectedAlert.source === 'diary' && <FileText className="h-4 w-4" />}
                        <span className="capitalize">{selectedAlert.source}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Palabras Clave Detectadas</label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedAlert.detectedKeywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contenido</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {selectedAlert.content}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Acciones Rápidas
                      <Button
                        size="sm"
                        onClick={() => setShowInterventionForm(true)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleStatusUpdate(selectedAlert.id, 'in-progress')}
                      disabled={selectedAlert.status === 'in-progress'}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Marcar en progreso
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleStatusUpdate(selectedAlert.id, 'resolved')}
                      disabled={selectedAlert.status === 'resolved'}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marcar como resuelta
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleStatusUpdate(selectedAlert.id, 'false-positive')}
                      disabled={selectedAlert.status === 'false-positive'}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Falso positivo
                    </Button>
                  </CardContent>
                </Card>

                {/* Intervenciones */}
                {selectedAlert.interventions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Intervenciones Realizadas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedAlert.interventions.map((intervention) => (
                          <div key={intervention.id} className="border-l-4 border-blue-500 pl-4 py-2">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">{intervention.description}</span>
                              <Badge variant="outline" className="text-xs">
                                {intervention.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600">
                              Por {intervention.performedBy} • {formatRelativeTime(intervention.performedAt)}
                            </p>
                            {intervention.notes && (
                              <p className="text-sm text-gray-700 mt-1">{intervention.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Formulario de nueva intervención */}
                {showInterventionForm && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Nueva Intervención</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Tipo de intervención
                        </label>
                        <select
                          value={newIntervention.type}
                          onChange={(e) => setNewIntervention({ ...newIntervention, type: e.target.value as Intervention['type'] })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="message">Mensaje de apoyo</option>
                          <option value="meeting">Cita programada</option>
                          <option value="referral">Referencia especializada</option>
                          <option value="emergency">Intervención de emergencia</option>
                          <option value="follow-up">Seguimiento</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Descripción
                        </label>
                        <Input
                          placeholder="Describe la intervención realizada"
                          value={newIntervention.description}
                          onChange={(e) => setNewIntervention({ ...newIntervention, description: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Notas adicionales
                        </label>
                        <Textarea
                          placeholder="Detalles adicionales sobre la intervención"
                          value={newIntervention.notes}
                          onChange={(e) => setNewIntervention({ ...newIntervention, notes: e.target.value })}
                          className="min-h-[80px]"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={handleAddIntervention}
                          disabled={!newIntervention.description}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Registrar Intervención
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowInterventionForm(false)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Selecciona una alerta
                  </h3>
                  <p className="text-gray-600">
                    Elige una alerta de la lista para ver los detalles completos
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function AlertCard({ 
  alert, 
  isSelected, 
  onClick, 
  onStatusUpdate 
}: { 
  alert: RiskAlert
  isSelected: boolean
  onClick: () => void
  onStatusUpdate: (alertId: string, status: RiskAlert['status']) => void
}) {
  const getStatusIcon = (status: RiskAlert['status']) => {
    switch (status) {
      case 'new':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'false-positive':
        return <XCircle className="h-4 w-4 text-gray-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusLabel = (status: RiskAlert['status']) => {
    switch (status) {
      case 'new':
        return 'Nueva'
      case 'in-progress':
        return 'En progreso'
      case 'resolved':
        return 'Resuelta'
      case 'false-positive':
        return 'Falso positivo'
      default:
        return 'Desconocido'
    }
  }

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        isSelected && "ring-2 ring-blue-500 bg-blue-50"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-gray-900">{alert.userName}</span>
              <Badge className={getRiskColor(alert.level)}>
                {getRiskLabel(alert.level)}
              </Badge>
              <div className="flex items-center gap-1">
                {getStatusIcon(alert.status)}
                <span className="text-xs text-gray-600">{getStatusLabel(alert.status)}</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-700 line-clamp-2 mb-2">
              {alert.content.slice(0, 120)}...
            </p>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>{formatRelativeTime(alert.createdAt)}</span>
              <span>Score: {(alert.score * 100).toFixed(1)}%</span>
              <span className="capitalize">{alert.source}</span>
              {alert.interventions.length > 0 && (
                <span>{alert.interventions.length} intervenciones</span>
              )}
            </div>
          </div>
          
          <div className={cn(
            "w-4 h-4 rounded-full border-2",
            alert.level === 'high' && "bg-red-500 border-red-500",
            alert.level === 'medium' && "bg-yellow-500 border-yellow-500",
            alert.level === 'low' && "bg-green-500 border-green-500"
          )}></div>
        </div>
      </CardContent>
    </Card>
  )
}
