import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MainSettingTabPage } from './main-setting-tab';

@NgModule({
  declarations: [
    MainSettingTabPage,
  ],
  imports: [
    IonicPageModule.forChild(MainSettingTabPage),
  ],
})
export class MainSettingTabPageModule {}
