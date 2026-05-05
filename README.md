# CareerCoach AI

An AI-powered resume and interview preparation tool built with React, Vite, Tailwind CSS, Groq LLaMA API, and Firebase.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root of the project with the following variables:
   ```env
   Groq_LLaMA_API_KEY="your_groq_llama_api_key_here"

   # Optional: Firebase config if you want to save sessions
   VITE_FIREBASE_API_KEY="your_firebase_api_key"
   VITE_FIREBASE_AUTH_DOMAIN="your_firebase_auth_domain"
   VITE_FIREBASE_PROJECT_ID="your_firebase_project_id"
   VITE_FIREBASE_STORAGE_BUCKET="your_firebase_storage_bucket"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your_firebase_messaging_sender_id"
   VITE_FIREBASE_APP_ID="your_firebase_app_id"
   ```

3. **Get a Groq LLaMA API Key**
   - Go to Groq Console (https://console.groq.com/)
   - Sign in and go to API Keys section
   - Click "Create API Key", give it a name
   - Copy and paste the key in your .env file as VITE_GROQ_API_KEY
     
4. **Run Locally**
   ```bash
   npm run dev
   ```

## Features
- **Resume Upload**: Extract text from PDF files entirely on the client side using pdfjs-dist.
- **Job Description Analysis**: Compare the parsed resume text against a Job Description.
- **Gemini Integration**: Get Match Score, Missing Skills, Rewritten Bullets, and likely Interview Questions using the Groq LLaMA API.
- **Save Sessions**: Stores analysis history in Firebase Firestore.
