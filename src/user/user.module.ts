import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/constant';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, JwtService],
  imports: [
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      privateKey: JWT_SECRET,
    }),
  ],
})
export class UserModule {}
