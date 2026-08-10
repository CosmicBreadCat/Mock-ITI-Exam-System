import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { genSalt, hash as bHash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(name: string, email: string, password: string) {
    if (await this.usersService.findByEmail(email)) {
      this.logger.warn(`Email ${email} is already in use`);
      throw new BadRequestException('Email already in use');
    }

    const salt = await genSalt(10);
    const hash = await bHash(password, salt);

    const user = await this.usersService.create(name, email, hash);
    return user;
  }

  async signIn(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      this.logger.warn(`User with email ${email} is not found`);
      throw new NotFoundException('User not found');
    }

    const match = await compare(password, user.password);

    if (!match) {
      this.logger.warn(`Bad password for email ${email}`);
      throw new BadRequestException('Bad password');
    }

    const payload = { sub: user.id, email: user.email };
    const response = {
      access_token: await this.jwtService.signAsync(payload),
    };

    this.logger.log(`Created access token for email ${email} successfully`);
    return response;
  }
}
