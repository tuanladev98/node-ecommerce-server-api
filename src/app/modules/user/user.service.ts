import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/app/repositories/user.repository';
import { UserRole } from 'src/app/vendors/common/enums';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  getAll() {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.role = :role', { role: UserRole.CLIENT })
      .getMany();
  }

  getOne(userId: number) {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.orders', 'order')
      .leftJoinAndSelect('order.bills', 'bill')
      .leftJoinAndSelect('bill.product', 'product')
      .leftJoinAndSelect('bill.size', 'size')
      .where('user.id = :userId', { userId })
      .getOne();
  }
}
