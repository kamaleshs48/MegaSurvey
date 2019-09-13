import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EducationTabPage } from './education-tab';

@NgModule({
  declarations: [
    EducationTabPage,
  ],
  imports: [
    IonicPageModule.forChild(EducationTabPage),
  ],
})
export class EducationTabPageModule {}
