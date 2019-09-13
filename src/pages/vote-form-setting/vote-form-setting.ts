import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, ModalController, IonicApp, Platform } from 'ionic-angular';
import { User, Settings } from '../../providers';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/**
 * Generated class for the VoteFormSettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vote-form-setting',
  templateUrl: 'vote-form-setting.html',
})
export class VoteFormSettingPage {
  ReligionID: any;
  _List = []
  _SurveyList = []


  /*  _List = [
     { name: 'JS', selected: true, id: 12 },
     { name: 'CSS', selected: false, id: 2 }
   ]
  */

  constructor(public navCtrl: NavController, public navParams: NavParams
    , private alertCtrl: AlertController, private settings: Settings,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public ionicApp: IonicApp,
    private platform: Platform,
    private sqlite: SQLite,
    public user: User,

  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReligionSettingPage');
    //  this.skills=[];
    setTimeout(() => {
      this.BindSurveyList();
    }, 600);

  }
  async Save() {

    for (var i = 0; i < this._List.length; i++) {
      //alert(this._List[i].selected);
      var selected = this._List[i].selected == true ? 1 : 0;
      var id = this._List[i].id;
      await this.UpdateRecord(selected, id);
    }
    this.user.ShowAlert('Record Updated Successfully.')

  }

  UpdateRecord(selected, id) {
    try {
      this.sqlite.create({
        name: 'surveydb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {

        db.executeSql('UPDATE PartyMaster SET  IsActive = ?  Where ID = ? ', [selected, id])
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
    catch (e) {
      alert(e);
    }
  }


  BindParty(Survey_ID) {
    // alert(ReligionID);

    this.sqlite.create({
      name: 'surveydb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('select * from PartyMaster AS G  WHERE G.Survey_ID = ? order by G.Name ', [Survey_ID])
        .then(res => {
          this._List = [];
          for (var i = 0; i < res.rows.length; i++) {
            this._List.push({
              id: res.rows.item(i).ID,
              name: res.rows.item(i).Name,
              selected: parseInt(res.rows.item(i).IsActive) == 1 ? true : false,


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

  BindSurveyList() {



    //  this.user.presentLoadingCustom();
    this.sqlite.create({
      name: 'surveydb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('select * from SurveyMaster ', [])
        .then(res => {
          this._SurveyList = [];
          for (var i = 0; i < res.rows.length; i++) {
            this._SurveyList.push({
              id: res.rows.item(i).ID,
              name: res.rows.item(i).Name,

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

  closeModal() {
    this.navCtrl.setRoot('ListMasterPage');
  }
}
