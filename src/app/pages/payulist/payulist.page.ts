import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  InAppBrowser,
  InAppBrowserOptions
} from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-payulist',
  templateUrl: './payulist.page.html',
  styleUrls: ['./payulist.page.scss'],
})
export class PayulistPage implements OnInit {

  constructor(private iab: InAppBrowser,
    private router: Router,) { }

  ngOnInit() {
  }

 

  payu(value,url) {
    
    const options: InAppBrowserOptions = {
      location: 'yes',
      zoom: 'yes',
      toolbar: 'no',
      closebuttoncaption: 'back',
    };
    const browser: any = this.iab.create(url);
    browser.close();

    
  }

  back(){
    this.router.navigate(['/home']);
  }


}
