import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlayerNewPage } from './player-new';

@NgModule({
  declarations: [
    PlayerNewPage,
  ],
  imports: [
    IonicPageModule.forChild(PlayerNewPage),
  ],
})
export class PlayerNewPageModule {}
