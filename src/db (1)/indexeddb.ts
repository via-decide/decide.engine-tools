import Dexie, { type Table } from 'dexie';

export interface User {
  id: string;
  tg_id: string; // From previous schema context (e.g. telegramUserId)
  name?: string;
  local_trust_level: string;
  created_at?: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  drops: number;
  credits: number;
  updated_at?: string;
}

export interface Plant {
  id: string;
  user_id: string;
  stage: number;
  updated_at?: string;
}

export interface Profile {
  id: string;
  user_id: string;
  identity_key: string;
}

export class ZayvoraZeroCloudDB extends Dexie {
  users!: Table<User, string>;
  wallets!: Table<Wallet, string>;
  plants!: Table<Plant, string>;
  profiles!: Table<Profile, string>;

  constructor() {
    super('ZayvoraZeroCloud');
    
    // Version 1 schema matching Supabase equivalents
    this.version(1).stores({
      users: 'id, tg_id, local_trust_level',
      wallets: 'id, user_id',
      plants: 'id, user_id',
      profiles: 'id, user_id'
    });
  }
}

export const db = new ZayvoraZeroCloudDB();
