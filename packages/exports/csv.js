(function (global) {
  'use strict';

  function escapeCell(val) {
    if (val === null || val === undefined) return '';
    let str = String(val);
    // Replace double quotes with escaped double quotes
    if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
      str = '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  function download(filename, csvContent, mimeType = 'text/csv;charset=utf-8;') {
    const blob = new Blob([csvContent], { type: mimeType });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }

  global.CSVExporter = {
    escape: escapeCell,
    download: download
  };
})(typeof window !== 'undefined' ? window : global);
