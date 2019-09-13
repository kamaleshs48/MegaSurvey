import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../providers/user/user';
import { LoadingController } from '../../../node_modules/ionic-angular/components/loading/loading-controller';
import { Settings } from '../../providers';
/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var navigator: any;
@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

  CurrnetPassword: string = '';
  NewPassword: string = '';
  ConfirmPassword: string = '';
  OldPassword: string = '';
  UID: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    public users: User,
    public settings: Settings,
  ) {
    this.settings.load().then(() => {
      this.settings.getValue('UID').then(r => {
        this.UID = r;

      });
      this.settings.getValue('Password').then(r => {
        this.OldPassword = r;
      });
    });
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

    if (this.CurrnetPassword == '') {
      this.users.ShowAlert('Please enter Currnet Password.');
      return;
    }
    if (this.NewPassword == '') {
      this.users.ShowAlert('Please enter New Password.');
      return;
    }
    if (this.ConfirmPassword == '') {
      this.users.ShowAlert('Please enter Confirm Password.');
      return;
    }
    if (this.ConfirmPassword != this.NewPassword) {
      this.users.ShowAlert('New Password and Confirm Password does not match');
      return;
    }
    if (this.CurrnetPassword != this.OldPassword) {
      this.users.ShowAlert('Currnet Password does not match');
      return;
    }
    if (this.NewPassword.length < 6 || this.NewPassword.length > 12) {
      this.users.ShowAlert('New Password must be 6 character and max 12 character');
      return;
    }

    loading.present();

    this.users.ChangePassword(this.NewPassword, this.UID).subscribe((res: any) => {
      if (res == 'Success') {
        this.settings.setValue('Password',this.NewPassword);
        this.OldPassword=this.NewPassword;
        this.CurrnetPassword='';
        this.NewPassword='';
        this.ConfirmPassword='';
        this.users.ShowAlert('Password changed successfully');
        loading.dismiss()
      }
      else {
        loading.dismiss()
     }
    });
  }
}
