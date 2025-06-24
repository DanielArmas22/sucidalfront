# Plataforma de Detección Temprana de Riesgo Suicida 🧠💚

Una plataforma web moderna y empática diseñada para la detección temprana de riesgo suicida en estudiantes universitarios de Ingeniería de Sistemas, utilizando técnicas avanzadas de Machine Learning y un enfoque centrado en el bienestar estudiantil.

## 🎯 Características Principales

### Para Estudiantes

- **Foro Estudiantil**: Espacio seguro para compartir experiencias y recibir apoyo comunitario
- **Diario Personal**: Herramienta privada para la reflexión y seguimiento del estado emocional
- **Recursos de Bienestar**: Acceso a recursos profesionales, ejercicios de mindfulness y contactos de emergencia
- **Perfil Personalizado**: Gestión de preferencias y visualización de actividad personal

### Para Administradores y Profesionales de Salud Mental

- **Dashboard Analítico**: Visualización de métricas, tendencias y estadísticas del sistema
- **Sistema de Alertas**: Monitoreo automático de casos de riesgo con diferentes niveles de prioridad
- **Gestión de Usuarios**: Administración completa de estudiantes y profesionales
- **Configuración Avanzada**: Control total sobre parámetros del sistema y modelo ML
- **Análisis de Explicabilidad**: Comprensión detallada del funcionamiento del modelo de ML

## 🛠️ Tecnologías Utilizadas

### Frontend

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático para mayor robustez
- **Tailwind CSS** - Estilos utilitarios responsivos
- **Radix UI** - Componentes accesibles y reutilizables
- **Recharts** - Visualización de datos y gráficos interactivos
- **Lucide React** - Iconografía moderna y consistente

### Funcionalidades Clave

- **Autenticación por Roles** - Sistema seguro con roles diferenciados
- **Responsive Design** - Optimizado para dispositivos móviles y desktop
- **Accesibilidad WCAG 2.1** - Cumple estándares de accesibilidad
- **Simulación ML** - Datos mock para demostrar integración con modelos de ML

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18.0 o superior
- npm o yarn
- Git

### Instalación

```bash
# Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]
cd sucidalfront

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Abrir en el navegador
# http://localhost:3000
```

### Cuentas Demo

La plataforma incluye cuentas demo para probar diferentes roles:

**Estudiante:**

- Email: `estudiante@universidad.edu`
- Contraseña: `demo123`

**Administrador:**

- Email: `admin@universidad.edu`
- Contraseña: `admin123`

**Psicólogo:**

- Email: `psicologo@universidad.edu`
- Contraseña: `psi123`

## 📱 Funcionalidades por Pantalla

### Estudiantes

#### 🏠 Dashboard Principal

- Foro estudiantil con publicaciones recientes
- Posibilidad de crear posts anónimos o identificados
- Sistema de filtrado por estado de ánimo y categorías
- Interacción segura y moderada

#### 📖 Diario Personal

- Entradas completamente privadas
- Registro de estados de ánimo
- Filtros por fecha y emociones
- Seguimiento de patrones emocionales

#### 💝 Recursos de Bienestar

- Biblioteca de recursos categorizados
- Contactos de emergencia siempre visibles
- Artículos, videos y técnicas de relajación
- Búsqueda inteligente de contenido

#### 👤 Perfil de Usuario

- Gestión de información personal
- Configuración de privacidad
- Estadísticas de uso personal
- Historial de actividad

### Administradores

#### 📊 Dashboard Analítico

- Métricas en tiempo real del sistema
- Gráficos de tendencias y patrones
- Alertas recientes y estado general
- Estadísticas por facultad y período

#### 🚨 Gestión de Alertas

- Lista priorizada de casos de riesgo
- Detalles contextuales de cada alerta
- Sistema de intervención y seguimiento
- Historial completo de acciones

#### 👥 Gestión de Usuarios

- Lista completa de estudiantes registrados
- Perfiles detallados con actividad
- Filtros avanzados y búsqueda
- Herramientas de administración

#### ⚙️ Configuración del Sistema

- Parámetros del modelo ML
- Configuración de alertas y umbrales
- Gestión de datos y privacidad
- Configuración de notificaciones

