# Organización del Proyecto Homi Connect

## 📋 Descripción General

**Homi Connect** es una aplicación web de conexión y emparejamiento (matching) construida con tecnologías modernas de React. Es una plataforma tipo "dating app" que permite a los usuarios crear perfiles, hacer matching con otros usuarios mediante swipes, chatear y gestionar suscripciones premium.

## 🏗️ Arquitectura Tecnológica

### Stack Principal
- **Frontend Framework**: React 18.3.1 con TypeScript
- **Build Tool**: Vite 5.4.1
- **Routing**: React Router DOM v6.26.2
- **UI Components**: Shadcn-ui con Radix UI
- **Styling**: Tailwind CSS 3.4.11
- **Backend/Database**: Supabase (BaaS - Backend as a Service)
- **State Management**: TanStack Query (React Query) v5.56.2
- **Forms**: React Hook Form con Zod validation

## 📁 Estructura de Directorios

```
homi-connect-30/
│
├── public/                      # Archivos estáticos públicos
│   ├── lovable-uploads/        # Imágenes subidas por usuarios
│   ├── favicon.ico             # Icono de la aplicación
│   ├── og-image.png            # Imagen para compartir en redes sociales
│   └── _redirects              # Configuración de redirecciones (Netlify/hosting)
│
├── src/                         # Código fuente de la aplicación
│   ├── components/             # Componentes React reutilizables
│   │   ├── admin/             # Componentes de administración
│   │   ├── auth/              # Componentes de autenticación
│   │   ├── chat/              # Componentes de mensajería/chat
│   │   ├── home/              # Componentes de la página principal
│   │   ├── layout/            # Componentes de layout (header, footer, etc.)
│   │   ├── matching/          # Componentes para sistema de swipes y matches
│   │   ├── profiles/          # Componentes de perfiles de usuario
│   │   └── ui/                # Componentes UI base (botones, cards, inputs, etc.)
│   │
│   ├── pages/                  # Páginas/Rutas de la aplicación
│   │   ├── Index.tsx          # Página principal/landing
│   │   ├── RegisterPage.tsx   # Registro de usuarios
│   │   ├── SignInPage.tsx     # Inicio de sesión
│   │   ├── MatchingPage.tsx   # Página de swipes/matching
│   │   ├── ChatPage.tsx       # Página de mensajes
│   │   ├── PricingPage.tsx    # Planes de precios
│   │   ├── SubscriptionPage.tsx # Gestión de suscripciones
│   │   ├── ProfilePage.tsx    # Vista de perfil
│   │   ├── AdminPage.tsx      # Panel de administración
│   │   └── ...                # Otras páginas (términos, privacidad, etc.)
│   │
│   ├── context/                # Context API de React
│   │   └── AuthContext.tsx    # Contexto de autenticación global
│   │
│   ├── hooks/                  # Custom React Hooks
│   │   ├── use-profiles.ts    # Hook para gestionar perfiles
│   │   ├── use-matches.ts     # Hook para gestionar matches
│   │   ├── use-messages.ts    # Hook para mensajería
│   │   ├── use-swipes.ts      # Hook para sistema de swipes
│   │   ├── useAuthLogic.ts    # Lógica de autenticación
│   │   ├── useSubscription.ts # Gestión de suscripciones
│   │   └── ...                # Otros hooks utilitarios
│   │
│   ├── integrations/           # Integraciones con servicios externos
│   │   └── supabase/          # Configuración de Supabase
│   │       ├── client.ts      # Cliente de Supabase
│   │       └── types.ts       # Tipos TypeScript para base de datos
│   │
│   ├── lib/                    # Utilidades y funciones helper
│   │   └── utils.ts           # Funciones utilitarias generales
│   │
│   ├── App.tsx                 # Componente raíz con rutas
│   ├── main.tsx               # Punto de entrada de la aplicación
│   └── index.css              # Estilos globales
│
├── supabase/                   # Configuración de Supabase
│   ├── migrations/            # Migraciones de base de datos
│   ├── functions/             # Edge Functions de Supabase
│   └── config.toml            # Configuración de Supabase
│
├── package.json                # Dependencias y scripts NPM
├── vite.config.ts             # Configuración de Vite
├── tailwind.config.ts         # Configuración de Tailwind CSS
├── tsconfig.json              # Configuración de TypeScript
├── eslint.config.js           # Configuración de ESLint
└── README.md                  # Documentación principal del proyecto
```

## 🎯 Componentes Principales

### 1. **Autenticación** (`src/components/auth/`)
- `AuthButton.tsx`: Botón de autenticación
- `ProtectedRoute.tsx`: Rutas protegidas que requieren autenticación
- `ProfileAuthGate.tsx`: Gate para verificar perfiles completos

### 2. **Sistema de Matching** (`src/components/matching/`)
- `SwipeCard.tsx`: Tarjeta individual para swipe
- `SwipeInterface.tsx`: Interfaz principal de swipes
- `MatchCard.tsx`: Tarjeta de match confirmado
- `MatchesList.tsx`: Lista de todos los matches
- `MatchingFilters.tsx`: Filtros de búsqueda

