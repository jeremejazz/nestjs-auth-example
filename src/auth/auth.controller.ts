import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto/signin.dto';
import { User } from 'src/users/entities/user.entity';

import { SignUpDto } from './dto/signup.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @Public()
  async signIn(@Body() signInDTO: SignInDTO) {
    return await this.authService.signIn(signInDTO);
  }

  @Post('signup')
  @Public()
  async signUp(@Body() signupDto: SignUpDto): Promise<User | null> {
    const user = await this.authService.signUp(signupDto);

    return user;
  }
}
