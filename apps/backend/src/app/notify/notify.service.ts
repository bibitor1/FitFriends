import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  IFriendInfo,
  INewTrainingInfo,
  INotify,
  ISubscriber,
} from '@fit-friends/types';
import { CreateNotifyDto } from './dto/create-notify.dto';
import { NotifyEntity } from './notify.entity';
import { NotifyRepository } from './notify.repository';
import { UserRepository } from '../user/user.repository';
import { NotificationMessages } from './notify.constant';
import { MailService } from '../mail/mail.service';

@Injectable()
export class NotifyService {
  private readonly logger = new Logger(NotifyService.name);

  constructor(
    private readonly notifyRepository: NotifyRepository,
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
  ) {}

  public async addSubscribe(dto: ISubscriber) {
    this.mailService.sendMailNewSubscribe(dto);
    const notifyEntity = new NotifyEntity({
      targetUserEmail: dto.email,
      text: NotificationMessages.SubscribeText,
    });
    const newNotify = await this.notifyRepository.create(notifyEntity);
    return newNotify;
  }

  public async deleteSubscribe(dto: ISubscriber) {
    this.mailService.sendMailUnsubscribe(dto);
    const notifyEntity = new NotifyEntity({
      targetUserEmail: dto.email,
      text: NotificationMessages.UnSubscribeText,
    });
    const newNotify = await this.makeNewNotify(notifyEntity);
    return newNotify;
  }

  public async addNewTraining(dto: INewTrainingInfo) {
    const { title, email } = dto;
    const text = `Появилась новая тренировка ${title}`;
    this.makeNewNotify({ targetUserEmail: email, text });
    await this.mailService.sendMailNewTraining(dto);
  }

  public async addFriend(dto: IFriendInfo) {
    const { srcEmail, srcName } = dto;
    const text = `У вас новый друг: ${srcName}, ${srcEmail}`;
    this.makeNewNotify({ targetUserEmail: dto.targetEmail, text });
    await this.mailService.sendMailNewFriend(dto);
  }

  public async makeNewNotify(dto: CreateNotifyDto): Promise<INotify> {
    const targetUser = await this.userRepository
      .findByEmail(dto.targetUserEmail)
      .catch((err) => {
        this.logger.error(err);
        throw new NotFoundException('User with this id not found');
      });

    if (!targetUser) {
      throw new NotFoundException('User with this id not found');
    }
    const entity = new NotifyEntity({ ...dto });
    return await this.notifyRepository.create(entity);
  }

  public async deleteNotify(notifyId: number): Promise<void> {
    const notify = await this.notifyRepository
      .findById(notifyId)
      .catch((err) => {
        this.logger.error(err);
        throw new NotFoundException('Notify with this id not found');
      });

    if (!notify) {
      throw new NotFoundException('Notify with this id not found');
    }
    await this.notifyRepository.destroy(notifyId);
  }

  public async getNotifyById(id: number): Promise<INotify> {
    return await this.notifyRepository.findById(id);
  }

  public async getNotify(email: string): Promise<INotify[]> {
    return await this.notifyRepository.findByEmail(email);
  }
}
