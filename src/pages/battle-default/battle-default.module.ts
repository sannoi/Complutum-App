import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BattleDefaultPage } from './battle-default';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    BattleDefaultPage,
  ],
  imports: [
    IonicPageModule.forChild(BattleDefaultPage),
    ComponentsModule
  ],
})
export class BattleDefaultPageModule {}
