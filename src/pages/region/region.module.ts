import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegionPage } from './region';

@NgModule({
  declarations: [
    RegionPage,
  ],
  imports: [
    IonicPageModule.forChild(RegionPage),
  ],
})
export class RegionPageModule {}
