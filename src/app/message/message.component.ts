import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlayerLottery } from '../models/playerLottery';
import { ModalController } from '@ionic/angular';
import { ViewHistoryCronComponent } from '../view-history-cron/view-history-cron.component';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() player: PlayerLottery;
  @Input() id: string;
  @Input() playerCurrent: PlayerLottery;
  @Input() idWin: string;
  @Input() verificado: boolean;
  @Input() minuteOutput: string = '00';
  @Input() secondsOutput: string = '00';
  @Input() miliSecondsOutput: string= '00';
  @Output() updatePlayer: EventEmitter<PlayerLottery> = new EventEmitter();
  @Output() updatePlayerCustomer: EventEmitter<PlayerLottery> = new EventEmitter();
  @Output() updateDatabase: EventEmitter<boolean> = new EventEmitter();

  // green 
  item={
    src:'assets/img/redButton.jpg'
  }
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.minuteOutput = '00';
    this.secondsOutput ='00';
    this.miliSecondsOutput='00';
  }

  update(current:PlayerLottery){
    
    if(this.playerCurrent.status && this.playerCurrent.uid === this.player.uid){
      this.playerCurrent.status=false;
      this.updatePlayerCustomer.emit(this.player);

    }else if(!this.player.src && !this.playerCurrent.status  && this.playerCurrent.uid !== this.player.uid){
      this.player.src ='assets/img/greenButton.jpg'
      this.updatePlayer.emit(this.player);
    }
  }

  async viewHistory(current:PlayerLottery){
    const modal = await this.modalCtrl.create({
      component: ViewHistoryCronComponent,
      cssClass: 'modal-fullscreen',
      componentProps: { chronos: current.historyCron},
    });
    await modal.present();
  }

  

  isIos() {
    const win = window as any;
    return win && win.Ionic && win.Ionic.mode === 'ios';
  }
}
