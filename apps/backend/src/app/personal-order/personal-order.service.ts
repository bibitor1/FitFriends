import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PersonalOrderRepository } from './personal-order.repository';
import { UserRepository } from '../user/user.repository';
import { ITokenPayload, OrderStatus, UserRole } from '@fit-friends/types';
import { PersonalOrderEntity } from './personal-order.entity';

@Injectable()
export class PersonalOrderService {
  private readonly logger = new Logger(PersonalOrderService.name);

  constructor(
    private readonly personalOrderRepository: PersonalOrderRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async buyPersonalTraining(userId: number, trainerId: number) {
    const trainer = await this.userRepository
      .findById(trainerId)
      .catch((err) => {
        this.logger.error(err);
        throw new NotFoundException('User not found');
      });

    if (!trainer || trainer.role === UserRole.Client) {
      throw new NotFoundException('Trainer not found');
    }

    if (userId !== trainerId) {
      const entity = new PersonalOrderEntity({
        userId,
        trainerId,
        orderStatus: OrderStatus.Pending,
      });
      return await this.personalOrderRepository.create(entity);
    }
  }

  public async getPersonalOrder(orderId: number) {
    return await this.personalOrderRepository.findById(orderId);
  }

  public async getPersonalOrders(userId: number) {
    return await this.personalOrderRepository.findByUserId(userId);
  }

  public async changeStatus(
    payload: ITokenPayload,
    { orderId: orderId, newStatus: newStatus },
  ) {
    const order = await this.personalOrderRepository
      .findById(orderId)
      .catch((err) => {
        this.logger.error(err);
        throw new NotFoundException('Order not found');
      });

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.trainerId !== payload.sub) {
      throw new ForbiddenException('You are not the trainer');
    }

    if (order.orderStatus !== newStatus) {
      const entity = new PersonalOrderEntity({
        ...order,
        orderStatus: newStatus,
      });
      entity.createdAt = order.createdAt;
      await this.personalOrderRepository.update(orderId, entity);
      return await this.personalOrderRepository.findById(orderId);
    }
  }
}
