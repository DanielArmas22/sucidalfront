import {
  User,
  Post,
  Reply,
  DiaryEntry,
  RiskAlert,
  MentalHealthResource,
  AnalyticsData,
} from "@/types";
import { generateId } from "@/lib/utils";

// Mock data para la aplicación
export const mockUsers: User[] = [
  {
    id: "1",
    email: "ana.garcia@universidad.edu",
    name: "Ana García",
    role: "student",
    faculty: "Ingeniería de Sistemas",
    semester: 6,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    email: "carlos.lopez@universidad.edu",
    name: "Carlos López",
    role: "student",
    faculty: "Ingeniería de Sistemas",
    semester: 8,
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "3",
    email: "admin@universidad.edu",
    name: "Dr. María Rodríguez",
    role: "admin",
    createdAt: new Date("2023-08-01"),
  },
];

export const mockPosts: Post[] = [
  {
    id: "1",
    authorId: "1",
    authorName: "Ana García",
    title: "Estrés por los exámenes finales",
    content:
      "Hola a todos, estoy pasando por un momento muy difícil con los exámenes finales. Siento que no puedo más, he estado estudiando día y noche pero no logro concentrarme. A veces pienso que sería mejor rendirme. ¿Alguien más se siente así?",
    category: "estres-academico",
    isAnonymous: false,
    createdAt: new Date("2024-06-20T10:30:00"),
    updatedAt: new Date("2024-06-20T10:30:00"),
    reactions: [
      {
        id: "1",
        userId: "2",
        type: "comprension",
        createdAt: new Date("2024-06-20T11:00:00"),
      },
      {
        id: "2",
        userId: "3",
        type: "apoyo",
        createdAt: new Date("2024-06-20T11:15:00"),
      },
    ],
    replies: [
      {
        id: "1",
        postId: "1",
        authorId: "2",
        authorName: "Carlos López",
        content:
          "Ana, te entiendo completamente. Yo pasé por algo similar el semestre pasado. Lo importante es no rendirse. ¿Has probado técnicas de relajación?",
        isAnonymous: false,
        createdAt: new Date("2024-06-20T11:30:00"),
        reactions: [
          {
            id: "3",
            userId: "1",
            type: "apoyo",
            createdAt: new Date("2024-06-20T12:00:00"),
          },
        ],
      },
    ],
    riskLevel: "medium",
    riskScore: 0.65,
    tags: ["estrés", "exámenes", "rendirse", "concentración"],
  },
  {
    id: "2",
    authorId: "2",
    authorName: "Usuario Anónimo",
    title: "Proyecto de tesis - Busco compañero",
    content:
      "Estoy buscando un compañero para el proyecto de tesis. Tengo algunas ideas sobre machine learning aplicado a la salud mental. Si alguien está interesado, podemos conversar.",
    category: "proyectos",
    isAnonymous: true,
    createdAt: new Date("2024-06-21T14:20:00"),
    updatedAt: new Date("2024-06-21T14:20:00"),
    reactions: [
      {
        id: "4",
        userId: "1",
        type: "apoyo",
        createdAt: new Date("2024-06-21T15:00:00"),
      },
    ],
    replies: [],
    riskLevel: "low",
    riskScore: 0.15,
  },
  {
    id: "3",
    authorId: "1",
    authorName: "Usuario Anónimo",
    title: "Me siento perdido y sin esperanza",
    content:
      "No sé qué hacer con mi vida. Cada día es más difícil levantarme de la cama. Siento que soy una carga para mi familia y que nada tiene sentido. He pensado en terminar con todo esto. No veo salida a mis problemas.",
    category: "desahogo",
    isAnonymous: true,
    createdAt: new Date("2024-06-22T09:15:00"),
    updatedAt: new Date("2024-06-22T09:15:00"),
    reactions: [
      {
        id: "5",
        userId: "2",
        type: "abrazo",
        createdAt: new Date("2024-06-22T09:30:00"),
      },
      {
        id: "6",
        userId: "3",
        type: "apoyo",
        createdAt: new Date("2024-06-22T09:45:00"),
      },
    ],
    replies: [
      {
        id: "2",
        postId: "3",
        authorId: "2",
        authorName: "Carlos López",
        content:
          "Por favor, no estás solo. Hay personas que te quieren ayudar. Te recomiendo que contactes con el centro de bienestar estudiantil. Tu vida tiene valor.",
        isAnonymous: false,
        createdAt: new Date("2024-06-22T10:00:00"),
        reactions: [
          {
            id: "7",
            userId: "1",
            type: "apoyo",
            createdAt: new Date("2024-06-22T10:15:00"),
          },
        ],
      },
    ],
    riskLevel: "high",
    riskScore: 0.92,
    tags: [
      "perdido",
      "sin esperanza",
      "carga",
      "terminar",
      "sin salida",
      "suicidio",
    ],
  },
];

