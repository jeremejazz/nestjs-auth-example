import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { User } from '../users/entities/user.entity';
import { SignInDTO } from './dto/signin.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signUp(signupDto: SignUpDto): Promise<User | null> {
    const { username, password, fullName } = signupDto;
    const existing = await this.usersService.findByUsername(username);
    if (existing) {
      throw new BadRequestException('Username exists');
    }

    const hashed = await this.hashPassword(password);

    return await this.usersService.create({
      username,
      password: hashed,
      fullName,
    });
  }

  async signIn(signInDTO: SignInDTO): Promise<User | void> {
    const { username, password } = signInDTO;

    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new BadRequestException('Invalid Login Credentials');
    }

    const isPasswordValid = await this.comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid Login Credentials');
    }

    return user;
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();

    return await bcrypt.hash(password, salt);
  }

  async comparePassword(password: string, hashed: string): Promise<boolean> {
    const result = await bcrypt.compare(password, hashed);
    return result;
  }
}
