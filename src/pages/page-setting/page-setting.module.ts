import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PageSettingPage } from './page-setting';

@NgModule({
  declarations: [
    PageSettingPage,
  ],
  imports: [
    IonicPageModule.forChild(PageSettingPage),
  ],
})
export class PageSettingPageModule {}
