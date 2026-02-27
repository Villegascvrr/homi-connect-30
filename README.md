🏠 HOMIMATCH – Compatibility-Based Flatmate Matching Platform

HOMIMATCH is a web platform designed to help people find compatible flatmates through structured lifestyle-based matching instead of traditional room listings.

The platform focuses on reducing shared-housing conflicts by evaluating compatibility before move-in.

✨ Key Features

🧠 Compatibility Questionnaire – Lifestyle-based structured onboarding
📊 Matching Algorithm – Weighted compatibility scoring system
👤 User Profiles – Detailed preferences & living expectations
🔎 Advanced Filtering – Search by city, lifestyle, and housing criteria
💬 Contact Initiation – Direct communication between compatible users
📋 Personal Dashboard – Manage matches, preferences, and activity

🛠️ Tech Stack

Frontend: React 18 / Next.js
Language: TypeScript
Styling: Tailwind CSS
UI Components: shadcn/ui, Lucide Icons
Backend / BaaS: Supabase (PostgreSQL, Auth, Realtime)
State Management: React Context API / Zustand
Routing: React Router DOM / Next Router
Deployment: Vercel / Netlify

🚀 Getting Started (Development)
Prerequisites

Node.js v18+
npm or pnpm

Clone the repository
git clone https://github.com/<your-username>/homimatch-web.git
cd homimatch-web
Install dependencies
npm install
Environment Variables

Create a .env file in the root directory:

VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
DATABASE_URL=
JWT_SECRET=
Start the development server
npm run dev

Open:

http://localhost:5173
🏗️ Project Structure
/src
├── components/        # Reusable UI components
│   ├── layout/        # App shell (Sidebar, Header)
│   ├── matching/      # Compatibility logic components
│   └── ui/            # UI primitives
├── pages/             # Main route views
├── contexts/          # Global state & authentication
├── hooks/             # Custom hooks
├── services/          # API & Supabase client
├── utils/             # Helper functions
└── types/             # TypeScript interfaces
📄 Available Scripts
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
