'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen,
  Search,
  FileText,
  Users,
  Shield,
  Brain,
  Heart,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle,
  Info,
  ExternalLink,
  Download,
  Video,
  MessageCircle
} from 'lucide-react'

interface HelpSection {
  id: string
  title: string
  icon: React.ElementType
  description: string
  content: string[]
  tags: string[]
  userRole?: 'student' | 'admin' | 'both'
}

const helpSections: HelpSection[] = [
  {
    id: 'getting-started',
    title: 'Primeros Pasos',
    icon: BookOpen,
    description: 'Guía básica para comenzar a usar la plataforma',
    userRole: 'both',
    tags: ['inicio', 'tutorial', 'básico'],
    content: [
      'Bienvenido/a a nuestra plataforma de bienestar estudiantil.',
      'Esta guía te ayudará a familiarizarte con las funcionalidades principales.',
      'La plataforma está diseñada para apoyar tu bienestar mental y emocional de manera confidencial y segura.',
      'Puedes acceder a recursos, conectar con profesionales de salud mental, y mantener un diario personal privado.'
    ]
  },
  {
    id: 'privacy-security',
    title: 'Privacidad y Seguridad',
    icon: Shield,
    description: 'Información sobre cómo protegemos tus datos',
    userRole: 'both',
    tags: ['privacidad', 'seguridad', 'datos', 'confidencial'],
    content: [
      'Tu privacidad es nuestra prioridad principal.',
      'Todos los datos están encriptados y solo los profesionales autorizados pueden acceder a información de riesgo.',
      'Puedes solicitar la eliminación de tus datos en cualquier momento.',
      'Nunca compartimos información personal con terceros sin tu consentimiento explícito.',
      'Los análisis de riesgo se realizan de forma automatizada y confidencial.'
    ]
  },
  {
    id: 'student-diary',
    title: 'Diario Personal',
    icon: FileText,
    description: 'Cómo usar tu espacio de reflexión privado',
    userRole: 'student',
    tags: ['diario', 'privado', 'reflexión', 'emociones'],
    content: [
      'Tu diario es completamente privado y solo tú puedes acceder a él.',
      'Úsalo para reflexionar sobre tus emociones, pensamientos y experiencias diarias.',
      'Puedes registrar tu estado de ánimo y hacer seguimiento a patrones.',
      'La escritura reflexiva ha mostrado beneficios para el bienestar mental.',
      'No hay límite en la cantidad de entradas que puedes crear.'
    ]
  },
  {
    id: 'student-resources',
    title: 'Recursos de Apoyo',
    icon: Heart,
    description: 'Accede a recursos de bienestar y apoyo profesional',
    userRole: 'student',
    tags: ['recursos', 'apoyo', 'bienestar', 'profesional'],
    content: [
      'Tenemos una amplia gama de recursos disponibles para ti.',
      'Incluye artículos, videos, ejercicios de mindfulness y técnicas de relajación.',
      'Puedes contactar directamente con profesionales de salud mental.',
      'Los recursos están organizados por categorías para facilitar tu búsqueda.',
      'Todos los recursos han sido validados por profesionales especializados.'
    ]
  },
  {
    id: 'student-forum',
    title: 'Foro Estudiantil',
    icon: MessageCircle,
    description: 'Conecta con otros estudiantes de forma segura',
    userRole: 'student',
    tags: ['foro', 'comunidad', 'anónimo', 'apoyo'],
    content: [
      'El foro es un espacio seguro para compartir experiencias con otros estudiantes.',
      'Puedes participar de forma anónima si lo prefieres.',
      'Está moderado por profesionales para mantener un ambiente de apoyo.',
      'Puedes buscar posts por temas específicos o estados de ánimo.',
      'Recuerda ser respetuoso y empático en todas tus interacciones.'
    ]
  },
  {
    id: 'admin-dashboard',
    title: 'Panel de Control',
    icon: Brain,
    description: 'Gestión del sistema y monitoreo de alertas',
    userRole: 'admin',
    tags: ['dashboard', 'admin', 'estadísticas', 'monitoreo'],
    content: [
      'El dashboard te proporciona una vista general del estado del sistema.',
      'Puedes ver estadísticas de uso, alertas activas y tendencias.',
      'Las métricas se actualizan en tiempo real.',
      'Usa los filtros para enfocarte en datos específicos por período o facultad.',
      'Los gráficos son interactivos y se pueden exportar para informes.'
    ]
  },
  {
    id: 'admin-alerts',
    title: 'Gestión de Alertas',
    icon: AlertTriangle,
    description: 'Cómo manejar alertas de riesgo y intervenciones',
    userRole: 'admin',
    tags: ['alertas', 'riesgo', 'intervención', 'urgente'],
    content: [
      'Las alertas se generan automáticamente basadas en análisis de ML.',
      'Prioriza las alertas por nivel de riesgo: bajo, medio, alto.',
      'Cada alerta incluye información contextual y recomendaciones de intervención.',
      'Registra todas las acciones tomadas para mantener un historial completo.',
      'Las alertas críticas requieren atención inmediata y seguimiento.'
    ]
  },
  {
    id: 'admin-users',
    title: 'Gestión de Usuarios',
    icon: Users,
    description: 'Administración de estudiantes y profesionales',
    userRole: 'admin',
    tags: ['usuarios', 'estudiantes', 'gestión', 'permisos'],
    content: [
      'Puedes ver información detallada de todos los usuarios registrados.',
      'Los perfiles incluyen actividad reciente y historial de intervenciones.',
      'Usa los filtros para encontrar usuarios específicos rápidamente.',
      'Puedes asignar casos a profesionales específicos.',
      'Mantén actualizada la información de contacto de emergencia.'
    ]
  },
  {
    id: 'ml-explanation',
    title: 'Inteligencia Artificial',
    icon: Brain,
    description: 'Cómo funciona la detección de riesgo automática',
    userRole: 'both',
    tags: ['ML', 'IA', 'algoritmo', 'detección', 'riesgo'],
    content: [
      'Utilizamos algoritmos de machine learning para detectar patrones de riesgo.',
      'El sistema analiza múltiples factores: texto, frecuencia de uso, patrones de comportamiento.',
      'Los modelos son entrenados con datos anonimizados y validados por profesionales.',
      'La detección es automática pero siempre requiere validación humana.',
      'El sistema mejora continuamente con más datos y retroalimentación profesional.'
    ]
  },
  {
    id: 'emergency-contacts',
    title: 'Contactos de Emergencia',
    icon: Phone,
    description: 'Números y recursos para situaciones de crisis',
    userRole: 'both',
    tags: ['emergencia', 'crisis', 'contacto', 'ayuda'],
    content: [
      'Línea Nacional de Prevención del Suicidio: 113 (gratuito, 24/7)',
      'Centro de Bienestar Universitario: (01) 555-0123',
      'Emergencias Médicas: 117',
      'Línea de Apoyo Emocional: (01) 555-0456',
      'Si estás en crisis inmediata, no dudes en llamar o acudir al centro de salud más cercano.'
    ]
  }
]

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<'all' | 'student' | 'admin'>('all')

  const filteredSections = helpSections.filter(section => {
    const matchesSearch = 
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      section.content.some(content => content.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesRole = 
      selectedRole === 'all' || 
      section.userRole === 'both' || 
      section.userRole === selectedRole

    return matchesSearch && matchesRole
  })

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Centro de Ayuda</h1>
        <p className="text-gray-600">
          Encuentra respuestas a tus preguntas y guías para usar la plataforma
        </p>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar en la documentación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedRole('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedRole === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setSelectedRole('student')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedRole === 'student'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Estudiantes
          </button>
          <button
            onClick={() => setSelectedRole('admin')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedRole === 'admin'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Administradores
          </button>
        </div>
      </div>

      {/* Alertas importantes */}
      <div className="mb-8 grid gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">En caso de emergencia</h3>
                <p className="text-red-800 text-sm mb-2">
                  Si estás experimentando pensamientos de autolesión o suicidio, busca ayuda inmediatamente.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="destructive">Línea 113 (24/7)</Badge>
                  <Badge variant="destructive">Centro Médico (01) 555-0123</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="h-6 w-6 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Confidencialidad garantizada</h3>
                <p className="text-blue-800 text-sm">
                  Toda la información que compartes está protegida por confidencialidad profesional. 
                  Solo se compartirá información en casos de riesgo inmediato para tu seguridad.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resultados de la búsqueda */}
      {searchTerm && (
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Mostrando {filteredSections.length} resultado(s) para "{searchTerm}"
          </p>
        </div>
      )}

      {/* Secciones de ayuda */}
      <div className="grid gap-6">
        {filteredSections.map((section) => {
          const Icon = section.icon
          return (
            <Card key={section.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    section.userRole === 'admin' ? 'bg-purple-100' :
                    section.userRole === 'student' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    <Icon className={`h-6 w-6 ${
                      section.userRole === 'admin' ? 'text-purple-600' :
                      section.userRole === 'student' ? 'text-green-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {section.description}
                    </CardDescription>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {section.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {section.userRole && section.userRole !== 'both' && (
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            section.userRole === 'admin' ? 'border-purple-300 text-purple-700' :
                            'border-green-300 text-green-700'
                          }`}
                        >
                          {section.userRole === 'admin' ? 'Administradores' : 'Estudiantes'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.content.map((paragraph, index) => (
                    <p key={index} className="text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredSections.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron resultados
          </h3>
          <p className="text-gray-600">
            Intenta con diferentes términos de búsqueda o explora todas las secciones.
          </p>
        </div>
      )}

      {/* Enlaces adicionales */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recursos Adicionales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Video className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-medium">Video Tutoriales</h3>
                  <p className="text-sm text-gray-600">Guías visuales paso a paso</p>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Download className="h-5 w-5 text-green-600" />
                <div>
                  <h3 className="font-medium">Guías PDF</h3>
                  <p className="text-sm text-gray-600">Documentación completa</p>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-purple-600" />
                <div>
                  <h3 className="font-medium">Contacto Técnico</h3>
                  <p className="text-sm text-gray-600">soporte@universidad.edu</p>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
