# CareerCoach AI

An AI-powered resume and interview preparation tool built with React, Vite, Tailwind CSS, Google Gemini 2.0 Flash API, and Firebase.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root of the project with the following variables:
   ```env
   VITE_GEMINI_API_KEY="your_gemini_api_key_here"

   # Optional: Firebase config if you want to save sessions
   VITE_FIREBASE_API_KEY="your_firebase_api_key"
   VITE_FIREBASE_AUTH_DOMAIN="your_firebase_auth_domain"
   VITE_FIREBASE_PROJECT_ID="your_firebase_project_id"
   VITE_FIREBASE_STORAGE_BUCKET="your_firebase_storage_bucket"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your_firebase_messaging_sender_id"
   VITE_FIREBASE_APP_ID="your_firebase_app_id"
   ```

3. **Get a Gemini API Key**
   - Go to Google AI Studio (https://aistudio.google.com/)
   - Create a new API key.
   - Paste the key in your `.env` file.

4. **Run Locally**
   ```bash
   npm run dev
   ```

## Features
- **Resume Upload**: Extract text from PDF files entirely on the client side using pdfjs-dist.
- **Job Description Analysis**: Compare the parsed resume text against a Job Description.
- **Gemini Integration**: Get Match Score, Missing Skills, Rewritten Bullets, and likely Interview Questions using the Gemini 2.0 Flash API.
- **Save Sessions**: Stores analysis history in Firebase Firestore.