export const mockDiaryEntries: DiaryEntry[] = [
  {
    id: "1",
    userId: "1",
    title: "Un día difícil",
    content:
      "Hoy fue particularmente difícil. Me desperté sintiéndome vacía y sin energía. Durante las clases no pude concentrarme y constantemente pensaba en lo inútil que soy. Mis padres me llamaron y no pude decirles cómo me siento realmente.",
    mood: "muy-mal",
    createdAt: new Date("2024-06-23T20:30:00"),
    riskLevel: "high",
    riskScore: 0.85,
    isPrivate: true,
  },
  {
    id: "2",
    userId: "2",
    title: "Reflexiones sobre el futuro",
    content:
      "Estuve pensando en qué haré después de graduarme. Aunque a veces me siento abrumado, creo que tengo buenas oportunidades por delante. El proyecto de tesis va bien y mi asesor está contento con mi progreso.",
    mood: "bien",
    createdAt: new Date("2024-06-23T22:15:00"),
    riskLevel: "low",
    riskScore: 0.12,
    isPrivate: true,
  },
];

export const mockRiskAlerts: RiskAlert[] = [
  {
    id: "1",
    userId: "1",
    userName: "Ana García",
    userEmail: "ana.garcia@universidad.edu",
    level: "high",
    score: 0.92,
    source: "post",
    sourceId: "3",
    content:
      "No sé qué hacer con mi vida. Cada día es más difícil levantarme de la cama...",
    detectedKeywords: [
      "perdido",
      "sin esperanza",
      "terminar con todo",
      "sin salida",
    ],
    createdAt: new Date("2024-06-22T09:15:00"),
    status: "new",
    interventions: [],
  },
  {
    id: "2",
    userId: "1",
    userName: "Ana García",
    userEmail: "ana.garcia@universidad.edu",
    level: "high",
    score: 0.85,
    source: "diary",
    sourceId: "1",
    content:
      "Hoy fue particularmente difícil. Me desperté sintiéndome vacía y sin energía...",
    detectedKeywords: ["vacía", "sin energía", "inútil"],
    createdAt: new Date("2024-06-23T20:30:00"),
    status: "new",
    interventions: [],
  },
  {
    id: "3",
    userId: "1",
    userName: "Ana García",
    userEmail: "ana.garcia@universidad.edu",
    level: "medium",
    score: 0.65,
    source: "post",
    sourceId: "1",
    content:
      "Siento que no puedo más, he estado estudiando día y noche pero no logro concentrarme...",
    detectedKeywords: ["no puedo más", "rendirme"],
    createdAt: new Date("2024-06-20T10:30:00"),
    status: "in-progress",
    handledBy: "Dr. María Rodríguez",
    handledAt: new Date("2024-06-20T15:00:00"),
    notes: "Contactada para sesión de apoyo. Mostró buena disposición.",
    interventions: [
      {
        id: "1",
        alertId: "3",
        type: "message",
        description: "Mensaje de apoyo enviado",
        performedBy: "Dr. María Rodríguez",
        performedAt: new Date("2024-06-20T15:00:00"),
        status: "completed",
      },
    ],
  },
];

export const mockResources: MentalHealthResource[] = [
  {
    id: "1",
    title: "Línea de Crisis 24/7",
    description:
      "Línea telefónica disponible las 24 horas para crisis emocionales",
    type: "contact",
    content: "Teléfono: 106\nWhatsApp: +57 300 754 8933",
    tags: ["emergencia", "crisis", "telefono"],
    isEmergency: true,
  },
  {
    id: "2",
    title: "Técnicas de Respiración para la Ansiedad",
    description: "Ejercicios simples de respiración para momentos de estrés",
    type: "technique",
    content: `1. Siéntate cómodamente y cierra los ojos
2. Inhala profundamente por la nariz durante 4 segundos
3. Mantén la respiración por 4 segundos
4. Exhala lentamente por la boca durante 6 segundos
5. Repite 5-10 veces`,
    tags: ["ansiedad", "respiracion", "relajacion"],
    isEmergency: false,
  },
  {
    id: "3",
    title: "Centro de Bienestar Estudiantil",
    description: "Servicios de apoyo psicológico gratuitos para estudiantes",
    type: "contact",
    content:
      "Ubicación: Edificio Administrativo, Piso 3\nHorario: Lunes a Viernes 8:00 AM - 6:00 PM\nTeléfono: (601) 555-0123\nEmail: bienestar@universidad.edu",
    tags: ["apoyo", "psicologia", "gratuito"],
    isEmergency: false,
  },
  {
    id: "4",
    title: "Manejo del Estrés Académico",
    description:
      "Estrategias para manejar la presión académica de manera saludable",
    type: "article",
    url: "https://ejemplo.com/manejo-estres",
    tags: ["estres", "academico", "estrategias"],
    isEmergency: false,
  },
];

