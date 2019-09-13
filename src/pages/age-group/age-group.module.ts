import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AgeGroupPage } from './age-group';

@NgModule({
  declarations: [
    AgeGroupPage,
  ],
  imports: [
    IonicPageModule.forChild(AgeGroupPage),
  ],
})
export class AgeGroupPageModule {}
