import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payulist',
  templateUrl: './payulist.page.html',
  styleUrls: ['./payulist.page.scss'],
})
export class PayulistPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  payu(value){
    console.log('valor0',value);
  }

}
