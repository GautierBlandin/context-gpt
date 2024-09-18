export function getValidToken() {
  const VALID_TOKEN = import.meta.env['API_ACCESS_TOKEN'];

  if (!VALID_TOKEN) {
    throw new Error('API_ACCESS_TOKEN is not set in the environment variables');
  }

  return VALID_TOKEN;
}
