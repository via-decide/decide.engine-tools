import { AsyncQueueWorker, DatabaseService } from '../services/mock-services';

type JsonResponse = {
  status: number;
  body: Record<string, unknown>;
};

function isAuthorized(headers: Record<string, string | undefined>): boolean {
  const expectedToken = process.env.CRON_AUTH_TOKEN;
  if (!expectedToken) {
    throw new Error('CRON_AUTH_TOKEN is not configured');
  }

  const incomingToken = headers['x-cron-token'] || headers.authorization?.replace(/^Bearer\s+/i, '');
  return incomingToken === expectedToken;
}

export async function cronHandler(request: {
  method: string;
  headers: Record<string, string | undefined>;
}): Promise<JsonResponse> {
  if (request.method !== 'POST') {
    return { status: 405, body: { ok: false, error: 'Method not allowed' } };
  }

  if (!isAuthorized(request.headers)) {
    return { status: 401, body: { ok: false, error: 'Unauthorized' } };
  }

  const users = await DatabaseService.getUsersWithActiveDailyAutomation();
  await Promise.all(
    users.map((user) =>
      AsyncQueueWorker.enqueueAgentRun({
        userId: user.userId,
        planId: user.planId,
        source: 'daily_cron'
      })
    )
  );

  return {
    status: 200,
    body: {
      ok: true,
      queued: users.length,
      schedule: '0 8 * * *'
    }
  };
}
