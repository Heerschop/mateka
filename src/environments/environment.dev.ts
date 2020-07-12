import { IEnvironment } from "./environment.model";
import { version } from 'environments/../../package.json';

export const environment: IEnvironment = {
  production: false,
  app: {
    env: 'pwa-dev',
    get version() {
      return version;
    },
  }
};
