import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const analyzeResumeWithAI = async (resumeText) => {
  try 
  {
    const completion = await groq.chat.completions.create({

      model: "llama-3.3-70b-versatile",
      response_format: {
        type: "json_object",
      },

      messages: [
        {
          role: "system",
          content: `
          You are a strict, senior ATS resume analyzer for technical roles (software, AI/ML, engineering).
          Your scoring must be discriminating — a resume with real, deployed projects and depth should score
          meaningfully higher than a resume with none. Do NOT cluster scores in a narrow "safe" range.
          Be honest and critical, not encouraging.

          Return ONLY valid JSON in this structure:
          {
            "atsScore": 0,
            "extractedSkills": [],
            "aiFeedback": ""
          }

          SCORING RUBRIC — atsScore is the sum of these weighted categories (max 100):

          1. Projects & Practical Experience (0-35 points)
             - No projects/experience listed: 0-8 points
             - 1-2 basic/academic projects, no deployment: 9-18 points
             - Multiple projects with real technical depth: 19-27 points
             - Multiple projects, at least one deployed/live, demonstrates end-to-end ownership: 28-35 points

          2. Technical Skill Depth & Relevance (0-20 points)
             - Few basic skills, mostly coursework-level (e.g. only C, HTML): 0-8 points
             - Moderate stack, some frameworks/tools: 9-14 points
             - Strong, modern, role-relevant stack (frameworks, databases, deployment tools, cloud): 15-20 points

          3. Quantified Impact & Action-Oriented Writing (0-15 points)
             - Vague descriptions, no metrics or outcomes: 0-5 points
             - Some concrete outcomes or numbers: 6-10 points
             - Consistently quantified impact (%, numbers, scale, performance): 11-15 points

          4. Education & Achievements (0-15 points)
             - Education only, no notable achievements: 0-6 points
             - Education plus minor/non-technical achievements: 7-10 points
             - Strong technical achievements (hackathons, competitive rankings, certifications, publications): 11-15 points

          5. Resume Structure, Clarity & ATS Readability (0-15 points)
             - Poor structure, missing sections, hard to parse: 0-6 points
             - Reasonably clear, standard sections present: 7-11 points
             - Excellent structure, clean formatting, consistent, easy to scan: 12-15 points

          CALIBRATION GUIDANCE:
          - A resume with zero projects and only coursework/basic skills should typically score in the 25-45 range overall.
          - A resume with 1-2 simple projects and a narrow skill set should typically score in the 45-60 range.
          - A resume with multiple solid projects and a decent stack should typically score in the 60-75 range.
          - A resume with multiple deployed, technically deep projects, strong quantified impact, and clean structure
            should score in the 76-92 range.
          - Scores above 92 should be rare and reserved for exceptional, industry-ready resumes.

          Rules:
          1. atsScore must be a number between 0 and 100, calculated by summing the category scores above.
          2. extractedSkills must be an array of technical skills explicitly present in the resume.
          3. aiFeedback must contain specific, critical, and practical feedback — mention concrete gaps
             (e.g. "no deployed projects", "no quantified outcomes") rather than generic encouragement.
          4. Do not include markdown.
          5. Do not include text outside the JSON object.
          `,
        },
        {
          role: "user",
          content: `Analyze the following resume:${resumeText}`,
        },
      ],
    });
    
    const aiResponse = completion.choices[0].message.content;
    const parsedResponse = JSON.parse(aiResponse);
    return parsedResponse;
  } 
  catch (error) 
  {
    throw new Error(`AI resume analysis failed: ${error.message}`);
  }
};

export default analyzeResumeWithAI;