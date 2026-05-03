const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
export async function analyzeResume(resumeText, jobDescription) {
  const prompt = `You are an expert career coach and resume analyst. Analyze the following resume against the job description and provide:
1. MATCH SCORE: Give a score out of 100
2. MISSING SKILLS: List top 5 missing skills or keywords
3. IMPROVED BULLETS: Rewrite 3 resume bullet points to better match the JD
4. INTERVIEW QUESTIONS: Generate 10 likely interview questions with ideal answers
Resume:
${resumeText}
Job Description:
${jobDescription}
Respond in this exact JSON format:
{
  "matchScore": 75,
  "missingSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "improvedBullets": [
    {"original": "old bullet", "improved": "new bullet"},
    {"original": "old bullet", "improved": "new bullet"},
    {"original": "old bullet", "improved": "new bullet"}
  ],
  "interviewQuestions": [
    {"question": "Q1?", "answer": "A1"},
    {"question": "Q2?", "answer": "A2"},
    {"question": "Q3?", "answer": "A3"},
    {"question": "Q4?", "answer": "A4"},
    {"question": "Q5?", "answer": "A5"},
    {"question": "Q6?", "answer": "A6"},
    {"question": "Q7?", "answer": "A7"},
    {"question": "Q8?", "answer": "A8"},
    {"question": "Q9?", "answer": "A9"},
    {"question": "Q10?", "answer": "A10"}
  ]
}`;
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 4000
    })
  });
  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`);
  }
  const data = await response.json();
  const content = data.choices[0].message.content;
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid response format');
  const parsed = JSON.parse(jsonMatch[0]);

  return {
    matchScore: parsed.matchScore,
    missingSkills: (parsed.missingSkills || []).map(skill => ({
      keyword: skill,
      reason: 'This skill is mentioned in the job description but not found in your resume.'
    })),
    rewrittenBullets: (parsed.improvedBullets || []).map(bullet => ({
      originalContext: bullet.original,
      rewritten: bullet.improved
    })),
    interviewQuestions: parsed.interviewQuestions || []
  };
}