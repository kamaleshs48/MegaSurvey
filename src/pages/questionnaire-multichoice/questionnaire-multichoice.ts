import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, Platform } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { User, Settings } from '../../providers';
import { ThrowStmt } from '@angular/compiler';
import { Content } from 'ionic-angular';


/**
 * Generated class for the QuestionnaireMultichoicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-questionnaire-multichoice',
  templateUrl: 'questionnaire-multichoice.html',
})
export class QuestionnaireMultichoicePage {
  @ViewChild(Content) content: Content;
  Question: '';
  OtherLanguage: '';
  Question_Index: number = 0;
  _List: any = [];
  Gender: any;
  Language_ID: 0;
  platformHeight = 0;
  height = '';
  Survey_ID = 0;
  SN = 0;
  NextPage = ''
  QuestionViewType = 1;
  IsNextQuestion: boolean = false;
  Survey_Type_ID = 0;
  Current_QuestionID = 0;
  IsOptionChecked: boolean = false;
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
    this.Survey_Type_ID = navParams.get('Survey_Type_ID') || 0;
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
    }, 500);

    setTimeout(() => {
      //	this.LoadQuestionViewType();
    }, 300);


  }

  LoadQuestionViewType() {
    this.settings.load().then(() => {
      this.settings.getValue('QuestionViewType').then(r => {

        this.QuestionViewType = r;
      }).catch();

    });
  }

  SaveGender() {

    //	this.user.ShowAlert('ResponseID :' + ResponseID + 'Question_ID:' + Question_ID);



    // Get Response Value
    var ResponseValue = ",";

    for (var i = 0; i < this._List.length; i++) {
      //alert(this._List[i].selected);
      if (this._List[i].selected == true) {
        ResponseValue += "," + this._List[i].value;
      }


    }

    if (ResponseValue == ",") {
      this.IsOptionChecked = false;
      this.user.ShowAlert('Please check atleast one value')
      return;
    }

    this.IsOptionChecked = true;
    ResponseValue = ResponseValue.replace(",,", "");




    let alert = this.alertCtrl.create({
      title: '',
      mode: 'ios',
      message: "Are You Sure want to save & Go to Next?",
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
            this.UpdateSurveyData_OtherFields(ResponseValue, this.Survey_ID);


            if (this.IsOptionChecked == false) {
              return false;
            }



            this.BindNextQuestionSN(this.Current_QuestionID);



            setTimeout(() => {
              if (this.IsNextQuestion == false) {
                let contactModal = this.modalCtrl.create(this.NextPage, { Language_ID: this.Language_ID, Survey_ID: this.Survey_ID, SN: this.SN, Survey_Type_ID: this.Survey_Type_ID });
                contactModal.present();
                setTimeout(() => {
                  this.viewCtrl.dismiss();
                }, 100);
              }
            }, 400);
          }
        }
      ]
    });
    alert.present();
  }
  public closeModal() {
    this.UpdateSurveyData_OtherFields('9999', this.Survey_ID);
    let contactModal = this.modalCtrl.create(this.NextPage, { Language_ID: this.Language_ID, Survey_ID: this.Survey_ID, SN: this.SN, Survey_Type_ID: this.Survey_Type_ID });
    contactModal.present();
    setTimeout(() => {
      this.viewCtrl.dismiss();
    }, 500);
  }

  async BindList() {
    this.Question_Index = 1;
    //  this.user.presentLoadingCustom();
    //IN (Select Question_ID FROM tbl_SurveyAssignQuestion WHERE Survey_ID =?)
    this.sqlite.create({
      name: 'surveydb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql(`Select QM.ID, QM.Question,QM.Option1,QM.Option2,QM.Option3,QM.Option4,QM.Option5
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
WHERE SQ.Status=1 AND QM.Question_Type_ID=2 AND QM.Status =1 AND QM.Question_ID=0 AND QM.ID IN (Select Question_ID FROM tbl_SurveyAssignQuestion WHERE Survey_ID =?) ORDER BY QM.ID `, [this.Language_ID, this.Survey_ID])
        .then(res => {
          this._List = [];
          this.Question = res.rows.item(0).Question;
          this.OtherLanguage = res.rows.item(0).HQuestion
          this.Current_QuestionID = res.rows.item(0).ID;
          var i = 0;
          this.Question_Index = 1;
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 1,
            text: res.rows.item(i).Option1,
            IsShow: res.rows.item(i).Option1 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption1

          });
          //2
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 2,
            text: res.rows.item(i).Option2,
            IsShow: res.rows.item(i).Option2 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption2

          });
          //3
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 3,
            text: res.rows.item(i).Option3,
            IsShow: res.rows.item(i).Option3 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption3

          })
          //4

          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 4,
            text: res.rows.item(i).Option4,
            IsShow: res.rows.item(i).Option4 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption4

          })
          //5

          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 5,
            text: res.rows.item(i).Option5,
            IsShow: res.rows.item(i).Option5 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption5

          });
          //6

          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 6,
            text: res.rows.item(i).Option6,
            IsShow: res.rows.item(i).Option6 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption6

          });

          //7

          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 7,
            text: res.rows.item(i).Option7,
            IsShow: res.rows.item(i).Option7 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption7

          });
          //8

          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 8,
            text: res.rows.item(i).Option8,
            IsShow: res.rows.item(i).Option8 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption8

          });

          //9

          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 9,
            text: res.rows.item(i).Option9,
            IsShow: res.rows.item(i).Option9 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption9

          })

          //10

          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 10,
            text: res.rows.item(i).Option10,
            IsShow: res.rows.item(i).Option10 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption10

          })
          //11
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 11,
            text: res.rows.item(i).Option11,
            IsShow: res.rows.item(i).Option11 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption11
          });
          //12
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 12,
            text: res.rows.item(i).Option12,
            IsShow: res.rows.item(i).Option12 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption12
          });

          //13
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 13,
            text: res.rows.item(i).Option13,
            IsShow: res.rows.item(i).Option13 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption13
          });

          //14
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 14,
            text: res.rows.item(i).Option14,
            IsShow: res.rows.item(i).Option14 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption14
          });


          //15
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 15,
            text: res.rows.item(i).Option15,
            IsShow: res.rows.item(i).Option15 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption15
          });

          //16
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 16,
            text: res.rows.item(i).Option16,
            IsShow: res.rows.item(i).Option16 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption16
          });
          //17
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 17,
            text: res.rows.item(i).Option17,
            IsShow: res.rows.item(i).Option17 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption17
          });


          //18
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 18,
            text: res.rows.item(i).Option18,
            IsShow: res.rows.item(i).Option18 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption18
          });
          //19
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 19,
            text: res.rows.item(i).Option19,
            IsShow: res.rows.item(i).Option19 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption19
          });
          //20
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 20,
            text: res.rows.item(i).Option20,
            IsShow: res.rows.item(i).Option20 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption20
          });
          //21
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 21,
            text: res.rows.item(i).Option21,
            IsShow: res.rows.item(i).Option21 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption21
          });
          //22
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 22,
            text: res.rows.item(i).Option22,
            IsShow: res.rows.item(i).Option22 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption22
          });
          //23
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 23,
            text: res.rows.item(i).Option23,
            IsShow: res.rows.item(i).Option23 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption23
          });
          //24
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 24,
            text: res.rows.item(i).Option24,
            IsShow: res.rows.item(i).Option24 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption24
          });
          //25
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 25,
            text: res.rows.item(i).Option25,
            IsShow: res.rows.item(i).Option25 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption25
          });
          //26
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 26,
            text: res.rows.item(i).Option26,
            IsShow: res.rows.item(i).Option26 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption26
          });
          //27
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 27,
            text: res.rows.item(i).Option27,
            IsShow: res.rows.item(i).Option27 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption27
          });
          //28
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 28,
            text: res.rows.item(i).Option28,
            IsShow: res.rows.item(i).Option28 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption28
          });
          //29
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 29,
            text: res.rows.item(i).Option29,
            IsShow: res.rows.item(i).Option29 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption29
          });
          //30
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 30,
            text: res.rows.item(i).Option30,
            IsShow: res.rows.item(i).Option30 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption30
          });







        })
        .catch(e => {
					/* alert('SSSSSSSSS');
					console.log(e);
					alert(JSON.stringify(e)); */
        })
        .catch(e => {
					/* alert('yyyyyyyyyyy');
					alert(JSON.stringify(e));
					console.log(e); */

        });
    });
  }




  async	BindNextQuestionSN(QuestionID) {
    //  this.user.presentLoadingCustom();
    this.sqlite.create({
      name: 'surveydb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql(`Select QM.ID,QM.Status, QM.Question,QM.Option1,QM.Option2,QM.Option3,QM.Option4,QM.Option5
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
WHERE  QM.Question_Type_ID=2 AND QM.Status =1 AND QM.Question_ID=0 AND QM.ID IN (Select Question_ID FROM tbl_SurveyAssignQuestion 
WHERE SQ.Status=1 AND Survey_ID =?) AND QM.ID >? ORDER BY QM.ID`, [this.Language_ID, this.Survey_ID, QuestionID])
        .then(res => {
          this._List = [];
          this.Question = '';
          this.OtherLanguage = '';
          var i = 0;
          if (res.rows.length > 0) {
            this.Current_QuestionID = res.rows.item(i).ID;
            this.Question = res.rows.item(0).Question;
            this.OtherLanguage = res.rows.item(0).HQuestion
            this.Question_Index = this.Question_Index + 1;
            this.content.scrollToTop();
            this.IsNextQuestion = true;
          }
          else {
            this.IsNextQuestion = false;
            return;
          }


          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 1,
            text: res.rows.item(i).Option1,
            IsShow: res.rows.item(i).Option1 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption1
          })
          //2
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 2,
            text: res.rows.item(i).Option2,
            IsShow: res.rows.item(i).Option2 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption2

          });
          //3
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 3,
            text: res.rows.item(i).Option3,
            IsShow: res.rows.item(i).Option3 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption3

          })
          //4

          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 4,
            text: res.rows.item(i).Option4,
            IsShow: res.rows.item(i).Option4 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption4
          })
          //5
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 5,
            text: res.rows.item(i).Option5,
            IsShow: res.rows.item(i).Option5 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption5

          });
          //6

          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 6,
            text: res.rows.item(i).Option6,
            IsShow: res.rows.item(i).Option6 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption6

          });

          //7

          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 7,
            text: res.rows.item(i).Option7,
            IsShow: res.rows.item(i).Option7 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption7

          });
          //8

          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 8,
            text: res.rows.item(i).Option8,
            IsShow: res.rows.item(i).Option8 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption8

          });

          //9

          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 9,
            text: res.rows.item(i).Option9,
            IsShow: res.rows.item(i).Option9 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption9

          });

          //10
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 10,
            text: res.rows.item(i).Option10,
            IsShow: res.rows.item(i).Option10 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption10
          });
          //11
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 11,
            text: res.rows.item(i).Option11,
            IsShow: res.rows.item(i).Option11 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption11
          });
          //12
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 12,
            text: res.rows.item(i).Option12,
            IsShow: res.rows.item(i).Option12 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption12
          });

          //13
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 13,
            text: res.rows.item(i).Option13,
            IsShow: res.rows.item(i).Option13 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption13
          });

          //14
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 14,
            text: res.rows.item(i).Option14,
            IsShow: res.rows.item(i).Option14 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption14
          });


          //15
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 15,
            text: res.rows.item(i).Option15,
            IsShow: res.rows.item(i).Option15 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption15
          });

          //16
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 16,
            text: res.rows.item(i).Option16,
            IsShow: res.rows.item(i).Option16 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption16
          });
          //17
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 17,
            text: res.rows.item(i).Option17,
            IsShow: res.rows.item(i).Option17 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption17
          });


          //18
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 18,
            text: res.rows.item(i).Option18,
            IsShow: res.rows.item(i).Option18 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption18
          });
          //19
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 19,
            text: res.rows.item(i).Option19,
            IsShow: res.rows.item(i).Option19 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption19
          });
          //20
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 20,
            text: res.rows.item(i).Option20,
            IsShow: res.rows.item(i).Option20 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption20
          });
          //21
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 21,
            text: res.rows.item(i).Option21,
            IsShow: res.rows.item(i).Option21 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption21
          });
          //22
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 22,
            text: res.rows.item(i).Option22,
            IsShow: res.rows.item(i).Option22 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption22
          });
          //23
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 23,
            text: res.rows.item(i).Option23,
            IsShow: res.rows.item(i).Option23 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption23
          });
          //24
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 24,
            text: res.rows.item(i).Option24,
            IsShow: res.rows.item(i).Option24 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption24
          });
          //25
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 25,
            text: res.rows.item(i).Option25,
            IsShow: res.rows.item(i).Option25 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption25
          });
          //26
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 26,
            text: res.rows.item(i).Option26,
            IsShow: res.rows.item(i).Option26 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption26
          });
          //27
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 27,
            text: res.rows.item(i).Option27,
            IsShow: res.rows.item(i).Option27 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption27
          });
          //28
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 28,
            text: res.rows.item(i).Option28,
            IsShow: res.rows.item(i).Option28 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption28
          });
          //29
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 29,
            text: res.rows.item(i).Option29,
            IsShow: res.rows.item(i).Option29 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption29
          });
          //30
          this._List.push({
            selected: false,
            QuestionID: res.rows.item(i).ID,
            Question: res.rows.item(i).Question,
            value: 30,
            text: res.rows.item(i).Option30,
            IsShow: res.rows.item(i).Option30 != '' ? true : false,
            OtherLanguage: res.rows.item(i).HOption30
          });
        })
        .catch(e => {
          console.log(e);
          alert(JSON.stringify(e));
        })
        .catch(e => {
          alert(JSON.stringify(e));
          //console.log(e);

        });
    });
  }


  UpdateSurveyData_OtherFields(ResponseValue, Survey_ID) {



    //  alert(ResponseValue);

    this.sqlite.create({
      name: 'surveydb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS tbl_MQuestionResponse(Question_ID INTEGER , SN INTEGER , QResponse TEXT,Survey_ID INTEGER)', [])
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));
      db.executeSql('INSERT INTO tbl_MQuestionResponse VALUES(?,?,?,?)', [
        this.Current_QuestionID,
        this.SN,
        ResponseValue,
        this.Survey_ID
        
      ]
      )
        .then(res => {
          // alert('Saved')
        })
        .catch(e => {
          alert(JSON.stringify(e));
          console.log(e);
        });

    }).catch(e => {
      alert(JSON.stringify(e));
      console.log(e)
    }
    );
  }
  async BindNextPage() {
    this.sqlite.create({
      name: 'surveydb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('select Name FROM tbl_PageMaster WHERE ID > 3 AND Status = 1 ORDER BY ID ASC LIMIT 1 ', [])
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
