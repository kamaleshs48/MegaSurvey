import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { User } from '../../providers';
import { LoadingController } from '../../../node_modules/ionic-angular/components/loading/loading-controller';

/**
 * Generated class for the DemoMobileVerifyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-demo-mobile-verify',
  templateUrl: 'demo-mobile-verify.html',
})
export class DemoMobileVerifyPage {
  OTP: any;
  MobileNo: string = '';
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public _Alert: AlertController,
    public user: User,
    private loadingCtrl: LoadingController,

  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DemoMobileVerifyPage');
  }


  GetOTP() {

    let title: string;


    title = 'We have send verification code at your mobile. Please Enter your verification code';


    if (this.MobileNo == '') {
      this.user.ShowAlert('Please Enter Mobile No');
      return;
    }
    if (this.MobileNo.length != 10) {
      this.user.ShowAlert('Please Enter Valid Mobile No');
      return;
    }


    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });


    loading.present();

    this.user.DemoMobileVerify(this.MobileNo).subscribe((resp: any) => {

      if (resp.status == 'Success') {

        this.OTP = resp.ServerOTP;
        loading.dismiss()
                 var obj = {
                    FirstName: resp.users.FirstName,
                    LastName: resp.users.LastName,
                    MobileNo1: this.MobileNo,
                    MobileNo2: resp.users.MobileNo1,
                    Email: resp.users.Email,
                    Address: resp.users.Address,
                    ServerOTP:this.OTP
                 }
                 this.navCtrl.push('DemoOtpMobileVerifyPage', obj);
                  //this.Signup();
                }
    })
  }
}
