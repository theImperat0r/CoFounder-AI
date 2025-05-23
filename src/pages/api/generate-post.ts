import type { APIRoute } from 'astro';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.OPENAI_API_KEY,
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const { description, industry, perception } = await request.json();

    // Generate post text using OpenAI
    const textCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a social media expert. Create engaging, concise posts for Facebook groups. Keep the tone professional but friendly."
        },
        {
          role: "user",
          content: `Create a Facebook post for a startup with the following details:
            Description: ${description}
            Industry: ${industry}
            Desired Perception: ${perception}
            
            Make it engaging and suitable for a professional audience.`
        }
      ],
      max_tokens: 150,
    });

    const generatedText = textCompletion.choices[0].message.content;

    // Generate image using DALL-E
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create a professional, modern image that represents: ${generatedText}. Make it suitable for a social media post.`,
      n: 1,
      size: "1024x1024",
    });

    if (!imageResponse.data?.[0]?.url) {
      throw new Error('Failed to generate image');
    }

    const imageUrl = imageResponse.data[0].url;

    return new Response(JSON.stringify({
      text: generatedText,
      imageUrl: imageUrl,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error generating post:', error);
    return new Response(JSON.stringify({
      error: 'Failed to generate post'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 