import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
// import { faker } from "@faker-js/faker";

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
