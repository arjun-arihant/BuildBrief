# BuildBrief 🚀

**From Vague Idea to Production-Ready Spec.**

BuildBrief is an interactive AI-driven architect that helps you define your next software project. It acts as a Senior Technical Product Manager, guiding you through a structured interview process to generate a comprehensive "Mega-Prompt" specification that you can hand off to AI coding agents (like Cursor, Windsurf, or Bolt) to build the actual app.

## ✨ Features

-   **Interactive Architecture Interview**: A guided 10-step process to define your app's core requirements.
-   **Cosmos UI**: A stunning, glassmorphic dark-mode interface designed for deep focus.
-   **Educational First**: Explains technical concepts (databases, APIs, auth) in simple terms before asking you to make decisions.
-   **Gemini-Powered**: Uses Google's Gemini 3 Flash model for fast, intelligent context-aware reasoning.
-   **Mega-Prompt Generation**: Outputs a detailed, multi-page technical specification covering User Stories, Schema, API, and Tech Stack.
-   **Visual Progress**: Tracks your journey from idea to spec with animated constellations.

## 🛠️ Tech Stack

**Client**
-   React 18 + Vite
-   TypeScript
-   Framer Motion (Animations)
-   Lucide React (Icons)
-   React Markdown

**Server**
-   Node.js + Express
-   Google Gemini API (`gemini-3-flash-preview`)
-   TypeScript

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   A [Google Gemini API Key](https://aistudio.google.com/)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/buildbrief.git
    cd buildbrief
    ```

2.  **Setup Server**
    ```bash
    cd server
    npm install
    cp .env.example .env
    ```
    *Edit `.env` and paste your `GEMINI_API_KEY`.*

3.  **Setup Client**
    ```bash
    cd ../client
    npm install
    ```

### Running the App

1.  **Start the Server** (Terminal 1)
    ```bash
    cd server
    npm run dev
    ```
    *Server runs on `http://localhost:3000`*

2.  **Start the Client** (Terminal 2)
    ```bash
    cd client
    npm run dev
    ```
    *Client runs on `http://localhost:5173`*

3.  Open `http://localhost:5173` in your browser.

## 📖 Usage

1.  Enter your app idea (e.g., "A Tinder for adopting rescue dogs").
2.  Answer the architectural questions posed by the AI.
3.  Review the educational definitions if you are unsure.
4.  At the end (Step 10), receive your **Implementation Plan / Mega-Prompt**.
5.  Copy the prompt and give it to your favorite AI coder!

## 📄 License

MIT
