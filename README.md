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


## Screenshots

<img width="2234" height="1278" alt="image" src="https://github.com/user-attachments/assets/e21ba7f1-bba5-4a52-aca1-ab6589e0f05c" />

<img width="2132" height="1248" alt="image" src="https://github.com/user-attachments/assets/9041b38b-8811-4d84-a28a-85c0540f9524" />

<img width="2120" height="1234" alt="image" src="https://github.com/user-attachments/assets/d248191c-09c4-4142-a0bc-9aeae6108de5" />

<img width="2102" height="1258" alt="image" src="https://github.com/user-attachments/assets/ffbfba9c-ffc6-48cc-a879-e51f37046e2a" />

<img width="1904" height="1262" alt="image" src="https://github.com/user-attachments/assets/1570bbff-e492-4337-ad11-49c80cf39014" />



## Live Demo

Live Link: https://careercoach-ai-8bec0.web.app/


## GitHub Repository

GitHub: https://github.com/Kajal-Kumari0606/careercoach-ai
