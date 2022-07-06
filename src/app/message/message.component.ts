import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Message } from '../services/data.service';
import { Customer } from '../models/customer';
import { PlayerLottery } from '../models/playerLottery';

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
  @Output() updatePlayer: EventEmitter<PlayerLottery> = new EventEmitter();
  @Output() updatePlayerCustomer: EventEmitter<PlayerLottery> = new EventEmitter();
  @Output() updateDatabase: EventEmitter<boolean> = new EventEmitter();

  // green 
  item={
    src:'assets/img/redButton.jpg'
  }
  constructor() { }

  ngOnInit() {}

  update(current:PlayerLottery){
    debugger;
    if(this.playerCurrent.status && this.playerCurrent.uid === this.player.uid){
      this.playerCurrent.status=false;
      this.updatePlayerCustomer.emit(this.player);

    }else if(this.player.src===undefined && !this.playerCurrent.status  && this.playerCurrent.uid !== this.player.uid){
      this.player.src ='assets/img/greenButton.jpg'
      this.updatePlayer.emit(this.player);
    }
  }

  isIos() {
    const win = window as any;
    return win && win.Ionic && win.Ionic.mode === 'ios';
  }
}
