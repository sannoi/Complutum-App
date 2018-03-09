import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrapDetailPage } from './trap-detail';

@NgModule({
  declarations: [
    TrapDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(TrapDetailPage),
  ],
})
export class TrapDetailPageModule {}
