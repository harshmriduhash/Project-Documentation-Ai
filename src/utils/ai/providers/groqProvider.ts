import { Groq } from 'groq-sdk';

export const generateWithGroq = async (
  prompt: string,
  apiKey: string,
  style: 'concise' | 'detailed' = 'detailed'
) => {
  const groq = new Groq({
    apiKey,
    dangerouslyAllowBrowser: true
  });

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are an expert technical documentation architect. Format your response in Markdown."
      },
      {
        role: "user",
        content: prompt
      },
    ],
    model: "llama-3.1-70b-versatile",
    temperature: style === 'concise' ? 0.5 : 0.7,
    max_tokens: style === 'concise' ? 4000 : 8000,
    top_p: 0.65,
    stream: false,
  });

  if (!chatCompletion.choices?.[0]?.message?.content) {
    throw new Error("Invalid response format from API");
  }

  return chatCompletion.choices[0].message.content;
};