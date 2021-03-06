import { Component } from '@angular/core';

import { InventoryPage } from '../inventory/inventory';
import { SettingsPage } from '../settings/settings';
//import { HomePage } from '../home/home';
import { FightersListPage } from '../fighters-list/fighters-list';
import { MapaPage } from '../mapa/mapa';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = MapaPage;
  tab2Root = InventoryPage;
  tab3Root = FightersListPage;
  tab4Root = SettingsPage;

  constructor() {

  }
}
