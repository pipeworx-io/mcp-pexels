interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Pexels MCP.
 */


const BASE = 'https://api.pexels.com';
const UA = 'pipeworx-mcp-pexels/1.0 (+https://pipeworx.io)';

const passthrough = { type: 'object' as const, properties: {}, additionalProperties: true };

const tools: McpToolExport['tools'] = [
  { name: 'photo_search', description: 'Photo search.', inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'], additionalProperties: true } },
  { name: 'photo_curated', description: 'Curated photos.', inputSchema: passthrough },
  { name: 'photo', description: 'Single photo.', inputSchema: { type: 'object', properties: { id: { type: 'number' } }, required: ['id'] } },
  { name: 'video_search', description: 'Video search.', inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'], additionalProperties: true } },
  { name: 'video_popular', description: 'Popular videos.', inputSchema: passthrough },
  { name: 'video', description: 'Single video.', inputSchema: { type: 'object', properties: { id: { type: 'number' } }, required: ['id'] } },
  { name: 'featured_collections', description: 'Featured collections.', inputSchema: passthrough },
  { name: 'collection_media', description: 'Media in a collection.', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'], additionalProperties: true } },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const apiKey = (args._apiKey as string | undefined)?.trim();
  if (!apiKey) throw new Error('Pexels requires an API key. Set PLATFORM_PEXELS_KEY or pass ?_apiKey=… (free at https://www.pexels.com/api/).');
  const get = async (url: string, params?: Record<string, unknown>) => {
    const p = new URLSearchParams();
    if (params) for (const [k, v] of Object.entries(params)) if (k !== '_apiKey' && v != null) p.set(k, String(v));
    const full = `${url}${[...p].length ? `?${p}` : ''}`;
    const res = await fetch(full, { headers: { Accept: 'application/json', 'User-Agent': UA, Authorization: apiKey } });
    if (res.status === 401 || res.status === 403) throw new Error('Pexels: invalid API key.');
    if (res.status === 429) throw new Error('Pexels: 429 rate limit.');
    if (!res.ok) throw new Error(`Pexels: ${res.status}`);
    return res.json();
  };
  const reqNum = (k: string, ex: string) => {
    const v = args[k];
    if (v == null || typeof v !== 'number') throw new Error(`Required argument "${k}" is missing. Pass a number like ${ex}.`);
    return v;
  };
  const reqStr = (k: string, ex: string) => {
    const v = args[k];
    if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${k}" is missing. Pass a string like ${ex}.`);
    return v;
  };
  switch (name) {
    case 'photo_search':
      return get(`${BASE}/v1/search`, args);
    case 'photo_curated':
      return get(`${BASE}/v1/curated`, args);
    case 'photo':
      return get(`${BASE}/v1/photos/${reqNum('id', '2014422')}`);
    case 'video_search':
      return get(`${BASE}/videos/search`, args);
    case 'video_popular':
      return get(`${BASE}/videos/popular`, args);
    case 'video':
      return get(`${BASE}/videos/videos/${reqNum('id', '2499611')}`);
    case 'featured_collections':
      return get(`${BASE}/v1/collections/featured`, args);
    case 'collection_media':
      return get(`${BASE}/v1/collections/${encodeURIComponent(reqStr('id', '"<id>"'))}`, args);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
