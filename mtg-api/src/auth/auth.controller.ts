import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { SigninDto } from './dtos/signin.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from 'src/modules/user/dtos/create-user.dto';
import { UserService } from 'src/modules/user/user.service';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: SigninDto })
  @Post('signin')
  async signin(@Request() request) {
    const access_token = await this.authService.login({
      email: request.user.email,
      id: request.user.id,
      role: request.user.role,
    });

    return {
      user: request.user,
      ...access_token,
    };
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    const access_token = await this.authService.login({
      email: user.email,
      id: user.id,
      role: user.role,
    });

    return {
      user,
      ...access_token,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return {
      user: req.user,
    };
  }
}
