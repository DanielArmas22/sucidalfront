'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'
import { mockApi } from '@/lib/mock-data'
import { DiaryEntry, MoodType, MOOD_TYPES } from '@/types'
import { formatDate, formatRelativeTime, cn } from '@/lib/utils'
import { 
  BookOpen, 
  Plus, 
  Search, 
  Calendar,
  Heart,
  Smile,
  Frown,
  Meh,
  Edit3,
  Lock,
  TrendingUp,
  Eye,
  Save
} from 'lucide-react'

export default function StudentDiaryPage() {
  const { user } = useAuth()
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateEntry, setShowCreateEntry] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMood, setSelectedMood] = useState<MoodType | 'all'>('all')
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: 'neutral' as MoodType
  })

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    if (!user) return
    
    try {
      const data = await mockApi.getDiaryEntries(user.id)
      setEntries(data.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()))
    } catch (error) {
      console.error('Error loading diary entries:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      await mockApi.createDiaryEntry({
        userId: user.id,
        title: newEntry.title,
        content: newEntry.content,
        mood: newEntry.mood,
        isPrivate: true
      })
      
      setNewEntry({
        title: '',
        content: '',
        mood: 'neutral'
      })
      setShowCreateEntry(false)
      loadEntries()
    } catch (error) {
      console.error('Error creating diary entry:', error)
    }
  }

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMood = selectedMood === 'all' || entry.mood === selectedMood
    return matchesSearch && matchesMood
  })

  const moodStats = MOOD_TYPES.map(mood => ({
    ...mood,
    count: entries.filter(e => e.mood === mood.value).length
  }))

  const getMoodIcon = (mood: MoodType) => {
    switch (mood) {
      case 'muy-bien':
      case 'bien':
        return <Smile className="h-4 w-4" />
      case 'neutral':
        return <Meh className="h-4 w-4" />
      case 'mal':
      case 'muy-mal':
        return <Frown className="h-4 w-4" />
      default:
        return <Meh className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-blue-600" />
                Mi Diario Personal
              </h1>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Espacio completamente privado para tus pensamientos y reflexiones
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Edit3 className="h-4 w-4" />
                <span>{entries.length} entradas</span>
              </div>
              <Button
                onClick={() => setShowCreateEntry(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Entrada
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Buscar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar en mis entradas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Estado de ánimo
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedMood('all')}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                        selectedMood === 'all'
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "hover:bg-gray-100"
                      )}
                    >
                      Todos los estados
                      <span className="float-right text-gray-500">{entries.length}</span>
                    </button>
                    {moodStats.map((mood) => (
                      <button
                        key={mood.value}
                        onClick={() => setSelectedMood(mood.value)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2",
                          selectedMood === mood.value
                            ? "bg-blue-100 text-blue-700 border border-blue-200"
                            : "hover:bg-gray-100"
                        )}
                      >
                        <div className={cn("w-3 h-3 rounded-full", mood.color)}></div>
                        {mood.label}
                        <span className="ml-auto text-gray-500">{mood.count}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estadísticas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Mi Progreso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Esta semana</span>
                    <span className="font-medium">{entries.filter(e => {
                      const weekAgo = new Date()
                      weekAgo.setDate(weekAgo.getDate() - 7)
                      return e.createdAt >= weekAgo
                    }).length} entradas</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Este mes</span>
                    <span className="font-medium">{entries.filter(e => {
                      const monthAgo = new Date()
                      monthAgo.setMonth(monthAgo.getMonth() - 1)
                      return e.createdAt >= monthAgo
                    }).length} entradas</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Promedio semanal</span>
                    <span className="font-medium">
                      {entries.length > 0 ? Math.round(entries.length / 4) : 0} entradas
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mensaje motivacional */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <Heart className="h-5 w-5" />
                  <span className="font-medium">Recordatorio</span>
                </div>
                <p className="text-sm text-blue-700 leading-relaxed">
                  Escribir sobre tus emociones puede ayudarte a procesarlas mejor. No hay respuestas correctas o incorrectas aquí.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-3 space-y-6">
            {/* Formulario nueva entrada */}
            {showCreateEntry && (
              <Card className="border-blue-200 shadow-md">
                <CardHeader>
                  <CardTitle className="text-blue-700">Nueva Entrada</CardTitle>
                  <CardDescription>
                    Este es tu espacio privado. Escribe libremente sobre tus pensamientos y emociones.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateEntry} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Título (opcional)
                      </label>
                      <Input
                        placeholder="¿Cómo resumirías tu día/momento?"
                        value={newEntry.title}
                        onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        ¿Cómo te sientes?
                      </label>
                      <div className="flex gap-2 flex-wrap">
                        {MOOD_TYPES.map((mood) => (
                          <button
                            key={mood.value}
                            type="button"
                            onClick={() => setNewEntry({ ...newEntry, mood: mood.value })}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors",
                              newEntry.mood === mood.value
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-300 hover:bg-gray-50"
                            )}
                          >
                            <div className={cn("w-3 h-3 rounded-full", mood.color)}></div>
                            <span className="text-sm">{mood.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Tus pensamientos
                      </label>
                      <Textarea
                        placeholder="Escribe sobre lo que sientes, piensas o has experimentado. No hay límites ni juicios aquí."
                        value={newEntry.content}
                        onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                        className="min-h-[150px]"
                        required
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCreateEntry(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Guardar Entrada
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Lista de entradas */}
            <div className="space-y-4">
              {filteredEntries.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {searchTerm || selectedMood !== 'all' ? 'No se encontraron entradas' : 'Comienza tu diario'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm || selectedMood !== 'all' 
                        ? 'Intenta con otros términos de búsqueda'
                        : 'Escribe tu primera entrada y comienza a reflexionar sobre tus experiencias'}
                    </p>
                    {!showCreateEntry && !searchTerm && selectedMood === 'all' && (
                      <Button
                        onClick={() => setShowCreateEntry(true)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Crear Primera Entrada
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                filteredEntries.map((entry) => (
                  <DiaryEntryCard key={entry.id} entry={entry} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DiaryEntryCard({ entry }: { entry: DiaryEntry }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const mood = MOOD_TYPES.find(m => m.value === entry.mood)
  const contentPreview = entry.content.slice(0, 200)
  const showReadMore = entry.content.length > 200

  return (
    <Card className="hover:shadow-md transition-shadow bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{formatDate(entry.createdAt)}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">{formatRelativeTime(entry.createdAt)}</span>
              </div>
              {mood && (
                <Badge 
                  variant="outline" 
                  className="text-xs flex items-center gap-1"
                >
                  <div className={cn("w-2 h-2 rounded-full", mood.color)}></div>
                  {mood.label}
                </Badge>
              )}
            </div>
            {entry.title && (
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{entry.title}</h3>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Lock className="h-3 w-3" />
            <span>Privado</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {isExpanded ? entry.content : contentPreview}
            {showReadMore && !isExpanded && '...'}
          </p>
          
          {showReadMore && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:text-blue-800 text-sm mt-2 flex items-center gap-1"
            >
              <Eye className="h-3 w-3" />
              {isExpanded ? 'Ver menos' : 'Leer más'}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
