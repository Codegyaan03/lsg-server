import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { generateText } from './bot';
import logger from './logger';
import { PrismaService } from 'src/prisma.service';
// import { faker } from "@faker-js/faker";

const sourceObj = {
  thehindu: 'the hindu',
  indianexpress: 'the indian express',
  thehindubusinessline: 'the hindu business line',
};

const loadData = async (link: string) => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const url = link;
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  const html = await page.content();

  const $ = cheerio.load(html);

  browser.close();
  return $;
};

export const getDrishtiIasEditorialsList = async (prisma: PrismaService) => {
  logger.info('Load editorial page.');
  const $ = await loadData(
    'https://www.drishtiias.com/current-affairs-news-analysis-editorials',
  );

  logger.info('Fetching all editorial links.');

  const dailyNewsLinks = $(
    'article .row .column:last-child .box-slide .box-hide ul li a',
  )
    .toArray()
    .map((el) => $(el).attr('href'));

  logger.info('Fetching editorial content by links.');
  const PQueue = await import('p-queue').then((m) => m.default);
  const queue = new PQueue({ concurrency: 5 });

  const editorial = await Promise.all(
    dailyNewsLinks.reverse().map(async (link) => {
      return queue.add(() => getDrishtiIasContent(link, prisma));
    }),
  );

  if (editorial.flat().length === 0) {
    return [];
  }

  logger.info('Saving all editorial.');

  await prisma.$transaction(async (tx) => {
    await tx.source.createMany({
      data: editorial.flat().map((item) => ({
        title: item.sourceName,
        link: item.link,
        originalSource: item.originalSource,
      })),
    });

    const editorialData = await Promise.all(
      editorial.flat().map(async (item) => ({
        title: item.title,
        content: item.content,
        sourceId: (await tx.source.findUnique({ where: { link: item.link } }))
          .id,
      })),
    );

    await tx.editorial.createMany({
      data: editorialData,
    });
    logger.info('successfully saved editorial.');
  });

  return editorial.flat();
};

const getDrishtiIasContent = async (
  link: string | undefined,
  prisma: PrismaService,
) => {
  const isFetchedLink = await prisma.source.findUnique({
    where: { originalSource: link },
  });

  if (isFetchedLink) return [];

  logger.info(`Fetching content from ${link}`);
  const $ = await loadData(link);

  const sourceLink = $('.article-detail .border p a').attr('href');

  if (!sourceLink) {
    return [];
  }

  logger.info('Customize editorial content.');

  const [title, content] = await Promise.all([
    generateText($('.article-detail h2').text().trim(), 'title'),
    generateText(
      $('.article-detail')
        .children(
          ':not(script, #disqus_thread, .border-bg, noscript, #disqus_recommendations, .next-post, .actions, .tags-new, .border, h2)',
        )
        .text()
        .trim(),
      'content',
    ),
  ]);
  logger.info(`Successfully fetched editorial content. from ${link}`);

  return {
    title,
    content,
    link: sourceLink,
    originalSource: link,
    sourceName:
      sourceObj[
        sourceLink.match(/https:\/\/(?:www\.)?([a-zA-Z0-9-]+)\.com/)?.[1]
      ],
  };
};

const getHinduEditorialContent = async (link: string) => {
  logger.info(`Fetching editorial content. from ${link}`);

  const $ = await loadData(link);

  logger.info('Customize editorial content.');

  const [title, content] = await Promise.all([
    generateText($('.editorial .title').text().trim(), 'title'),
    generateText(
      $('.editorial .articlebodycontent > p').text().trim(),
      'content',
    ),
  ]);
  logger.info(`Successfully fetched editorial content. from ${link}`);
  return { title, link, content, source: 'the hindu' };
};

export const getListOfHinduEditorials = async (prisma: PrismaService) => {
  logger.info('Fetching hindu editorial list');
  const $ = await loadData('https://www.thehindu.com/opinion/editorial/');

  const links = $('.editorial-section .element.wide-row-element .title a')
    .toArray()
    .map((el) => $(el).attr('href'));

  const promise = links.map(async (link) => {
    const isFetchedLink = await prisma.source.findFirst({
      where: { link },
    });
    if (isFetchedLink) return [];
    return getHinduEditorialContent(link);
  });
  const editorials = await Promise.all(promise);

  if (editorials.flat().length === 0) {
    return [];
  }

  logger.info('saving hindu editorial list');
  await prisma.$transaction(async (tx) => {
    await tx.source.createMany({
      data: editorials.flat().map((item) => ({
        title: item.source,
        link: item.link,
        originalSource: item.link,
      })),
    });

    const editorialData = await Promise.all(
      editorials.flat().map(async (item) => ({
        title: item.title,
        content: item.content,
        sourceId: (await tx.source.findFirst({ where: { link: item.link } }))
          .id,
      })),
    );

    await tx.editorial.createMany({
      data: editorialData,
    });
  });
  logger.info('Successfully fetched and saved hindu editorial list');
  return editorials.flat();
};
