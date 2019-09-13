import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Settings, User, Api } from '../providers';
import { MyApp } from './app.component';
import { SQLite } from '@ionic-native/sqlite';

import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Geolocation } from '@ionic-native/geolocation';
import { Network } from '@ionic-native/network';


// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function provideSettings(storage: Storage) {

  return new Settings(storage, {
    option1: true,
    option2: 'Ionitron J. Framework',
    option3: '3',
    option4: 'Hello',
    UID: '0',
    UName: '',
    Email: '',
    Row_ID: '0',
    username: '',
    IsLoadData: 'F',
    ServeyHistry: '',
    QuestionViewType: 1,
    Language_ID:6

  });
}

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp, { tabsPlacement: 'bottom', tabsHideOnSubPages: true, mode: 'md', }),
    IonicStorageModule.forRoot({
      name: '__MegaDB',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    Api,

    User,
    Camera,
    SplashScreen,
    StatusBar,
    SQLite,
    SQLitePorter,
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler },

    Geolocation,
    Network
  ]
})
export class AppModule { }
