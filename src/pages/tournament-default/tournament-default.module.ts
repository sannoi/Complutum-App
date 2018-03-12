import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TournamentDefaultPage } from './tournament-default';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    TournamentDefaultPage,
  ],
  imports: [
    IonicPageModule.forChild(TournamentDefaultPage),
    ComponentsModule
  ],
})
export class TournamentDefaultPageModule {}
