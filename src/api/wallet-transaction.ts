import { db } from '../db/indexeddb';
import { verifyTelegramInitData } from '../services/telegram-auth';

type WalletTransactionRequest = {
  method: string;
  body?: {
    initData?: string;
    currency?: string;
    amount?: number;
    action?: 'earn' | 'spend';
    signature?: string;
    reason?: string;
  };
};

export async function walletTransactionHandler(request: WalletTransactionRequest): Promise<{ status: number; body: Record<string, unknown> }> {
  if (request.method !== 'POST') return { status: 405, body: { ok: false, error: 'Method not allowed' } };

  try {
    const { telegramUserId } = verifyTelegramInitData(request.body?.initData || '');
    const currency = String(request.body?.currency || 'drops');
    const action = request.body?.action;
    const amount = Math.max(0, Number(request.body?.amount || 0));

    if (!action || !['earn', 'spend'].includes(action)) {
      return { status: 400, body: { ok: false, error: 'Invalid action' } };
    }

    const usersArray = await db.users.where('tg_id').equals(telegramUserId).toArray();
    const user = usersArray[0];
    if (!user) return { status: 404, body: { ok: false, error: 'User not found' } };

    const walletsArray = await db.wallets.where('user_id').equals(user.id).toArray();
    const wallet = walletsArray[0];
    if (!wallet) return { status: 404, body: { ok: false, error: 'Wallet not found' } };

    const current = Number((wallet as Record<string, any>)[currency] || 0);
    const next = action === 'earn' ? current + amount : current - amount;
    if (next < 0) return { status: 400, body: { ok: false, error: 'Insufficient funds' } };

    await db.wallets.update(wallet.id, { [currency]: next });
    const updatedWallet = await db.wallets.get(wallet.id);

    return { status: 200, body: { ok: true, balances: updatedWallet as any } };
  } catch (error) {
    return { status: 500, body: { ok: false, error: String((error as Error).message || error) } };
  }
}