export const mockAnalytics: AnalyticsData = {
  totalUsers: 1247,
  activeUsers: 892,
  totalPosts: 3456,
  totalAlerts: 89,
  riskDistribution: {
    low: 45,
    medium: 32,
    high: 12,
  },
  trends: [
    { date: "2024-06-17", alerts: 5, posts: 67, users: 234 },
    { date: "2024-06-18", alerts: 8, posts: 89, users: 267 },
    { date: "2024-06-19", alerts: 12, posts: 92, users: 289 },
    { date: "2024-06-20", alerts: 15, posts: 78, users: 301 },
    { date: "2024-06-21", alerts: 9, posts: 85, users: 298 },
    { date: "2024-06-22", alerts: 18, posts: 94, users: 315 },
    { date: "2024-06-23", alerts: 14, posts: 88, users: 324 },
  ],
  topKeywords: [
    { word: "estrés", count: 45, riskLevel: "medium" },
    { word: "ansiedad", count: 38, riskLevel: "medium" },
    { word: "sin esperanza", count: 12, riskLevel: "high" },
    { word: "depresión", count: 23, riskLevel: "high" },
    { word: "cansancio", count: 34, riskLevel: "low" },
    { word: "exámenes", count: 56, riskLevel: "medium" },
  ],
  facultyStats: [
    {
      faculty: "Ingeniería de Sistemas",
      totalStudents: 345,
      alertsCount: 23,
      riskLevel: "medium",
    },
    {
      faculty: "Ingeniería Industrial",
      totalStudents: 289,
      alertsCount: 18,
      riskLevel: "medium",
    },
    {
      faculty: "Ingeniería Civil",
      totalStudents: 267,
      alertsCount: 12,
      riskLevel: "low",
    },
    {
      faculty: "Ingeniería Electrónica",
      totalStudents: 234,
      alertsCount: 28,
      riskLevel: "high",
    },
  ],
};

// Funciones para simular operaciones de API
export const mockApi = {
  // Autenticación
  login: async (email: string, password: string): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const user = mockUsers.find((u) => u.email === email);
    if (!user) throw new Error("Usuario no encontrado");
    return user;
  },

  // Posts
  getPosts: async (): Promise<Post[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockPosts.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  },

  createPost: async (
    post: Omit<Post, "id" | "createdAt" | "updatedAt" | "reactions" | "replies">
  ): Promise<Post> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newPost: Post = {
      ...post,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      reactions: [],
      replies: [],
    };
    mockPosts.unshift(newPost);
    return newPost;
  },

  // Diary
  getDiaryEntries: async (userId: string): Promise<DiaryEntry[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockDiaryEntries.filter((entry) => entry.userId === userId);
  },

  createDiaryEntry: async (
    entry: Omit<DiaryEntry, "id" | "createdAt">
  ): Promise<DiaryEntry> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const newEntry: DiaryEntry = {
      ...entry,
      id: generateId(),
      createdAt: new Date(),
    };
    mockDiaryEntries.push(newEntry);
    return newEntry;
  },

  // Risk Alerts
  getRiskAlerts: async (): Promise<RiskAlert[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockRiskAlerts.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  },

  updateAlertStatus: async (
    alertId: string,
    status: RiskAlert["status"],
    notes?: string
  ): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const alert = mockRiskAlerts.find((a) => a.id === alertId);
    if (alert) {
      alert.status = status;
      if (notes) alert.notes = notes;
      if (status !== "new") {
        alert.handledBy = "Dr. María Rodríguez";
        alert.handledAt = new Date();
      }
    }
  },

  // Resources
  getResources: async (): Promise<MentalHealthResource[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockResources;
  },

  // Analytics
  getAnalytics: async (): Promise<AnalyticsData> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return mockAnalytics;
  },
};
