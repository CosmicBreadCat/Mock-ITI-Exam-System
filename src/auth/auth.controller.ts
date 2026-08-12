import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/signin')
  signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body.email, body.password);
  }

  // Depricated, will be moved to users controller as an admin/manager only action
  // @Public()
  // @Post('/signup')
  // signUp(@Body() body: SignUpDto) {
  //   return this.authService.signUp(body.name, body.email, body.password);
  // }
}
