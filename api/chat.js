
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: "OPENAI_API_KEY is not configured in Vercel.",
    });
  }

  try {
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body;

    const messages = Array.isArray(body?.messages)
      ? body.messages
      : [];

    const context = body?.context || {};

    const safeMessages = messages
      .filter(
        (message) =>
          message &&
          ["user", "assistant"].includes(message.role) &&
          typeof message.content === "string" &&
          message.content.trim()
      )
      .slice(-12)
      .map((message) => ({
        role: message.role,
        content: message.content.slice(0, 2000),
      }));

    if (
      !safeMessages.length ||
      safeMessages[safeMessages.length - 1].role !== "user"
    ) {
      return res.status(400).json({
        error: "Please enter a message first.",
      });
    }

    const limitedContext = {
      employees: Array.isArray(context.employees)
        ? context.employees.slice(0, 100)
        : [],
      departments: Array.isArray(context.departments)
        ? context.departments.slice(0, 30)
        : [],
    };

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      instructions: `You are the MHK Tech Inc AI HR Assistant.
Answer clearly and professionally.
Use only employee information provided in the dashboard context.
Never invent salaries, attendance, leave balances, or company policies.
The employee records are demo data.
Recommend an authorized HR professional for important HR decisions.

Dashboard context: ${JSON.stringify(limitedContext)}`,
      input: safeMessages,
      max_output_tokens: 500,
    });

    return res.status(200).json({
      reply:
        response.output_text ||
        "I couldn't generate a response. Please try again.",
    });
  } catch (error) {
    console.error("AI chat request failed:", error.message);

    if (error.status === 401) {
      return res.status(401).json({
        error: "Check your OpenAI API key in Vercel.",
      });
    }

    if (error.status === 429) {
      return res.status(429).json({
        error: "Check your OpenAI API usage and billing limits.",
      });
    }

    return res.status(500).json({
      error: "AI service failed. Check Vercel function logs.",
    });
  }
}
