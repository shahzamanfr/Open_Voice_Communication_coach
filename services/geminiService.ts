import { GoogleGenAI, Type, Part } from "@google/genai";
import { CoachMode, Feedback } from '../types';

/**
 * Converts an HTMLImageElement to a GoogleGenerativeAI.Part object by drawing it to a canvas.
 * This ensures the analyzed image is the one displayed to the user, preventing synchronization issues.
 */
export function imageToGenerativePart(imageElement: HTMLImageElement): Part {
    const canvas = document.createElement('canvas');
    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Could not get canvas context');
    }
    ctx.drawImage(imageElement, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg');
    const base64data = dataUrl.split(',')[1];

    return {
        inlineData: {
            mimeType: 'image/jpeg',
            data: base64data,
        },
    };
}

/**
 * Generates a powerful, concise strategy for explaining an image.
 */
export async function getExplanationStrategy(ai: GoogleGenAI, imagePart: Part): Promise<string> {
  const systemInstruction = `You are a master communicator and rhetoric coach. Your task is to analyze an image and provide a single, powerful, and concise strategy for explaining it effectively.

  **RULES:**
  1.  **DO NOT describe the image.**
  2.  Focus on a **structural or narrative approach**.
  3.  The strategy should be a single sentence.
  4.  Frame it as a direct suggestion, starting with "Try..." or "Focus on...".

  **Examples of good strategies:**
  - "Try starting with the overall mood of the scene, then zoom in on the details that create that feeling."
  - "Focus on the main subject first, then describe their relationship to the environment around them."
  - "Build a narrative: what might have happened before this moment, what is happening now, and what could happen next?"

  Your output must be only the strategy text, with no extra formatting or explanation.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, { text: systemInstruction }] },
    config: {
        // Lower temperature for more focused, less random strategies
        temperature: 0.2,
    }
  });
  return response.text.trim();
}


/**
 * Generates a descriptive caption for a given image part.
 */
export async function generateImageCaption(ai: GoogleGenAI, imagePart: Part): Promise<string> {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                imagePart,
                { text: 'Describe this image in detail. What are the main subjects, what are they doing, what is in the background, and what is the overall mood?' }
            ]
        },
    });
    return response.text;
}

/**
 * Gets coaching feedback by comparing the AI caption with the user's explanation.
 */
export async function getCoachingFeedback(
    ai: GoogleGenAI,
    aiCaption: string,
    userExplanation: string,
    mode: CoachMode,
    strategy: string | null
): Promise<Feedback> {
    const strategyInstruction = strategy
      ? `**User's Strategic Goal:**
    The user was given the following strategy to guide their explanation: "${strategy}".
    In your evaluation, pay special attention to how well they executed this specific strategy. Was their attempt successful, clumsy, or did they ignore it completely? Weave this observation directly into your analysis and scoring.`
      : '';
    
    const systemInstruction = `You are an elite communication coach with a Ph.D. in rhetoric and psychology. Your analysis is brutally accurate, insightful, and always focused on making the user a more impactful and persuasive speaker.

**Your Task:**
You will receive an AI-generated, fact-based description of an image ("The Ground Truth") and the user's explanation. Your job is to dissect the user's communication style, not just their accuracy.

${strategyInstruction}

**Advanced Communication Analysis Metrics:**
1.  **Tone & Style Diagnosis:** Go beyond the surface. Is the user's tone confident, hesitant, humorous, clinical, poetic? Is their style narrative or analytical? How does this choice of tone impact the listener?
2.  **Linguistic Impact:** Analyze their use of strong verbs vs. weak/passive verbs. Do they use sensory language that evokes feeling, or is it purely visual? Identify specific word choices that either strengthen or weaken their message.
3.  **Structural Cohesion:** How do they build the mental picture for the listener? Is it a logical flow (e.g., background to foreground) or a chaotic list of observations?
4.  **Coaching Mindset:** Your overall score should be encouraging but fair. However, your detailed analysis, especially the Communication Profile, MUST be direct and unflinching.

**Communication Profile (The Hard Truth):**
This section is for direct, objective, and un-sugarcoated feedback. Use direct quotes from the user's text to support your claims.
- **Profile:** A one-to-three word title for their communication style. (e.g., "Hesitant Observer," "Confident Narrator").
- **Communicative Strength:** Identify their single most effective technique, quoting their text as an example. (e.g., "Excellent use of metaphor with the phrase '...'.").
- **Primary Growth Area:** Identify their single biggest weakness. Be ruthlessly specific and quote their text. (e.g., "Your reliance on filler words like 'kind of' in the sentence '...' completely drains your authority.").

**NEW - The 'Impact Rewrite' Feature:**
Identify one key sentence from the user's explanation that could be significantly more impactful. Provide the original sentence, a rewritten version, and a brief, tactical explanation of *why* the rewrite is more effective. This is about teaching, not just grading.

**Personality Mode: ${mode}**
Adapt your tone (except for the 'Hard Truth' Communication Profile and 'Impact Rewrite' which are always direct and analytical):
- **Teacher:** Patient, encouraging, structured.
- **Debater:** Sharp, logical, and questioning.
- **Storyteller:** Imaginative and creative.

**Input:**
- **The Ground Truth (AI Caption):** ${aiCaption}
- **The User's Explanation:** ${userExplanation}

**Output Instructions:**
Your entire output MUST be a single, valid JSON object without any markdown or extra text.
`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: systemInstruction,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    score: { type: Type.INTEGER, description: 'A score out of 100. Be encouraging but fair.' },
                    whatYouDidWell: { type: Type.STRING, description: 'A specific, genuine compliment about their communication technique.' },
                    areasForImprovement: { type: Type.STRING, description: 'Constructive feedback on 1-2 key communication areas.' },
                    personalizedTip: { type: Type.STRING, description: 'A single, powerful, and actionable tip for their next attempt.' },
                    spokenResponse: { type: Type.STRING, description: 'A natural, conversational, spoken-style summary of the feedback.' },
                    communicationBehavior: {
                        type: Type.OBJECT,
                        description: "The brutally honest and direct 'Communication Profile' analysis.",
                        properties: {
                            profile: { type: Type.STRING, description: 'A 1-3 word title for their communication style.' },
                            strength: { type: Type.STRING, description: 'Their single most effective communication technique, with an example.' },
                            growthArea: { type: Type.STRING, description: 'Their single most important area for improvement, with a direct quote.' }
                        },
                        required: ['profile', 'strength', 'growthArea']
                    },
                    exampleRewrite: {
                        type: Type.OBJECT,
                        description: "The 'Impact Rewrite' feature, showing a before-and-after of one of the user's sentences.",
                        properties: {
                            original: { type: Type.STRING, description: "The user's original sentence." },
                            improved: { type: Type.STRING, description: "A more impactful, rewritten version of the sentence." },
                            reasoning: { type: Type.STRING, description: "A brief explanation of why the rewritten version is more effective." }
                        },
                        required: ['original', 'improved', 'reasoning']
                    }
                },
                required: ['score', 'whatYouDidWell', 'areasForImprovement', 'personalizedTip', 'spokenResponse', 'communicationBehavior', 'exampleRewrite']
            }
        }
    });

    try {
        const jsonText = response.text.trim();
        const parsedFeedback = JSON.parse(jsonText);
        return parsedFeedback;
    } catch (e) {
        console.error("Failed to parse JSON feedback:", response.text);
        throw new Error("The AI returned an invalid response. Please try again.");
    }
}