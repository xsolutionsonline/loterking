import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-view-history-cron',
  templateUrl: './view-history-cron.component.html',
  styleUrls: ['./view-history-cron.component.scss'],
})
export class ViewHistoryCronComponent implements OnInit {
  chronos: String[];

  constructor(private navParams: NavParams,
    private modalController: ModalController,) { }

  ngOnInit() {
    this.chronos = this.navParams.get('chronos');
  }

  close() {
    this.modalController.dismiss();
  }

}
