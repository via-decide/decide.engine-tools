import { db } from '../db/indexeddb';
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

    const usersArray = await db.users.where('tg_id').equals(telegramUserId).toArray();
    const user = usersArray[0];
    if (!user) return { status: 404, body: { ok: false, error: 'User not found' } };

    const plantsArray = await db.plants.where('user_id').equals(user.id).toArray();
    const plant = plantsArray[0] as any;
    if (!plant) return { status: 404, body: { ok: false, error: 'Plant not found' } };

    if (action === 'sync') return { status: 200, body: { ok: true, state: plant } };

    let hydration = Number(plant.hydration || 0);
    let stage = Number(plant.stage || 0);

    if (action === 'tick') hydration = Math.max(0, hydration - 2);
    if (action === 'add_xp') stage = stage + amount;

    if (action === 'water') {
      const walletsArray = await db.wallets.where('user_id').equals(user.id).toArray();
      const wallet = walletsArray[0];
      if (!wallet) return { status: 404, body: { ok: false, error: 'Wallet not found' } };

      const drops = Number(wallet.drops || 0);
      const dropCost = Math.ceil(amount / 3);
      if (drops < dropCost) return { status: 400, body: { ok: false, error: 'Insufficient Water Drops' } };

      hydration = Math.min(100, hydration + amount);
      await db.wallets.update(wallet.id, { drops: drops - dropCost });
    }

    await db.plants.update(plant.id, { hydration, stage, updated_at: new Date().toISOString() } as any);
    const updatedPlant = await db.plants.get(plant.id);

    return { status: 200, body: { ok: true, state: updatedPlant as any } };
  } catch (error) {
    return { status: 500, body: { ok: false, error: String((error as Error).message || error) } };
  }
}
