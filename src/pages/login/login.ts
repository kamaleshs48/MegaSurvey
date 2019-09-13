import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, Events } from 'ionic-angular';
import { Settings } from '../../providers';
import { User } from '../../providers';
import { MainPage } from '../';


import { LoadingController } from '../../../node_modules/ionic-angular/components/loading/loading-controller';
declare var navigator: any;
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { email: string, password: string, DeviceID: string } = {
    email: '',
    password: '',
    DeviceID: ''
  };
  DemoUserID: any;
  DemoPassword: any;

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    private settings: Settings,
    private user: User,
    private events: Events,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private translateService: TranslateService

  ) {



    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }
  // Attempt to login in through our User service
  doLogin() {



    var networkState = navigator.connection.type;
    if (networkState == 'none') {
      this.user.ShowAlert('Please check your internet connection')
      return;
    };


    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    if (this.account.email == '' || this.account.password == '') {
      let toast = this.toastCtrl.create({
        message: 'Please Enter Valid UserID and Password',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      return;
    }
    loading.present();
    this.account.DeviceID = 'this.device.uuid';
    this.user.login(this.account).subscribe((resp: any) => {

      if (resp.status == 'success') {

         this.settings.load().then(() => {
  
            this.settings.setValue('UID', resp.users.UID);
            this.settings.setValue('UName', resp.users.FirstName);
            this.settings.setValue('Email', resp.users.Email);
            this.settings.setValue('MobileNo', resp.MobileNo);
            this.settings.setValue('IsVerify', resp.IsMobileVerify)
            this.settings.setValue('Row_ID', 0);
            this.settings.setValue('username', resp);
            this.settings.save();
          }); 


        this.events.publish('username:changed', resp);
        loading.dismiss()
        if (resp.IsMobileVerify == "0") {
          this.navCtrl.push('MobileVerifyPage', { ServerOTP: resp.ServerOTP, MobileNo: resp.MobileNo });
        }
        else {

          if (parseInt(resp.users.UID) == 1) {
            this.navCtrl.push('DemoMobileVerifyPage')
          }
          else {
           // this.settings.setValue('IsVerify', 1)
            this.navCtrl.setRoot(MainPage);
          }
        }
      }
      else {
        this.user.HideLoadingCustom();
        loading.dismiss();
        this.user.ShowAlert(resp.ErrorMessage)
        return;
      }
    }, (err) => {
      // alert(JSON.stringify( err))
      // this.navCtrl.setRoot(MainPage);
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: this.loginErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
      loading.dismissAll();
    });




    // this.navCtrl.setRoot(MainPage);
  }
  goToRegisterPage() {
    this.navCtrl.push('RegisterPage');
  }
  ForgotPassword() {
    this.navCtrl.push('ForgotPasswordPage');
  }

  ionViewWillEnter() {

    this.user.GetDemoUser().subscribe((resp: any) => {

      if (resp.status == 'success') {
        this.DemoUserID = resp.EmailID;
        this.DemoPassword = resp.Password;

      }
    });


  }

}
