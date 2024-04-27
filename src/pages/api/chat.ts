import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

// Create a GROQ API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.GROQ_API_KEY,
  basePath: 'https://api.groq.com/openai/v1'
})
const openai = new OpenAIApi(config)

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

export default async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json()

  // Ask GROQ for a streaming chat completion given the prompt
  const response = await openai.createChatCompletion({
    model: 'mixtral-8x7b-32768',
    stream: true,
    messages
  })
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)
  // Respond with the stream
  return new StreamingTextResponse(stream)
}

