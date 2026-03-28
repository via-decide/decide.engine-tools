/**
 * api/claude.js — Vercel Serverless Proxy for Anthropic API
 *
 * Keeps ANTHROPIC_API_KEY server-side (Vercel env var).
 * Browser tools call /api/claude instead of api.anthropic.com directly.
 * Supports both text and vision (base64 image) payloads.
 */

export const config = { runtime: 'edge' };

const ALLOWED_ORIGIN = [
  'https://viadecide.com',
  'https://www.viadecide.com',
];

const ALLOWED_MODELS = [
  'claude-haiku-4-5-20251001',
  'claude-sonnet-4-6',
  'claude-opus-4-6',
];

export default async function handler(req) {
  const origin = req.headers.get('origin') || '';

  // CORS — only allow our own domain
  const corsHeaders = {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN.includes(origin)
      ? origin
      : ALLOWED_ORIGIN[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: corsHeaders }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('[claude-proxy] ANTHROPIC_API_KEY not set');
    return new Response(
      JSON.stringify({ error: 'Service not configured' }),
      { status: 503, headers: corsHeaders }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON body' }),
      { status: 400, headers: corsHeaders }
    );
  }

  // Validate model is on allowlist
  if (!ALLOWED_MODELS.includes(body.model)) {
    return new Response(
      JSON.stringify({ error: `Model not allowed: ${body.model}` }),
      { status: 400, headers: corsHeaders }
    );
  }

  // Enforce max_tokens cap (prevent abuse)
  if (!body.max_tokens || body.max_tokens > 4000) {
    body.max_tokens = 2000;
  }

  // Forward to Anthropic
  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await upstream.json();

    return new Response(JSON.stringify(data), {
      status: upstream.status,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error('[claude-proxy] upstream error:', err);
    return new Response(
      JSON.stringify({ error: 'Upstream API error' }),
      { status: 502, headers: corsHeaders }
    );
  }
}
