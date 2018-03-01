import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BattleDefaultPage } from './battle-default';

@NgModule({
  declarations: [
    BattleDefaultPage,
  ],
  imports: [
    IonicPageModule.forChild(BattleDefaultPage),
  ],
})
export class BattleDefaultPageModule {}
