import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ViewAwardsComponent } from './view-awards.component';


@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, RouterModule],
  declarations: [ViewAwardsComponent],
  exports: [ViewAwardsComponent]
})
export class ViewAwardsModule {}
