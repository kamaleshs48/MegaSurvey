import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MainSettingTabPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage(
  {
    priority: 'high'
  }
)
@Component({
  selector: 'page-main-setting-tab',
  templateUrl: 'main-setting-tab.html',
})
export class MainSettingTabPage {
  @ViewChild('myTabs') tabRef;
  tab1Root = 'SingleQuestionSettingPage';
  tab2Root = 'MultipleQuestionSettingPage';
  tab3Root = 'VoteFormSettingPage';
  tab4Root = 'AgeGroupSettingPage';
  tab5Root = 'QuestionSettingPage';
  constructor(public navCtrl: NavController, public navParams: NavParams) {
   // this.tabRef.select(0);
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.tabRef.select(0);
    }, 200);
    console.log('ionViewDidLoad MainSettingTabPage');
  }
  ionViewDidEnter() {
    this.tabRef.select(0);
    setTimeout(() => {
      this.tabRef.select(0);
    }, 1000);
  }
  ionViewWillEnter() {
    this.tabRef.select(0);
    setTimeout(() => {
      this.tabRef.select(0);
    }, 1000);
  }

}
