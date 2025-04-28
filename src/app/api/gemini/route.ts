import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, documentContent } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Check if API key is available
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      console.error('Missing GOOGLE_AI_API_KEY environment variable');
      return NextResponse.json({ error: 'API key configuration error' }, { status: 500 });
    }

    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Combine the user's prompt with the document content for context
    const fullPrompt = `
      Document Content for Context:
      ${documentContent || '(Empty document)'}
      DO NOT REPLY IN MARKDOWN ONLY GIVE PLAIN TEXT YOU ARE INSIDE A RICH TEXT EDITOR
      User Request:
      ${prompt}
    `;

    // Generate content
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Error generating content with Gemini:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate content',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
