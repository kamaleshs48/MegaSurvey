import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, Platform } from 'ionic-angular';
import { Item } from '../../models/item';
import { User, Settings } from '../../providers';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { LoadingController } from '../../../node_modules/ionic-angular/components/loading/loading-controller';
import Moment from 'moment'
@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  currentItems: Item[];
  SurveyList: any = [];
  User_ID: any = 0;
  PText: any = 'Expiry on {31-12-2018, Bal. Entry:}';
  constructor(public navCtrl: NavController, public modalCtrl: ModalController,
    public user: User, private sqlite: SQLite, private platform: Platform,
    private settings: Settings,
    private loadingCtrl: LoadingController


  ) {
    platform.ready().then(() => {

      this.settings.load().then(() => {
        this.settings.getValue('UID').then(r => {

          this.User_ID = r;
        })
        this.settings.getValue('IsLoadData').then(r => {

          if (r != "T") {

            this.user.LoadMasterData(this.User_ID).subscribe((resp) => {
              this.BindSurveyList(this.User_ID);

            }, (err) => {

            });

          }
        })
      });
      setTimeout(() => {
        this.BindSurveyList(this.User_ID);
        // Redirecto To Select Page
      }, 200);

    });
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {


  }


  FirstPage(ID, State_ID, Loksabha_ID, Vidhansabha_ID, WardBlock_ID, Survey_For, PresentLimit, MaxLimit, WardLevelName, Survey_Type_ID, Balance, IsExpired: boolean, IsStart: boolean) {
    //chek Balance
    if (parseInt(Balance) < 1) {
      return;
    }
    if (IsExpired == true) {
      return;
    }
    if (IsStart == false) {
      return;
    }
    let paramObj = {
      Survey_ID: ID,
      State_ID: State_ID,
      Loksabha_ID: Loksabha_ID,
      Vidhansabha_ID: Vidhansabha_ID,
      WardBlock_ID: WardBlock_ID,
      Survey_For: Survey_For,
      PresentLimit: PresentLimit,
      MaxLimit: MaxLimit,
      WardLevelName: WardLevelName,
      Survey_Type_ID: Survey_Type_ID


    };
    this.navCtrl.push('HomePage', paramObj)
  }
  BindSurveyList(User_ID: number) {
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.sqlite.create({
      name: 'surveydb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('SELECT * , (MaxLimit - PresentLimit) PresentLimit1 FROM SurveyMaster WHERE UserID = ' + User_ID + ' ORDER BY ID ASC', [])
        .then(res => {
          this.SurveyList = [];
          let IsExpired: boolean = false;
          let IsStart: boolean = false;
          for (var i = 0; i < res.rows.length; i++) {
            IsExpired = false;
            let expDate = Moment(res.rows.item(i).ExpDate, 'DD-MM-YYYY').toDate();
            let a = Moment(expDate).format('YYYYMMDD');

            let CurrentDate = new Date();
            let b = Moment(CurrentDate).format('YYYYMMDD');
            if (a < b) {
              IsExpired = true;
            }

            var _PPText = 'Expiry on {' + res.rows.item(i).ExpDate + ', Bal. Entry: ' + res.rows.item(i).PresentLimit1 + '}';

            let stDate = Moment(res.rows.item(i).ExpDate1, 'DD-MM-YYYY').toDate();
            let sd = Moment(stDate).format('YYYYMMDD');

            if (sd > b) {
              _PPText = 'Start on {' + res.rows.item(i).ExpDate1 + ', Bal. Entry: ' + res.rows.item(i).PresentLimit1 + '}';
              IsStart = false;
            }
            else {
              _PPText = 'Expiry on {' + res.rows.item(i).ExpDate + ', Bal. Entry: ' + res.rows.item(i).PresentLimit1 + '}';
              IsStart = true;
            }


            //'Expiry on {' + res.rows.item(i).ExpDate + ', Bal. Entry: ' + res.rows.item(i).PresentLimit1 + '}',
            //  alert(a > b);


            this.SurveyList.push({
              ID: res.rows.item(i).ID, PID: res.rows.item(i).PID,
              Name: res.rows.item(i).Name, Code: res.rows.item(i).Code,
              State_ID: res.rows.item(i).State_ID,
              Loksabha_ID: res.rows.item(i).Loksabha_ID,
              Vidhansabha_ID: res.rows.item(i).Vidhansabha_ID,
              WardBlock_ID: res.rows.item(i).WardBlock_ID,
              Survey_For: res.rows.item(i).Survey_For,
              MaxLimit: res.rows.item(i).MaxLimit,
              PresentLimit: _PPText,
              WardLevelName: res.rows.item(i).WardLevelName,
              Balance: res.rows.item(i).PresentLimit1,
              IsExpired: IsExpired,
              IsStart: IsStart,
              IsEnabled: (IsStart == false || IsExpired == true|| parseInt(res.rows.item(i).PresentLimit1) < 1) ? 0 : 1,

            });
          }
          loading.dismiss();
          // this.GetSurveyPresentLimit(1, User_ID);
          //return stateList;
        })
        .catch(e => {
         
          loading.dismiss();
          console.log(e);
        });

    });
  }
  GetSurveyPresentLimit(SurveyID, UserID) {
    var PresentLimit: any = 0;
    this.sqlite.create({
      name: 'surveydb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('SELECT (MaxLimit - PresentLimit) PresentLimit FROM SurveyMaster WHERE UserID = ' + UserID + ' AND ID = ' + SurveyID, [])
        .then(res => {
          if (res.rows.length > 0) {


            return 'Expiry on {01-11-2018, Bal. Entry: ' + res.rows.item(0).PresentLimit + '}';
          }

        }
        ).catch(e => {
         
          console.log(e)
        })

    }).catch(e => {

      console.log(e)
    });

  }
  ionViewWillEnter() {
    setTimeout(() => {


      this.BindSurveyList(this.User_ID);
      // Redirecto To Select Page

    }, 200);
  }
}
