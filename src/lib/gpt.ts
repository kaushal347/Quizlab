import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

if (!process.env.GROQ_API_KEY) {
  console.warn("⚠️ WARNING: GROQ_API_KEY is not defined in your environment variables!");
}

interface OutputFormat {
  [key: string]: string | string[] | OutputFormat;
}

export async function strict_output(
  system_prompt: string,
  user_prompt: string | string[],
  output_format: OutputFormat,
  model: string = "llama-3.1-8b-instant",
  temperature: number = 1,
  num_tries: number = 3,
  verbose: boolean = true
): Promise<unknown[]> {
  const list_input = Array.isArray(user_prompt);
  const expectedCount = list_input ? user_prompt.length : 1;

  for (let attempt = 0; attempt < num_tries; attempt++) {
    console.log(`🤖 strict_output: Attempt ${attempt + 1}/${num_tries}`);
    try {
      // 🔥 Stronger system prompt to force Groq to output N items
      const finalSystemPrompt =
        system_prompt +
        `\nYou MUST return ONLY valid JSON.\n` +
        `You MUST return a JSON ARRAY of EXACTLY ${expectedCount} items.\n` +
        `Each array item MUST correspond to each input prompt in the SAME order.\n` +
        `Do NOT merge prompts.\n` +
        `Do NOT skip items.\n` +
        `Do NOT add text, comments, or markdown.\n`;

      // 🔥 Give Groq the full list of prompts clearly
      const combinedUserPrompt = list_input
        ? `For EACH of the ${expectedCount} prompts, generate ONE item.\n` +
        `Return a JSON ARRAY of EXACTLY ${expectedCount} items.\n` +
        `Here are the prompts:\n${JSON.stringify(user_prompt, null, 2)}`
        : (user_prompt as string);

      const response = await groq.chat.completions.create({
        model: attempt === num_tries - 1 ? "llama3-8b-8192" : model, // Fallback to a super stable model on last attempt
        temperature,
        messages: [
          { role: "system", content: finalSystemPrompt },
          { role: "user", content: combinedUserPrompt },
        ],
      });

      let raw = response.choices?.[0]?.message?.content ?? "";

      // Remove any accidental code fences
      raw = raw.replace(/```json|```/gi, "").trim();

      if (verbose) console.log("RAW AI OUTPUT:", raw);

      let parsed;

      // 1️⃣ Try direct parse first
      try {
        parsed = JSON.parse(raw);
      } catch {
        // 2️⃣ Try array extraction
        const sArr = raw.indexOf("[");
        const eArr = raw.lastIndexOf("]");

        if (sArr !== -1 && eArr !== -1 && eArr > sArr) {
          parsed = JSON.parse(raw.slice(sArr, eArr + 1));
        } else {
          // 3️⃣ Try single object extraction
          const sObj = raw.indexOf("{");
          const eObj = raw.lastIndexOf("}");

          if (sObj !== -1 && eObj !== -1 && eObj > sObj) {
            parsed = JSON.parse(raw.slice(sObj, eObj + 1));
          } else {
            throw new Error("❌ No valid JSON found in Groq output");
          }
        }
      }

      // Normalize to array
      if (!Array.isArray(parsed)) parsed = [parsed];

      // 🟢 Validate correct length
      if (parsed.length !== expectedCount) {
        console.warn(
          `⚠ Groq returned ${parsed.length} items but ${expectedCount} expected — retrying...`
        );
        continue;
      }

      console.log("✅ strict_output: Successfully parsed and validated items.");
      return parsed;
    } catch (err) {
      console.error(`❌ strict_output ERROR (attempt ${attempt + 1}):`, err);
    }
  }

  return [];
}
