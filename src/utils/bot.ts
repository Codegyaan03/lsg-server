import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function getAnswer(data: string) {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const chat = model.startChat({
    history: [],
  });

  const msg = `create summary in 500 words you can also add bullet points and write like that original context will remain the same- ${data}`;

  const result = await chat.sendMessage(msg);
  const response = result.response;
  const text = response.text();
  console.log(text);
}
