import { db } from '../db/indexeddb';

/**
 * Export the entire Dexie database to a JSON Blob string
 */
export async function exportDatabaseToJson(): Promise<string> {
  const exportData: Record<string, any[]> = {};
  
  // Iterate through all Dexie tables
  for (const table of db.tables) {
    exportData[table.name] = await table.toArray();
  }

  return JSON.stringify(exportData, null, 2);
}

/**
 * Trigger a browser download of the database backup
 */
export async function downloadDatabaseBackup() {
  const jsonStr = await exportDatabaseToJson();
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `zayvora_zerocloud_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Import a JSON dump back into the Dexie database
 */
export async function importDatabaseFromJson(jsonStr: string): Promise<void> {
  const importData = JSON.parse(jsonStr);
  
  await db.transaction('rw', db.tables, async () => {
    for (const table of db.tables) {
      if (importData[table.name]) {
        await table.clear(); // Clear existing data to prevent conflict
        await table.bulkAdd(importData[table.name]);
      }
    }
  });
}
