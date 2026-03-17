import crypto from 'node:crypto';

export type TelegramIdentity = {
  telegramUserId: string;
  authDate: number;
};

function requiredEnv(name: 'TELEGRAM_BOT_TOKEN'): string {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

function parseInitData(initData: string): URLSearchParams {
  if (!initData || !initData.trim()) {
    throw new Error('Missing Telegram initData');
  }
  return new URLSearchParams(initData);
}

export function verifyTelegramInitData(initData: string): TelegramIdentity {
  const params = parseInitData(initData);
  const hash = params.get('hash');
  if (!hash) {
    throw new Error('Invalid initData hash');
  }

  const authDate = Number(params.get('auth_date') || 0);
  if (!Number.isFinite(authDate) || authDate <= 0) {
    throw new Error('Invalid auth_date');
  }

  const maxAgeSeconds = 60 * 60;
  if (Math.abs(Math.floor(Date.now() / 1000) - authDate) > maxAgeSeconds) {
    throw new Error('initData expired');
  }

  const dataCheckString = [...params.entries()]
    .filter(([key]) => key !== 'hash')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(requiredEnv('TELEGRAM_BOT_TOKEN')).digest();
  const expectedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  if (expectedHash !== hash) {
    throw new Error('Telegram initData verification failed');
  }

  const userRaw = params.get('user');
  if (!userRaw) {
    throw new Error('Missing Telegram user payload');
  }

  const user = JSON.parse(userRaw) as { id?: number };
  const telegramUserId = String(user.id || '');
  if (!telegramUserId) {
    throw new Error('Invalid Telegram user id');
  }

  return { telegramUserId, authDate };
}
