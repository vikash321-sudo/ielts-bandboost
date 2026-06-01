import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const answer = String(body.answer || "").trim();
    const task = String(body.task || "IELTS writing/speaking practice").trim();

    if (!answer) {
      return NextResponse.json({ error: "Answer is required." }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY is missing." }, { status: 500 });
    }

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "You are an IELTS mentor. Give concise, honest feedback. Do not claim an official IELTS score. Use estimated practice band only."
        },
        {
          role: "user",
          content: `Task: ${task}\n\nStudent answer:\n${answer}\n\nReturn feedback with: estimated practice band, strengths, weak areas, and 3 improvement actions.`
        }
      ]
    });

    return NextResponse.json({ feedback: response.output_text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "AI feedback failed." }, { status: 500 });
  }
}
