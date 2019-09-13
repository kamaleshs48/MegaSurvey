import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DemoUserRegisterPage } from './demo-user-register';

@NgModule({
  declarations: [
    DemoUserRegisterPage,
  ],
  imports: [
    IonicPageModule.forChild(DemoUserRegisterPage),
  ],
})
export class DemoUserRegisterPageModule {}
