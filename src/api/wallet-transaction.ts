import { getSupabaseAdminClient } from '../services/supabase';
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

    const supabase = getSupabaseAdminClient();
    const { data: user, error: userError } = await supabase.from('users').select('id').eq('tg_id', telegramUserId).single();
    if (userError || !user) return { status: 404, body: { ok: false, error: 'User not found' } };

    const { data: wallet, error: walletError } = await supabase.from('wallets').select('*').eq('user_id', user.id).single();
    if (walletError || !wallet) return { status: 404, body: { ok: false, error: 'Wallet not found' } };

    const current = Number((wallet as Record<string, unknown>)[currency] || 0);
    const next = action === 'earn' ? current + amount : current - amount;
    if (next < 0) return { status: 400, body: { ok: false, error: 'Insufficient funds' } };

    const { data: updatedWallet, error: updateError } = await supabase
      .from('wallets')
      .update({ [currency]: next })
      .eq('user_id', user.id)
      .select('*')
      .single();

    if (updateError) throw updateError;

    return { status: 200, body: { ok: true, balances: updatedWallet } };
  } catch (error) {
    return { status: 500, body: { ok: false, error: String((error as Error).message || error) } };
  }
}
