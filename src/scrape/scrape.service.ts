import { Injectable } from '@nestjs/common';
import { CreateScrapeDto, ScrapeOption } from './dto/index.dto';
import { PrismaService } from 'src/prisma.service';
import { ScrapeFunctions } from 'src/scrape/scrape.functions';

@Injectable()
export class ScrapeService {
  constructor(
    private prisma: PrismaService,
    private scrapeFunctions: ScrapeFunctions,
  ) {}

  async scrapeData(scrapeData: CreateScrapeDto) {
    const option: ScrapeOption | undefined = scrapeData.option;
    switch (option) {
      case ScrapeOption.THE_HINDU: {
        const latestHinduEditorialList =
          await this.scrapeFunctions.getListOfHinduEditorials();

        if (latestHinduEditorialList.length === 0) {
          return {
            success: true,
            message: 'Already fetched hindu editorial.',
          };
        }
        return {
          success: true,
          data: latestHinduEditorialList,
        };
      }

      case ScrapeOption.DRISHTI_IAS: {
        const list = await this.scrapeFunctions.getDrishtiIasEditorialsList();

        if (list.length === 0) {
          return {
            success: true,
            message: 'Already fetched Drishti IAS editorial.',
          };
        }
        return {
          success: true,
          message: 'Successfully fetched Drishti IAS editorial.',
          data: list,
        };
      }

      default: {
        return 'empty case';
      }
    }
  }

  async findAll() {
    // find editorial with pagination
    const editorial = await this.prisma.editorial.findMany({
      take: 10,
      select: {
        id: true,
        title: true,
        content: true,
        source: {
          select: {
            id: true,
            title: true,
            link: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (editorial.length === 0) {
      return {
        success: true,
        message: 'No editorial found',
      };
    }

    return {
      success: true,
      data: editorial,
      message: 'Editorial fetched successfully',
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} scrape`;
  }

  update(id: number) {
    return `This action updates a #${id} scrape`;
  }

  remove(id: number) {
    return `This action removes a #${id} scrape`;
  }
}
