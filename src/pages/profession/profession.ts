import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, Platform } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { User, Settings } from '../../providers';


@IonicPage()
@Component({
  selector: 'page-profession',
  templateUrl: 'profession.html',
})
export class ProfessionPage {
  _List: any = [];
  Gender: any;
  platformHeight = 0;
  height = '';
  Language_ID: 0;
  Survey_ID = 0;
  SN = 0;
  NextPage=''
  constructor(public navCtrl: NavController, public navParams: NavParams
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


    platform.ready().then(() => {
      this.platformHeight = platform.height();
      this.height = ((this.platformHeight / 7.7) - 3).toString() + 'px';


    });


    setTimeout(() => {
      this.BindList();
    }, 200);
    setTimeout(() => {
      this.BindNextPage();
    }, 300);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GenderPage');



  }




  SaveGender(value, text) {
    this.Gender = value;
    // alert(text);
    let alert = this.alertCtrl.create({
      title: '',
      mode: 'ios',
      message: "Your Profession is '" + text + "', is it right?",
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
            //  this.navCtrl.push('AgeGroupPage');

            this.UpdateSurveyData_OtherFields(value, this.SN, this.Survey_ID);
            if (this.NextPage) {
            let contactModal = this.modalCtrl.create(this.NextPage, { Language_ID: this.Language_ID, Survey_ID: this.Survey_ID, SN: this.SN });
            contactModal.present();
            }
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

      db.executeSql('select G.ID, G.Name,LR.Regional_Language ,G.Icons from tbl_Profession AS G Left Join tbl_LanguageRegional AS LR ON G.ID=LR.Profession_ID AND LR.Language_ID=? WHERE G.Status=1', [this.Language_ID])
        .then(res => {
          this._List = [];
          for (var i = 0; i < res.rows.length; i++) {
            this._List.push({
              value: res.rows.item(i).ID,
              text: res.rows.item(i).Name,
              IconsName: res.rows.item(i).Icons,
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

      db.executeSql('UPDATE SurveyData SET  Profession_ID = ? ,IsActive=1  Where RowID = ? AND Survey_ID = ?', [value, SN, Survey_ID])
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

      db.executeSql('select Name FROM tbl_PageMaster WHERE ID > 8 AND Status = 1 ORDER BY ID ASC LIMIT 1 ', [])
        .then(res => {
         
          this.NextPage=res.rows.item(0).Name
        })
        .catch(e => {
         
        })
        .catch(e => {
         
        });
    });
  }
}
