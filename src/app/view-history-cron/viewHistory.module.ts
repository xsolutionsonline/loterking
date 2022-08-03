import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ViewHistoryCronComponent } from './view-history-cron.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, RouterModule],
  declarations: [ViewHistoryCronComponent],
  exports: [ViewHistoryCronComponent]
})
export class ViewHistoryModule {}
