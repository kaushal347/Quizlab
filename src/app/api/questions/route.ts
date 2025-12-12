import { strict_output } from "@/lib/gpt";
import { generateQuestions } from "@/lib/question-generator";
import { getQuestionsSchema } from "@/schemas/forms/questions";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, topic, type } = getQuestionsSchema.parse(body);

    const questions = await generateQuestions({ amount, topic, type });

    console.log("✅ AI returned:", questions);

    if (!Array.isArray(questions) || questions.length === 0) {
      console.log("❌ AI returned no questions");
      return NextResponse.json(
        { error: "AI failed to generate questions." },
        { status: 500 }
      );
    }

    return NextResponse.json({ questions }, { status: 200 });
  } catch (error) {
    console.error("❌ /api/questions ERROR:", error);

    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Server crashed generating questions" },
      { status: 500 }
    );
  }
}
