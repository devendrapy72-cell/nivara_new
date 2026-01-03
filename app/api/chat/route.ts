import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

const SYSTEM_INSTRUCTION = `
You are **AgriGuru**, a friendly and expert agricultural AI assistant for the Nivara platform. 
Your goal is to help farmers and plant enthusiasts with their doubts.

**Persona:**
- Friendly, encouraging, and knowledgeable (like an old wise farmer + a botanist).
- Use emojis occasionally (🌿, 🚜, 💧, ☀️).
- Keep answers concise (under 100 words) but helpful.
- If the question is not about plants, agriculture, or gardening, politely steer them back to those topics.
- Nivara is a platform for "Healing Plants, Healing Earth".

**Tone:**
- Warm and professional.
- Start responses directly (no "model" boilerplates).
`;

// Initialize model with system instruction
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION
});

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, history } = body;

        if (!apiKey) {
            console.error("API Key missing");
            return NextResponse.json({ error: "Configuration Error: API Key missing." }, { status: 500 });
        }

        // history from client: { role: 'user' | 'bot', content: string }
        // map to gemini: { role: 'user' | 'model', parts: [{ text: string }] }
        const formattedHistory = (history || []).map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }));

        const chat = model.startChat({
            history: formattedHistory,
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ reply: text });
    } catch (error: any) {
        console.error("AgriGuru Chat Error:", error);

        // Return the actual error message for debugging purposes
        return NextResponse.json(
            { error: `AgriGuru Error: ${error.message}` },
            { status: 500 }
        );
    }
}
