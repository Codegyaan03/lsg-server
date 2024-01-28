import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ScrapeModule } from './scrape/scrape.module';
import { CustomWinstonLogger } from './custom-winston-logger/custom-winston-logger';
import { SocketGateway } from './socket/socket.gateway';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: 'memory',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    ScrapeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SocketGateway,
    CustomWinstonLogger,
    JwtService,
    PrismaService,
  ],
})
export class AppModule {}
