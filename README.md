# BuildBrief 🚀

AI-Driven Software Specification Generator.
Turn vague ideas into production-ready specs.

## Prerequisites
- Node.js (v18+)
- Gemini API Key

## Setup

1. **Server**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env and add your GEMINI_API_KEY
   npm run build # or just npx ts-node src/index.ts
   ```

2. **Client**
   ```bash
   cd client
   npm install
   npm run dev
   ```

## Development
- Server runs on `http://localhost:3000`
- Client runs on `http://localhost:5173` (proxies /api to 3000)

## Tech Stack
- React + Vite + TypeScript
- Node.js + Express
- Google Gemini API (flash-exp)
