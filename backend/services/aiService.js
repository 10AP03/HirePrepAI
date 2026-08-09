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

          STEP 1 — DOCUMENT VALIDATION (do this first, before anything else):
          Determine whether the provided text is actually a personal resume/CV — a document whose primary
          purpose is to represent one specific person's education, skills, projects, and experience for
          job/internship applications.

          It is NOT a resume if it is, for example: a lab report, academic assignment, project report,
          research paper, class notes, textbook excerpt, code file, article, or any other document —
          even if it happens to mention technical terms, programming languages, or tools.
          The mere presence of skill keywords (e.g. "Java", "Python") does NOT make something a resume.
          A real resume has clear personal identity markers: a name/header, contact-style structure,
          and organized sections like Education, Skills, Projects, or Experience framed around one candidate.

          If it is NOT a resume, set "isResume" to false, set "atsScore" to 0, leave "extractedSkills" as
          an empty array, and set "aiFeedback" to a short, clear message explaining that the uploaded
          document does not appear to be a resume and a proper resume should be uploaded instead.

          STEP 2 — ONLY IF it IS a genuine resume, proceed with full ATS analysis using this rubric:

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

          Return ONLY valid JSON in this exact structure:
          {
            "isResume": true,
            "atsScore": 0,
            "extractedSkills": [],
            "aiFeedback": ""
          }

          Rules:
          1. isResume must be a boolean — true only if this is genuinely a personal resume/CV.
          2. atsScore must be a number between 0 and 100 (0 if isResume is false).
          3. extractedSkills must be an array of technical skills explicitly present in the resume (empty if isResume is false).
          4. aiFeedback must contain specific, critical, practical feedback if it is a resume, or a clear
             rejection message if it is not.
          5. Do not include markdown.
          6. Do not include text outside the JSON object.
          `,
        },
        {
          role: "user",
          content: `Analyze the following document:${resumeText}`,
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