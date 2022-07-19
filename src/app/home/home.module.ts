import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { MessageComponentModule } from '../message/message.module';
import { ViewAwardsModule } from '../view-awards/viewAwards.module';
import { MenuPrincipalModule } from '../menu-principal/menuPrincipal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MessageComponentModule,
    HomePageRoutingModule,
    ViewAwardsModule,
    MenuPrincipalModule,
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
