import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuestionSettingPage } from './question-setting';

@NgModule({
  declarations: [
    QuestionSettingPage,
  ],
  imports: [
    IonicPageModule.forChild(QuestionSettingPage),
  ],
})
export class QuestionSettingPageModule {}
