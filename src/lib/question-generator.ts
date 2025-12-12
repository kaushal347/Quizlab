import { strict_output } from "@/lib/gpt";

interface QuestionGenerationParams {
    amount: number;
    topic: string;
    type: "mcq" | "open_ended";
}

export async function generateQuestions({ amount, topic, type }: QuestionGenerationParams) {
    console.log("📩 Generating questions (internal function):", { amount, topic, type });

    let questions: unknown[] = [];

    const promptArr = new Array(amount).fill(
        type === "mcq"
            ? `Provide ONE hard MCQ question about ${topic}.
       You MUST return ONLY JSON with the fields:
       question, answer, option1, option2, option3.

       STRICT RULES (very important):
       - ALL options MUST be unique.
       - option1, option2, option3 MUST NOT be the same as each other.
       - answer MUST NOT match option1, option2, or option3.
       - NO duplicate options.
       - NO repeated values.
       - NO empty or placeholder options.`
            : `Provide ONE hard open-ended question about ${topic}. 
       You MUST return ONLY JSON with fields: question, answer.`
    );

    questions = await strict_output(
        "YOU MUST RETURN ONLY VALID JSON. NO EXPLANATION. NO MARKDOWN. NO EXTRA TEXT.",
        promptArr,
        type === "mcq"
            ? {
                question: "question",
                answer: "answer",
                option1: "option1",
                option2: "option2",
                option3: "option3",
            }
            : {
                question: "question",
                answer: "answer",
            }
    );

    console.log("✅ AI returned (internal function):", questions);

    return questions;
}
