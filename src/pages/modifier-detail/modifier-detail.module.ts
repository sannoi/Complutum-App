import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModifierDetailPage } from './modifier-detail';

@NgModule({
  declarations: [
    ModifierDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ModifierDetailPage),
  ],
})
export class ModifierDetailPageModule {}
