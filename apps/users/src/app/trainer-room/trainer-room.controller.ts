import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Patch,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { TrainingRdo } from './rdo/training.tdo';
import { RoleTrainerGuard } from '../auth/guards/role-trainer.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import CreateTrainingDto from './dto/create-training.dto';
import { fillObject } from '@fit-friends/core';
import { UpdateTrainingDto } from './dto/update-training.dto';
import { TrainingQuery } from './query/training.query';
import { IRequestWithTokenPayload } from '@fit-friends/types';
import { OrderRdo } from './rdo/order.rdo';
import { OrdersQuery } from './query/order.query';

@ApiTags('trainer-room')
@Controller('trainer-room')
export class TrainerRoomController {
  constructor(private readonly trainerRoomService: TrainerRoomService) {}

  @ApiResponse({
    type: TrainingRdo,
    status: HttpStatus.CREATED,
    description: 'The new training has been successfully created.',
  })
  @UseGuards(RoleTrainerGuard, JwtAuthGuard)
  @Post('/create-training')
  public async create(@Body() dto: CreateTrainingDto) {
    const newTraining = await this.trainerRoomService.create(dto);
    return fillObject(TrainingRdo, newTraining);
  }

  @ApiResponse({
    type: TrainingRdo,
    status: HttpStatus.OK,
    description: 'The training has been successfully updates.',
  })
  @UseGuards(RoleTrainerGuard, JwtAuthGuard)
  @Patch('training/:id')
  public async update(@Param('id') id: number, @Body() dto: UpdateTrainingDto) {
    const updatedTraiding = await this.trainerRoomService.update(id, dto);
    return fillObject(TrainingRdo, updatedTraiding);
  }

  @UseGuards(JwtAuthGuard)
  @Get('training/:id')
  public async show(@Param('id') id: number) {
    const updatedTraiding = await this.trainerRoomService.getTraining(id);
    return fillObject(TrainingRdo, updatedTraiding);
  }

  @ApiResponse({
    type: TrainingRdo,
    status: HttpStatus.OK,
    description: 'The training list has been successfully created.',
  })
  @UseGuards(RoleTrainerGuard, JwtAuthGuard)
  @Get('trainings/feed')
  public async feedLine(
    @Query() query: TrainingQuery,
    @Req() { user: payload }: IRequestWithTokenPayload,
  ) {
    const trainings = await this.trainerRoomService.getTrainings(
      query,
      payload.sub,
    );
    return { ...fillObject(TrainingRdo, trainings) };
  }

  @ApiResponse({
    type: OrderRdo,
    status: HttpStatus.OK,
    description: 'Get trainer orders',
  })
  @UseGuards(JwtAuthGuard, RoleTrainerGuard)
  @Get('orders')
  async findTrainerOrders(
    @Req() req: IRequestWithTokenPayload,
    @Query() query: OrdersQuery,
  ) {
    const trainerId: number = req?.user.sub;
    const trainerOrders = await this.trainerRoomService.getTrainerOrders(
      trainerId,
      query,
    );

    return fillObject(OrderRdo, trainerOrders);
  }
}
