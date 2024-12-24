export const generateWithOpenAI = async (
  prompt: string,
  apiKey: string,
  style: 'concise' | 'detailed' = 'detailed'
) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert technical documentation architect. Format your response in Markdown."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: style === 'concise' ? 0.5 : 0.7,
      max_tokens: style === 'concise' ? 2048 : 4096,
    })
  });

  const data = await response.json();
  if (!data.choices?.[0]?.message?.content) {
    throw new Error("Invalid response format from OpenAI API");
  }

  return data.choices[0].message.content;
};