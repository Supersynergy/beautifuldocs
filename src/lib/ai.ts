// AI Integration: fal.ai for images, OpenRouter for content

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function generateContent(
  topic: string,
  format: 'article' | 'slides' | 'report' = 'article'
): Promise<{ title: string; content: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY not set');
  }

  const prompts: Record<string, string> = {
    article: `Write a comprehensive article about "${topic}". Include introduction, 3-4 main sections with subheadings, and conclusion. Use markdown formatting with ## headers.`,
    slides: `Create presentation slides about "${topic}". For each slide: # Title, then bullet points. Separate slides with ---. Include 5-6 slides.`,
    report: `Write a professional report about "${topic}". Include executive summary, key findings, recommendations. Use markdown tables and formatting.`,
  };

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'qwen/qwen-2.5-coder-32b-instruct',
      messages: [
        {
          role: 'system',
          content: 'You are a professional content writer. Output valid markdown only.',
        },
        {
          role: 'user',
          content: prompts[format],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const data: OpenRouterResponse = await response.json();
  const content = data.choices[0]?.message?.content || '';

  // Extract title from first # heading or use topic
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : topic;

  return { title, content };
}

export async function generateImage(prompt: string): Promise<string> {
  const apiKey = process.env.FAL_API_KEY;
  if (!apiKey) {
    throw new Error('FAL_API_KEY not set');
  }

  // Submit generation request
  const submitResponse = await fetch('https://queue.fal.run/fal-ai/flux/schnell', {
    method: 'POST',
    headers: {
      'Authorization': `Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: `Professional, high-quality: ${prompt}. Clean, modern aesthetic suitable for business documents.`,
      image_size: 'landscape_4_3',
    }),
  });

  if (!submitResponse.ok) {
    throw new Error(`fal.ai API error: ${submitResponse.status}`);
  }

  const { request_id } = await submitResponse.json();

  // Poll for result
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 1000));
    
    const statusResponse = await fetch(`https://queue.fal.run/fal-ai/flux/schnell/requests/${request_id}`, {
      headers: { 'Authorization': `Key ${apiKey}` },
    });

    if (statusResponse.ok) {
      const result = await statusResponse.json();
      if (result.images?.[0]?.url) {
        return result.images[0].url;
      }
    }
  }

  throw new Error('Image generation timed out');
}

export async function generateStylePalette(description: string): Promise<Record<string, string>> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY not set');
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'qwen/qwen-2.5-coder-32b-instruct',
      messages: [
        {
          role: 'system',
          content: 'You are a design expert. Return ONLY a JSON object with color palette keys: primary, secondary, accent, background, surface, text, textMuted.',
        },
        {
          role: 'user',
          content: `Create a color palette for: ${description}. Return as JSON.`,
        },
      ],
    }),
  });

  const data: OpenRouterResponse = await response.json();
  const content = data.choices[0]?.message?.content || '{}';
  
  // Extract JSON from response
  const jsonMatch = content.match(/\{[^}]+\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  
  return {};
}
