import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReligionTabPage } from './religion-tab';

@NgModule({
  declarations: [
    ReligionTabPage,
  ],
  imports: [
    IonicPageModule.forChild(ReligionTabPage),
  ],
})
export class ReligionTabPageModule {}
