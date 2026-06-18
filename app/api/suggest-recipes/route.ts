import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') || 'culinary inspiration';

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Lazily handle missing keys gracefully as instructed by safety rules
    return NextResponse.json({ 
      error: 'GEMINI_API_KEY is missing. Please set it in your environment dashboard.',
      code: 'GEMINI_API_KEY_MISSING',
      suggestions: [
        {
          title: 'Lemon Herb Garlic Chicken Breast',
          description: 'A classic, fail-safe comfort dish with blistered lemon wheels and cold pan butter glaze.',
          prepTime: '25 mins',
          difficulty: 'Easy'
        },
        {
          title: 'Sautéed Garlic Scallopini Pasta',
          description: 'Glossy emulsion coatings of white wine reduction, olive oil, and crushed red peppercorn flakes.',
          prepTime: '20 mins',
          difficulty: 'Medium'
        },
        {
          title: 'Charred Sourdough with Burrata',
          description: 'Pristine toasted bread slices covered with raw sea salt flares, hand-torn burrata cream, and extra virgin olive oil.',
          prepTime: '10 mins',
          difficulty: 'Easy'
        }
      ]
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `You are a gourmet Michelin-starred food consultant and recipe engineer.
The user tried to search for the keyword "${query}" on a recipe and culinary blog site, but found zero matches inside our database.
Propose 3 creative, mouth-watering, highly-specific recipe ideas that match or elevate the searched terms.
Return the result strictly as a valid, parsable JSON array of 3 objects.
Each object must have exactly these keys:
- "title": a gorgeous, artisanal recipe name
- "description": a highly sensory, professional culinary outline (e.g. mentioning slow cold retardation, blistered sears, pan deglazes, or fragile crusts)
- "prepTime": a realistic execution time (e.g. "30 mins", "1.5 hrs")
- "difficulty": "Easy", "Medium", or "Hard"

Return only the raw JSON text. Do not wrap it in \`\`\`json or regular code markdown blocks. Just return the valid JSON array starting with [ and ending with ].`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json', // Force JSON output to prevent syntax errors
      }
    });

    const text = response.text || '[]';
    // Clean potential markdown leftovers
    const trimmed = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const suggestions = JSON.parse(trimmed);

    return NextResponse.json({ success: true, suggestions });
  } catch (error: any) {
    console.error('Gemini Recipe Suggestions search API failure details:', error);
    
    // Recovery block - return beautiful fallback suggestions if there is an API parsing block
    return NextResponse.json({
      error: error.message || 'Gemini API failed to parse content.',
      code: 'SUGGEST_RECIPES_API_EXCEPTION',
      suggestions: [
        {
          title: `Artisanal French Butter Scramble with "${query}"`,
          description: 'A delicate slow-cooked custard texture featuring fresh seasonal chives and toasted rustic pain de campagne strips.',
          prepTime: '15 mins',
          difficulty: 'Easy'
        },
        {
          title: `Gourmet pan-glazed Salmon with "${query}"`,
          description: 'Seared wild salmon skins served on a bed of fresh herb quinoa, finished with high-hydration citrus dressing drops.',
          prepTime: '20 mins',
          difficulty: 'Medium'
        },
        {
          title: `Rustic Autumn Soup featuring "${query}"`,
          description: 'Slow-simmered vegetable mineral broth loaded with fresh roasted squashes, extra virgin olive oil swirls, and micro-greens.',
          prepTime: '35 mins',
          difficulty: 'Easy'
        }
      ]
    });
  }
}
