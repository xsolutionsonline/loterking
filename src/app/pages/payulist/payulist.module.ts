import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { IonicModule } from '@ionic/angular';

import { PayulistPageRoutingModule } from './payulist-routing.module';

import { PayulistPage } from './payulist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PayulistPageRoutingModule
  ],
  providers:[
    InAppBrowser,
  ],
  declarations: [PayulistPage]
})
export class PayulistPageModule {}
