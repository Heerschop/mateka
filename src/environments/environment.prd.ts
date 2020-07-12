import { IEnvironment } from "./environment.model";
import { version } from 'environments/../../package.json';

export const environment: IEnvironment = {
  production: true,
  app: {
    env: 'pwa-prd',
    get version() {
      return version;
    },
  }
};
