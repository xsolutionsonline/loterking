import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PayulistPage } from './payulist.page';

const routes: Routes = [
  {
    path: '',
    component: PayulistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayulistPageRoutingModule {}
