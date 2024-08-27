import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const systemPrompt = `
You are an AI flashcard generator. Your task is to create flashcards with conversational words and phrases. For each flashcard, place a word or phrase in the [Target Language] on one side, and its translation in [Source Language] on the other side. Focus on commonly used conversational vocabulary that would be useful in everyday interactions. Ensure the translations are accurate and appropriate for the context.
You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`
export async function POST(req) {
    const openai = new OpenAI()
    const data = await req.text()
  
    // We'll implement the OpenAI API call here
  }

  export async function POST(req) {
    const openai = new OpenAI()
    const data = await req.text()
  
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: data },
      ],
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
    })
    // Parse the JSON response from the OpenAI API
    const flashcards = JSON.parse(completion.choices[0].message.content)

    // Return the flashcards as a JSON response
    return NextResponse.json(flashcards.flashcards)
  
    // We'll process the API response in the next step
  }