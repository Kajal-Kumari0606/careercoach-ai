import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: 'AIzaSyAhO42JFhZ-IIPqy6yTnOLvPXoPx1Q2xAw',
  vertexai: {
    project: 'careercoach-project',
    location: 'us-central1'
  }
});

async function main() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: 'Hello'
    });
    console.log(response.text);
  } catch(e) {
    console.error(e);
  }
}
main();
