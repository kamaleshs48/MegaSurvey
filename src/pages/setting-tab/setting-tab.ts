import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage(
  {
    priority: 'high'
  }
)
@Component({
  selector: 'page-setting-tab',
  templateUrl: 'setting-tab.html',
})
export class SettingTabPage {
  @ViewChild('myTabs') tabRef;

  tab1Root = 'ProfessionTabPage';
  tab2Root = 'EducationTabPage';
  tab3Root = 'ReligionTabPage';
  tab4Root = 'ReligionSettingPage';
  tab5Root = 'PageSettingPage';
  constructor(public navCtrl: NavController, public navParams: NavParams) {
   // this.tabRef.select(0);
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.tabRef.select(0);
    }, 200);
    console.log('ionViewDidLoad SettingTabPage');
  }
  ionViewDidEnter() {
    this.tabRef.select(0);
    setTimeout(() => {
      this.tabRef.select(0);
    }, 200);
  }
  ionViewWillEnter() {
    this.tabRef.select(0);
    setTimeout(() => {
      this.tabRef.select(0);
    }, 100);
  }


 
}
