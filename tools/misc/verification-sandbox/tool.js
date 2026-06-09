(function (global) {
  'use strict';

  const STORAGE_KEY = 'vd:tool:verification-sandbox:state';

  // Wait for DOM
  document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('storage-input');
    const saveBtn = document.getElementById('save-btn');
    const loadBtn = document.getElementById('load-btn');
    const exportBtn = document.getElementById('export-btn');

    // Load saved value
    if (global.PlatformStorage) {
      const saved = global.PlatformStorage.getItem(STORAGE_KEY);
      if (saved) input.value = saved;
    }

    // Save triggers
    saveBtn.addEventListener('click', () => {
      if (global.PlatformStorage) {
        global.PlatformStorage.setItem(STORAGE_KEY, input.value);
        alert('State saved successfully!');
      }
    });

    loadBtn.addEventListener('click', () => {
      if (global.PlatformStorage) {
        const saved = global.PlatformStorage.getItem(STORAGE_KEY);
        input.value = saved || '';
        alert('State loaded!');
      }
    });

    // CSV Exporter triggers
    exportBtn.addEventListener('click', () => {
      if (global.CSVExporter) {
        const headers = 'Timestamp,Variable,Value\n';
        const data = `${new Date().toISOString()},${slug},${input.value}`;
        global.CSVExporter.download('${slug}-report.csv', headers + data);
      }
    });
  });
})(typeof window !== 'undefined' ? window : global);
