import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../providers/user/user';
import { LoadingController } from '../../../node_modules/ionic-angular/components/loading/loading-controller';
/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var navigator: any;
@IonicPage()
@Component({
	selector: 'page-forgot-password',
	templateUrl: 'forgot-password.html',
})

export class ForgotPasswordPage {

	MobileNo: string = '';
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private loadingCtrl: LoadingController,
		public users: User,
	) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ForgotPasswordPage');
	}
	ForGotPassword() {


		var networkState = navigator.connection.type;
		if (networkState == 'none') {
			this.users.ShowAlert('Please check your internet connection')
			return;
		};


		const loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});

		if (this.MobileNo == '') {
			this.users.ShowAlert('Please enter Mobile No.');
			return;
		}

		loading.present();

		this.users.ForgotPassword(this.MobileNo).subscribe((res: any) => {
			if (res == 'Password sent successfully to your Mobile No.') {
				this.users.ShowAlert(res);
				loading.dismiss()
				this.navCtrl.push('LoginPage');
			}
			else {
				loading.dismiss()
				this.users.ShowAlert(res);
			}
		});
	}
}
