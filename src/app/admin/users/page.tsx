'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'
import { mockUsers, mockApi } from '@/lib/mock-data'
import { User, RiskAlert } from '@/types'
import { formatDate, formatRelativeTime, cn } from '@/lib/utils'
import { 
  Users, 
  Search, 
  Filter, 
  Eye,
  MessageCircle,
  BookOpen,
  Calendar,
  GraduationCap,
  Mail,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Activity,
  Clock,
  Shield,
  UserCheck,
  UserX,
  Download
} from 'lucide-react'

interface UserWithStats extends User {
  postsCount: number
  diaryEntriesCount: number
  alertsCount: number
  lastActivity: Date
  riskLevel: 'low' | 'medium' | 'high'
}

export default function AdminUsersPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState<UserWithStats[]>([])
  const [alerts, setAlerts] = useState<RiskAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [facultyFilter, setFacultyFilter] = useState('all')
  const [semesterFilter, setSemesterFilter] = useState('all')
  const [riskFilter, setRiskFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState<UserWithStats | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      // Cargar datos y crear estadísticas simuladas
      const [alertsData] = await Promise.all([
        mockApi.getRiskAlerts()
      ])
      
      setAlerts(alertsData)
      
      // Simular datos de usuarios con estadísticas
      const usersWithStats: UserWithStats[] = mockUsers
        .filter(u => u.role === 'student')
        .map(u => {
          const userAlerts = alertsData.filter(a => a.userId === u.id)
          const highRiskAlerts = userAlerts.filter(a => a.level === 'high')
          const mediumRiskAlerts = userAlerts.filter(a => a.level === 'medium')
          
          let riskLevel: 'low' | 'medium' | 'high' = 'low'
          if (highRiskAlerts.length > 0) riskLevel = 'high'
          else if (mediumRiskAlerts.length > 1) riskLevel = 'medium'
          
          return {
            ...u,
            postsCount: Math.floor(Math.random() * 20) + 1,
            diaryEntriesCount: Math.floor(Math.random() * 30) + 5,
            alertsCount: userAlerts.length,
            lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            riskLevel
          }
        })
      
      setUsers(usersWithStats)
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFaculty = facultyFilter === 'all' || user.faculty === facultyFilter
    const matchesSemester = semesterFilter === 'all' || user.semester?.toString() === semesterFilter
    const matchesRisk = riskFilter === 'all' || user.riskLevel === riskFilter
    return matchesSearch && matchesFaculty && matchesSemester && matchesRisk
  })

  const userStats = {
    total: users.length,
    active: users.filter(u => {
      const dayAgo = new Date()
      dayAgo.setDate(dayAgo.getDate() - 1)
      return u.lastActivity >= dayAgo
    }).length,
    highRisk: users.filter(u => u.riskLevel === 'high').length,
    mediumRisk: users.filter(u => u.riskLevel === 'medium').length
  }

  const faculties = [...new Set(users.map(u => u.faculty).filter(Boolean))]
  const semesters = [...new Set(users.map(u => u.semester).filter(Boolean))].sort()

  const getRiskColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200'
    }
  }

  const getRiskLabel = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return 'Bajo'
      case 'medium':
        return 'Medio'
      case 'high':
        return 'Alto'
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                Gestión de Usuarios
              </h1>
              <p className="text-gray-600 mt-1">
                Monitoreo y administración de estudiantes registrados en la plataforma
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar datos
              </Button>
              <Badge variant="outline" className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                {userStats.active} usuarios activos
              </Badge>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Estudiantes</p>
                  <p className="text-2xl font-bold">{userStats.total}</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Activos (24h)</p>
                  <p className="text-2xl font-bold">{userStats.active}</p>
                </div>
                <Activity className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">Riesgo Medio</p>
                  <p className="text-2xl font-bold">{userStats.mediumRisk}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Riesgo Alto</p>
                  <p className="text-2xl font-bold">{userStats.highRisk}</p>
                </div>
                <Shield className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de usuarios */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filtros */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por nombre o email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                      value={facultyFilter}
                      onChange={(e) => setFacultyFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">Todas las facultades</option>
                      {faculties.map(faculty => (
                        <option key={faculty} value={faculty}>{faculty}</option>
                      ))}
                    </select>
                    
                    <select
                      value={semesterFilter}
                      onChange={(e) => setSemesterFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">Todos los semestres</option>
                      {semesters.map(semester => (
                        <option key={semester} value={semester.toString()}>{semester}° Semestre</option>
                      ))}
                    </select>
                    
                    <select
                      value={riskFilter}
                      onChange={(e) => setRiskFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">Todos los riesgos</option>
                      <option value="high">Alto riesgo</option>
                      <option value="medium">Riesgo medio</option>
                      <option value="low">Bajo riesgo</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lista de usuarios */}
            <div className="space-y-4">
              {filteredUsers.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No se encontraron usuarios
                    </h3>
                    <p className="text-gray-600">
                      Intenta con otros filtros de búsqueda
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredUsers.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    isSelected={selectedUser?.id === user.id}
                    onClick={() => setSelectedUser(user)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Panel de detalles */}
          <div className="space-y-6">
            {selectedUser ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5" />
                      Información del Usuario
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {selectedUser.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedUser.name}</h3>
                        <p className="text-sm text-gray-600">{selectedUser.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="font-medium text-gray-700">Facultad</label>
                        <div className="flex items-center gap-1 mt-1">
                          <GraduationCap className="h-4 w-4 text-gray-500" />
                          <span>{selectedUser.faculty}</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="font-medium text-gray-700">Semestre</label>
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{selectedUser.semester}°</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="font-medium text-gray-700">Registro</label>
                        <p className="text-gray-600">{formatDate(selectedUser.createdAt)}</p>
                      </div>
                      
                      <div>
                        <label className="font-medium text-gray-700">Última actividad</label>
                        <p className="text-gray-600">{formatRelativeTime(selectedUser.lastActivity)}</p>
                      </div>
                    </div>

                    <div>
                      <label className="font-medium text-gray-700">Nivel de Riesgo</label>
                      <div className="mt-1">
                        <Badge className={getRiskColor(selectedUser.riskLevel)}>
                          {getRiskLabel(selectedUser.riskLevel)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Estadísticas de Actividad
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-gray-600">Publicaciones</span>
                        </div>
                        <span className="font-semibold">{selectedUser.postsCount}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-purple-600" />
                          <span className="text-sm text-gray-600">Entradas diario</span>
                        </div>
                        <span className="font-semibold">{selectedUser.diaryEntriesCount}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <span className="text-sm text-gray-600">Alertas generadas</span>
                        </div>
                        <span className="font-semibold">{selectedUser.alertsCount}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-gray-600">Días activo</span>
                        </div>
                        <span className="font-semibold">
                          {Math.floor((Date.now() - selectedUser.createdAt.getTime()) / (1000 * 60 * 60 * 24))}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {selectedUser.alertsCount > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Alertas Recientes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {alerts
                          .filter(alert => alert.userId === selectedUser.id)
                          .slice(0, 3)
                          .map((alert) => (
                            <div key={alert.id} className="border-l-4 border-red-500 pl-3 py-2">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className={getRiskColor(alert.level)}>
                                  {getRiskLabel(alert.level)}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {formatRelativeTime(alert.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">
                                {alert.content.slice(0, 100)}...
                              </p>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Acciones Administrativas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar mensaje
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Programar cita
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar historial
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start text-red-600 hover:text-red-700">
                      <UserX className="h-4 w-4 mr-2" />
                      Suspender cuenta
                    </Button>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Selecciona un usuario
                  </h3>
                  <p className="text-gray-600">
                    Elige un usuario de la lista para ver sus detalles completos
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

function UserCard({ 
  user, 
  isSelected, 
  onClick 
}: { 
  user: UserWithStats
  isSelected: boolean
  onClick: () => void
}) {
  const getRiskColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return 'text-green-600 bg-green-50'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50'
      case 'high':
        return 'text-red-600 bg-red-50'
    }
  }

  const getRiskLabel = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return 'Bajo'
      case 'medium':
        return 'Medio'
      case 'high':
        return 'Alto'
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user.name.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.faculty} • {user.semester}° semestre</p>
              <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                <span>{user.postsCount} posts</span>
                <span>{user.diaryEntriesCount} entradas</span>
                <span>{formatRelativeTime(user.lastActivity)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={getRiskColor(user.riskLevel)}>
              {getRiskLabel(user.riskLevel)}
            </Badge>
            {user.alertsCount > 0 && (
              <Badge variant="outline" className="text-xs">
                {user.alertsCount} alertas
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
