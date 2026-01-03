import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Get API key from environment variables
    // Get API key from environment variables
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      )
    }

    // Get the image file from the form data
    const formData = await request.formData()
    const imageFile = formData.get('image') as File

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an image.' },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit)
    if (imageFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image size should be less than 10MB' },
        { status: 400 }
      )
    }

    // Convert image to base64
    const arrayBuffer = await imageFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Image = buffer.toString('base64')
    const mimeType = imageFile.type

    // Initialize Gemini
    // Inside your API route
    const genAI = new GoogleGenerativeAI(apiKey);

    // Use 'gemini-1.5-flash' without the 'models/' prefix 
    // or ensure you are using the correct library version
    // Correct way to call the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    // Create the prompt for plant disease detection
    const prompt = `You are an expert plant pathologist and agricultural specialist. Analyze this plant image and provide a detailed disease diagnosis.

Please provide your analysis in the following structured format:

**Disease Name:** [Name of the disease if detected, or "Healthy Plant" if no disease is found]

**Confidence Level:** [High/Medium/Low]

**Description:** [Detailed description of what you observe in the image, including symptoms, affected areas, and any visible signs of disease or health issues]

**Treatment Recommendations:** [If disease is detected, provide specific treatment steps including any recommended fungicides, pesticides, or cultural practices. If healthy, provide general care tips]

**Prevention Tips:** [Advice on how to prevent this disease in the future, including proper watering, fertilization, spacing, and monitoring practices]

Be thorough, accurate, and provide actionable advice. If the image is unclear or you cannot identify a specific disease, please state that clearly.`

    // Prepare the image part
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    }

    // Generate content
    try {
      const result = await model.generateContent([prompt, imagePart])
      const response = await result.response
      const text = response.text()

      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from Gemini API')
      }

      // Parse the response to extract structured information
      const parsedResult = parseGeminiResponse(text)

      return NextResponse.json(parsedResult, { status: 200 })
    } catch (genError) {
      console.error('Gemini API generation error:', genError)
      throw genError
    }
  } catch (error) {
    console.error('Error analyzing image:', error)

    // Handle specific Gemini API errors
    if (error instanceof Error) {
      if (error.message.includes('API_KEY')) {
        return NextResponse.json(
          { error: 'Invalid or missing Gemini API key' },
          { status: 500 }
        )
      }
      if (error.message.includes('SAFETY')) {
        return NextResponse.json(
          { error: 'Image was blocked by safety filters. Please try a different image.' },
          { status: 400 }
        )
      }
    }

    // Return more detailed error message
    const errorMessage = error instanceof Error
      ? error.message
      : 'Failed to analyze image. Please try again.'

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

function parseGeminiResponse(text: string) {
  // Extract disease name
  const diseaseMatch = text.match(/\*\*Disease Name:\*\*\s*(.+?)(?:\n|$)/i) ||
    text.match(/Disease Name:\s*(.+?)(?:\n|$)/i)
  const disease = diseaseMatch ? diseaseMatch[1].trim() : 'Unknown'

  // Extract confidence level
  const confidenceMatch = text.match(/\*\*Confidence Level:\*\*\s*(.+?)(?:\n|$)/i) ||
    text.match(/Confidence Level:\s*(.+?)(?:\n|$)/i)
  const confidence = confidenceMatch ? confidenceMatch[1].trim() : 'Medium'

  // Extract description
  const descriptionMatch = text.match(/\*\*Description:\*\*\s*([\s\S]+?)(?:\*\*Treatment|\*\*Prevention|$)/i) ||
    text.match(/Description:\s*([\s\S]+?)(?:\n\nTreatment|\n\nPrevention|$)/i)
  const description = descriptionMatch ? descriptionMatch[1].trim() : text

  // Extract treatment
  const treatmentMatch = text.match(/\*\*Treatment Recommendations:\*\*\s*([\s\S]+?)(?:\*\*Prevention|$)/i) ||
    text.match(/Treatment Recommendations:\s*([\s\S]+?)(?:\n\nPrevention|$)/i)
  const treatment = treatmentMatch ? treatmentMatch[1].trim() : 'No specific treatment recommendations available.'

  // Extract prevention
  const preventionMatch = text.match(/\*\*Prevention Tips:\*\*\s*([\s\S]+?)$/i) ||
    text.match(/Prevention Tips:\s*([\s\S]+?)$/i)
  const prevention = preventionMatch ? preventionMatch[1].trim() : 'Maintain good plant hygiene and monitor regularly.'

  return {
    disease,
    confidence,
    description,
    treatment,
    prevention,
  }
}

