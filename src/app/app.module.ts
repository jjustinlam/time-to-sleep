import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// import { VisualScheduleComponent } from './components/visual-schedule/visual-schedule.component';

import { Health } from '@awesome-cordova-plugins/health/ngx';

// import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications';


@NgModule({
  declarations: [
    AppComponent,
    // VisualScheduleComponent
  ],
  imports: [BrowserModule, FormsModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Health
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
