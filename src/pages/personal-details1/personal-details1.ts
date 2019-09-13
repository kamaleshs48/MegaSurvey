import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, Platform } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { User, Settings } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-personal-details1',
  templateUrl: 'personal-details1.html',
})
export class PersonalDetails1Page {
  TData = 1;
  _List: any = [];
  Gender: any;
  Language_ID: 0;
  platformHeight = 0;
  height = '';
  Survey_ID = 0;
  SN = 0;
  NextPage = ''
  Name = '';
  Email = '';
  Mobile1 = '';
  Mobile2 = '';
  Survey_Type_ID: 0;





  constructor(public navCtrl: NavController,
    public navParams: NavParams
    , private alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    private platform: Platform,
    private settings: Settings,
    private sqlite: SQLite,
    public user: User,
  ) {

    this.Survey_ID = navParams.get('Survey_ID') || 0;
    this.SN = navParams.get('SN') || 0;
    this.Language_ID = navParams.get('Language_ID') || 0;
    this.Survey_Type_ID = navParams.get('Survey_Type_ID');
    platform.ready().then(() => {
      this.platformHeight = platform.height();
      this.height = ((this.platformHeight / 7.7) - 3).toString() + 'px';
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad GenderPage');

    setTimeout(() => {
      this.BindNextPage();
    }, 300);

  }
  SaveGender(value, text) {
    this.Gender = value;
    // alert(text);







    let alert = this.alertCtrl.create({
      title: '',
      mode: 'ios',
      message: 'Your Response  ' + text + ', is it right?',
      buttons: [
        {

          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            //this.navCtrl.push('RegionPage');


            // this.navCtrl.push('AgeGroupPage');
            this.UpdateSurveyData_OtherFields(value, this.SN, this.Survey_ID);


            let contactModal = this.modalCtrl.create(this.NextPage, { Language_ID: this.Language_ID, Survey_ID: this.Survey_ID, SN: this.SN, Survey_Type_ID: this.Survey_Type_ID });
            contactModal.present();

            setTimeout(() => {
              this.viewCtrl.dismiss();
            }, 500);



          }
        }
      ]
    });
    alert.present();
  }


  public Skip() {

   // this.UpdateSurveyData_OtherFields("99999", this.SN, this.Survey_ID);
    let contactModal = this.modalCtrl.create(this.NextPage, { Language_ID: this.Language_ID, Survey_ID: this.Survey_ID, SN: this.SN, Survey_Type_ID: this.Survey_Type_ID });
    contactModal.present();

    setTimeout(() => {
      this.viewCtrl.dismiss();
    }, 500);
  }

  public closeModal() {



    if (this.Name != '' && this.Name.length >= 3) {
      this.TData = 1;
    }
    else if (this.Name != '' && this.Name.length < 3) {
      this.user.ShowAlert('Please Enter Valid Name');
      return;
    }
    if (this.Mobile1 != '' && this.Mobile1.length >= 9) {
      this.TData = 1;
    }
    else if (this.Mobile1 != '' && this.Mobile1.length < 9) {
      this.user.ShowAlert('Please Enter Valid Mobile Number');
      return;
    }
    if (this.Mobile2 != '' && this.Mobile2.length >= 9) {
      this.TData = 1;
    }
    else if (this.Mobile2 != '' && this.Mobile2.length < 10) {
      this.user.ShowAlert('Please Enter Valid Mobile Number');
      return;
    }
    if (this.Email != '' && this.validateEmail(this.Email) == true) {
      this.TData = 1;
    }
    else if (this.Email != '' && this.validateEmail(this.Email) == false) {
      this.user.ShowAlert('Please Enter Valid Email');
      return;
    }
    if (this.Email == '' && this.Name == '' && this.Mobile1 == '' && this.Mobile2 == '') {
      this.user.ShowAlert('Please Enter atleast one fileds.');
      return;
    }
    this.UpdateSurveyData_OtherFields(this.Name, this.SN, this.Survey_ID);


    let contactModal = this.modalCtrl.create(this.NextPage, { Language_ID: this.Language_ID, Survey_ID: this.Survey_ID, SN: this.SN, Survey_Type_ID: this.Survey_Type_ID });
    contactModal.present();

    setTimeout(() => {
      this.viewCtrl.dismiss();
    }, 500);

   
  }
  UpdateSurveyData_OtherFields(value, SN, Survey_ID) {
   
    this.sqlite.create({
      name: 'surveydb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('UPDATE SurveyData SET  Name = ? , Email = ?, Mobile1 =?,Mobile2 = ? ,IsActive=1 Where RowID = ? AND Survey_ID = ?',
        [value.replace("'", ""), this.Email.replace("'", ""), this.Mobile1.replace("'", ""), this.Mobile2.replace("'", ""), SN, Survey_ID])
        .then(res => {


       



        }).catch(e => {

          console.log(e)
        });

    }).catch(e => {

      console.log(e)
    }
    );
  }
  onKeyPress(event) {
    //this.IsButtonEnable();
    if ((event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 97 && event.keyCode <= 122) || event.keyCode == 32 || event.keyCode == 46) {

      return true
    }
    else {
      return false
    }
  }
  isValidNumber(event) {

    var charCode = event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    //this.IsButtonEnable();
    return true;
  }

  IsButtonEnable() {

    let ret = false;

    if (this.Name != '' && this.Name.length >= 3) {
      this.TData = 1;
    }
    else if (this.Name != '' && this.Name.length < 3) {
      this.TData = 0;
    }
    if (this.Mobile1 != '' && this.Mobile1.length >= 9) {
      this.TData = 1;
    }
    else if (this.Mobile1 != '' && this.Mobile1.length < 9) {
      this.TData = 0;
    }
    if (this.Mobile2 != '' && this.Mobile2.length >= 9) {
      this.TData = 1;
    }
    else if (this.Mobile2 != '' && this.Mobile2.length < 10) {
      this.TData = 0;
    }
    if (this.Email != '' && this.validateEmail(this.Email) == true) {
      this.TData = 1;
    }
    else if (this.Email != '' && this.validateEmail(this.Email) == false) {
      this.TData = 0;
    }
    if (this.Email == '' && this.Name == '' && this.Mobile1 == '' && this.Mobile2 == '') {
      this.TData = 0;
    }

    //	return ret;
  }
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

   BindNextPage() {

    this.sqlite.create({
      name: 'surveydb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('select Name FROM tbl_PageMaster WHERE ID > 1 AND Status = 1 ORDER BY ID ASC LIMIT 1 ', [])
        .then(res => {
          if (res.rows.length > 0) {
            this.NextPage = res.rows.item(0).Name
          }




        })
        .catch(e => {
          //  alert(JSON.stringify(e));
        })
        .catch(e => {
          // alert(JSON.stringify(e));

        });
    });
  }

}
