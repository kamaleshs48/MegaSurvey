import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuestionnaireMultichoicePage } from './questionnaire-multichoice';

@NgModule({
  declarations: [
    QuestionnaireMultichoicePage,
  ],
  imports: [
    IonicPageModule.forChild(QuestionnaireMultichoicePage),
  ],
})
export class QuestionnaireMultichoicePageModule {}
