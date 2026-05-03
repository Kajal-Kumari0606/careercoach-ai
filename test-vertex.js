const apiKey = 'AIzaSyAhO42JFhZ-IIPqy6yTnOLvPXoPx1Q2xAw';
const projectId = 'careercoach-project';
const location = 'us-central1';
const model = 'gemini-2.0-flash';

const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:generateContent?key=${apiKey}`;

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    contents: [{ parts: [{ text: "Hello" }] }],
  })
}).then(res => res.json()).then(data => console.log(data)).catch(err => console.error(err));
