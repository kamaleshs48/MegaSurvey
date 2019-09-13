import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReligionSettingPage } from './religion-setting';

@NgModule({
  declarations: [
    ReligionSettingPage,
  ],
  imports: [
    IonicPageModule.forChild(ReligionSettingPage),
  ],
})
export class ReligionSettingPageModule {}
