// Utility to load config.json at runtime and expose backendUrl

let configCache: any = null;

export async function getConfig() {
  if (configCache) return configCache;
  const response = await fetch('/config.json');
  if (!response.ok) throw new Error('Failed to load config.json');
  configCache = await response.json();
  return configCache;
}

export async function getBackendUrl(): Promise<string> {
  const config = await getConfig();
  if (!config.backendUrl) throw new Error('backendUrl not found in config.json');
  return config.backendUrl.replace(/\/$/, ''); // remove trailing slash if present
} 