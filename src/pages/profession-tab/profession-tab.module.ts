import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfessionTabPage } from './profession-tab';

@NgModule({
  declarations: [
    ProfessionTabPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfessionTabPage),
  ],
})
export class ProfessionTabPageModule {}
