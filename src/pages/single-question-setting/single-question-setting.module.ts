import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SingleQuestionSettingPage } from './single-question-setting';

@NgModule({
  declarations: [
    SingleQuestionSettingPage,
  ],
  imports: [
    IonicPageModule.forChild(SingleQuestionSettingPage),
  ],
})
export class SingleQuestionSettingPageModule {}
