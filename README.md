# FCM_Cordova
This Application will show Firebase Cloud Notifications on Cordova/Angular Project.

<b>Plugins Used : </b>

<ul>
  <li> cordova-plugin-firebasex </li>
  <li> cordova-plugin-splashscreen </li>
  <li> cordova-android-support-gradle-release </li>
</ul>

<b>Other Platform Specifications</b>

<ul>
<li> Cordova version - 9.0.0 </li>
<li> Angular version - 7.0.0 (Can be upgraded to Angular 8 , 9 - depending upon cordova firebase plugin support ) </li>
<li> Typescript Version - 3.1.6 </li>
</ul>

Steps to run : 
<ol>
  <li>Clone the Project</li>
  <li>Run npm install</li>
  <li>Run cordova platform add android</li>
  <li>Run corodova plugin add cordova-plugin-splashscreen</li>
  <li>Run corodova plugin add cordova-android-support-gradle-release</li>
  <li>Run corodova plugin add cordova-plugin-firebasex</li>
  <li>Run ng build --prod</li>
  <li>Run cordova build android</li>
</ol>
<br>
<b>Note:</b> - Also add google-services.json at root folder. [ Same can be generated from Firebase Console ]  <br><br>

<b>Firebase Analytics Added </b>
<p>
    To enable sending of DebugView data on a connected Android test device for a configured Firebase Analytics app, execute the following command:<br>
      <b>adb shell setprop debug.firebase.analytics.app [your_app_package_name] </b>
    <br><br>
    This behavior persists until you explicitly disable it by executing the following command:<br>
      <b>adb shell setprop debug.firebase.analytics.app .none.  </b>
</p>




<br><br><br>
For more information , please visit : <br> https://github.com/dpa99c/cordova-plugin-firebasex or <br> https://www.npmjs.com/package/cordova-plugin-firebase
