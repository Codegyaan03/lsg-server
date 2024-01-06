import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { generateText } from './bot';
import logger from 'src/utils/logger';
// import { faker } from "@faker-js/faker";

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

export const getListOfEditorials = async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const url =
    'https://www.drishtiias.com/current-affairs-news-analysis-editorials';
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  const html = await page.content();

  const $ = cheerio.load(html);

  const dailyNewsLinks = $(
    'article .row .column:first .box-slide .box-hide ul li a',
  )
    .toArray()
    .map((el) => $(el).attr('href'));

  browser.close();
  return dailyNewsLinks;
};

export const getEditorialByDate = async (link: string | undefined) => {
  if (!link) return [];
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  // await page.setUserAgent(faker.internet.userAgent());

  await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 0 });
  const html = await page.content();

  const $ = cheerio.load(html);

  const list = $('article .article-detail h2 a')
    .toArray()
    .map((el) => $(el).attr('href'));

  browser.close();
  return list;
};

const getHinduEditorialContent = async (link: string) => {
  const $ = await loadData(link);

  logger.info('Update content.');
  const [title, content] = await Promise.all([
    generateText($('.editorial .title').text().trim(), 'title'),
    generateText(
      $('.editorial .articlebodycontent > p').text().trim(),
      'content',
    ),
  ]);
  return { title, link, content, source: 'the hindu' };
};

export const getListOfHinduEditorials = async () => {
  logger.info('Fetching hindu editorial list');
  const $ = await loadData('https://www.thehindu.com/opinion/editorial/');

  logger.info('Fetching hindu editorial content');

  const links = $('.editorial-section .element.wide-row-element .title a')
    .toArray()
    .map((el) => $(el).attr('href'));

  const promise = links.map((link) => getHinduEditorialContent(link));
  const editorials = await Promise.all(promise);
  return editorials.flat();
};
