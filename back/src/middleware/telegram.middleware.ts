// telegram.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import * as CryptoJS from 'crypto-js';
import * as qs from 'query-string';

@Injectable()
export class TelegramAuthGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const initDataRaw = decodeURIComponent(request.headers['x-telegram-init-data']);
    console.log(initDataRaw)
    if (!initDataRaw) return true;

    const params = new URLSearchParams(initDataRaw);
    const parsedData = Object.fromEntries(params.entries());

    const hash = parsedData.hash;
    delete parsedData.hash;

    const dataCheckString = Object.keys(parsedData)
      .sort()
      .map(k => `${k}=${parsedData[k]}`)
      .join('\n');

    const secretKey = CryptoJS.HmacSHA256(
      process.env.TELEGRAM_BOT_TOKEN,
      'WebAppData'
    );

    const calculatedHash = CryptoJS.HmacSHA256(dataCheckString, secretKey).toString(CryptoJS.enc.Hex);

    if (calculatedHash === hash) {
      request.telegramUser = parsedData.user ? JSON.parse(parsedData.user) : null;
      return true;
    }

    return false;
  }
}