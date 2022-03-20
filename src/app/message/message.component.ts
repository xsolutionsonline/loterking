import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Message } from '../services/data.service';
import { Customer } from '../models/customer';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() player: Customer;
  @Input() id: string;
  @Input() idWin: string;
  @Output() updatePlayer: EventEmitter<Customer> = new EventEmitter();

  // green 
  item={
    src:'https://firebasestorage.googleapis.com/v0/b/lotterking-a692c.appspot.com/o/botonred.png?alt=media&token=404af3fe-8416-4c74-b7e6-9e60a32afdf8'
  }
  constructor() { }

  ngOnInit() {}

  update(){
    if(this.player.src===undefined){
    this.player.src ='https://firebasestorage.googleapis.com/v0/b/lotterking-a692c.appspot.com/o/botongreen.png?alt=media&token=b68dcef0-9027-48db-95b3-bb7e7f2172ad'
    this.updatePlayer.emit(this.player);
    }
  }

  isIos() {
    const win = window as any;
    return win && win.Ionic && win.Ionic.mode === 'ios';
  }
}
