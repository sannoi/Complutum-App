import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FightersListPage } from './fighters-list';

@NgModule({
  declarations: [
    FightersListPage,
  ],
  imports: [
    IonicPageModule.forChild(FightersListPage),
  ],
})
export class FightersListPageModule {}
