import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { Platform } from 'ionic-angular/platform/platform';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { User, Settings } from '../../providers';

/**
 * Generated class for the AgeGroupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-age-group',
  templateUrl: 'age-group.html',
})
export class AgeGroupPage {

  _List: any = [];
  Gender_ID: any = 1;
  Language_ID: 0;
  platformHeight = 0;
  height = '';
  Survey_ID = 0;
  SN = 0;
  NextPage = ''
  Survey_Type_ID = 0;
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
    this.Gender_ID = navParams.get('Gender_ID') || 1;


    this.Survey_Type_ID = navParams.get('Survey_Type_ID');
    platform.ready().then(() => {
      this.platformHeight = platform.height();
      this.height = ((this.platformHeight / 7.7) - 3).toString() + 'px';


    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GenderPage');


    setTimeout(() => {
      this.BindList();
    }, 200);
    setTimeout(() => {
      this.BindNextPage();
    }, 300);

  }
  SaveGender(value, text) {

    // alert(text);


    let alert = this.alertCtrl.create({
      title: '',
      mode: 'ios',
      message: "Your age between  '" + text + "', is it right?",
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
            let contactModal = this.modalCtrl.create(this.NextPage, { Language_ID: this.Language_ID, Survey_ID: this.Survey_ID, SN: this.SN });
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
  public closeModal() {
    this.UpdateSurveyData_OtherFields("9999", this.SN, this.Survey_ID);
    let contactModal = this.modalCtrl.create(this.NextPage, { Language_ID: this.Language_ID, Survey_ID: this.Survey_ID, SN: this.SN });
    contactModal.present();
    setTimeout(() => {
      this.viewCtrl.dismiss();
    }, 500);
  }

  BindList() {



    //  this.user.presentLoadingCustom();
    this.sqlite.create({
      name: 'surveydb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('select G.ID, G.Name,LR.Regional_Language ,G.Icons from tbl_AgeGroup AS G Left Join tbl_LanguageRegional AS LR ON G.ID=LR.Age_Group_ID AND LR.Language_ID = ? WHERE G.Status=1 AND G.Survey_ID=?', [this.Language_ID, this.Survey_Type_ID])
        .then(res => {
          this._List = [];
          var ImgIcons = "";

          for (var i = 0; i < res.rows.length; i++) {
            if (this.Gender_ID == 2 || this.Gender_ID == 3) {
              ImgIcons = res.rows.item(i).Icons.replace("Male", "Female");
            }
            else {
              ImgIcons= res.rows.item(i).Icons;
            }
            this._List.push({
              value: res.rows.item(i).ID,
              text: res.rows.item(i).Name,
              IconsName:ImgIcons, //res.rows.item(i).Icons,
              OtherLanguage: res.rows.item(i).Regional_Language,

            })
          }
        })
        .catch(e => {
          console.log(e);
          alert(JSON.stringify(e));
        })
        .catch(e => {
          alert(JSON.stringify(e));
          console.log(e);

        });
    });
  }

  UpdateSurveyData_OtherFields(value, SN, Survey_ID) {
    this.sqlite.create({
      name: 'surveydb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('UPDATE SurveyData SET  Age_Group_ID = ? ,IsActive=1  Where RowID = ? AND Survey_ID = ?', [value, SN, Survey_ID])
        .then(res => {


        }).catch(e => {
          alert(e);
          console.log(e)
        });

    }).catch(e => {
      alert(e);
      console.log(e)
    }
    );
  }
  BindNextPage() {

    this.sqlite.create({
      name: 'surveydb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('select Name FROM tbl_PageMaster WHERE ID > 6 AND Status = 1 ORDER BY ID ASC LIMIT 1 ', [])
        .then(res => {

          this.NextPage = res.rows.item(0).Name

        })
        .catch(e => {

        })
        .catch(e => {


        });
    });
  }
}
