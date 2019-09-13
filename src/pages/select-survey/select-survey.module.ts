import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectSurveyPage } from './select-survey';

@NgModule({
  declarations: [
    SelectSurveyPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectSurveyPage),
  ],
})
export class SelectSurveyPageModule {}