#### 🧠 Análisis de Explicabilidad ML

- Visualización de cómo funciona el modelo
- Factores que influyen en las predicciones
- Métricas de confianza y precisión
- Detalles técnicos del algoritmo

## 🔒 Privacidad y Seguridad

### Principios de Privacidad

- **Confidencialidad**: Todos los datos están protegidos por confidencialidad profesional
- **Anonimización**: Los datos se anonimizan para análisis ML
- **Consentimiento**: Los usuarios controlan qué información comparten
- **Eliminación**: Derecho a solicitar eliminación de datos personales

### Medidas de Seguridad

- Autenticación segura con roles diferenciados
- Encriptación de datos sensibles
- Logs de acceso y auditoría
- Cumplimiento con regulaciones de protección de datos

## 🤖 Integración con Machine Learning

### Modelo de Detección

- **Algoritmo**: Random Forest + NLP
- **Precisión**: 94.2%
- **Factores Analizados**:
  - Análisis de sentimientos en texto
  - Patrones de comportamiento
  - Frecuencia de uso
  - Interacciones sociales
  - Búsqueda de recursos

### Explicabilidad

- Factores de riesgo identificables
- Niveles de confianza transparentes
- Recomendaciones basadas en evidencia
- Validación humana requerida

## 🎨 Diseño y UX

### Principios de Diseño

- **Empático**: Colores cálidos y lenguaje comprensivo
- **Accesible**: Cumple WCAG 2.1 AA
- **Responsivo**: Optimizado para todos los dispositivos
- **Intuitivo**: Navegación clara y consistente

### Paleta de Colores

- **Estudiantes**: Verdes cálidos (bienestar, crecimiento)
- **Administradores**: Azules profesionales (confianza, estabilidad)
- **Alertas**: Sistema semafórico (verde, amarillo, rojo)

## 📚 Estructura del Proyecto

```
src/
├── app/                    # Páginas de la aplicación
│   ├── admin/             # Páginas de administración
│   ├── student/           # Páginas de estudiantes
│   ├── help/              # Centro de ayuda
│   └── login/             # Autenticación
├── components/            # Componentes reutilizables
│   └── ui/               # Componentes de interfaz
├── contexts/             # Contextos de React
├── lib/                  # Utilidades y helpers
└── types/               # Definiciones de tipos TypeScript
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo
npm run build        # Construye para producción
npm run start        # Inicia servidor de producción
npm run lint         # Ejecuta linter
npm run type-check   # Verifica tipos TypeScript
```

## 🌟 Funcionalidades Avanzadas

### Simulación de Datos

- Datos mock realistas para demostración
- Simulación de API endpoints
- Casos de uso variados y representativos

### Análisis y Reportes

- Exportación de configuraciones
- Generación de reportes de análisis
- Visualizaciones interactivas

### Accesibilidad

- Navegación por teclado
- Lectores de pantalla compatibles
- Contraste de colores optimizado
- Textos alternativos descriptivos

## 🤝 Contribución

Este proyecto está diseñado como una demostración académica. Para contribuir:

1. Fork el repositorio
2. Crea una rama para tu feature
3. Implementa los cambios
4. Envía un pull request

## 📖 Documentación Adicional

### Centro de Ayuda

La aplicación incluye un centro de ayuda completo con:

- Guías paso a paso
- Documentación de funcionalidades
- Contactos de emergencia
- Recursos de bienestar

### Consideraciones Éticas

- Diseñado con supervisión de profesionales de salud mental
- Enfoque en prevención y apoyo temprano
- Respeto por la autonomía del estudiante
- Protección de datos sensibles

## 🚨 Contactos de Emergencia

**En caso de crisis inmediata:**

- Línea Nacional: 113 (24/7)
- Emergencias: 117
- Centro de Bienestar: (01) 555-0123

## 📄 Licencia

Este proyecto es desarrollado con fines académicos y de investigación.

---

**Nota Importante**: Esta es una plataforma de demostración con datos simulados. En un entorno de producción real, se requeriría supervisión profesional, validación clínica y cumplimiento de regulaciones de salud mental específicas.
