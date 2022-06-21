import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GamePageSpecial } from './gameSpecial.page';

const routes: Routes = [
  {
    path: '',
    component: GamePageSpecial
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GamePageSpecialRoutingModule {}
