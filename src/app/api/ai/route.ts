import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API Key is missing. Please add it to your environment variables.' }, { status: 500 });
    }

    // Call Gemini Imagen 3
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        instances: [
          {
            prompt: `Abstract graphic design, generative art, solid black background, highly decorative, digital brutalism, neon green and hot pink and electric yellow. ${prompt}. No text, no people, no faces, pure abstract graphic elements, sharp vector style.`
          }
        ],
        parameters: {
          sampleCount: 1,
          outputOptions: {
            mimeType: "image/jpeg"
          }
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      return NextResponse.json({ error: 'Failed to generate frame', details: errorData }, { status: response.status });
    }

    const data = await response.json();
    const base64Image = data.predictions?.[0]?.bytesBase64Encoded;

    if (!base64Image) {
      return NextResponse.json({ error: 'No image returned from Gemini' }, { status: 500 });
    }

    return NextResponse.json({
      imageUrl: `data:image/jpeg;base64,${base64Image}`
    });
  } catch (err) {
    console.error('AI route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
