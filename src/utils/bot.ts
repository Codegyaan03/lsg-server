import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

const config = new ConfigService();

export async function generateText(data: string, type: 'title' | 'content') {
  // For text-only input, use the gemini-pro model
  const genAI = new GoogleGenerativeAI(config.get('GOOGLE_GEMINI_API_KEY'));
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const chat = model.startChat({
    history: [],
  });

  let msg: string;

  if (type === 'title') {
    msg = `create a title for the following context- ${data}`;
  } else {
    // msg = `please write an essay on given article with proper outlines. Article - ${data}`;
    msg = `I want you to act as an essay writer. I will provide you with an article and you will write it from there. Article - ${data}`;
  }

  const result = await chat.sendMessage(msg);
  const response = result.response;
  const text = response.text();
  return text.replaceAll('\n', '<br/>');
}
