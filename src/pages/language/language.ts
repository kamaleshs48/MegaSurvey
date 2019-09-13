import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { User, Settings } from '../../providers';
import { Network } from '@ionic-native/network';
declare var navigator: any;

/**
 * Generated class for the LanguagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-language',
  templateUrl: 'language.html',
})
export class LanguagePage {
  LanguageList = [];
  Language_ID: any;
  constructor(

    public navCtrl: NavController, public navParams: NavParams,
    private sqlite: SQLite,
    public toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private settings: Settings,
    public user: User, private network: Network, ) {

    setTimeout(() => {
      this.BindLanguage();

    }, 600);


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LanguagePage');
    setTimeout(() => {
      this.LoadLanguageID();
    }, 700);

  }




  BindLanguage() {


    this.sqlite.create({
      name: 'surveydb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('SELECT * FROM tbl_Language ORDER BY ID ASC', [])
        .then(res => {
          this.LanguageList = [];
          if (res.rows.length < 1) {

            this.user.ShowAlert('Record not found');
          }


          for (var i = 0; i < res.rows.length; i++) {
            this.LanguageList.push({
              ID: res.rows.item(i).ID,
              Name: res.rows.item(i).Name,
              Status: res.rows.item(i).Status,
            })
          }
          //return stateList;
        })
        .catch(e => {

          console.log(e);
        })

    })
      .catch(e => {
        console.log(e);
      });
  }
  Save() {



    this.settings.load().then(() => {
      this.settings.setValue('Language_ID', parseInt(this.Language_ID));

    }).catch();

    this.user.ShowAlert('Record Updated Successfully.');


  }

  LoadLanguageID() {
    this.settings.load().then(() => {
      this.settings.getValue('Language_ID').then(r => {

        this.Language_ID = r;
      }).catch();

    });
  }
  closeModal()
  {
    this.navCtrl.setRoot('ListMasterPage');
  }
}