### 3. **Perfiles** (`src/components/profiles/`)
- `ProfilePage.tsx`: Vista del perfil de usuario
- `ProfileEditPage.tsx`: Edición de perfil

### 4. **Chat** (`src/components/chat/`)
- Componentes para el sistema de mensajería entre matches

### 5. **Administración** (`src/components/admin/`)
- `ProfilesTable.tsx`: Tabla administrativa de perfiles

### 6. **UI Base** (`src/components/ui/`)
- Componentes reutilizables basados en Shadcn-ui:
  - `button`, `card`, `input`, `select`, `dialog`, etc.
  - Componentes personalizados como `PremiumBadge`, `CompatibilityBadge`

## 🔌 Integraciones y Servicios

### Supabase
El proyecto utiliza Supabase como backend, proporcionando:
- **Autenticación**: Sistema completo de auth (email/password, recuperación, etc.)
- **Base de datos**: PostgreSQL para almacenar perfiles, matches, mensajes
- **Storage**: Almacenamiento de imágenes de perfil
- **Realtime**: Funcionalidad en tiempo real para chat

### TanStack Query (React Query)
Gestiona el estado del servidor y cacheo de datos:
- Queries para obtener datos (perfiles, matches, mensajes)
- Mutations para modificar datos
- Invalidación automática de cache

## 🎨 Sistema de Diseño

### Tailwind CSS
Configuración personalizada con:
- **Colores de marca**: Paleta púrpura (`homi-purple`, `homi-lightPurple`)
- **Animaciones custom**: swipe-left, swipe-right, float, fade-in
- **Fuentes**: Poppins e Inter
- **Modo oscuro**: Soporte mediante clase "dark"

### Componentes Shadcn-ui
Biblioteca de componentes accesibles y personalizables basada en Radix UI.

## 🚀 Scripts Disponibles

```json
{
  "dev": "vite",              // Servidor de desarrollo
  "build": "vite build",      // Build de producción
  "build:dev": "vite build --mode development", // Build de desarrollo
  "lint": "eslint .",         // Linting del código
  "preview": "vite preview"   // Preview del build
}
```

## 📦 Flujo de Datos

1. **Usuario accede a la app** → `main.tsx` inicia React
2. **App.tsx** configura:
   - QueryClientProvider (React Query)
   - AuthProvider (Context de autenticación)
   - BrowserRouter (Rutas)
3. **Navegación** → React Router carga la página correspondiente
4. **Componentes** usan hooks personalizados para:
   - Obtener datos de Supabase vía React Query
   - Gestionar estado local
   - Realizar mutaciones
5. **Updates en tiempo real** → Supabase realtime actualiza el UI

## 🔐 Seguridad y Autenticación

- **AuthContext**: Provee el estado de autenticación globalmente
- **ProtectedRoute**: Protege rutas que requieren login
- **Supabase Auth**: Maneja sesiones, tokens JWT, y refresh tokens
- **Row Level Security (RLS)**: En Supabase para proteger datos

## 🎭 Características Principales

1. **Registro/Login**: Sistema completo de autenticación
2. **Perfiles**: Creación y edición de perfiles con fotos
3. **Swipe System**: Matching estilo Tinder (like/pass)
4. **Matches**: Lista de matches confirmados
5. **Chat**: Mensajería en tiempo real
6. **Suscripciones**: Sistema de planes premium
7. **Admin Panel**: Gestión administrativa de usuarios
8. **Responsive**: Diseño adaptable a móviles y desktop

## 🌐 Despliegue

El proyecto está configurado para desplegarse en:
- **Lovable.dev**: Plataforma principal de desarrollo y despliegue
- **Netlify**: Mediante configuración en `public/_redirects`

## 🔧 Configuración de Desarrollo

1. **Clonar repositorio**
```bash
git clone <YOUR_GIT_URL>
cd homi-connect-30
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
- Crear archivo `.env` con credenciales de Supabase

4. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

El servidor correrá en `http://localhost:8080`

## 📝 Convenciones de Código

- **TypeScript**: Todo el código está tipado
- **Componentes**: PascalCase (ej: `MatchingPage.tsx`)
- **Hooks**: camelCase con prefijo "use" (ej: `useProfiles.ts`)
- **Archivos de utilidad**: kebab-case (ej: `use-matches.ts`)
- **Alias de importación**: `@/` apunta a `./src/`

## 🧩 Patrones de Diseño Utilizados

1. **Container/Presentational**: Separación de lógica y presentación
2. **Custom Hooks**: Reutilización de lógica de estado
3. **Context API**: Estado global de autenticación
4. **Composition**: Composición de componentes pequeños y reutilizables
5. **Server State Management**: React Query para datos del servidor

---

**Última actualización**: Noviembre 2025
**Versión**: 0.0.0
**Licencia**: Privado
