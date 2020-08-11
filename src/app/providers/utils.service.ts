import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class UtilsProvider {

   
    constructor() {

    }
    /**
     * Descp:Function to check whether cordova platforms is ready for device.
     */
    isDeviceReady() {
        return new Promise((resolve, reject) => {
            document.addEventListener('deviceready', (onDeviceReady) => {
                console.log('Device is ready');
                resolve(true);
            }, false);
        });
    }


}

