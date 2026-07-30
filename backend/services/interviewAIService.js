import Groq from "groq-sdk";

const groq = new Groq({                           // Create Groq client.
    apiKey: process.env.GROQ_API_KEY,             // GROQ_API_KEY is loaded from our backend environment variables.
});

const cleanJsonResponse = (text) => {
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
};

export const generateInterviewQuestion = async ({           // Generates one interview question
    interviewType,
    subject,
    topic,
    targetRole,
    difficulty,
    previousQuestions = [],
}) => {
  try 
  {
    // Convert previously asked questions into readable text.This will prevent AI to ask the same question
    const previousQuestionsText = previousQuestions.length > 0 ? previousQuestions.join("\n"): "No previous questions have been asked.";

    // Send interview configuration and previous questions to the AI.
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
      {
        role: "system",
        content: `You are an AI technical interviewer.Your responsibility is to generate exactly ONE interview question.
        The question must:
        - Match the interview type.
        - Match the subject and topic.
        - Be relevant to the target role.
        - Match the requested difficulty.
        - Not repeat any previously asked question.
        - Be clear and suitable for a real interview.
        Return ONLY valid JSON.
        Required format:
        {
          "question": "Interview question here"
        }
        Do not return Markdown.
        Do not return explanations.
        Do not return text outside the JSON object.`,
      },
      {
        role: "user",
        content: `Interview Type: ${interviewType}
                  Subject: ${subject}
                  Topic: ${topic}
                  Target Role: ${targetRole}
                  Difficulty: ${difficulty}
                  Previously Asked Questions:${previousQuestionsText}
        Generate the next interview question.`,
      },
      ],
      response_format: {
      type: "json_object"
      }
    });
    const aiResponse = completion.choices[0].message.content;        // Groq returns the AI content as a string.
    const parsedResponse = JSON.parse(cleanJsonResponse(aiResponse));                  // Convert JSON string into a JavaScript object.
    return parsedResponse;
  } 
  catch (error) 
  {
    console.error("Interview Question Generation Error:", error);
    throw error;
  }
};

export const evaluateInterviewAnswer = async ({
    interviewType,
    subject,
    topic,
    targetRole,
    difficulty,
    question,
    candidateAnswer
}) => {
  try 
  {
    const completion = await groq.chat.completions.create({     // Send interview context, question, and candidate answer to Groq
    model: "llama-3.3-70b-versatile",
    messages: [
    {
      role: "system",
      content: `You are an expert technical interviewer and candidate evaluator.Your responsibility is to evaluate a candidate's     interview answer fairly and professionally.
      
      Evaluation Rules:
      1. Evaluate the technical correctness of the answer.
      2. Evaluate the depth of the answer according to the interview difficulty.
      3. Evaluate whether the answer demonstrates knowledge expected for the target role.
      4. Consider the interview subject and topic while evaluating.
      5. Do not give a high score only because the answer contains technically correct information.
      6. If the difficulty is high, expect deeper technical explanation.
      7. If the answer is incomplete, vague, or partially correct, reduce the score accordingly.
      8. Give a score from 0 to 10.
      9. Provide concise and constructive feedback.
      10. Return valid JSON only.
      Return the response in exactly this format:
      {
        "score": 0,
        "feedback": "Evaluation feedback here"
      }`
    },
    {
      role: "user",
      content: `Interview Type: ${interviewType}
                Subject: ${subject}
                Topic: ${topic}
                Target Role: ${targetRole}
                Difficulty: ${difficulty}
                Interview Question:${question}
                Candidate Answer:${candidateAnswer}
      Evaluate the candidate's answer based on the interview context.`
    }
    ],
    response_format: {
    type: "json_object"
    }
    });

    const aiResponse = completion.choices[0].message.content;     // Extract AI response
    const evaluation = JSON.parse(cleanJsonResponse(aiResponse));                // Convert structured JSON response into JavaScript object
    return evaluation;

  } 
  catch (error) 
  {
    console.error("Interview answer evaluation failed:", error.message);
    throw error;
  }
};

export const generateFinalInterviewFeedback = async ({
    interviewType,
    subject,
    topic,
    targetRole,
    difficulty,
    overallScore,
    questions
}) => {

  try 
  {
    const prompt = `You are an expert technical interviewer.Your task is to generate professional final interview feedback based on the candidate's complete interview performance.

    Interview Details:
    - Interview Type: ${interviewType}
    - Subject: ${subject}
    - Topic: ${topic}
    - Target Role: ${targetRole}
    - Difficulty: ${difficulty}
    - Overall Score: ${overallScore}/10

    Question-wise Performance:${JSON.stringify(questions, null, 2)}

    Instructions:
    1. Analyze the candidate's complete interview performance.
    2. Consider:
      - Overall Score
      - Technical Knowledge
      - Quality of Answers
      - Strengths
      - Weaknesses
      - Consistency
      - Communication Quality
      - Areas for Improvement
    3. Keep the feedback professional and constructive.
    4. Do NOT mention every individual question score.
    5. Keep the feedback between 120-180 words.
    6. Return ONLY valid JSON.

    Expected Output:
    {
      "finalFeedback": "Overall interview feedback here."
    }`;

    const completion = await groq.chat.completions.create({model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:"You are an expert technical interviewer. Always return ONLY valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      response_format: 
      {
        type: "json_object"
      }
    });

    const aiResponse = completion.choices[0].message.content;

    const parsedResponse = JSON.parse(cleanJsonResponse(aiResponse));

    return {finalFeedback: parsedResponse.finalFeedback};

  } 
  catch (error) 
  {
    console.error("Error generating final interview feedback:",error);
    throw new Error("Failed to generate final interview feedback.");
  }
};
