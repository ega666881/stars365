// src/middleware/ip-whitelist.middleware.ts
import { Request, Response, NextFunction } from 'express';

const ALLOWED_IPS = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];

export function IpWhitelistMiddleware(req: Request, res: Response, next: NextFunction) {
    const clientIp = req.ip || req.connection.remoteAddress;
    console.log(clientIp)

    if (ALLOWED_IPS.includes(clientIp)) {
        return next();
    }

    return res.status(403).json({ message: 'Access denied: IP not allowed' });
}