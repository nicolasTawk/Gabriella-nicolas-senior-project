require("dotenv").config();
const { OpenAI } = require("openai");
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/* --- Static research summary injected into every prompt ------------ */
const RESEARCH_SNIPPET = `
### Childhood Interests → Holland RIASEC → Likely Majors
• Building / coding / puzzles           → Investigative-Realistic → Computer Science, Electrical/Mechanical Engineering
• Music / drawing / performance         → Artistic               → Graphic Design, Fine Arts, Architecture, Media Studies
• Reading / writing / languages         → Artistic-Social        → Literature, Journalism, Linguistics, History
• Caring / teaching / volunteering      → Social                 → Education, Nursing, Psychology, Social Work
• Selling / organising / leading games  → Enterprising           → Business Admin, Marketing, Economics, Entrepreneurship
• Order / data / accounting games       → Conventional           → Accounting, Finance, Information Systems
(Data sources: Levine-2012 puzzles STEM; MSU-2013 arts-innovation; Woods-2010 personality longitudinal; O*NET RIASEC.)
`;

/* --- Prompt builder ------------------------------------------------- */
function buildPrompt(answersJson) {
  return `
You are an evidence-based college-major advisor bot.

Guidelines:
1. Use the research table below to connect the student's answers to Holland interest domains.
2. From those domains, pick the THREE most suitable college majors (ranked best → third-best).
3. Output ONLY a JSON array of three strings. No extra keys.

${RESEARCH_SNIPPET}

--- STUDENT PROFILE JSON ---
${JSON.stringify(answersJson, null, 2)}
--- END PROFILE ---
`;
}

/* --- Main function exported to controllers -------------------------- */
async function recommendMajors(answersJson) {
  const prompt = buildPrompt(answersJson);

  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: "You provide succinct major recommendations." },
      { role: "user",   content: prompt }
    ],
    temperature: 0.4,
    response_format: { type: "json_object" }      // guarantees valid JSON
  });

  // Example return: '["Computer Science","Electrical Engineering","Software Engineering"]'
  const majors = JSON.parse(completion.choices[0].message.content);
  return { majors, prompt };
}

module.exports = { recommendMajors };