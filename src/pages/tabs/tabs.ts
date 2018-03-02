import { Component } from '@angular/core';

import { InventoryPage } from '../inventory/inventory';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { FightersListPage } from '../fighters-list/fighters-list';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = InventoryPage;
  tab3Root = FightersListPage;
  tab4Root = ContactPage;

  constructor() {

  }
}
