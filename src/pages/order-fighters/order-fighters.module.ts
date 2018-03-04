import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderFightersPage } from './order-fighters';

@NgModule({
  declarations: [
    OrderFightersPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderFightersPage),
  ],
})
export class OrderFightersPageModule {}
