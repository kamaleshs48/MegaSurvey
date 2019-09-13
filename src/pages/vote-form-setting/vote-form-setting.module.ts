import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VoteFormSettingPage } from './vote-form-setting';

@NgModule({
  declarations: [
    VoteFormSettingPage,
  ],
  imports: [
    IonicPageModule.forChild(VoteFormSettingPage),
  ],
})
export class VoteFormSettingPageModule {}
