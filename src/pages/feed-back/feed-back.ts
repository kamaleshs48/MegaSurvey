import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';

import { Settings } from '../../providers';
import { User } from '../../providers';
import { LoadingController } from '../../../node_modules/ionic-angular/components/loading/loading-controller';
/**
 * Generated class for the FeedBackPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var navigator: any;
@IonicPage()
@Component({
  selector: 'page-feed-back',
  templateUrl: 'feed-back.html',
})
export class FeedBackPage {
  Qry: string = '';
  UID: any;
  MobileNo:any;
  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    public users: User,
    private loadingCtrl: LoadingController,
    private settings: Settings
  ) {
  }

  ionViewDidLoad() {

    this.settings.load().then(() => {

     
      this.settings.getValue('MobileNo').then(r => {
        this.MobileNo = r;
     });

      this.settings.getValue('UID').then(r => {
        this.UID = r;

      });
    });


    console.log('ionViewDidLoad FeedBackPage');
  }
  SubmitFeedBack() {
    var networkState = navigator.connection.type;
    if (networkState == 'none') {
      this.users.ShowAlert('Please check your internet connection')
      return;
    };

    if (this.Qry == '') {
      this.users.ShowAlert('Please Enter Comment');
      return;
    }

    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });




    loading.present();

    this.users.SendFeedBack(this.UID,this.MobileNo, this.Qry).subscribe(res => {
      this.Qry = '';
      loading.dismiss()
      this.users.ShowAlert('Thank You For Your Feedback.')

    });





  }
}
