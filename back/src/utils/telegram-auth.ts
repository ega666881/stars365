import * as crypto from 'crypto';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

function validateHash(initData: string): boolean {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');
  
  const dataCheckString = Array.from(urlParams.entries())
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join('\n');
  
  const secretKey = crypto.createHmac('sha256', 'WebAppData')
    .update(BOT_TOKEN)
    .digest();
  
  const hash2 = crypto.createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');
  
  return hash === hash2;
}

export async function verifyTelegramAuth(initData: string) {
  if (!validateHash(initData)) {
    throw new Error('Invalid hash');
  }

  const urlParams = new URLSearchParams(initData);
  const userStr = urlParams.get('user');
  if (!userStr) throw new Error('User data not found');
  
  return JSON.parse(decodeURIComponent(userStr));
}