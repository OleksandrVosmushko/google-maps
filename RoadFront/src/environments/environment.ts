// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  keys: {
    gmap: 'AIzaSyDikeBAymgSWrWz-9Y7Danr2mNewZV_MwI'
  },
  buttons: [
    { mode: 1, icon: 'recommend.png' },
    { mode: 2, icon: 'car.png' },
    { mode: 3, icon: 'transit.png' },
    { mode: 4, icon: 'walk.png' },
    { mode: 5, icon: 'bike.png' },
  ],
  apiUrl: ''
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
