import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';

import { Settings } from '../../providers';
import { User } from '../../providers';
import { LoadingController } from '../../../node_modules/ionic-angular/components/loading/loading-controller';
/**
 * Generated class for the MobileVerifyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var navigator: any;
@IonicPage()
@Component({
	selector: 'page-mobile-verify',
	templateUrl: 'mobile-verify.html',
})
export class MobileVerifyPage {
	OTP: string = '';
	OTPCount: number = 0;
	ServerOTP: string;
	MobileNo: string;
	constructor(public navCtrl: NavController, public navParams: NavParams,
		public users: User,
		private loadingCtrl: LoadingController,
	) {
		this.ServerOTP = navParams.get('ServerOTP') || 0;
		this.MobileNo = navParams.get('MobileNo') || 0;
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
	SubmitOTP() {
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

		loading.present();

		this.users.VerifyMobileNo(this.MobileNo).subscribe(res => {
			loading.dismiss()
			this.navCtrl.setRoot('ListMasterPage');
		}, err => {
				this.users.ShowAlert('Some thing wrong. Please try again');
				loading.dismiss()
			});


	}
}
