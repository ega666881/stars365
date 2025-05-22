import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LocalhostOnlyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const allowedIps = ['127.0.0.1', '::1'];

    // Получаем IP клиента
    const ip = req.ip || req.connection.remoteAddress;
    console.log(ip)
    if (!ip || !allowedIps.includes(ip.trim())) {
      return res.status(403).json({
        message: 'Доступ запрещён: разрешены только запросы с localhost',
      });
    }

    next();
  }
}