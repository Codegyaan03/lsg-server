import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { generateText } from '../utils/bot';
import { PrismaService } from 'src/prisma.service';
import { Injectable } from '@nestjs/common';
import { CustomWinstonLogger } from 'src/custom-winston-logger/custom-winston-logger';

const sourceObj = {
  thehindu: 'the hindu',
  indianexpress: 'the indian express',
  thehindubusinessline: 'the hindu business line',
};

@Injectable()
export class ScrapeFunctions {
  constructor(
    private loggerInstance: CustomWinstonLogger,
    private prisma: PrismaService,
  ) {}

  loadData = async (link: string) => {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      ignoreDefaultArgs: ['--disable-extensions'],
      protocolTimeout: 300000,
    });
    const page = await browser.newPage();

    const url = link;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 300000 });
    const html = await page.content();

    const $ = cheerio.load(html);

    browser.close();
    return $;
  };

  getDrishtiIasEditorialsList = async () => {
    this.loggerInstance.getLogger().info('Load Drishti editorial page.');
    const $ = await this.loadData(
      'https://www.drishtiias.com/current-affairs-news-analysis-editorials',
    );

    this.loggerInstance.getLogger().info('Fetching all editorial links.');

    const dailyNewsLinks = $(
      'article .row .column:last-child .box-slide .box-hide ul li a',
    )
      .toArray()
      .map((el) => $(el).attr('href'));

    this.loggerInstance
      .getLogger()
      .info('Fetching editorial content by links.');
    const PQueue = await import('p-queue').then((m) => m.default);
    const queue = new PQueue({ concurrency: 5 });

    const editorial = await Promise.all(
      dailyNewsLinks.reverse().map(async (link) => {
        return queue.add(() => this.getDrishtiIasContent(link));
      }),
    );

    if (editorial.flat().length === 0) {
      this.loggerInstance
        .getLogger()
        .info('Already fetched Drishti IAS editorials.');
      return [];
    }

    this.loggerInstance.getLogger().info('Saving all editorials.');

    await this.prisma.$transaction(async (tx) => {
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
      this.loggerInstance.getLogger().info('Successfully saved editorial.');
    });

    return editorial.flat();
  };

  getDrishtiIasContent = async (link: string | undefined) => {
    const isFetchedLink = await this.prisma.source.findUnique({
      where: { originalSource: link },
    });

    if (isFetchedLink) return [];

    this.loggerInstance.getLogger().info(`Fetching content from ${link}`);
    const $ = await this.loadData(link);

    const sourceLink = $('.article-detail .border p a').attr('href');

    if (!sourceLink) {
      return [];
    }

    this.loggerInstance.getLogger().info('Customize editorial content.');

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
    this.loggerInstance
      .getLogger()
      .info(`Successfully fetched editorial content from ${link}`);

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

  getHinduEditorialContent = async (link: string) => {
    this.loggerInstance
      .getLogger()
      .info(`Fetching editorial content from ${link}`);

    const $ = await this.loadData(link);

    this.loggerInstance.getLogger().info('Customize editorial content.');

    const [title, content] = await Promise.all([
      generateText($('.editorial .title').text().trim(), 'title'),
      generateText(
        $('.editorial .articlebodycontent > p').text().trim(),
        'content',
      ),
    ]);
    this.loggerInstance
      .getLogger()
      .info(`Successfully fetched editorial content from ${link}`);
    return { title, link, content, source: 'the hindu' };
  };

  getListOfHinduEditorials = async () => {
    this.loggerInstance.getLogger().info('Fetching hindu editorials list');
    const $ = await this.loadData(
      'https://www.thehindu.com/opinion/editorial/',
    );

    const links = $('.editorial-section .element.wide-row-element .title a')
      .toArray()
      .map((el) => $(el).attr('href'));

    const promise = links.map(async (link) => {
      const isFetchedLink = await this.prisma.source.findFirst({
        where: { link },
      });
      if (isFetchedLink) return [];
      return this.getHinduEditorialContent(link);
    });
    const editorials = await Promise.all(promise);

    if (editorials.flat().length === 0) {
      this.loggerInstance.getLogger().info('Already fetched hindu editorials');

      return [];
    }

    this.loggerInstance.getLogger().info('Saving hindu editorial list');
    await this.prisma.$transaction(async (tx) => {
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
    this.loggerInstance
      .getLogger()
      .info('Successfully fetched and saved hindu editorial list');
    return editorials.flat();
  };
}
