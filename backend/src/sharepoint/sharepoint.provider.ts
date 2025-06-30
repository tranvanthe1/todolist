import { Provider } from '@nestjs/common';
import { bootstrap } from 'pnp-auth';
import { sp } from '@pnp/sp-commonjs';
import { ConfigService } from '@nestjs/config';

export const SHAREPOINT = 'SHAREPOINT';

export const SharePointProvider: Provider = {
  provide: SHAREPOINT,
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    const siteUrl = config.get<string>('SP_SITE');
    const username = config.get<string>('SP_USER')!;
    const password = config.get<string>('SP_PASS')!;

    await bootstrap(sp, { username, password, online: true }, siteUrl);

    sp.setup({ sp: { baseUrl: siteUrl } });
    return sp;
  },
};
