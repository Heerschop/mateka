import { IEnvironment } from './environment.model';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {} as IEnvironment;

const message = 'Use: ng serve --project=pwa --configuration=dev|prd';

setTimeout(() => {
  document.write('<h2>' + message + '</h2>');
}, 500);

/* tslint:disable:no-string-throw */

throw message;

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
