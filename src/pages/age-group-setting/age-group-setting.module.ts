import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AgeGroupSettingPage } from './age-group-setting';

@NgModule({
  declarations: [
    AgeGroupSettingPage,
  ],
  imports: [
    IonicPageModule.forChild(AgeGroupSettingPage),
  ],
})
export class AgeGroupSettingPageModule {}
