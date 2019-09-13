import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, ModalController, IonicApp, Platform } from 'ionic-angular';
import { User, Settings } from '../../providers';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/**
 * Generated class for the SubCastPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sub-cast',
  templateUrl: 'sub-cast.html',
})
export class SubCastPage {
  _List: any = [];
  Gender: any;
  paramObj: any;
  platformHeight = 0;
  height = '';
  Religion_ID = 0;
  Survey_ID = 0;
  Language_ID: 0;
  SN = 0;
  NextPage = ''
  IsData: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams
    , private alertCtrl: AlertController, private settings: Settings,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public ionicApp: IonicApp,
    private platform: Platform,
    private sqlite: SQLite,
    public user: User,

  ) {

    this.Religion_ID = navParams.get('Religion_ID') || 0;

    this.Survey_ID = navParams.get('Survey_ID') || 0;
    this.SN = navParams.get('SN') || 0;
    this.Language_ID = navParams.get('Language_ID') || 0;

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
    this.Gender = value;
    // alert(text);
    // alert(this.paramObj);

    let alert1 = this.alertCtrl.create({
      title: '',
      mode: 'ios',
      message: "Your caste is '" + text + "', is it right?",
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
            this.UpdateSurveyData_OtherFields(value, this.SN, this.Survey_ID);

            let contactModal = this.modalCtrl.create(this.NextPage, { Language_ID: this.Language_ID, Survey_ID: this.Survey_ID, SN: this.SN });
            contactModal.present();
            setTimeout(() => {
              this.viewCtrl.dismiss();
            }, 200);


          }
        }
      ]
    });
    alert1.present();




  }
  public closeModal() {
    let contactModal = this.modalCtrl.create(this.NextPage, { Language_ID: this.Language_ID, Survey_ID: this.Survey_ID, SN: this.SN });
    contactModal.present();
    setTimeout(() => {
      this.viewCtrl.dismiss();
    }, 200);
  }

  public dismissAllModal() {
    let activeModal = this.ionicApp._modalPortal.getActive();
    if (activeModal) {
      activeModal.dismiss().then(() => {
        this.dismissAllModal()
      });
    }
  }


  BindList() {



    //  this.user.presentLoadingCustom();
    this.sqlite.create({
      name: 'surveydb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('select G.ID, G.Name,LR.Regional_Language ,G.Icons from tbl_SubCaste AS G Left Join tbl_LanguageRegional AS LR ON G.ID=LR.Caste_ID AND LR.Language_ID = ? WHERE G.Status=1 AND G.Religion_ID = ? Order by G.Name', [this.Language_ID, this.Religion_ID])
        .then(res => {
          this._List = [];

          if (res.length > 0) {
          this.IsData=true;
          }

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

      db.executeSql('UPDATE SurveyData SET  Caste_ID = ?  ,IsActive=1 Where RowID = ? AND Survey_ID = ?', [value, SN, Survey_ID])
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

      db.executeSql('select Name FROM tbl_PageMaster WHERE ID > 10 AND Status = 1 ORDER BY ID ASC LIMIT 1 ', [])
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
