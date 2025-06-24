'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockApi } from '@/lib/mock-data'
import { MentalHealthResource } from '@/types'
import { cn } from '@/lib/utils'
import { 
  Heart, 
  Search, 
  Phone, 
  MessageCircle, 
  ExternalLink,
  AlertTriangle,
  BookOpen,
  Video,
  Users,
  Clock,
  Shield,
  Headphones,
  Brain,
  Smile,
  Activity
} from 'lucide-react'

export default function StudentResourcesPage() {
  const [resources, setResources] = useState<MentalHealthResource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')

  useEffect(() => {
    loadResources()
  }, [])

  const loadResources = async () => {
    try {
      const data = await mockApi.getResources()
      setResources(data)
    } catch (error) {
      console.error('Error loading resources:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = selectedType === 'all' || resource.type === selectedType
    return matchesSearch && matchesType
  })

  const emergencyResources = resources.filter(r => r.isEmergency)
  const regularResources = filteredResources.filter(r => !r.isEmergency)

  const resourceTypes = [
    { value: 'all', label: 'Todos los recursos', icon: Heart },
    { value: 'contact', label: 'Contactos de ayuda', icon: Phone },
    { value: 'technique', label: 'Técnicas y ejercicios', icon: Activity },
    { value: 'article', label: 'Artículos y guías', icon: BookOpen },
    { value: 'video', label: 'Videos y multimedia', icon: Video }
  ]

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'contact':
        return <Phone className="h-5 w-5" />
      case 'technique':
        return <Activity className="h-5 w-5" />
      case 'article':
        return <BookOpen className="h-5 w-5" />
      case 'video':
        return <Video className="h-5 w-5" />
      default:
        return <Heart className="h-5 w-5" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="h-10 w-10 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Recursos de Bienestar
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Aquí encontrarás herramientas, contactos y recursos para cuidar tu salud mental y bienestar. 
            Recuerda que buscar ayuda es un acto de valentía.
          </p>
        </div>

        {/* Alerta de emergencia */}
        {emergencyResources.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-red-600 mt-1 mr-3" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  🚨 ¿Necesitas ayuda inmediata?
                </h3>
                <p className="text-red-700 mb-4">
                  Si estás en crisis o pensando en hacerte daño, por favor busca ayuda inmediatamente.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {emergencyResources.map((resource) => (
                    <div key={resource.id} className="bg-white p-4 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {resource.title}
                      </h4>
                      <p className="text-sm text-red-700 mb-2">{resource.description}</p>
                      {resource.content && (
                        <div className="text-sm text-red-800 bg-red-50 p-2 rounded whitespace-pre-line">
                          {resource.content}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar recursos, técnicas, contactos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {resourceTypes.map((type) => {
                  const Icon = type.icon
                  const count = type.value === 'all' 
                    ? resources.filter(r => !r.isEmergency).length
                    : resources.filter(r => r.type === type.value && !r.isEmergency).length
                    
                  return (
                    <Button
                      key={type.value}
                      variant={selectedType === type.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedType(type.value)}
                      className={cn(
                        "flex items-center gap-2",
                        selectedType === type.value && "bg-green-600 hover:bg-green-700"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {type.label}
                      <Badge variant="secondary" className="ml-1">
                        {count}
                      </Badge>
                    </Button>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recursos regulares */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularResources.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron recursos
              </h3>
              <p className="text-gray-600">
                Intenta con otros términos de búsqueda o categorías
              </p>
            </div>
          ) : (
            regularResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))
          )}
        </div>

        {/* Información adicional */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Shield className="h-5 w-5" />
                Tu Privacidad es Importante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 text-sm leading-relaxed">
                Todos los recursos aquí compartidos respetan tu privacidad. Cuando contactes servicios de apoyo, 
                tu información se manejará de manera confidencial según las políticas de cada servicio.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Users className="h-5 w-5" />
                No Estás Solo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 text-sm leading-relaxed">
                Buscar ayuda es normal y valiente. Miles de estudiantes utilizan estos recursos cada año. 
                El apoyo profesional puede hacer una gran diferencia en tu bienestar.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Técnicas rápidas */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Brain className="h-6 w-6" />
              Técnicas Rápidas para Momentos Difíciles
            </CardTitle>
            <CardDescription className="text-purple-600">
              Ejercicios que puedes hacer ahora mismo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  <h4 className="font-semibold text-purple-800">Respiración 4-7-8</h4>
                </div>
                <p className="text-sm text-purple-700">
                  Inhala 4 segundos, retén 7 segundos, exhala 8 segundos. Repite 4 veces.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Smile className="h-5 w-5 text-purple-600" />
                  <h4 className="font-semibold text-purple-800">Técnica 5-4-3-2-1</h4>
                </div>
                <p className="text-sm text-purple-700">
                  5 cosas que ves, 4 que tocas, 3 que escuchas, 2 que hueles, 1 que saboreas.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Headphones className="h-5 w-5 text-purple-600" />
                  <h4 className="font-semibold text-purple-800">Música Relajante</h4>
                </div>
                <p className="text-sm text-purple-700">
                  Escucha música suave o sonidos de la naturaleza por 5-10 minutos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ResourceCard({ resource }: { resource: MentalHealthResource }) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'contact':
        return <Phone className="h-5 w-5" />
      case 'technique':
        return <Activity className="h-5 w-5" />
      case 'article':
        return <BookOpen className="h-5 w-5" />
      case 'video':
        return <Video className="h-5 w-5" />
      default:
        return <Heart className="h-5 w-5" />
    }
  }
  
  return (
    <Card className="hover:shadow-md transition-shadow bg-white h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getResourceIcon(resource.type)}
            <div>
              <CardTitle className="text-lg">{resource.title}</CardTitle>
              <Badge variant="outline" className="mt-1 text-xs">
                {resource.type === 'contact' && 'Contacto'}
                {resource.type === 'technique' && 'Técnica'}
                {resource.type === 'article' && 'Artículo'}
                {resource.type === 'video' && 'Video'}
              </Badge>
            </div>
          </div>
          {resource.type === 'contact' && (
            <div className="flex items-center gap-1 text-green-600">
              <Clock className="h-4 w-4" />
              <span className="text-xs">24/7</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 text-sm mb-4 leading-relaxed">
          {resource.description}
        </p>

        {resource.content && (
          <div className="mb-4">
            <div className="bg-gray-50 p-3 rounded-lg text-sm">
              <pre className="whitespace-pre-wrap font-sans text-gray-700">
                {isExpanded ? resource.content : resource.content.slice(0, 150) + (resource.content.length > 150 ? '...' : '')}
              </pre>
              {resource.content.length > 150 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-blue-600 hover:text-blue-800 text-xs mt-2"
                >
                  {isExpanded ? 'Ver menos' : 'Ver más'}
                </button>
              )}
            </div>
          </div>
        )}

        {resource.url && (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button
              size="sm"
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Acceder al recurso
            </Button>
          </a>
        )}

        {resource.type === 'contact' && !resource.url && (
          <div className="flex gap-2">
            <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
              <Phone className="h-4 w-4 mr-2" />
              Llamar
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </Button>
          </div>
        )}

        {resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-4">
            {resource.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {resource.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{resource.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
