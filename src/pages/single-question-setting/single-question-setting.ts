import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, ModalController, IonicApp, Platform } from 'ionic-angular';
import { User, Settings } from '../../providers';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/**
 * Generated class for the SingleQuestionSettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-single-question-setting',
  templateUrl: 'single-question-setting.html',
})
export class SingleQuestionSettingPage {
  ReligionID: any;
  Language_ID: 0;
  _List = []
  _RList = []
  _SurveyList = []
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
    this.settings.load().then(() => {
      this.settings.getValue('Language_ID').then(r => {

        this.Language_ID = r;
      }).catch();

    });

    setTimeout(() => {
      this.BindSurveyList();
    }, 600);





  }
  async Save() {

    for (var i = 0; i < this._List.length; i++) {
      //alert(this._List[i].selected);
      var selected = this._List[i].selected == true ? 1 : 0;
      var id = this._List[i].id;
      var Survey_ID = this._List[i].Survey_ID;
      await this.UpdateRecord(selected, id, Survey_ID, i + 1);
    }

    /*  this.settings.load().then(() => {
       this.settings.setValue('QuestionViewType', parseInt(this.QuestionViewType));
 
     }).catch();
  */
    this.user.ShowAlert('Record Updated Successfully.')

  }


  LoadQuestionViewType() {
    this.settings.load().then(() => {
      this.settings.getValue('QuestionViewType').then(r => {

        this.QuestionViewType = r;
      }).catch();

    });
  }


  UpdateRecord(selected, id, Survey_ID, QIndex) {
    try {
      this.sqlite.create({
        name: 'surveydb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {

        db.executeSql('UPDATE tbl_SurveyAssignQuestion SET  Status = ? , QIndex =?  Where Question_ID = ? AND  Survey_ID =? ', [selected, QIndex, id, Survey_ID])
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


  BindQuestion(Survey_ID) {
    // alert(ReligionID);

    this.sqlite.create({
      name: 'surveydb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql(`Select QM.ID,SQ.Status, QM.Question,QM.Option1,QM.Option2,QM.Option3,QM.Option4,QM.Option5
      ,QM1.Question AS HQuestion,QM1.Option1 AS HOption1,QM1.Option2 AS HOption2,QM1.Option3 AS HOption3,QM1.Option4 AS HOption4,QM1.Option5 AS HOption5,
      QM.Option6,QM.Option7,QM.Option8,QM.Option9,QM.Option10,
      QM.Option11,QM.Option12,QM.Option13,QM.Option14,QM.Option15,QM.Option16,QM.Option17,QM.Option18,QM.Option19,QM.Option20,
      QM.Option21,QM.Option22,QM.Option23,QM.Option24,QM.Option25,QM.Option26,QM.Option27,QM.Option28,QM.Option29,QM.Option30
      ,QM1.Option6 AS HOption6,QM1.Option7 AS HOption7,QM1.Option8 AS HOption8,QM1.Option9 AS HOption9,QM1.Option10 AS HOption10
      ,QM1.Option11 AS HOption11,QM1.Option12 AS HOption12,QM1.Option13 AS HOption13,QM1.Option14 AS HOption14,QM1.Option15 AS HOption15
     ,QM1.Option16 AS HOption16,QM1.Option17 AS HOption17,QM1.Option18 AS HOption18,QM1.Option19 AS HOption19,QM1.Option20 AS HOption20
     ,QM1.Option21 AS HOption21,QM1.Option22 AS HOption22,QM1.Option23 AS HOption23,QM1.Option24 AS HOption24,QM1.Option25 AS HOption25
     ,QM1.Option26 AS HOption26,QM1.Option27 AS HOption27,QM1.Option28 AS HOption28,QM1.Option29 AS HOption29,QM1.Option30 AS HOption30
      From tbl_QuestionMaster QM 
      INNER JOIN tbl_SurveyAssignQuestion SQ ON SQ.Question_ID=QM.ID
     LEFT JOIN tbl_QuestionMaster QM1 ON QM.ID=QM1.Question_ID AND QM1.Language_ID=?
     WHERE QM.Question_Type_ID=1 AND QM.Question_ID=0 AND SQ.Survey_ID=?  ORDER BY QM.ID `, [this.Language_ID, Survey_ID])
        .then(res => {
          this._List = [];
          for (var i = 0; i < res.rows.length; i++) {
            this._List.push({
              id: res.rows.item(i).ID,
              name: res.rows.item(i).Question,
              selected: parseInt(res.rows.item(i).Status) == 1 ? true : false,
              Survey_ID: Survey_ID

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





}
