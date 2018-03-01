import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup} from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-player-new',
  templateUrl: 'player-new.html',
})
export class PlayerNewPage {
  private playerData: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public viewCtrl: ViewController) {
    this.playerData = this.formBuilder.group({
      nombre: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(12)])],
    });
  }

  ionViewDidLoad() {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  savePlayer() {
    let data = { player: this.playerData.value };
    this.viewCtrl.dismiss(data);
  }

}
