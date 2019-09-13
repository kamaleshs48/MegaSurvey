import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfessionPage } from './profession';

@NgModule({
  declarations: [
    ProfessionPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfessionPage),
  ],
})
export class ProfessionPageModule {}
