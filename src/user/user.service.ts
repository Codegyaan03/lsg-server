import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RequestWithUser } from './interface';

@Injectable()
export class UserService {
  constructor(
    private prism: PrismaService,
    private jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const isEmailExist = await this.prism.user.findFirst({
      where: { email: createUserDto.email },
    });
    if (isEmailExist) {
      throw new BadRequestException('Email already exist');
    }
    const hash = await argon2.hash(createUserDto.password);
    delete createUserDto.confirm_password;
    return await this.prism.user.create({
      data: { ...createUserDto, password: hash },
    });
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.prism.user.findFirst({
      where: { email: loginUserDto.email },
    });

    if (!user) {
      throw new NotFoundException('Credentials are wrong.');
    }
    const isMatch = await argon2.verify(user.password, loginUserDto.password);
    if (!isMatch) {
      throw new NotFoundException('Credentials are wrong.');
    }
    debugger;
    const payload: RequestWithUser['user'] = { sub: user.id, role: user.role };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1d',
    });

    return {
      access_token: access_token,
    };
  }

  async me(req: RequestWithUser) {
    const user = await this.prism.user.findUnique({
      where: { id: req.user.sub },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { user, success: true, message: 'User found successfully.' };
  }

  async findOne(id: string) {
    const user = await this.prism.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { user, success: true, message: 'User found successfully.' };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return updateUserDto;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
