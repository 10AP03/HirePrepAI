import Groq from "groq-sdk";

const groq = new Groq({                               // Create a Groq client.
  apiKey: process.env.GROQ_API_KEY,
});

const analyzeResumeWithAI = async (resumeText) => {
  try 
  {
    const completion = await groq.chat.completions.create({             // Send the extracted resume text to the Groq API.

      model: "llama-3.3-70b-versatile",                                 // Model that will analyze the resume.
      response_format: {                                                 // Force the AI response to be a JSON object.
        type: "json_object",
      },

      messages: [                                                     // Messages define the conversation/instructions
        {
          role: "system",
          content: `
          You are an expert ATS resume analyzer.
          Analyze the candidate's resume carefully.
          Return ONLY valid JSON in the following structure:
          {
            "atsScore": 0,
            "extractedSkills": [],
            "aiFeedback": ""
          }
          Rules:
          1. atsScore must be a number between 0 and 100.
          2. extractedSkills must be an array of technical skills explicitly present in the resume.
          3. aiFeedback must contain clear and practical feedback for improving the resume.
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
    
    const aiResponse = completion.choices[0].message.content;         // Groq returns a large completion response object.
    const parsedResponse = JSON.parse(aiResponse);                    // JSON.parse converts the JSON string into a JavaScript object.
    return parsedResponse;                                            // Return the structured AI analysis.
  } 
  catch (error) 
  {
    throw new Error(`AI resume analysis failed: ${error.message}`);       // Report the AI service failure to the caller.
  }
};

export default analyzeResumeWithAI;