import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserRdo } from './rdo/user.rdo';
import { CreateUserDto } from './dto/create-user.dto';
import { fillObject } from '@fit-friends/util/util-core';
import { LoggedUserRdo } from './rdo/logged-user.rdo';
import { LoginUserDto } from './dto/login-user.dto';
import { UserRole } from '@fit-friends/shared/app-types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    type: UserRdo,
    status: HttpStatus.CREATED,
    description: 'The new user has been successfully created.',
  })
  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() dto: CreateUserDto): Promise<UserRdo> {
    const newUser = await this.authService.createUser(dto);
    return fillObject(UserRdo, newUser);
  }

  @ApiResponse({
    type: LoggedUserRdo,
    status: HttpStatus.OK,
    description: 'User has been successfully logged.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Password or Login is wrong.',
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() dto: LoginUserDto): Promise<LoggedUserRdo> {
    const verifiedUser = await this.authService.verifyUser(dto);
    const loggedUser = await this.authService.createUserToken(verifiedUser);
    return fillObject(LoggedUserRdo, Object.assign(verifiedUser, loggedUser));
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get a new access/refresh tokens',
  })
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  public async refreshToken(@Req() { user }: RequestWithUser) {
    return this.authService.createUserToken(user);
  }

  @ApiResponse({
    type: UserRdo,
    status: HttpStatus.OK,
    description: 'Users list complete.',
  })
  @Roles(UserRole.Client)
  @UseGuards(UserRolesGuard)
  @Get('/feed')
  public async feedLine(
    @Query(new ValidationPipe({ transform: true })) query: UserQuery
  ) {
    const users = await this.authService.getUsers(query);
    return { ...fillObject(UserRdo, users) };
  }

  @ApiResponse({
    type: UserRdo,
    status: HttpStatus.OK,
    description: 'User updated.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/update')
  public async update(
    @Req() { user: payload }: RequestWithTokenPayload,
    @Body() dto: UpdateUserDto
  ) {
    const id = payload.sub;
    const updatedUser = await this.authService.updateUser(id, dto);
    return fillObject(UserRdo, updatedUser);
  }

  @ApiResponse({
    type: UserRdo,
    status: HttpStatus.OK,
    description: 'User by id received',
  })
  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  public async show(@Param('id', ParseIntPipe) id: number) {
    const user = await this.authService.getUser(id);
    return fillObject(UserRdo, user);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Checkig token availibility',
  })
  @UseGuards(JwtAuthGuard)
  @Get('check')
  public async checkToken(@Req() { user: payload }: RequestWithTokenPayload) {
    return payload;
  }
}
