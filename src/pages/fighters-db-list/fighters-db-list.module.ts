import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FightersDbListPage } from './fighters-db-list';

@NgModule({
  declarations: [
    FightersDbListPage,
  ],
  imports: [
    IonicPageModule.forChild(FightersDbListPage),
  ],
})
export class FightersDbListPageModule {}
