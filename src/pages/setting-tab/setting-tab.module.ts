import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingTabPage } from './setting-tab';

@NgModule({
  declarations: [
    SettingTabPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingTabPage),
  ],
})
export class SettingTabPageModule {}
