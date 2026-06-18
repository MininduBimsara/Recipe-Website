import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Initialize Gemini SDK with telemetry header "aistudio-build" as per Skill instructions
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export async function POST(req: NextRequest) {
  try {
    const { recipeTitle, ingredientGroups, steps, customization } = await req.json();

    if (!customization) {
      return NextResponse.json({ 
        error: "Missing customization instructions",
        code: "MISSING_CUSTOMIZATION_INPUT" 
      }, { status: 400 });
    }

    const systemPrompt = `You are an expert master chef specialized in dietary adaptations, kitchen science, and scaling recipes. 
Your task is to take the user's recipe and tailor it based on their specific request: "${customization}". 
Keep the integrity of the recipe while adjusting ingredients and steps carefully. 
Provide the adjusted recipe strictly matching the requested JSON schema.`;

    const contents = `
Recipe: ${recipeTitle}

Original Ingredients:
${JSON.stringify(ingredientGroups, null, 2)}

Original Steps:
${JSON.stringify(steps, null, 2)}

Adaptation Instructions: ${customization}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            shortChefNote: {
              type: Type.STRING,
              description: "A friendly, encouragement chef note summarizing what was adapted and why (max 80 words)."
            },
            ingredientGroups: {
              type: Type.ARRAY,
              description: "The adapted ingredient groups matching original groupings, but with tailored ingredient measurements or items.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  items: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["items"]
              }
            },
            steps: {
              type: Type.ARRAY,
              description: "The adjusted steps highlighting instructions updated for this adaptation/scale.",
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.INTEGER },
                  instruction: { type: Type.STRING },
                  tip: { type: Type.STRING, description: "Relevant kitchen safety tip or science insight for this specific step adaptation." }
                },
                required: ["stepNumber", "instruction"]
              }
            }
          },
          required: ["shortChefNote", "ingredientGroups", "steps"]
        }
      }
    });

    const text = response.text || "{}";
    const adaptedRecipe = JSON.parse(text.trim());

    return NextResponse.json(adaptedRecipe);
  } catch (err: any) {
    console.error("Gemini adaptation error:", err);
    return NextResponse.json({ 
      error: "Could not adapt the recipe. " + (err.message || ""), 
      code: "AI_ADAPTATION_EXCEPTION"
    }, { status: 500 });
  }
}
