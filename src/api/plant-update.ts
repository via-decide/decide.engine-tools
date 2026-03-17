import { getSupabaseAdminClient } from '../services/supabase';
import { verifyTelegramInitData } from '../services/telegram-auth';

type PlantAction = 'sync' | 'tick' | 'water' | 'add_xp';

type PlantUpdateRequest = {
  method: string;
  body?: {
    initData?: string;
    action?: PlantAction;
    amount?: number;
  };
};

export async function plantUpdateHandler(request: PlantUpdateRequest): Promise<{ status: number; body: Record<string, unknown> }> {
  if (request.method !== 'POST') return { status: 405, body: { ok: false, error: 'Method not allowed' } };

  try {
    const { telegramUserId } = verifyTelegramInitData(request.body?.initData || '');
    const action = request.body?.action || 'sync';
    const amount = Math.max(0, Number(request.body?.amount || 0));

    const supabase = getSupabaseAdminClient();
    const { data: user, error: userError } = await supabase.from('users').select('id').eq('tg_id', telegramUserId).single();
    if (userError || !user) return { status: 404, body: { ok: false, error: 'User not found' } };

    const { data: plant, error: plantError } = await supabase.from('plants').select('*').eq('user_id', user.id).single();
    if (plantError || !plant) return { status: 404, body: { ok: false, error: 'Plant not found' } };

    if (action === 'sync') return { status: 200, body: { ok: true, state: plant } };

    let hydration = Number(plant.hydration || 0);
    let stage = Number(plant.stage || 0);

    if (action === 'tick') hydration = Math.max(0, hydration - 2);
    if (action === 'add_xp') stage = stage + amount;

    if (action === 'water') {
      const { data: wallet, error: walletError } = await supabase.from('wallets').select('*').eq('user_id', user.id).single();
      if (walletError || !wallet) return { status: 404, body: { ok: false, error: 'Wallet not found' } };

      const drops = Number(wallet.drops || 0);
      const dropCost = Math.ceil(amount / 3);
      if (drops < dropCost) return { status: 400, body: { ok: false, error: 'Insufficient Water Drops' } };

      hydration = Math.min(100, hydration + amount);
      const { error: walletUpdateError } = await supabase.from('wallets').update({ drops: drops - dropCost }).eq('user_id', user.id);
      if (walletUpdateError) throw walletUpdateError;
    }

    const { data: updatedPlant, error: updatePlantError } = await supabase
      .from('plants')
      .update({ hydration, stage, last_tick_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .select('*')
      .single();

    if (updatePlantError) throw updatePlantError;

    return { status: 200, body: { ok: true, state: updatedPlant } };
  } catch (error) {
    return { status: 500, body: { ok: false, error: String((error as Error).message || error) } };
  }
}
