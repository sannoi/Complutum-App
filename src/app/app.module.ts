import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { InventoryPage } from '../pages/inventory/inventory';
import { FightersListPage } from '../pages/fighters-list/fighters-list';
import { MapaPage } from '../pages/mapa/mapa';
import { SettingsPage } from '../pages/settings/settings';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Geolocation } from '@ionic-native/geolocation';
import { BattleServiceProvider } from '../providers/battle-service/battle-service';
import { PlayerServiceProvider } from '../providers/player-service/player-service';
import { ConfigServiceProvider } from '../providers/config-service/config-service';
import { ToastServiceProvider } from '../providers/toast-service/toast-service';
import { ItemsServiceProvider } from '../providers/items-service/items-service';
import { MapServiceProvider } from '../providers/map-service/map-service';
import { StatsServiceProvider } from '../providers/stats-service/stats-service';
import { SettingsServiceProvider } from '../providers/settings-service/settings-service';
import { WikidataServiceProvider } from '../providers/wikidata-service/wikidata-service';
import { AlertServiceProvider } from '../providers/alert-service/alert-service';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    InventoryPage,
    FightersListPage,
    MapaPage,
    SettingsPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__ComplutumApp'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    InventoryPage,
    FightersListPage,
    MapaPage,
    SettingsPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
	  Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BattleServiceProvider,
    PlayerServiceProvider,
    ConfigServiceProvider,
    ToastServiceProvider,
    ItemsServiceProvider,
    MapServiceProvider,
    StatsServiceProvider,
    SettingsServiceProvider,
    WikidataServiceProvider,
    AlertServiceProvider,
    AlertServiceProvider
  ]
})
export class AppModule {}
