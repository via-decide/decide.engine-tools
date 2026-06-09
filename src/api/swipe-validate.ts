import { db } from '../db/indexeddb';
import { verifyTelegramInitData } from '../services/telegram-auth';

type SwipeResult = { cardId: string; accepted: boolean };

const SECURE_CARD_XP: Record<string, number> = {
  water: 12,
  pest: 14,
  logic: 10,
  rest: 8
};

type SwipeValidateRequest = {
  method: string;
  body?: {
    initData?: string;
    results?: SwipeResult[];
  };
};

function xpForCardId(cardId: string, accepted: boolean): number {
  if (!accepted) return 0;
  const prefix = String(cardId || '').split('-')[0];
  return SECURE_CARD_XP[prefix] || 0;
}

export async function swipeValidateHandler(request: SwipeValidateRequest): Promise<{ status: number; body: Record<string, unknown> }> {
  if (request.method !== 'POST') return { status: 405, body: { ok: false, error: 'Method not allowed' } };

  try {
    const { telegramUserId } = verifyTelegramInitData(request.body?.initData || '');
    const results = Array.isArray(request.body?.results) ? request.body?.results : [];
    const xpEarned = results.reduce((sum, result) => sum + xpForCardId(result.cardId, Boolean(result.accepted)), 0);

    const usersArray = await db.users.where('tg_id').equals(telegramUserId).toArray();
    const user = usersArray[0];
    if (!user) return { status: 404, body: { ok: false, error: 'User not found' } };

    const plantsArray = await db.plants.where('user_id').equals(user.id).toArray();
    const plant = plantsArray[0];
    if (!plant) return { status: 404, body: { ok: false, error: 'Plant not found' } };

    const nextStage = Number(plant.stage || 0) + xpEarned;
    await db.plants.update(plant.id, { stage: nextStage });

    return { status: 200, body: { ok: true, xpEarned } };
  } catch (error) {
    return { status: 500, body: { ok: false, error: String((error as Error).message || error) } };
  }
}
