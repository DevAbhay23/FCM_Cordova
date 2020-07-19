import { Component, OnInit } from '@angular/core';
import { UtilsProvider } from './providers/utils.service';

declare var navigator;
declare var firebasePlugin: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'push-messaging';
  constructor(private utilsProvider: UtilsProvider) {

  }

  ngOnInit() {
    this.utilsProvider.isDeviceReady().then(data => {
      if (data) {
        navigator.splashscreen.hide();             // hide splash screen
        setTimeout(() => {
          this.performFirebaseInit();
        }, 1000);
      }
    });
  }

  performFirebaseInit() {
    firebasePlugin = (<any>window).FirebasePlugin;    // get instance of firebase plugin
    this.registerFirebaseHandlers();
    this.getFcmId();
    this.checkNotificationPermission(false);
    this.initFcmConfigAndroid();
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
    firebasePlugin.onMessageReceived((message: any) => {
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
      console.log('Error in firebasePlugin message', error);
    });
  }

  /**
   * Handler is called , when FCM token refreshes/changes
   */
  tokenRefreshHandler() {
    firebasePlugin.onTokenRefresh((token) => {
      console.log('Success - Token refreshed: ' + token);
    }, (error) => {
      console.log('Failure - Token Refresh Error: ', error);
    });
  }

  /**
   * Method to get app instance ID (an constant ID which persists as long as the app is not uninstalled/reinstalled).
   */
  getFcmId() {
    firebasePlugin.getId((id) => {
      console.log('Success - FCM ID: ' + id);
    }, (error) => {
      console.log('Failure - FCM id error: ', error);
    });
  }

  /**
   * Method to get firebase registration id.
   */
  getFcmToken() {
    firebasePlugin.getToken((token) => {
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
    firebasePlugin.createChannel(customChannel,
      () => {
        console.log('Created custom channel: ' + customChannel.id);
        firebasePlugin.listChannels(
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
    firebasePlugin.hasPermission((hasPermission) => {
      if (hasPermission) {
        console.log('Remote notifications permission granted');
        this.getFcmToken();  // generate new FCM token
      } else if (!requested) {
        console.log('Requesting remote notifications permission');
        firebasePlugin.grantPermission(
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
    firebasePlugin.unregister();
  }

}
