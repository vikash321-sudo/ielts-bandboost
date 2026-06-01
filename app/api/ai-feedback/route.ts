import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DAILY_AI_LIMIT = 5;

export async function POST(request: Request) {
  try {
    const openAiKey = process.env.OPENAI_API_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!openAiKey) {
      return NextResponse.json(
        {
          error:
            "OPENAI_API_KEY is not configured. Add it in Vercel environment variables."
        },
        { status: 500 }
      );
    }

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        {
          error:
            "Supabase is not configured. Add Supabase environment variables."
        },
        { status: 500 }
      );
    }

    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Login is required to use AI feedback." },
        { status: 401 }
      );
    }

    const accessToken = authHeader.replace("Bearer ", "");

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    });

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Invalid session. Please login again." },
        { status: 401 }
      );
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { count, error: countError } = await supabase
      .from("ai_feedback_logs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", todayStart.toISOString());

    if (countError) {
      return NextResponse.json(
        { error: "Could not check AI usage limit." },
        { status: 500 }
      );
    }

    if ((count || 0) >= DAILY_AI_LIMIT) {
      return NextResponse.json(
        {
          error:
            "Daily AI feedback limit reached. Try again tomorrow."
        },
        { status: 429 }
      );
    }

    const body = await request.json();

    const question = String(body.question || "").trim();
    const answer = String(body.answer || "").trim();
    const skill = String(body.skill || "IELTS Writing").trim();

    if (!answer) {
      return NextResponse.json(
        { error: "Answer is required for AI feedback." },
        { status: 400 }
      );
    }

    if (answer.length > 6000) {
      return NextResponse.json(
        { error: "Answer is too long. Please shorten it." },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey: openAiKey
    });

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: `
You are an IELTS writing tutor. Give practical feedback to a student.

Important rules:
- Do not claim this is an official IELTS score.
- Use simple language.
- Be direct and useful.
- Focus on improvement, not praise.

Skill: ${skill}

Question:
${question || "No question provided"}

Student Answer:
${answer}

Give feedback in this format:

1. Estimated practice band:
2. Main weakness:
3. Grammar problems:
4. Vocabulary improvement:
5. Structure improvement:
6. Improved version of one paragraph:
7. One action for next practice:
`
    });

    const feedback = response.output_text || "No feedback generated.";

    const { error: logError } = await supabase.from("ai_feedback_logs").insert({
      user_id: user.id,
      skill
    });

    if (logError) {
      console.error("AI usage log failed:", logError.message);
    }

    return NextResponse.json({
      feedback,
      remainingToday: DAILY_AI_LIMIT - ((count || 0) + 1)
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