export type DailyAutomationUser = {
  userId: string;
  planId: string;
  activeDailyAutomation: boolean;
  identityMd?: string;
};

export type AgentLogEntry = {
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
};

const mockUsers: DailyAutomationUser[] = [
  { userId: 'u_1001', planId: 'plan_daily_001', activeDailyAutomation: true, identityMd: 'You are concise and action-oriented.' },
  { userId: 'u_1002', planId: 'plan_daily_002', activeDailyAutomation: false, identityMd: 'Use an encouraging coaching tone.' },
  { userId: 'u_1003', planId: 'plan_daily_003', activeDailyAutomation: true, identityMd: 'Prioritize structured bullet points.' }
];

const mockLogs: AgentLogEntry[] = [];
const mockDraftFixes: Array<Record<string, unknown>> = [];

export const DatabaseService = {
  async getUsersWithActiveDailyAutomation(): Promise<Array<Pick<DailyAutomationUser, 'userId' | 'planId'>>> {
    return mockUsers
      .filter((user) => user.activeDailyAutomation)
      .map((user) => ({ userId: user.userId, planId: user.planId }));
  },

  async getUserProfile(userId: string): Promise<DailyAutomationUser | null> {
    return mockUsers.find((user) => user.userId === userId) || null;
  },

  async saveSuggestedFix(payload: {
    userId?: string;
    source: string;
    prompt: string;
    suggestedFix: string;
    requiresApproval: boolean;
    createdAt: string;
  }): Promise<void> {
    mockDraftFixes.push({ id: `draft_${Date.now()}`, ...payload });
  },

  async getSuggestedFixes(): Promise<Array<Record<string, unknown>>> {
    return mockDraftFixes.slice();
  }
};

export const AsyncQueueWorker = {
  async enqueueAgentRun(payload: { userId: string; planId: string; source: 'daily_cron' | 'manual' }): Promise<void> {
    mockLogs.push({
      level: 'INFO',
      message: `Enqueued agent run for user ${payload.userId} / plan ${payload.planId}`,
      timestamp: new Date().toISOString(),
      metadata: payload
    });
  }
};

export const AgentLogger = {
  async logError(message: string, metadata?: Record<string, unknown>): Promise<void> {
    mockLogs.push({ level: 'ERROR', message, timestamp: new Date().toISOString(), metadata });
  },

  async getRecentErrors(limit = 20): Promise<AgentLogEntry[]> {
    return mockLogs
      .filter((entry) => entry.level === 'ERROR')
      .slice(-Math.max(1, limit))
      .reverse();
  }
};
