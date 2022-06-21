import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GamePageSpecialRoutingModule } from './gameSpecial-routing.module';

import { GamePageSpecial } from './gameSpecial.page';
import { MessageComponentModule } from '../../message/message.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GamePageSpecialRoutingModule,
    MessageComponentModule,
  ],
  declarations: [GamePageSpecial]
})
export class GamePageSpecialModule {}
