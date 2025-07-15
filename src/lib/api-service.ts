// API service for communicating with the backend
const API_BASE_URL = process.env.BACKEND_API_URL || "http://localhost:8000";

export interface UserMessage {
  id: string;
  user_id: string;
  user_name: string;
  content: string;
  timestamp: string;
  type: string;
  category?: string;
}

export interface PredictionResult {
  message_id: string;
  original_text: string;
  translated_text: string;
  prediction: string;
  confidence: number;
  suicidal_probability: number;
  non_suicidal_probability: number;
  risk_level: string;
  analysis: {
    indicators_found: string[];
    indicator_count: number;
    first_person_count: number;
    text_length: number;
    word_count: number;
  };
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  loading: boolean;
}

// Mock data for testing
const mockMessages: UserMessage[] = [
  {
    id: "1",
    user_id: "user_1",
    user_name: "Ana García",
    content:
      "Hoy fue un mejor día. Hablé con mi familia y me siento un poco mejor.",
    timestamp: "2025-01-17T10:45:00Z",
    type: "diary",
    category: "personal",
  },
  {
    id: "2",
    user_id: "user_2",
    user_name: "Carlos Mendoza",
    content:
      "Me duele todo el cuerpo y no puedo dormir. Creo que necesito ayuda profesional.",
    timestamp: "2025-01-17T09:30:00Z",
    type: "post",
    category: "salud",
  },
  {
    id: "3",
    user_id: "user_3",
    user_name: "María López",
    content:
      "Estoy muy estresada con los exámenes finales. Siento que no voy a poder con todo.",
    timestamp: "2025-01-16T15:20:00Z",
    type: "diary",
    category: "academico",
  },
  {
    id: "4",
    user_id: "user_4",
    user_name: "Pedro Jiménez",
    content:
      "No encuentro motivación para nada. Todo me parece sin sentido y no tengo ganas de hacer nada.",
    timestamp: "2025-01-16T08:15:00Z",
    type: "post",
    category: "emocional",
  },
  {
    id: "5",
    user_id: "user_1",
    user_name: "Ana García",
    content:
      "Tuve una sesión con mi psicólogo hoy. Estamos trabajando en estrategias de afrontamiento.",
    timestamp: "2025-01-15T14:00:00Z",
    type: "diary",
    category: "tratamiento",
  },
  {
    id: "6",
    user_id: "user_5",
    user_name: "Laura Ruiz",
    content:
      "Me siento completamente abrumada. No sé cómo seguir adelante con mi vida.",
    timestamp: "2025-01-15T11:30:00Z",
    type: "post",
    category: "crisis",
  },
  {
    id: "7",
    user_id: "user_6",
    user_name: "Diego Torres",
    content:
      "Hoy conseguí levantarme temprano y hacer ejercicio. Pequeños pasos pero importantes.",
    timestamp: "2025-01-14T07:45:00Z",
    type: "diary",
    category: "progreso",
  },
];

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  // Health check
  async healthCheck() {
    return this.request<{
      status: string;
      model_loaded: boolean;
      device: string;
      timestamp: string;
    }>("/health");
  }

  // Get all user messages
  async getAllMessages() {
    // For development, return mock data
    if (process.env.NODE_ENV === "development") {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      return {
        messages: mockMessages,
        total: mockMessages.length,
        users_count: new Set(mockMessages.map((m) => m.user_id)).size,
      };
    }

    return this.request<{
      messages: UserMessage[];
      total: number;
      users_count: number;
    }>("/users/messages");
  }

  // Get messages for specific user
  async getUserMessages(userId: string) {
    return this.request<{
      messages: UserMessage[];
      total: number;
      user_name: string;
    }>(`/users/${userId}/messages`);
  }

  // Predict message risk
  async predictMessage(messageId: string, text: string) {
    // For development, return mock prediction

    return this.request<PredictionResult>("/predict/detailed", {
      method: "POST",
      body: JSON.stringify({
        message_id: messageId,
        text: text,
      }),
    });
  }

  // Basic text prediction
  async predictText(text: string) {
    return this.request<{
      prediction: string;
      confidence: number;
      suicidal_probability: number;
      non_suicidal_probability: number;
      processed_text: string;
      risk_level: string;
    }>("/predict/detailed", {
      method: "POST",
      body: JSON.stringify({
        text: text,
      }),
    });
  }

  // Detailed prediction
  async predictTextDetailed(text: string) {
    return this.request<{
      prediction: string;
      confidence: number;
      suicidal_probability: number;
      non_suicidal_probability: number;
      processed_text: string;
      risk_level: string;
      analysis: object;
    }>("/predict/detailed", {
      method: "POST",
      body: JSON.stringify({
        text: text,
      }),
    });
  }
}

export const apiService = new ApiService();
export default apiService;
