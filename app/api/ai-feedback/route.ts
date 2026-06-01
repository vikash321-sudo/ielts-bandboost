import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "OPENAI_API_KEY is not configured. Add it in .env.local for local use or in Vercel environment variables for deployment."
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const question = String(body.question || "").trim();
    const answer = String(body.answer || "").trim();
    const skill = String(body.skill || "IELTS").trim();

    if (!answer) {
      return NextResponse.json(
        { error: "Answer is required for AI feedback." },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey
    });

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: `
You are an IELTS tutor. Give short, useful feedback for a learner.

Skill: ${skill}
Question: ${question || "No question provided"}
Student Answer: ${answer}

Give feedback in this format:
1. Estimated level
2. Main weakness
3. Improved version
4. One practical tip

Do not claim this is an official IELTS band score.
`
    });

    return NextResponse.json({
      feedback: response.output_text || "No feedback generated."
    });
  } catch (error) {
    console.error("AI feedback error:", error);

    return NextResponse.json(
      {
        error: "AI feedback failed. Check your API key and request format."
      },
      { status: 500 }
    );
  }
}