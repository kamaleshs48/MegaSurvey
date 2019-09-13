import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Settings } from '../../providers';
import { User } from '../../providers';
import { LoadingController } from '../../../node_modules/ionic-angular/components/loading/loading-controller';
/**
 * Generated class for the DemoOtpMobileVerifyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var navigator: any;
@IonicPage()
@Component({
  selector: 'page-demo-otp-mobile-verify',
  templateUrl: 'demo-otp-mobile-verify.html',
})
export class DemoOtpMobileVerifyPage {
  u: { FirstName: string, LastName: string, Mobile1: string, Mobile2: string, Email: string, Address: string } =
  {
    FirstName: '',
    LastName: '',
    Email: '',
    Mobile1: '',
    Address: '',
    Mobile2: ''
  }

  OTP: string = '';
	OTPCount: number = 0;
	ServerOTP: string;
	MobileNo: string;constructor(public navCtrl: NavController, public navParams: NavParams,
		public users: User,
		private loadingCtrl: LoadingController,
	) {
		this.ServerOTP = navParams.get('ServerOTP') || 0;
    this.MobileNo = navParams.get('MobileNo1') || 0;
    
    this.u.FirstName = navParams.get('FirstName') || '';
    this.u.LastName = navParams.get('LastName') || '';
    this.u.Email = navParams.get('Email') || '';
    this.u.Mobile1 = navParams.get('MobileNo1') || '';
    this.u.Mobile2 = navParams.get('MobileNo2') || '';
    this.u.Address = navParams.get('Address') || '';


	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad MobileVerifyPage');
	}
	ResendOTP() {

		var networkState = navigator.connection.type;
		if (networkState == 'none') {
			this.users.ShowAlert('Please check your internet connection')
			return;
		};


		const loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});

		loading.present();

		this.users.ResendOTP(this.ServerOTP, this.MobileNo).subscribe(res => {

		});
		this.users.ShowAlert('Resend verification code successfully.')
		this.OTPCount = this.OTPCount + 1;
		loading.dismiss()
	}
  SubmitOTP()
   {

    if (this.OTP == '') {
			this.users.ShowAlert('Please enter verification code');
			return;
		}
		if (this.OTP != this.ServerOTP) {
			this.users.ShowAlert('Invalid verification code, Please enter valid verification code');
			return;
		}
  
    const loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
	
		//	this.navCtrl.setRoot('ListMasterPage');
    var obj = {
      FirstName: this.u.FirstName,
      LastName: this.u.LastName,
      MobileNo1: this.u.Mobile1,
      MobileNo2: this.u.Mobile2,
      Email: this.u.Email,
      Address: this.u.Address,
      ServerOTP:this.OTP
   }
    this.navCtrl.push('DemoUserRegisterPage', obj);


  }
}