import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlayerDetailPage } from './player-detail';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    PlayerDetailPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(PlayerDetailPage),
  ],
})
export class PlayerDetailPageModule {}
