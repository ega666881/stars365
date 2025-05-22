import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

function getClientIp(req) {
    const forwardedIps = req.headers['x-forwarded-for'];
    if (forwardedIps) {
      return forwardedIps.split(',')[0].trim();
    }
  
    let ip = req.ip || req.connection.remoteAddress;
  
    
    if (ip.startsWith('::ffff:')) {
      ip = ip.substring(7);
    }
  
    return ip.trim();
}

@Injectable()
export class LocalhostOnlyMiddleware implements NestMiddleware {
    
    
    use(req: Request, res: Response, next: NextFunction) {
        const allowedIps = ['127.0.0.1', '::1'];

        // Получаем IP клиента
        const ip = getClientIp(req);
        console.log(ip)
        if (!ip || !allowedIps.includes(ip.trim())) {
        return res.status(403).json({
            message: 'Доступ запрещён: разрешены только запросы с localhost',
        });
        }

        next();
    }
}