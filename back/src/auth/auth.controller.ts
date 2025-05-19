import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TelegramAuthDto } from './dto/telegram-auth.dto';
import { TelegramAuthGuard } from './guards/telegram.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('telegram')
  @UseGuards(TelegramAuthGuard)
  async telegramAuth(@Body() userData: any) {
    const user = await this.authService.findOrCreateUser(userData);
    return { user };
  }
}