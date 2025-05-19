import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { verifyTelegramAuth } from '../../utils/telegram-auth';

@Injectable()
export class TelegramAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { initData } = request.body;
    
    try {
      const userData = await verifyTelegramAuth(initData);
      request.user = userData;
      return true;
    } catch (error) {
      return false;
    }
  }
}