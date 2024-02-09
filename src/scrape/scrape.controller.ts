import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
} from '@nestjs/common';
import { ScrapeService } from './scrape.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateScrapeDto } from './dto/index.dto';
import { AuthGuard } from 'src/Decorators/guards/auth.guard';
import { Roles, RolesGuard } from 'src/Decorators/guards/roles.guard';
import { Role } from 'src/types';
import { Response } from 'express';
import { responseResult } from 'src/utils/response-result';

@ApiTags('Editorial')
@Controller('editorial')
export class ScrapeController {
  constructor(private readonly scrapeService: ScrapeService) {}

  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  @Post('scrape')
  scrapeData(@Body() scrapeData: CreateScrapeDto, @Res() res: Response) {
    res.json(responseResult(null, true, 'Scraping started.'));
    return this.scrapeService.scrapeData(scrapeData);
  }

  @Roles([Role.ADMIN, Role.AUTHOR])
  @UseGuards(AuthGuard, RolesGuard)
  @Get('all')
  findAll() {
    return this.scrapeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scrapeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.scrapeService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scrapeService.remove(+id);
  }
}
