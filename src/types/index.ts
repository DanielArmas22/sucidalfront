// Tipos principales de la aplicación

export interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'admin'
  faculty?: string
  semester?: number
  createdAt: Date
  isAnonymous?: boolean
}

export interface Post {
  id: string
  authorId: string
  authorName: string
  title: string
  content: string
  category: PostCategory
  isAnonymous: boolean
  createdAt: Date
  updatedAt: Date
  reactions: Reaction[]
  replies: Reply[]
  riskLevel?: RiskLevel
  riskScore?: number
  tags?: string[]
}

export interface Reply {
  id: string
  postId: string
  authorId: string
  authorName: string
  content: string
  isAnonymous: boolean
  createdAt: Date
  reactions: Reaction[]
  riskLevel?: RiskLevel
}

export interface Reaction {
  id: string
  userId: string
  type: ReactionType
  createdAt: Date
}

export interface DiaryEntry {
  id: string
  userId: string
  title: string
  content: string
  mood?: MoodType
  createdAt: Date
  riskLevel?: RiskLevel
  riskScore?: number
  isPrivate: boolean
}

export interface RiskAlert {
  id: string
  userId: string
  userName: string
  userEmail: string
  level: RiskLevel
  score: number
  source: 'post' | 'reply' | 'diary'
  sourceId: string
  content: string
  detectedKeywords: string[]
  createdAt: Date
  status: AlertStatus
  handledBy?: string
  handledAt?: Date
  notes?: string
  interventions: Intervention[]
}

export interface Intervention {
  id: string
  alertId: string
  type: InterventionType
  description: string
  performedBy: string
  performedAt: Date
  followUpDate?: Date
  notes?: string
  status: 'pending' | 'completed' | 'cancelled'
}

export interface MentalHealthResource {
  id: string
  title: string
  description: string
  type: 'article' | 'video' | 'contact' | 'technique'
  url?: string
  content?: string
  tags: string[]
  isEmergency: boolean
}

export interface AnalyticsData {
  totalUsers: number
  activeUsers: number
  totalPosts: number
  totalAlerts: number
  riskDistribution: {
    low: number
    medium: number
    high: number
  }
  trends: {
    date: string
    alerts: number
    posts: number
    users: number
  }[]
  topKeywords: {
    word: string
    count: number
    riskLevel: RiskLevel
  }[]
  facultyStats: {
    faculty: string
    totalStudents: number
    alertsCount: number
    riskLevel: RiskLevel
  }[]
}

// Tipos auxiliares
export type PostCategory = 
  | 'vida-universitaria'
  | 'estres-academico'
  | 'proyectos'
  | 'desahogo'
  | 'consejos'
  | 'general'

export type ReactionType = 
  | 'apoyo'
  | 'comprension'
  | 'fuerza'
  | 'abrazo'

export type MoodType = 
  | 'muy-mal'
  | 'mal'
  | 'neutral'
  | 'bien'
  | 'muy-bien'

export type RiskLevel = 'low' | 'medium' | 'high'

export type AlertStatus = 
  | 'new'
  | 'in-progress'
  | 'resolved'
  | 'false-positive'

export type InterventionType = 
  | 'message'
  | 'meeting'
  | 'referral'
  | 'emergency'
  | 'follow-up'

// Constantes
export const POST_CATEGORIES: { value: PostCategory; label: string; description: string }[] = [
  {
    value: 'vida-universitaria',
    label: 'Vida Universitaria',
    description: 'Experiencias del día a día en la universidad'
  },
  {
    value: 'estres-academico',
    label: 'Estrés Académico',
    description: 'Presión de estudios, exámenes y tareas'
  },
  {
    value: 'proyectos',
    label: 'Proyectos',
    description: 'Dudas y experiencias con proyectos académicos'
  },
  {
    value: 'desahogo',
    label: 'Desahogo',
    description: 'Espacio seguro para expresar emociones'
  },
  {
    value: 'consejos',
    label: 'Consejos',
    description: 'Pedir y compartir consejos útiles'
  },
  {
    value: 'general',
    label: 'General',
    description: 'Temas generales y conversación libre'
  }
]

export const REACTION_TYPES: { value: ReactionType; label: string; emoji: string }[] = [
  { value: 'apoyo', label: 'Te apoyo', emoji: '🤝' },
  { value: 'comprension', label: 'Te comprendo', emoji: '💙' },
  { value: 'fuerza', label: 'Mucha fuerza', emoji: '💪' },
  { value: 'abrazo', label: 'Un abrazo', emoji: '🫂' }
]

export const MOOD_TYPES: { value: MoodType; label: string; color: string }[] = [
  { value: 'muy-mal', label: 'Muy mal', color: 'bg-red-500' },
  { value: 'mal', label: 'Mal', color: 'bg-orange-500' },
  { value: 'neutral', label: 'Neutral', color: 'bg-gray-500' },
  { value: 'bien', label: 'Bien', color: 'bg-blue-500' },
  { value: 'muy-bien', label: 'Muy bien', color: 'bg-green-500' }
]
