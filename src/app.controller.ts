import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  // constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
