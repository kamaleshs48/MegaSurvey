import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DemoMobileVerifyPage } from './demo-mobile-verify';

@NgModule({
  declarations: [
    DemoMobileVerifyPage,
  ],
  imports: [
    IonicPageModule.forChild(DemoMobileVerifyPage),
  ],
})
export class DemoMobileVerifyPageModule {}
