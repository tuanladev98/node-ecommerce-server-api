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

  private makeUserCode() {
    const colors = [
      '#4c5899',
      '#4c7a99',
      '#ee99ee',
      '#039e9e',
      '#4c3658',
      '#253949',
      '#8c5061',
      '#d87f81',
      '#673444',
      '#814355',
      '#ae6378',
      '#79616f',
      '#d49b7e',
      '#ffc04c',
      '#3a1a8a',
      '#f68815',
      '#642f74',
      '#dd6f14',
      '#cc6600',
      '#3366cc',
      '#663366',
      '#696865',
      '#e5690e',
      '#00717c',
      '#55ffee',
      '#66ffee',
      '#ddffee',
      '#ddffff',
      '#33c0ff',
      '#5588dd',
      '#6699dd',
      '#555588',
      '#faefae',
      '#66cc80',
      '#33ccaa',
      '#66cc55',
      '#55cc66',
      '#c7bb81',
      '#1a472a',
      '#007291',
    ];

    return colors[Math.floor(Math.random() * colors.length)];
  }

  registerUser(email: string, password: string, name: string, gender: Gender) {
    return this.userRepository.save(
      this.userRepository.create({
        email,
        password: bcrypt.hashSync(password, 12),
        name,
        gender,
        userColor: this.makeUserCode(),
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
