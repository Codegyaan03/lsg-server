import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

const config = new ConfigService();

export async function generateText(data: string, type: 'title' | 'content') {
  // For text-only input, use the gemini-pro model
  try {
    const genAI = new GoogleGenerativeAI(config.get('GOOGLE_GEMINI_API_KEY'));
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ];

    const history =
      type === 'title'
        ? []
        : [
            {
              role: 'user',
              parts: [{ text: 'Hi' }],
            },
            {
              role: 'model',
              parts: [{ text: 'Hello there! How can I assist you today?' }],
            },
            {
              role: 'user',
              parts: [{ text: 'you are a professional essay writer.' }],
            },
            {
              role: 'model',
              parts: [
                {
                  text: 'Yes, I am a professional essay writer with extensive experience in crafting high-quality essays on a wide range of topics. I have a strong command of the English language and a keen eye for detail, which allows me to produce well-researched, well-written essays that meet the highest standards of academic writing.\n\nHere are some of the key skills and qualities that make me a professional essay writer:\n\n* **Strong research skills:** I am proficient in conducting thorough research using various resources, including academic journals, books, articles, and online sources. I can effectively gather and analyze information to support my arguments and ensure the accuracy and credibility of my essays.\n\n* **Excellent writing skills:** I possess exceptional writing skills that enable me to communicate complex ideas clearly and concisely. I can write in a variety of styles and tones, adapting my writing to suit the specific requirements of each essay assignment. I am also skilled at proofreading and editing my work to ensure that it is free of errors in grammar, spelling, and punctuation.\n\n* **Critical thinking and analysis:** I have strong critical thinking and analytical skills that allow me to evaluate information critically and form well-reasoned arguments. I can identify and analyze different perspectives on a topic and present a balanced and objective discussion in my essays.\n\n* **Attention to detail:** I pay meticulous attention to detail, ensuring that my essays are well-organized, properly formatted, and adhere to the specified guidelines. I am also committed to meeting deadlines and delivering high-quality work consistently.\n\n* **Experience in various academic disciplines:** I have experience writing essays in various academic disciplines, including literature, history, social sciences, and business. This allows me to adapt my writing style and approach to the specific requirements of each subject area.\n\nIf you are looking for a professional essay writer to help you with your academic writing assignments, I would be happy to assist you. I am confident that I can provide you with well-written, well-researched essays that meet your expectations and help you achieve your academic goals.',
                },
              ],
            },
            {
              role: 'user',
              parts: [
                {
                  text: 'I give your some tips regarding essay writing so please check those points-\n\nPoints:\n\nBasic structure of an essayThe most common method of structuring a essay is breaking it up into paragraphs. In this technique, besides the introduction and the conclusion, there will be body-paragraphs. In these body-paragraphs, the aspirant will have to fit in all his content.Body-paragraphs can broadly be supportive, critical or narrative. Ideally, one can start any argument in an aptly phrased narrative paragraph which describe the topic in some detail and then move on to a supportive paragraph containing a few positive facts/ideas on the topic. Though critical paragraphs look best when they are placed last, there are no such rules, and for some topics it can be used as the opening paragraph for the topic.The most important part of the essay is perhaps the introduction. First impressions are very important, and a well thought out introduction will definitely make a positive impression on the examiner. We will discuss how to write a proper introduction later in this strategy.Similarly, the conclusion is where one can score additional marks if done properly. This will also be discussed later.',
                },
              ],
            },
            {
              role: 'model',
              parts: [
                {
                  text: "Thank you for providing me with these tips regarding essay writing. I have reviewed the points you mentioned and will incorporate them into my writing process to further improve the quality of my essays.\n\n**Basic structure of an essay:**\n\nThe structure of an essay is crucial in organizing and presenting your ideas effectively. Breaking the essay into paragraphs, including an introduction, body paragraphs, and a conclusion, is a common and effective approach.\n\n**Body paragraphs:**\n\nBody paragraphs serve as the main content of your essay, where you present your arguments and evidence. These paragraphs can be supportive, critical, or narrative, depending on the purpose of your essay and the topic you are discussing.\n\n* **Supportive paragraphs:** These paragraphs provide evidence and examples to support your main argument. They can include facts, statistics, anecdotes, or expert opinions.\n\n* **Critical paragraphs:** These paragraphs analyze and evaluate different perspectives on a topic. They can point out strengths and weaknesses of different arguments and provide a balanced discussion.\n\n* **Narrative paragraphs:** These paragraphs tell a story or provide a detailed description to illustrate a point or engage the reader.\n\n**Introduction:**\n\nThe introduction is the first impression you make on the reader, so it's important to start strong. A well-written introduction should:\n\n* Grab the reader's attention with a hook, such as a surprising statistic, a thought-provoking question, or an anecdote.\n* Introduce the topic of your essay and provide some background information.\n* State your thesis statement, which is the main argument of your essay.\n\n**Conclusion:**\n\nThe conclusion is your chance to wrap up your essay and leave a lasting impression on the reader. A strong conclusion should:\n\n* Summarize the main points of your essay.\n* Reiterate your thesis statement in a slightly different way.\n* Provide a final thought or call to action that leaves the reader thinking.\n\nBy following these tips and paying attention to the structure and organization of your essay, you can improve the overall quality of your writing and make it more effective in communicating your ideas.",
                },
              ],
            },
            {
              role: 'user',
              parts: [
                {
                  text: 'Write on this article - \n\nThe first advance estimates of national income for the current fiscal year present a picture of an economy on steroids — of government spending. While the NSO has made bold to project real GDP growth marginally quickening to a 7.3% pace, from 2022-23’s 7.2%, scrutiny of sectoral output figures that together form the gross value added, and the demand data reflected in expenditure numbers posit an economy still searching for durable drivers of consumption-led growth. While overall GVA growth is seen slowing to 6.9%, from the preceding fiscal’s 7%, the agriculture, livestock, forestry and fishing sector — the bedrock of the rural economy, one of the largest providers of work and the second-largest generator of economic value outside the services economy — will see output expanding by 1.8%, the slowest in eight years and less than half of 2022-23’s 4% pace. And even this pace of growth may be optimistic given the estimated shortfall in kharif output and lag in rabi sowing, particularly in paddy and pulses. Equally, the second-largest component of the services economy, the omnibus trade, hotels, transport, communication and broadcasting sector — also a large provider of jobs — is estimated to witness more than a halving in the pace of growth — to 6.3%, from 14% last fiscal. Here too, the estimates reflect the trend evident in the NSO’s November 30 release of second-quarter GDP estimates, and underscore the underlying loss of momentum in the post-pandemic rebound in services.On the demand side, private final consumption expenditure — the largest component of GDP with a share that till two decades ago exceeded 60% — is projected to log its slowest non-pandemic year expansion in more than 20 years. At 4.4%, private consumption spending growth is estimated to have been at its lowest ebb since the pandemic and accompanying lockdowns caused spending to contract by more than 5% in 2020-21, and just over half of 2022-23’s 7.5% pace. With the rural economy struggling under the impact of the monsoon vagaries and the resultant weakness in farm output, demand for producers of a range of goods from soaps and detergents to packaged foods and two-wheelers is yet to regain any kind of vigour in the hinterland. Gross fixed capital formation, which includes government capital spending, remains the main bright spot and driver of momentum. The NSO pegs GFCF growing 10.3% to reach a record 34.9% share of GDP this fiscal. With the general election just ahead, policymakers face an unenviable choice — keep the spending spigot fully open to prop up growth at the risk of fiscal slippage, or tighten the purse strings and risk further loss of momentum.',
                },
              ],
            },
            {
              role: 'model',
              parts: [
                {
                  text: "**Economic Growth and Consumption-Led Challenges in India**\n\nThe first advance estimates of national income for the current fiscal year in India present a mixed picture of economic growth and challenges in consumption-led demand. While the National Statistical Office (NSO) projects a marginally quicker real GDP growth of 7.3% compared to 2022-23's 7.2%, there are concerns about the durability of consumption-driven growth.\n\n**Key Points:**\n\n* **Sectoral Output:** Gross value added (GVA) growth is estimated to slow to 6.9% from the previous fiscal's 7%. The agriculture sector, a crucial provider of employment and economic value, is projected to expand by only 1.8%, the slowest pace in eight years.\n\n* **Services Sector:** The trade, hotels, transport, communication, and broadcasting sector, a significant contributor to the services economy, is estimated to witness a more than halving in growth rate to 6.3% from 14% in the previous fiscal year.\n\n* **Private Consumption Expenditure:** Private final consumption expenditure, the largest component of GDP, is projected to grow at its slowest non-pandemic year expansion in over 20 years, at 4.4%. This reflects the ongoing weakness in rural demand and the impact of monsoon vagaries on farm output.\n\n* **Gross Fixed Capital Formation:** Gross fixed capital formation, which includes government capital spending, remains a bright spot, estimated to grow by 10.3% and reach a record 34.9% share of GDP.\n\n* **Policy Dilemma:** Policymakers face a difficult choice between maintaining high levels of government spending to support growth, risking fiscal slippage, or tightening the purse strings and potentially further slowing economic momentum.\n\n**Challenges and Implications:**\n\n1. **Rural Economy:** The slowdown in agricultural growth and weak rural demand pose challenges for producers of consumer goods and two-wheelers.\n\n2. **Services Sector:** The loss of momentum in the services sector, particularly in trade, hotels, and transportation, indicates underlying weaknesses in post-pandemic recovery.\n\n3. **Consumption-Led Growth:** The subdued private consumption expenditure raises concerns about the sustainability of economic growth, as consumption is a key driver of overall economic activity.\n\n4. **Government Spending:** Elevated government spending has been a significant contributor to economic growth, but policymakers must balance the need for fiscal discipline with the risk of slowing growth.\n\n5. **Policy Dilemma:** The upcoming general election adds to the complexity of policy decisions, as policymakers must consider the trade-offs between short-term growth and long-term fiscal stability.\n\nIn conclusion, the Indian economy faces challenges in achieving durable consumption-led growth, despite projections of marginally improved GDP growth. The slowdown in agriculture, weakness in the services sector, and subdued private consumption expenditure require careful policy navigation to maintain economic momentum while ensuring fiscal prudence.",
                },
              ],
            },
            {
              role: 'user',
              parts: [{ text: 'good write like this in future articles' }],
            },
            {
              role: 'model',
              parts: [
                {
                  text: 'Thank you for your feedback. I will strive to maintain a high standard of writing in future articles, ensuring that they are informative, engaging, and well-structured. Here are some key points I will focus on:\n\n* **Clear and Concise:** I will aim to present complex information in a clear and concise manner, using simple language and avoiding jargon.\n\n* **Accuracy and Reliability:** I will thoroughly research my topics and ensure that the information I present is accurate and reliable. I will cite reputable sources and avoid making unsubstantiated claims.\n\n* **Well-Structured:** I will organize my articles into logical sections and paragraphs, with a clear introduction, body, and conclusion. I will use headings and subheadings to improve readability and help readers navigate the content easily.\n\n* **Engaging and Interesting:** I will strive to make my articles engaging and interesting to read, using vivid language, anecdotes, and examples to illustrate key points. I will also incorporate visuals, such as charts, graphs, and images, to enhance understanding and make the content more visually appealing.\n\n* **Thought-Provoking and Insightful:** I will aim to provide readers with thought-provoking insights and perspectives on the topics I cover. I will encourage readers to think critically about the issues and form their own opinions.\n\n* **Professional and Objective:** I will maintain a professional and objective tone in my writing, avoiding personal biases or emotional language. I will strive to present a balanced and fair analysis of the facts and evidence.\n\nBy adhering to these principles, I hope to produce high-quality articles that inform, engage, and stimulate thought among my readers.',
                },
              ],
            },
          ];

    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history,
    });

    let msg: string;

    if (type === 'title') {
      msg = `write title with the same context and length should not be more than 20 words - ${data}`;
    } else {
      msg = `Article - ${data}`;
    }

    const result = await chat.sendMessage(msg);
    const response = result.response;
    const text = response.text();
    return text.replaceAll('\n', '<br/>');
  } catch (error) {
    throw new Error(error);
  }
}
