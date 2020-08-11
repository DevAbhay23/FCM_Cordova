import { Injectable} from '@angular/core';
import { FirebaseProvider } from './firebase-service';
declare var cordova;
@Injectable({
    providedIn: 'root'
})
export class AnalyticsProvider {

    constructor(private firebaseService: FirebaseProvider) {

    }

    logEvent(eventName, dataObj) {
        this.firebaseService.getFirebaseInstance().logEvent(eventName, dataObj);
    }

    setUserId(mUserId) {
        this.firebaseService.getFirebaseInstance().setUserId(mUserId);
    }

    setUserProperty(key, value) {
        this.firebaseService.getFirebaseInstance().setUserProperty(key, value);
    }

    setCurrentScreen(name) {
        this.firebaseService.getFirebaseInstance().setScreenName(name);
    }
}

