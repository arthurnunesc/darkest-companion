import type { PageLoad } from './$types';
import { parseExpeditionParams } from '$lib/game/url-state';

export const load: PageLoad = ({ url }) => {
  return {
    expedition: parseExpeditionParams(url.searchParams)
  };
};
