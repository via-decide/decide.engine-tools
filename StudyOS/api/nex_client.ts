(function (global) {
  'use strict';

  const BASE_URL = 'http://localhost:8000';

  async function request(path, payload) {
    const options = {
      method: payload ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (payload) {
      options.body = JSON.stringify(payload);
    }

    const response = await fetch(`${BASE_URL}${path}`, options);
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Nex API ${path} failed (${response.status}): ${text || response.statusText}`);
    }
    return response.json();
  }

  async function searchCorpus(query) {
    return request('/search', { query, limit: 10 });
  }

  async function getDocument(doc_id) {
    return request('/document', { doc_id });
  }

  async function getSources(query) {
    return request('/sources', { query });
  }

  async function getSummary(query) {
    return request('/summary', { query });
  }

  async function getCorpusStatus() {
    return request('/status');
  }

  const client = {
    searchCorpus,
    getDocument,
    getSources,
    getSummary,
    getCorpusStatus
  };

  global.NexClient = client;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = client;
  }
})(typeof window !== 'undefined' ? window : globalThis);
