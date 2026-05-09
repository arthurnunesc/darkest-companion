import type { PageLoad } from './$types';
import { parseExpeditionParams } from '$lib/expedition-state';

export const load: PageLoad = ({ url }) => {
  return {
    expedition: parseExpeditionParams(url.searchParams)
  };
};
