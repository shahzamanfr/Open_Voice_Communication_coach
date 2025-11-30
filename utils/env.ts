/**
 * Environment variables validation for production deployment
 */

interface EnvConfig {
  VITE_GEMINI_API_KEY: string;
  VITE_PEXELS_API_KEY?: string;
  VITE_UNSPLASH_ACCESS_KEY?: string;
}

/**
 * Validates required environment variables
 */
export function validateEnvironment(): EnvConfig {
  const env = import.meta.env;
  
  // Required variables
  const requiredVars = ['VITE_GEMINI_API_KEY'];
  const missing = requiredVars.filter(key => !env[key] || env[key] === 'your_gemini_api_key_here');
  
  if (missing.length > 0) {
    const error = `Missing required environment variables: ${missing.join(', ')}`;
    console.error('❌ Environment validation failed:', error);
    throw new Error(error);
  }

  // Validate API key format
  const geminiKey = env.VITE_GEMINI_API_KEY;
  if (!geminiKey.startsWith('AIza') || geminiKey.length < 30) {
    const error = 'Invalid VITE_GEMINI_API_KEY format';
    console.error('❌ API key validation failed:', error);
    throw new Error(error);
  }

  return {
    VITE_GEMINI_API_KEY: geminiKey,
    VITE_PEXELS_API_KEY: env.VITE_PEXELS_API_KEY,
    VITE_UNSPLASH_ACCESS_KEY: env.VITE_UNSPLASH_ACCESS_KEY,
  };
}

/**
 * Gets environment configuration safely
 */
export function getEnvConfig(): EnvConfig {
  try {
    return validateEnvironment();
  } catch (error) {
    // In production, show user-friendly error
    if (import.meta.env.PROD) {
      throw new Error('Application configuration error. Please contact support.');
    }
    throw error;
  }
}