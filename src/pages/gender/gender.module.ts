import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GenderPage } from './gender';

@NgModule({
  declarations: [
    GenderPage,
  ],
  imports: [
    IonicPageModule.forChild(GenderPage),
  ],
})
export class GenderPageModule {}
