// src/middleware/ip-whitelist.middleware.ts
import { Request, Response, NextFunction } from 'express';

const ALLOWED_IPS = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];

export function IpWhitelistMiddleware(req: Request, res: Response, next: NextFunction) {
    const clientIp = req.ip || req.connection.remoteAddress;
    console.log(clientIp)
    // Если используется прокси (например, Nginx), используй x-forwarded-for
    const forwardedIps = req.headers['x-forwarded-for'];
    console.log(forwardedIps)
    const ip = forwardedIps ? (Array.isArray(forwardedIps) ? forwardedIps[0] : forwardedIps.split(',')[0]) : clientIp;
    console.log(ip)
    if (!ip) {
        return res.status(403).json({ message: 'IP address not found' });
    }

    const cleanIp = ip.trim();
    
    if (ALLOWED_IPS.includes(cleanIp)) {
        return next();
    }

    return res.status(403).json({ message: 'Access denied: IP not allowed' });
}