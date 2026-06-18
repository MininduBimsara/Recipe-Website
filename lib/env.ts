import { z } from 'zod';

const envSchema = z.object({
  GOOGLE_AI_API_KEY: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

let env: Env | null = null;

if (typeof window === 'undefined') {
  const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;

  const result = envSchema.safeParse({
    GOOGLE_AI_API_KEY: apiKey,
  });

  if (!result.success) {
    const isDev = process.env.NODE_ENV === 'development';
    const message = `
=============================================
❌ SAVORY KITCHEN ENVIRONMENT CONFIGURATION ERROR
=============================================
Missing required environment variable: GOOGLE_AI_API_KEY (or GEMINI_API_KEY).
Please set the secret in your standard .env file:
GOOGLE_AI_API_KEY="your-api-key-here"
=============================================
`;
    console.error(message);
    if (isDev) {
      throw new Error(message);
    }
  } else {
    env = result.data;
  }
}

export function getEnv(): Env {
  if (typeof window !== 'undefined') {
    throw new Error('Environment configuration must only be accessed on the server-side to hide secure keys.');
  }
  return {
    GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY || '',
  };
}
