import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MultipleQuestionSettingPage } from './multiple-question-setting';

@NgModule({
  declarations: [
    MultipleQuestionSettingPage,
  ],
  imports: [
    IonicPageModule.forChild(MultipleQuestionSettingPage),
  ],
})
export class MultipleQuestionSettingPageModule {}
