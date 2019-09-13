import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, Events } from 'ionic-angular';
import { Settings } from '../../providers';
import { User } from '../../providers';
import { MainPage } from '../';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { LoadingController } from '../../../node_modules/ionic-angular/components/loading/loading-controller';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var navigator: any;
@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  authForm: FormGroup;
  u: { FirstName: string, LastName: string, MobileNo: string, Email: string, password: string } =
    {
      FirstName: '',
      LastName: '',
      Email: '',
      MobileNo: '',
      password: ''
    }
  constructor(
    public navCtrl: NavController,
    private settings: Settings,
    private user: User,
    private events: Events,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    public formBuilder: FormBuilder,
    private translateService: TranslateService
  ) {
    this.authForm = formBuilder.group({
      FirstName: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'),Validators.minLength(4),Validators.maxLength(30)])],
      LastName: [''],
      Email:[''],
      MobileNo:['',Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      password:['',Validators.compose([Validators.required,  Validators.minLength(4), Validators.maxLength(12)])]

  });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }
  doLogin() {

     var networkState = navigator.connection.type;
    if (networkState == 'none') {
      this.user.ShowAlert('Please check your internet connection')
      return;
    };
 

    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });


    if (this.u.Email != '' && this.validateEmail(this.u.Email) == true) {
      this.user.ShowAlert('Please enter valid Email.')
    }


    if ( this.u.FirstName == '' || this.u.MobileNo == '' || this.u.password == '') {
    //  this.navCtrl.push('MobileVerifyPage');
      let toast = this.toastCtrl.create({
        message: 'Please fill in all required fields',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      return;
    }
    loading.present();
    this.user.UserRegister(this.u).subscribe((resp: any) => {

      if (resp.status == 'success') {

        /*   this.settings.load().then(() => {
  
            this.settings.setValue('UID', resp.users.UID);
            this.settings.setValue('UName', resp.users.FirstName);
            this.settings.setValue('Email', resp.users.Email);
   
            this.settings.setValue('Row_ID', 0);
            this.settings.setValue('username', resp);
            this.settings.save();
          }); */


        this.events.publish('username:changed', resp);
        loading.dismiss()
        this.navCtrl.push('MobileVerifyPage',{ServerOTP:resp.ServerOTP,MobileNo:resp.MobileNo});

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
        message: '',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      loading.dismissAll();
    });




    // this.navCtrl.setRoot(MainPage);
  }
  GoToLogin()
  {
    this.navCtrl.push('LoginPage');
  }
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}
