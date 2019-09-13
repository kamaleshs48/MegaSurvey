import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { User, Settings } from '../../providers';

declare var navigator: any;
@IonicPage()
@Component({
  selector: 'page-master',
  templateUrl: 'master.html',
})
export class MasterPage {


  User_ID: any = 0;
  TData: Number = 0;
  isLoadData: boolean = false;
  IsData: boolean = false;
  SurveyList: any = [];
  MQRList: any = [];
  PartyList: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite,
    public toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public user: User, private settings: Settings
  ) {
    this.settings.load().then(() => {
      this.settings.getValue('UID').then(r => {

        this.User_ID = r;
      })
    });
  }

  ionViewDidLoad() {
    this.settings.load().then(() => {
      this.settings.getValue('UID').then(r => {

        this.User_ID = r;
      })
      this.GetSurveyData();
      setTimeout(() => {
        this.BindMQRList();
      }, 200);
    });
    console.log('ionViewDidLoad MasterPage');
  }




  saveData() {
    this.sqlite.create({
      name: 'surveydb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS SurveyMaster(ID INTEGER ,PID INTEGER,  Name TEXT, Code TEXT)', [])
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));
      db.executeSql('SELECT * FROM SurveyMaster ORDER BY ID ASC', [])
        .then(res => {
          this.SurveyList = [];

          for (var i = 0; i < res.rows.length; i++) {
            this.SurveyList.push({ ID: res.rows.item(i).ID, PID: res.rows.item(i).PID, Name: res.rows.item(i).Name, Code: res.rows.item(i).Code })
          }
          //return stateList;
        })
        .catch(e => {
          console.log(e);
        });
      db.executeSql('SELECT * FROM PartyMaster ORDER BY ID ASC', [])
        .then(res => {
          this.PartyList = [];

          for (var i = 0; i < res.rows.length; i++) {
            this.PartyList.push({
              ID: res.rows.item(i).ID, Survey_ID: res.rows.item(i).Survey_ID,
              PartyName: res.rows.item(i).Name, IconsName: res.rows.item(i).Icons
            })
          }
          //return stateList;
        })
        .catch(e => {

          console.log(e);
        })

        .catch(e => {
          console.log(e);
          alert(JSON.stringify(e));
        });
    });
  }

  doLogin() {


    var networkState = navigator.connection.type;
    if (networkState == 'none') {
      this.user.ShowAlert('Please check your internet connection')
      return;
    };


    if (this.SurveyList.length > 0) {
      this.user.ShowAlert("There are " + this.SurveyList.length + " records in your system. Please upload these records first then import data. Thank You")
      return;
    }


    let alert = this.alertCtrl.create({
      title: '',
      message: 'Are you sure to import data?',
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
            this.user.LoadMasterData(this.User_ID).subscribe((resp) => {
              this.BindSurveyList();
            }, (err) => {
              this.user.ShowAlert(err);
            });
            // this.user.LoadMasterData1(this.User_ID);
          }
        }
      ]
    });
    alert.present();



    //  ask Premisssion 
    // Are you sure want to import data.






  }


  BindSurveyList() {
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.sqlite.create({
      name: 'surveydb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS SurveyMaster(ID INTEGER ,PID INTEGER,  Name TEXT, Code TEXT,State_ID INTEGER,Loksabha_ID INTEGER,Vidhansabha_ID INTEGER,WardBlock_ID INTEGER)', [])
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));
      db.executeSql('SELECT * FROM SurveyMaster ORDER BY ID ASC', [])
        .then(res => {
          this.SurveyList = [];

          for (var i = 0; i < res.rows.length; i++) {
            this.SurveyList.push({
              ID: res.rows.item(i).ID, PID: res.rows.item(i).PID,
              Name: res.rows.item(i).Name, Code: res.rows.item(i).Code,
              State_ID: res.rows.item(i).State_ID,
              Loksabha_ID: res.rows.item(i).Loksabha_ID,
              Vidhansabha_ID: res.rows.item(i).Vidhansabha_ID,
              WardBlock_ID: res.rows.item(i).WardBlock_ID


            })
          }
          loading.dismiss();
          //return stateList;
        })
        .catch(e => {
          loading.dismiss();
          console.log(e);
        })
        .catch(e => {
          loading.dismiss();
          console.log(e);
          // alert(JSON.stringify(e));
        });
    });
  }
  PostDataToServer() {
    var networkState = navigator.connection.type;
    this.GetSurveyData();

    if (this.SurveyList.length < 1) {

      this.user.ShowAlert('Record not found');
      return;
    }

    if (networkState == 'none') {
      this.user.ShowAlert('Please check your internet connection')
      return;
    };

    if (this.SurveyList.length < 0) {
      return;
    }

    let xx = [this.SurveyList, this.MQRList];

    let alert = this.alertCtrl.create({
      title: '',
      message: 'Do you want to upload data?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.user.SaveSurveyData(xx).subscribe((resp: any) => {
              if (resp == 'Success') {
                this.SurveyList = [];
                this.TData = 0;
                this.ClearData();
                this.user.ShowAlert('Data Uploaded Successfully');
              }
              else {
                this.user.ShowAlert('Oops! Something went wrong, please try again');
              }


            });






          }
        }
      ]
    });
    alert.present();
  }



  BindMQRList() {
    this.sqlite.create({
      name: 'surveydb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM tbl_MQuestionResponse ', [])
        .then(res => {

          if (res.rows.length < 1) {

          }


          this.MQRList = []

          for (var i = 0; i < res.rows.length; i++) {
            this.MQRList.push({
              Question_ID: res.rows.item(i).Question_ID,
              SN: res.rows.item(i).SN,
              QResponse: res.rows.item(i).QResponse,
              Survey_ID: res.rows.item(i).Survey_ID,
            })
          }
          //return stateList;
        })
        .catch(e => {
          alert(JSON.stringify(e));
          console.log(e);
        })

    })
      .catch(e => {
        alert(JSON.stringify(e));
      });

  }



  ClearData() {

    this.sqlite.create({
      name: 'surveydb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS SurveyData(RowID INTEGER,Party_ID INTEGER,Survey_ID INTEGER ,State_ID INTEGER ,LokSabha_ID INTEGER,VidhanSabha_ID INTEGER ,Word_ID INTEGER ,Booth_ID INTEGER ,Area_ID INTEGER ,OtherArea TEXT  ,GPSCoordinate TEXT ,SurveyDate TEXT ,User_ID INTEGER)', [])
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));

      db.executeSql('DELETE FROM tbl_MQuestionResponse', [])
        .then(res => {
        })
        .catch(e => {
          console.log(e);
        })
      db.executeSql('DELETE FROM SurveyData', [])
        .then(res => {


        })
        .catch(e => {
          console.log(e);
        });


    })
      .catch(e => {
        console.log(e);
      });
  }
  GetSurveyData() {
    /*  var networkState = navigator.connection.type;
     if (networkState == 'none') {
       this.user.ShowAlert('Please check your internet connection')
       return;
     }; */



    this.sqlite.create({
      name: 'surveydb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS SurveyData(RowID INTEGER,Party_ID INTEGER,Survey_ID INTEGER ,State_ID INTEGER ,LokSabha_ID INTEGER,VidhanSabha_ID INTEGER ,Word_ID INTEGER ,Booth_ID INTEGER ,Area_ID INTEGER ,OtherArea TEXT  ,GPSCoordinate TEXT ,SurveyDate TEXT ,User_ID INTEGER)', [])
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));
      db.executeSql('SELECT * FROM SurveyData WHERE IsActive=1 ORDER BY RowID ASC', [])
        .then(res => {
          this.SurveyList = [];
          if (res.rows.length < 1) {
            this.IsData = false;
            /*  this.user.ShowAlert('Record not found'); */
          }
          this.IsData = true;
          this.TData = res.rows.length;

          for (var i = 0; i < res.rows.length; i++) {
            this.SurveyList.push({
              RowID: res.rows.item(i).RowID,
              Party_ID: res.rows.item(i).Party_ID,
              Survey_ID: res.rows.item(i).Survey_ID,
              State_ID: res.rows.item(i).State_ID,
              LokSabha_ID: res.rows.item(i).LokSabha_ID,
              VidhanSabha_ID: res.rows.item(i).VidhanSabha_ID,
              Word_ID: res.rows.item(i).Word_ID,
              Booth_ID: res.rows.item(i).Booth_ID,
              Area_ID: res.rows.item(i).Area_ID,
              OtherArea: res.rows.item(i).OtherArea,
              GPSCoordinate: res.rows.item(i).GPSCoordinate,
              SurveyDate: res.rows.item(i).SurveyDate,
              UserID: res.rows.item(i).User_ID,
              PersonID: res.rows.item(i).PersonID,
              Street: res.rows.item(i).Street,

              Gender_ID: res.rows.item(i).Gender_ID,
              Age_Group_ID: res.rows.item(i).Age_Group_ID,
              Religion_ID: res.rows.item(i).Religion_ID,
              Caste_ID: res.rows.item(i).Caste_ID,

              Education_ID: res.rows.item(i).Education_ID,
              Profession_ID: res.rows.item(i).Profession_ID,

              Email: res.rows.item(i).Email,
              Name: res.rows.item(i).Name,
              Mobile1: res.rows.item(i).Mobile1,
              Mobile2: res.rows.item(i).Mobile2,
              QResponse1: res.rows.item(i).QResponse1,
              QResponse2: res.rows.item(i).QResponse2,
              QResponse3: res.rows.item(i).QResponse3,
              QResponse4: res.rows.item(i).QResponse4,
              QResponse5: res.rows.item(i).QResponse5,
              QResponse6: res.rows.item(i).QResponse6,
              QResponse7: res.rows.item(i).QResponse7,
              QResponse8: res.rows.item(i).QResponse8,
              QResponse9: res.rows.item(i).QResponse9,
              QResponse10: res.rows.item(i).QResponse10,
              QResponse11: res.rows.item(i).QResponse11,
              QResponse12: res.rows.item(i).QResponse12,
              QResponse13: res.rows.item(i).QResponse13,
              QResponse14: res.rows.item(i).QResponse14,
              QResponse15: res.rows.item(i).QResponse15,
              QResponse16: res.rows.item(i).QResponse16,
              QResponse17: res.rows.item(i).QResponse17,
              QResponse18: res.rows.item(i).QResponse18,
              QResponse19: res.rows.item(i).QResponse19,
              QResponse20: res.rows.item(i).QResponse20,

              QResponse21: res.rows.item(i).QResponse21,
              QResponse22: res.rows.item(i).QResponse22,
              QResponse23: res.rows.item(i).QResponse23,
              QResponse24: res.rows.item(i).QResponse24,
              QResponse25: res.rows.item(i).QResponse25,
              QResponse26: res.rows.item(i).QResponse26,
              QResponse27: res.rows.item(i).QResponse27,
              QResponse28: res.rows.item(i).QResponse28,
              QResponse29: res.rows.item(i).QResponse29,
              QResponse30: res.rows.item(i).QResponse30


            })
          }
          //return stateList;
        })
        .catch(e => {
          alert(JSON.stringify(e));
          console.log(e);
        })

    })
      .catch(e => {
        console.log(e);
      });

  }

}
