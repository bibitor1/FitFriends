import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'node:crypto';
import { AuthErrorMessage, IUser } from '@fit-friends/types';
import { UserRepository } from '../user/user.repository';
import { UserEntity } from '../user/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { createJWTPayload } from '@fit-friends/core';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly configService: ConfigService,
  ) {}

  public async createUser(dto: CreateUserDto): Promise<IUser> {
    const newUser = {
      ...dto,
      passwordHash: '',
      orders: [],
      personalOrders: [],
      balance: [],
      friends: [],
    };

    const existUser = await this.userRepository.findByEmail(dto.email);

    if (existUser) {
      throw new ConflictException(AuthErrorMessage.UserAlreadyExist);
    }

    const userEntity = await new UserEntity(newUser).setPassword(dto.password);

    return await this.userRepository.create(userEntity);
  }

  public async verifyUser(dto: LoginUserDto) {
    const { email, password } = dto;
    const existUser = await this.userRepository.findByEmail(email);

    if (!existUser) {
      throw new NotFoundException(AuthErrorMessage.UserNotFound);
    }

    const userEntity = new UserEntity(existUser);
    if (!(await userEntity.comparePassword(password))) {
      throw new UnauthorizedException(
        AuthErrorMessage.UserPasswordOrEmailWrong,
      );
    }

    return existUser;
  }

  public async logout(id: number) {
    await this.refreshTokenService.deleteByUserId(id);
  }

  public async createUserToken(user: IUser) {
    const accessTokenPayload = createJWTPayload(user);
    const refreshTokenPayload = {
      ...accessTokenPayload,
      tokenId: crypto.randomUUID(),
    };

    await this.refreshTokenService.createRefreshSession(refreshTokenPayload);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userInfo } = user;

    return {
      userInfo,
      access_token: await this.jwtService.signAsync(accessTokenPayload, {
        secret: this.configService.get<string>('jwt.accessTokenSecret'),
        expiresIn: this.configService.get<string>('jwt.accessTokenExpiresIn'),
      }),
      refresh_token: await this.jwtService.signAsync(refreshTokenPayload, {
        secret: this.configService.get<string>('jwt.refreshTokenSecret'),
        expiresIn: this.configService.get<string>('jwt.refreshTokenExpiresIn'),
      }),
    };
  }
}
