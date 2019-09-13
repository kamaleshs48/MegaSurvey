import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, ModalController, IonicApp, Platform } from 'ionic-angular';
import { User, Settings } from '../../providers';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/**
 * Generated class for the QuestionSettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-question-setting',
  templateUrl: 'question-setting.html',
})
export class QuestionSettingPage {
  ReligionID: any;
  _List = []
  _RList = []
  QuestionViewType: any = 1;

  /*  _List = [
     { name: 'JS', selected: true, id: 12 },
     { name: 'CSS', selected: false, id: 2 }
   ]
  */

  constructor(public navCtrl: NavController, public navParams: NavParams
    , private alertCtrl: AlertController, private settings: Settings,

    private sqlite: SQLite,
    public user: User,

  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReligionSettingPage');
    //  this.skills=[];



    setTimeout(() => {
      this.LoadQuestionViewType();
    }, 300);




  }
  async Save() {



    this.settings.load().then(() => {
      this.settings.setValue('QuestionViewType', parseInt(this.QuestionViewType));

    }).catch();

    this.user.ShowAlert('Record Updated Successfully.')

  }


  LoadQuestionViewType() {
    this.settings.load().then(() => {
      this.settings.getValue('QuestionViewType').then(r => {

        this.QuestionViewType = r;
      }).catch();

    });
  }


  UpdateRecord(selected, id) {
    try {
      this.sqlite.create({
        name: 'surveydb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {

        db.executeSql('UPDATE tbl_PageMaster SET  Status = ?  Where ID = ? ', [selected, id])
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


  BindList() {
    // alert(ReligionID);

    this.sqlite.create({
      name: 'surveydb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('select * from tbl_PageMaster AS G  order by G.ID ', [])
        .then(res => {
          this._List = [];
          for (var i = 0; i < res.rows.length; i++) {
            this._List.push({
              id: res.rows.item(i).ID,
              name: res.rows.item(i).Title,
              selected: parseInt(res.rows.item(i).Status) == 1 ? true : false,


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


  checUncheck(i) {
    if (i == 4 && this._List[i].selected == false) {

      setTimeout(() => {
        this._List[5].selected = false;
      }, 200);

    }
    else if (i == 5 && this._List[i].selected == true) {
      setTimeout(() => {
        this._List[4].selected = true;
      }, 200);

    }
  }
}
