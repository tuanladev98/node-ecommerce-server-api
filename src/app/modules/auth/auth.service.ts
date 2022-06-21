import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserRepository } from 'src/app/repositories/user.repository';
import { Gender } from 'src/app/vendors/common/enums';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  registerUser(email: string, password: string, name: string, gender: Gender) {
    return this.userRepository.save(
      this.userRepository.create({
        email,
        password: bcrypt.hashSync(password, 12),
        name,
        gender,
      }),
    );
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'password', 'role'],
    });
    if (!user) throw new UnauthorizedException('Wrong credentials.');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Wrong credentials.');

    const accessToken = this.jwtService.sign(
      {
        userId: user.id,
        role: user.role,
      },
      { expiresIn: '24h' },
    );

    const userInfo = await this.userRepository.findOne({ where: { email } });

    return { userInfo, accessToken };
  }
}
