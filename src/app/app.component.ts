import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform, Events, IonicApp } from 'ionic-angular';
import { FirstRunPage, MainPage } from '../pages';
import { Settings, User } from '../providers';
import { Geolocation } from '@ionic-native/geolocation';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
declare var navigator: any;
@Component({
  template: `<ion-menu [content]="content">
    <ion-header>
      <ion-toolbar>
      <button menuClose ion-item no-lines (click)="openProfilePage('MyProfilePage')">
      

     <ion-avatar item-start>
     <img src="{{ImagePath}}"/>
    </ion-avatar>

    <h4>{{UName}}</h4> 
    
    </button>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">
        <ion-icon color="header" name="{{p.icon}}">&nbsp;&nbsp;&nbsp;</ion-icon>{{p.title}}
        </button>
      
      
      <button menuClose ion-item  (click)="LogOut()">
        <ion-icon color="header" name="log-out">&nbsp;&nbsp;&nbsp;</ion-icon>Log Out
        </button>
        <ion-item>
        &nbsp;
        </ion-item>
      </ion-list>
    </ion-content>
    <ion-footer>
    <ion-toolbar>
    <strong center>
      App Version 0.0.5
   </strong>
    </ion-toolbar>
   </ion-footer>
  </ion-menu>
  <ion-nav #content [root]="rootPage"></ion-nav>
    
  `,
})
export class MyApp {
  rootPage = FirstRunPage;
  UsersDetails: any;
  backbutton = 0;
  UName: any;
  UID: any;
  IsVerify: any;
  ImagePath: any = 'assets/img/logo.png';
  Email: any;
  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    { title: 'Home', component: 'ListMasterPage', icon: 'md-home' },
    { title: 'Data Import/Export', component: 'MasterPage', icon: 'car' },
    { title: 'Survey Data', component: 'SelectSurveyPage', icon: 'flask' },

    { title: 'Regional Language', component: 'LanguagePage', icon: 'ios-appstore-outline' },
    /*   { title: 'Regional Caste', component: 'PersonalDetailsPage', icon: 'ios-appstore-outline' },  */
    { title: 'Settings', component: 'MainSettingTabPage', icon: 'ios-settings' },
    { title: 'Further Settings', component: 'SettingTabPage', icon: 'ios-settings' },

    { title: 'Question Sequence', component: 'QuestionSettingPage', icon: 'ios-bookmark-outline' },
    { title: 'About Us', component: 'AboutUsPage', icon: 'md-help-buoy' },

    { title: 'Privacy Policy', component: 'PrivacyPolicyPage', icon: 'ios-paper-outline' },
    { title: 'Terms & Conditions', component: 'TermsConditionsPage', icon: 'ios-paper-outline' },
    { title: 'FAQs', component: 'FaqPage', icon: 'ios-help-circle' },

    { title: 'Feedback', component: 'FeedBackPage', icon: 'ios-help-circle-outline' },
    { title: 'Contact Us', component: 'ContactUsPage', icon: 'md-bookmarks' },

    /*  { title: 'Gender', component: 'GenderPage', icon: 'log-out' },
     { title: 'Age Group', component: 'AgeGroupPage', icon: 'log-out' },
     { title: 'Region', component: 'RegionPage', icon: 'log-out' },
     { title: 'Sub Cast', component: 'SubCastPage', icon: 'log-out' },
       { title: 'Log Out', component: 'LoginPage', icon: 'log-out' }, */




