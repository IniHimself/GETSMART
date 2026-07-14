import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export async function generateCourseTopics(courseCode: string, courseTitle: string, _university: string = 'Nigerian University') {
  const prompt = `You are a curriculum expert for Nigerian universities like Redeemer's University and Vision University.
  
Generate a comprehensive list of topics for the course "${courseCode}: ${courseTitle}" following standard Nigerian university curriculum.

Return ONLY a JSON object in this exact format:
{
  "courseCode": "${courseCode}",
  "courseTitle": "${courseTitle}",
  "topics": [
    {
      "id": 1,
      "name": "Topic Name",
      "description": "Brief description of what this topic covers"
    }
  ]
}

Generate 8-15 topics that cover the full course content. Topics should be ordered from foundational to advanced concepts. Use Nigerian university academic standards.`;

  const result = await geminiModel.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    throw new Error('Failed to parse AI response');
  }
  throw new Error('No valid response from AI');
}

export async function generateTopicContent(topic: string, courseCode: string, courseTitle: string) {
  const prompt = `You are a Nigerian university professor teaching "${courseCode}: ${courseTitle}".
  
Generate comprehensive study content for the topic: "${topic}"

Return ONLY a JSON object in this exact format:
{
  "topic": "${topic}",
  "content": {
    "overview": "A 2-3 paragraph overview of this topic",
    "keyConcepts": ["concept1", "concept2", "concept3"],
    "keyTerms": {
      "term1": "definition of term1",
      "term2": "definition of term2"
    },
    "formulas": ["formula1 if applicable", "formula2 if applicable"],
    "examples": ["practical example 1", "practical example 2"],
    "commonMistakes": ["common mistake 1", "common mistake 2"],
    "examTips": ["tip 1 for exam preparation", "tip 2 for exam preparation"]
  },
  "subtopics": [
    {
      "id": 1,
      "name": "Subtopic Name",
      "summary": "Brief summary of this subtopic"
    }
  ]
}

Make the content thorough and exam-focused. Use Nigerian university academic standards (e.g. Redeemer's University, Vision University). Include relevant formulas, definitions, and practical examples.`;

  const result = await geminiModel.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    throw new Error('Failed to parse AI response');
  }
  throw new Error('No valid response from AI');
}

export async function generateQuizQuestion(topic: string, course: string, difficulty: 'easy' | 'medium' | 'hard' = 'medium') {
  const prompt = `You are a Nigerian university exam question generator. Generate a ${difficulty} level multiple choice question for the course "${course}" on the topic "${topic}". Follow Nigerian university exam standards (e.g. Redeemer's University, Vision University). 

Return ONLY a JSON object in this exact format:
{
  "question": "The question text here?",
  "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
  "correctAnswer": "A",
  "explanation": "Brief explanation of the correct answer",
  "topic": "${topic}",
  "difficulty": "${difficulty}"
}`;

  const result = await geminiModel.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    throw new Error('Failed to parse AI response');
  }
  throw new Error('No valid response from AI');
}

export async function generateFlashcards(topic: string, course: string, count: number = 10) {
  const prompt = `Generate ${count} study flashcards for the course "${course}" on the topic "${topic}". Follow Nigerian university curriculum standards.

Return ONLY a JSON array in this exact format:
[
  {
    "front": "Question or concept to learn",
    "back": "The answer or explanation",
    "hint": "A helpful hint"
  }
]`;

  const result = await geminiModel.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  
  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    throw new Error('Failed to parse AI response');
  }
  throw new Error('No valid response from AI');
}

export async function generateStudySummary(topic: string, course: string) {
  const prompt = `Provide a comprehensive study summary for "${topic}" in the course "${course}". Follow Nigerian university curriculum standards. Include key concepts, definitions, formulas where relevant, and common exam points. Be thorough but concise.`;

  const result = await geminiModel.generateContent(prompt);
  const response = result.response;
  return response.text();
}

export async function askStudyQuestion(question: string, topic: string, course: string) {
  const prompt = `You are a helpful Nigerian university study assistant for the course "${course}". A student asks about "${topic}":

Student Question: ${question}

Provide a clear, accurate, and educational answer. Reference Nigerian university exam standards where relevant. Be concise but thorough.`;

  const result = await geminiModel.generateContent(prompt);
  const response = result.response;
  return response.text();
}

export async function generateSmartStudySession(
  course: string, 
  topic: string,
  weakAreas: string[] = [],
  _difficulty: 'adaptive' | 'easy' | 'medium' | 'hard' = 'adaptive'
) {
  const weakAreasText = weakAreas.length > 0 
    ? `Focus extra attention on these weak areas: ${weakAreas.join(', ')}.` 
    : '';

  const prompt = `Generate 15 adaptive quiz questions for "${course}" - "${topic}" following Nigerian university exam standards. ${weakAreasText}

Return ONLY a JSON array in this exact format:
[
  {
    "question": "Question text?",
    "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
    "correctAnswer": "A",
    "explanation": "Brief explanation",
    "difficulty": "easy|medium|hard",
    "type": "multiple-choice"
  }
]

Include a mix of difficulties: 5 easy, 5 medium, 5 hard. Make questions exam-style (like JAMB or university exams).`;

  const result = await geminiModel.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  
  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    throw new Error('Failed to parse AI response');
  }
  throw new Error('No valid response from AI');
}
