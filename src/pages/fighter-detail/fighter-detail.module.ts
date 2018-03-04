import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FighterDetailPage } from './fighter-detail';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    FighterDetailPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(FighterDetailPage),
  ],
})
export class FighterDetailPageModule {}