    /*   { title: 'HomePage', component: 'HomePage', icon: 'log-out'},
     { title: 'Survey Page', component: 'Survey1Page', icon: 'log-out'}  */


  ]

  constructor(private translate: TranslateService, platform: Platform, private settings: Settings,
    private config: Config, private statusBar: StatusBar, private splashScreen: SplashScreen
    , private events: Events,
    private geolocation: Geolocation,
    private ionicApp: IonicApp,
    public user: User,
    private loadingCtrl: LoadingController,
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // this.statusBar.show();

      this.splashScreen.hide();

      setTimeout(() => {
        this._GetCurrentPosition();

      }, 800);


      //_________________________________
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.



      this.settings.load().then(() => {

        this.settings.getValue('IsVerify').then(r => {
          this.IsVerify = r;
        });

        this.settings.getValue('UID').then(r => {
          this.UID = r;

          if (parseInt(this.UID) > 0) {
            this.settings.getValue('Email').then(r => {
              this.Email = r;
              this.settings.getValue('username').then(r => {
                this.UsersDetails = r;

                if (this.UsersDetails) {
                  if (this.UsersDetails != 'undifined' && this.UsersDetails != null && this.UsersDetails != "" && parseInt(this.IsVerify) > 0) {
                    this.events.publish('username:changed', this.UsersDetails);
                    this.rootPage = MainPage;
                  }
                  else {
                    this.rootPage = FirstRunPage;
                  }
                }
                else {
                  this.rootPage = FirstRunPage;
                }
              });
            });
          }
        });
      });
      this.statusBar.styleLightContent();
      //  this.splashScreen.hide();
      this.UName = "not logged in";
      events.subscribe('username:changed', username => {
        if (username != null && username !== undefined && username !== "") {
          if (username.users != null) {
            this.UName = username.users.FirstName + ' ' + username.users.LastName;
            this.Email = username.users.Email;
            this.UID = username.users.UID;
            this.ImagePath = username.users.ImagePath;

          }

        }
      });








      /* this.settings.load().then(() => {
       this.settings.getValue('UID').then(r=>{this.UID=r;});
       this.settings.getValue('UName').then(r=>{this.UName=r;});
       this.settings.getValue('Email').then(r=>{this.Email=r;});
       this.settings.getValue('ImagePath').then(r=>{this.ImagePath=r;});
       */

      //_________________________________




    });
    this.initTranslate();
  }
  public dismissAllModal() {
    let activeModal = this.ionicApp._modalPortal.getActive();
    if (activeModal) {
      activeModal.dismiss().then(() => {
        this.dismissAllModal()
      });
    }
  }



  _GetCurrentPosition() {
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }
  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();

    if (browserLang) {
      if (browserLang === 'zh') {
        const browserCultureLang = this.translate.getBrowserCultureLang();

        if (browserCultureLang.match(/-CN|CHS|Hans/i)) {
          this.translate.use('zh-cmn-Hans');
        } else if (browserCultureLang.match(/-TW|CHT|Hant/i)) {
          this.translate.use('zh-cmn-Hant');
        }
      } else {
        this.translate.use(this.translate.getBrowserLang());
      }
    } else {
      this.translate.use('en'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  openProfilePage(page) {

    if (parseInt(this.UID) == 1) {
      this.user.ShowAlert('It is a demo account of this app. So you can not update this account.')
      return false;
    }
    this.nav.push(page);
  }


  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario


    this.dismissAllModal()
    if (page.component == 'SettingTabPage') {
      this.nav.setRoot(page.component);
    }
    if (page.component == 'MainSettingTabPage') {
      this.nav.setRoot(page.component);
    }

    this.nav.setRoot(page.component);
  }

  LogOut() {

    var networkState = navigator.connection.type;
    if (networkState == 'none') {
      this.user.ShowAlert('Please check your internet connection')
      return;
    };



    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    this.settings.load().then(() => {

      this.settings.getValue('MobileNo').then(r => {
        this.user.LogOut(r).subscribe((x: any) => {
          if (x == 'success')
           {
            this.settings.setValue('UID', 0);
            this.settings.setValue('IsVerify', 0);
            this.settings.setValue('ServeyHistry', '');
            loading.dismiss();
            this.nav.setRoot('LoginPage');
          }
          else {
            loading.dismiss();
            this.user.ShowAlert('Opps Somthing wrong please try again some time');
          }
        }, err => {
          this.user.ShowAlert('Opps Somthing wrong please try again after some time');
          loading.dismiss();
        });
      });
    });
  }
}
