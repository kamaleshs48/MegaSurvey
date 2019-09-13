import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { User, Settings } from '../../providers';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ThrowStmt } from '../../../node_modules/@angular/compiler';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  WardLevelName: 'Ward/Block';
  Survey_ID: any = 0;
  User_ID: any = 0;
  StateList: any = [];
  LokSabhaList: any = [];
  VidhanSabhList: any = [];
  WordList: any = [];
  BoothList: any = [];
  AreaList: any = [];
  IsSurveyRunning = 0;
  StateID: boolean = false;
  LokSabhaID: boolean = false;
  VidhanSabhaID: boolean = false;
  WardBlock_ID: boolean = false;
  Survey_For: any = '';
  Survey_Type_ID: 0;
  selectOptions = {
    mode: 'ios'
  };
  S = {
    Survey_ID: 0,
    User_ID: 0,
    StateID: 0, LokSabhaID: 0, VidhanSabhaID: 0, WordID: 0, BoothID: 0, AreaID: 0, AreaOther: '',
    Survey_For: '', MaxLimit: 0, PresentLimit: 0, Street: ''
  };
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public user: User, private sqlite: SQLite, private platform: Platform,
    private settings: Settings
  ) {
    this.WardLevelName = navParams.get('WardLevelName') || 'Ward/Block'
    this.Survey_ID = navParams.get('Survey_ID') || 1;
    this.StateID = navParams.get('State_ID') >= 1 ? true : false;
    this.LokSabhaID = navParams.get('Loksabha_ID') >= 1 ? true : false;
    this.VidhanSabhaID = navParams.get('Vidhansabha_ID') >= 1 ? true : false;
    this.WardBlock_ID = navParams.get('WardBlock_ID') >= 1 ? true : false;
    this.S.StateID = navParams.get('State_ID');
    this.S.LokSabhaID = navParams.get('Loksabha_ID');
    this.S.VidhanSabhaID = navParams.get('Vidhansabha_ID');
    this.S.WordID = navParams.get('WardBlock_ID');
    this.S.Survey_For = navParams.get('Survey_For');
    this.S.PresentLimit = navParams.get('PresentLimit');
    this.S.MaxLimit = navParams.get('MaxLimit');
    this.Survey_Type_ID = navParams.get('Survey_Type_ID');

    platform.ready().then(() => {
      setTimeout(() => {
        this.GetState();
      }, 100);
    });
  }



  ionViewDidLoad() {

  }
  Next() {

    if (this.S.StateID < 1) { this.user.ShowAlert('Please Select State'); return; }
    if (this.S.LokSabhaID < 1) { this.user.ShowAlert('Please Select Loksabha'); return; }
    if (this.S.VidhanSabhaID < 1) { this.user.ShowAlert('Please Select Vidhansabha'); return; }
    if (this.S.WordID < 1) { this.user.ShowAlert('Please Select Ward Name'); return; }
    if (this.S.AreaID < 1) { this.user.ShowAlert('Please Select or Enter Area Name'); return; }
    if (this.S.AreaID == 99999 && this.S.AreaOther == '') { this.user.ShowAlert('Please Select or Enter Area Name'); return; }


    let paramObj = {
      StateID: this.S.StateID
      , LokSabhaID: this.S.LokSabhaID
      , VidhanSabhaID: this.S.VidhanSabhaID
      , WordID: this.S.WordID
      , BoothID: this.S.BoothID
      , AreaID: this.S.AreaID
      , AreaOther: this.S.AreaOther != '' ? this.S.AreaOther.replace("'", "") : ""
      , Survey_ID: this.Survey_ID
      , Survey_For: this.S.Survey_For
      , User_ID: this.User_ID
      , PresentLimit: this.S.PresentLimit
      , MaxLimit: this.S.MaxLimit
      , Street: this.S.Street != '' ? this.S.Street.replace("'", "") : ""
      , Survey_Type_ID: this.Survey_Type_ID




    };
    this.settings.load().then(() => {
      // alert(JSON.stringify(this.S));
      // alert('StateID - ' + this.S.StateID);
      this.settings.setValue('ServeyHistry', JSON.stringify(this.S));

      setTimeout(() => {
        this.settings.setValue('ServeyHistry', JSON.stringify(this.S));
      }, 100);

      this.navCtrl.push('SurveyPage', paramObj);
    });





  }

  GetState() {
    this.sqlite.create({
      name: 'surveydb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS StateMaster(ID INTEGER ,PID INTEGER,  Name TEXT, Code TEXT)', [])
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));
      db.executeSql('SELECT * FROM StateMaster ORDER BY NAME ASC', [])
        .then(res => {
          this.StateList = [];

          for (var i = 0; i < res.rows.length; i++) {
            this.StateList.push({ ID: res.rows.item(i).ID, PID: res.rows.item(i).PID, Name: res.rows.item(i).Name, Code: res.rows.item(i).Code })
          }

          //return stateList;
        })
        .catch(e => {

          console.log(e);
        }).catch(e => {

          console.log(e);

        });
    });





    this.settings.load().then(() => {



      this.settings.getValue('UID').then(r => {
        this.User_ID = r;
        this.S.User_ID = this.User_ID;
        this.S.Survey_ID = this.Survey_ID;
      });
      this.settings.getValue('ServeyHistry').then(r => {

        if (r != undefined || r != null || r != 'xyz') {
          if (r.StateID == this.S.StateID) {


            setTimeout(() => {
              this.S.AreaOther = r.AreaOther;
            }, 500);
          }
          let xxx = JSON.parse(r);
          if (xxx.StateID = this.S.StateID && xxx.Survey_ID == this.S.Survey_ID && xxx.User_ID == this.User_ID) {
            this.S.LokSabhaID = xxx.LokSabhaID;
            this.S.VidhanSabhaID = xxx.VidhanSabhaID;
            this.S.WordID = xxx.WordID;
            this.S.BoothID = xxx.BoothID;
            this.S.AreaID = xxx.AreaID;
            this.S.AreaOther = xxx.AreaOther;
            this.S.Street = xxx.Street;


            //  this.S.BoothID = 0;
            //  this.S.AreaID = 0;
            // this.S.AreaOther = '';
          }

          // alert('SSS');

        }
        // alert(r);
      });





      setTimeout(() => {
        this.BindLokSabha(this.S.StateID);
        this.BindVidhanSabha(this.S.LokSabhaID);
        this.BindWord(this.S.VidhanSabhaID);
        this.BindArea(this.S.WordID)
        this.BoothList(this.S.WordID);
      }, 200);



    });


  }

  BindLokSabha(StateID) {
    this.sqlite.create({
      name: 'surveydb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS LokSabhaMaster(ID INTEGER ,PID INTEGER,  Name TEXT, Code TEXT)', [])
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));
      db.executeSql('SELECT * FROM LokSabhaMaster WHERE PID = ? ORDER BY NAME ASC', [StateID])
        .then(res => {
          this.LokSabhaList = [];

          for (var i = 0; i < res.rows.length; i++) {
            this.LokSabhaList.push({ ID: res.rows.item(i).ID, PID: res.rows.item(i).PID, Name: res.rows.item(i).Name, Code: res.rows.item(i).Code })
          }







          //return stateList;
        })
        .catch(e => {
          console.log(e);
        }).catch(e => {
          console.log(e);

        });
    });
  }
  BindVidhanSabha(PID) {
    this.sqlite.create({
      name: 'surveydb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS VidhanSabhaMaster(ID INTEGER ,PID INTEGER,  Name TEXT, Code TEXT)', [])
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));
      db.executeSql('SELECT * FROM VidhanSabhaMaster WHERE PID = ? ORDER BY NAME ASC', [PID])
        .then(res => {
          this.VidhanSabhList = [];

          for (var i = 0; i < res.rows.length; i++) {
            this.VidhanSabhList.push({ ID: res.rows.item(i).ID, PID: res.rows.item(i).PID, Name: res.rows.item(i).Name, Code: res.rows.item(i).Code })
          }





          //return stateList;
        })
        .catch(e => {

          console.log(e);
        }).catch(e => {


        });
    });
  }
  BindWord(PID) {
    this.sqlite.create({
      name: 'surveydb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS WordMaster(ID INTEGER ,PID INTEGER,  Name TEXT, Code TEXT)', [])
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));
      db.executeSql('SELECT * FROM WordMaster WHERE PID=? ORDER BY NAME ASC', [PID])
        .then(res => {
          this.WordList = [];
          for (var i = 0; i < res.rows.length; i++) {
            this.WordList.push({ ID: res.rows.item(i).ID, PID: res.rows.item(i).PID, Name: res.rows.item(i).Name, Code: res.rows.item(i).Code })
          }
          //return stateList;
        })
        .catch(e => {
          alert(e);
          console.log(e);
        }).catch(e => {
          alert(e);
          console.log(e);

        });
    });
  }
  BindArea(PID) {
    this.sqlite.create({
      name: 'surveydb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS AreaCityMaster(ID INTEGER ,PID INTEGER,  Name TEXT, Code TEXT)', [])
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));
      db.executeSql('SELECT * FROM AreaCityMaster WHERE PID=? ORDER BY NAME ASC', [PID])
        .then(res => {
          this.AreaList = [];
          for (var i = 0; i < res.rows.length; i++) {
            this.AreaList.push({ ID: res.rows.item(i).ID, PID: res.rows.item(i).PID, Name: res.rows.item(i).Name, Code: res.rows.item(i).Code })
          }

          this.AreaList.push({ ID: 99999, PID: PID, Name: 'Other', Code: 'C001' })



          //  this.S.BoothID = 0;
          //  this.S.AreaID = 0;
          // this.S.AreaOther = '';
          //return stateList;
        })
        .catch(e => {
          console.log(e);
        }).catch(e => {
          console.log(e);

        });
    });
  }

  BindBooth(PID) {
    this.S.AreaOther = '';
    this.S.Street = '';
    this.S.BoothID = null;



  }

  BindLokSabha1(PID) {
    this.BindLokSabha(PID);

    setTimeout(() => {
      this.S.LokSabhaID = 0;
      this.VidhanSabhList = [];
      this.S.VidhanSabhaID = 0;
      this.WordList = [];
      this.S.WordID = 0;
      this.AreaList = [];
      this.S.AreaID = 0;
      this.S.AreaOther = '';
      this.BoothList = [];
      this.S.BoothID = 0;
      this.S.Street = '';
    }, 200);
  }

  BindVidhanSabha1(PID) {
    this.BindVidhanSabha(PID);

    setTimeout(() => {
      this.S.VidhanSabhaID = 0;
      this.WordList = [];
      this.S.WordID = 0;
      this.AreaList = [];
      this.S.AreaID = 0;
      this.S.AreaOther = '';
      this.BoothList = [];
      this.S.BoothID = 0;
      this.S.Street = '';
    }, 200);


  }
  BindWord1(PID) {
    this.BindWord(PID);

    setTimeout(() => {

      this.S.WordID = 0;
      this.AreaList = [];
      this.S.AreaID = 0;
      this.S.AreaOther = '';
      this.BoothList = [];
      this.S.BoothID = 0;
      this.S.Street = '';


    }, 200);



  }
  BindArea1(PID) {
    this.BindArea(PID);

    setTimeout(() => {
      this.S.AreaID = 0;
      this.S.AreaOther = '';
      this.BoothList = [];
      this.S.BoothID = 0;
      this.S.Street = '';
    }, 200);


  }



}
