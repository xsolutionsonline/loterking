import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-view-awards',
  templateUrl: './view-awards.component.html',
  styleUrls: ['./view-awards.component.scss'],
})
export class ViewAwardsComponent implements OnInit {
  valueAward:number=100000;
  awards: Number[];

  constructor(private navParams: NavParams,
    private modalController: ModalController,) { }

  ngOnInit() {
    this.awards = this.navParams.get('awards');
    this.valueAward = this.navParams.get('valueAward');
  }

  close() {
    this.modalController.dismiss();
  }
}
