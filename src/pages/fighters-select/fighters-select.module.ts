import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FightersSelectPage } from './fighters-select';

@NgModule({
  declarations: [
    FightersSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(FightersSelectPage),
  ],
})
export class FightersSelectPageModule {}
