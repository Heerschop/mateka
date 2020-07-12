export interface IEnvironment {
  production: boolean;
  app: {
    version: string;
    env: string;
  };
}
