import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/app/repositories/user.repository';
import { UserLogRepository } from 'src/app/repositories/user_log.repository';
import { UserLogType, UserRole } from 'src/app/vendors/common/enums';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userLogRepository: UserLogRepository,
  ) {}

  getAll() {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.orders', 'order')
      .where('user.role = :role', { role: UserRole.CLIENT })
      .getMany();
  }

  getOne(userId: number) {
    return (
      this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.orders', 'order')
        .leftJoinAndSelect('order.user', 'user_order')
        // .leftJoinAndSelect('order.bills', 'bill')
        // .leftJoinAndSelect('bill.product', 'product')
        // .leftJoinAndSelect('bill.size', 'size')
        .where('user.id = :userId', { userId })
        .orderBy('order.created_at', 'DESC')
        .getOne()
    );
  }

  addLog(userId: number, logType: UserLogType) {
    return this.userLogRepository.save(
      this.userLogRepository.create({
        userId,
        logType,
      }),
    );
  }
}
