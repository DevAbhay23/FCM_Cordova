import { Component, OnInit } from '@angular/core';
import { UtilsProvider } from './providers/utils.service';
import { AnalyticsProvider } from './providers/analytics.service';
import { FirebaseProvider } from './providers/firebase-service';

declare var navigator;
// declare var firebasePlugin: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'push-messaging';
  constructor(private utilsProvider: UtilsProvider, private firebaseService: FirebaseProvider,
    private analyticsService: AnalyticsProvider) {
  }

  /**
   * Method called on page init
   */
  ngOnInit() {
    this.utilsProvider.isDeviceReady().then(data => {
      if (data) {
        navigator.splashscreen.hide();             // hide splash screen
        setTimeout(() => {
          this.performFirebaseInit();
          this.testFirebaseAnalyticsEvents();
        }, 5000);    // delay is added for debugging only
      }
    });
  }

  /**
   * Method to perform firebase initialization
   */
  performFirebaseInit() {
    const firebasePlugin = (<any>window).FirebasePlugin;    // get instance of firebase plugin
    this.firebaseService.setFirebaseInstance(firebasePlugin);
    this.firebaseService.registerFirebaseHandlers();
    this.firebaseService.getFcmId();
    this.firebaseService.checkNotificationPermission(false);
    this.firebaseService.initFcmConfigAndroid();
  }


  /**
   * Method to test various analytics events
   */
  testFirebaseAnalyticsEvents() {

    // ---- below properties are configurable  --- //

    this.analyticsService.setCurrentScreen('Dashboard');
    this.analyticsService.setUserId('Dev User');
    this.analyticsService.setUserProperty('Name', 'Dev User');
    const dataObj = {
      key: 'Platform',
      value: 'Android'
    };
    this.analyticsService.logEvent('Modules', dataObj);
  }
}
