import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, ModalController, IonicApp, Platform } from 'ionic-angular';
import { User, Settings } from '../../providers';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';


/**
 * Generated class for the AgeGroupSettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-age-group-setting',
  templateUrl: 'age-group-setting.html',
})
export class AgeGroupSettingPage {
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
      var SurveyTypeID = this._List[i].Survey_Type_ID;
      await this.UpdateRecord(selected, id, SurveyTypeID);
    }
    this.user.ShowAlert('Record Updated Successfully.')

  }

  UpdateRecord(selected, id, SurveyTypeID) {
    try {
      this.sqlite.create({
        name: 'surveydb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {

        db.executeSql('UPDATE tbl_AgeGroup SET  Status = ?  Where ID = ? AND Survey_ID=? ', [selected, id, SurveyTypeID])
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


  BindAgeGroup(SurveyTypeID) {
    // alert(ReligionID);

    this.sqlite.create({
      name: 'surveydb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('select * from tbl_AgeGroup AS G  WHERE G.Survey_ID=?  order by G.Name ', [SurveyTypeID])
        .then(res => {
          this._List = [];
          for (var i = 0; i < res.rows.length; i++) {
            this._List.push({
              id: res.rows.item(i).ID,
              name: res.rows.item(i).Name,
              selected: parseInt(res.rows.item(i).Status) == 1 ? true : false,
              Survey_Type_ID: res.rows.item(i).Survey_ID,

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
              id: res.rows.item(i).PID,
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
}
