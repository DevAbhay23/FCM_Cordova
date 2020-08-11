import { Injectable } from '@angular/core';
declare var firebasePlugin: any;
@Injectable({
    providedIn: 'root'
})
export class FirebaseProvider {
    private firebaseInstance: any;
    constructor() {

    }

    /**
     * set firebase singleton instance
     * @param mInstance : instance
     */
    setFirebaseInstance(mInstance) {
        this.firebaseInstance = mInstance;
    }

    /**
     * get firebase instance
     */
    getFirebaseInstance() {
        if (this.firebaseInstance == null) {
            this.firebaseInstance = (<any>window).FirebasePlugin;    // get instance of firebase plugin
            return this.firebaseInstance;
        }
        return this.firebaseInstance;
    }


    /**
     * Method to initialize various firebase handlers
     */
    registerFirebaseHandlers() {
        this.messageReceivedHandler();
        this.tokenRefreshHandler();

    }

/**
 * Handler is invoked when notification message is arrived
 */
    messageReceivedHandler() {
        const notifMessageType = 'notification';
        this.getFirebaseInstance().onMessageReceived((message: any) => {
            try {
                console.log('onMessageReceived');
                console.dir(message);
                if (message.messageType === notifMessageType) {
                    this.handleNotificationMessage(message);
                } else {
                    this.handleDataMessage(message);
                }
            } catch (e) {
                console.log('Exception in onMessageReceived Handler: ' + e.message);
            }

        }, (error) => {
            console.log('Error in   this.getFirebaseInstance() message', error);
        });
    }

    /**
     * Handler is called , when FCM token refreshes/changes
     */
    tokenRefreshHandler() {
        this.getFirebaseInstance().onTokenRefresh((token) => {
            console.log('Success - Token refreshed: ' + token);
        }, (error) => {
            console.log('Failure - Token Refresh Error: ', error);
        });
    }


    /**
     * Method to get app instance ID (an constant ID which persists as long as the app is not uninstalled/reinstalled).
     */
    getFcmId() {
        this.getFirebaseInstance().getId((id) => {
            console.log('Success - FCM ID: ' + id);
        }, (error) => {
            console.log('Failure - FCM id error: ', error);
        });
    }

    /**
     * Method to get firebase registration id.
     */
    getFcmToken() {
        this.getFirebaseInstance().getToken((token) => {
            console.log('Success - FCM token: ' + token);
        }, (error) => {
            console.log('Failure - FCM token error', error);
        });
    }


    /**
     * Method to handle notifications messages
     * @param message message payload
     */
    handleNotificationMessage(message) {
        let title;
        if (message.title) {
            title = message.title;
        } else if (message.notification && message.notification.title) {
            title = message.notification.title;
        }

        let body;
        if (message.body) {
            body = message.body;
        } else if (message.notification && message.notification.body) {
            body = message.notification.body;
        }

        let msg = 'Notification message received';
        if (message.tap) {
            msg += ' (tapped in ' + message.tap + ')';
        }
        if (title) {
            msg += '; title=' + title;
        }
        if (body) {
            msg += '; body=' + body;
        }
        msg += ': ' + JSON.stringify(message);
        console.log(msg);
    }

    /**
     * Function to handle data messages recieved from notifications
     * @param message message payload
     */
    handleDataMessage(message) {
        console.log('Data message received: ' + JSON.stringify(message));
    }


    /**
     * Function to initialize Notification Channel
     */
    initFcmConfigAndroid() {
        const customChannel: any = {
            id: 'demoMessaging',
            name: 'GoDevelopers',
            sound: 'default',            // Values allowed [default,ringtone,filename]
            vibration: [300, 200, 300],  // Values allowed [Boolean(allow or not),Array of Values[300,200,300]]
            light: true,                 // Whether to blink the LED
            importance: 4,               // [ high(4) ,default(3) ,low(2),min(1),none(0) ]
            visibility: 1                //  [ 1 - public, 0 - private ,-1 - secret ]
        };

        // create new channel
        this.getFirebaseInstance().createChannel(customChannel,
            () => {
                console.log('Created custom channel: ' + customChannel.id);
                this.getFirebaseInstance().listChannels(
                    (channels) => {
                        if (typeof channels === 'undefined') { return; }
                        for (let i = 0; i < channels.length; i++) {
                            console.log('Channel id=' + channels[i].id + '; name=' + channels[i].name);
                        }
                    },
                    (error) => {
                        console.log('Error - List channels error: ' + error);
                    }
                );
            },
            (error) => {
                console.log('Error - Create channel error', error);
            }
        );
    }

    /**
     * Method to check if permission is granted for remote notifications
     * @param requested boolean permission result
     */
    checkNotificationPermission(requested) {
        this.getFirebaseInstance().hasPermission((hasPermission) => {
            if (hasPermission) {
                console.log('Remote notifications permission granted');
                this.getFcmToken();  // generate new FCM token
            } else if (!requested) {
                console.log('Requesting remote notifications permission');
                this.getFirebaseInstance().grantPermission(
                    (success) => {
                        console.log('Success- Notifications Permission Grant: ', success);
                        this.checkNotificationPermission.bind(this, true);
                    }
                    , (error) => {
                        console.log('Failure - Notifications Permission Grant Error : ', error);
                    });
            } else {
                // Denied
                console.log('Notifications won\'t be shown as permission is denied');
            }
        }, (error) => {
            console.log('Error - Notification Has Permission Error : ', error);
        });
    }

    /**
     * Method to Unregister from Firebase by deleting the current device token , useful after user logs out of app.
     * Other methods like  isAutoInitEnabled ,setAutoInitEnabled
     * are provided by firebase plugin to check new FCM tokens will be automatically generated or not.
     */
    unregisterFromFirebase() {
        this.getFirebaseInstance().unregister();
    }
}

