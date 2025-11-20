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

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Parse PDF text
    let text = ''
    try {
      // @ts-ignore
      const pdfParse = require('pdf-parse')
      const pdfData = await pdfParse(buffer)
      text = pdfData.text
    } catch (error) {
      console.error('PDF Parse Error:', error)
      return NextResponse.json({ error: 'Failed to parse PDF' }, { status: 500 })
    }

    // Call Gemini to extract structured data
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `
      You are an expert resume parser. Extract the following information from the resume text below and return it as a valid JSON object.
      
      Resume Text:
      ${text.substring(0, 30000)} // Limit text length if needed

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

    const result = await model.generateContent(prompt)
    const response = await result.response
    const textResponse = response.text()

    // Clean up response if it contains markdown code blocks
    const jsonString = textResponse.replace(/```json/g, '').replace(/```/g, '').trim()

    const parsedData = JSON.parse(jsonString)

    return NextResponse.json(parsedData)
  } catch (error) {
    console.error('Resume Parsing Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
