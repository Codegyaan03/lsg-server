import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum ScrapeOption {
  THE_HINDU,
}

export class CreateScrapeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ScrapeOption, { message: 'Invalid option' })
  option: ScrapeOption;
}
