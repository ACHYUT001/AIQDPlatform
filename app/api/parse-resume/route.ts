import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Convert file to base64 for Gemini
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Data = buffer.toString('base64')

    // Call Gemini to extract structured data
    // Using gemini-2.0-flash as 1.5 is not available in this environment
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `
      You are an expert resume parser. Extract the following information from the resume document provided and return it as a valid JSON object.

      Required JSON Structure:
      {
        "fullName": "string",
        "email": "string",
        "phone": "string",
        "location": "string",
        "skills": [
          { "name": "string", "proficiency": "beginner" | "intermediate" | "expert" }
        ],
        "workExperience": [
          {
            "company": "string",
            "role": "string",
            "startDate": "string",
            "endDate": "string",
            "description": "string"
          }
        ],
        "education": [
          {
            "institution": "string",
            "degree": "string",
            "year": "string"
          }
        ],
        "summary": "string"
      }

      If a field is missing, use null or empty string. Infer proficiency for skills if possible, otherwise default to "intermediate".
      Return ONLY the JSON object, no markdown formatting.
    `

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: 'application/pdf',
        },
      },
    ])

    const response = await result.response
    const textResponse = response.text()

    // Clean up response if it contains markdown code blocks
    const jsonString = textResponse.replace(/```json/g, '').replace(/```/g, '').trim()

    const parsedData = JSON.parse(jsonString)

    return NextResponse.json(parsedData)
  } catch (error: any) {
    console.error('Resume Parsing Error:', error)
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error)
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 })
  }
}
