import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UtilsProvider } from './providers/utils.service';
import { AnalyticsProvider } from './providers/analytics.service';
import { FirebaseProvider } from './providers/firebase-service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [UtilsProvider, AnalyticsProvider, FirebaseProvider],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }
