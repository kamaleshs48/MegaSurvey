import { Component, ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';
import { IonicPage, NavController, NavParams, AlertController, ModalController, Platform } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { User, Settings } from '../../providers';
import { ThrowStmt } from '@angular/compiler';
/**
 * Generated class for the QuestionnairePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-questionnaire',
	templateUrl: 'questionnaire.html',
})
export class QuestionnairePage {
	@ViewChild(Content) content: Content;
	Question: '';
	OtherLanguage: '';
	Question_Index: number = 0;
	QIndex: number = 0;
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
		this.Survey_Type_ID = navParams.get('Survey_Type_ID');
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
			this.LoadQuestionViewType();
		}, 300);


	}

	LoadQuestionViewType() {
		this.settings.load().then(() => {
			this.settings.getValue('QuestionViewType').then(r => {

				this.QuestionViewType = r;
			}).catch();

		});
	}

	SaveGender(ResponseID, ResponseText, Question_ID, QIndex) {

		//	this.user.ShowAlert('ResponseID :' + ResponseID + 'Question_ID:' + Question_ID);


		let alert = this.alertCtrl.create({
			title: '',
			mode: 'ios',
			message: "Your Response is '" + ResponseText + "', is it right?",
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
						this.UpdateSurveyData_OtherFields('QResponse' + QIndex, ResponseID, this.SN, this.Survey_ID);


						if (this.QuestionViewType == 1) {
							this.BindNextQuestionSN(Question_ID, ResponseID);
						}
						else {
							this.BindNextQuestion(Question_ID, ResponseID);
						}

						this.content.scrollToTop();

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
		this.UpdateSurveyData_OtherFields('QResponse' + this.QIndex, "9999", this.SN, this.Survey_ID);
		let contactModal = this.modalCtrl.create(this.NextPage, { Language_ID: this.Language_ID, Survey_ID: this.Survey_ID, SN: this.SN, Survey_Type_ID: this.Survey_Type_ID });
		contactModal.present();
		setTimeout(() => {
			this.viewCtrl.dismiss();
		}, 500);
	}

	BindList() {


		this.Question_Index = 1;
		//  this.user.presentLoadingCustom();
		//IN (Select Question_ID FROM tbl_SurveyAssignQuestion WHERE Survey_ID =?)
		this.sqlite.create({
			name: 'surveydb.db',
			location: 'default'
		}).then((db: SQLiteObject) => {
			db.executeSql(`Select QM.ID, QM.Question,QM.Option1,QM.Option2,QM.Option3,QM.Option4,QM.Option5
 ,QM1.Question AS HQuestion,QM1.Option1 AS HOption1,QM1.Option2 AS HOption2,QM1.Option3 AS HOption3,QM1.Option4 AS HOption4,QM1.Option5 AS HOption5,
 QM.Option6,QM.Option7,QM.Option8,QM.Option9,QM.Option10
 ,QM1.Option6 AS HOption6,QM1.Option7 AS HOption7,QM1.Option8 AS HOption8,QM1.Option9 AS HOption9,QM1.Option10 AS HOption10 
 ,SQ.QIndex QIndex
 From tbl_QuestionMaster QM 
 INNER JOIN tbl_SurveyAssignQuestion SQ ON SQ.Question_ID=QM.ID
LEFT JOIN tbl_QuestionMaster QM1 ON QM.ID=QM1.Question_ID AND QM1.Language_ID=?
WHERE SQ.Status=1 AND QM.Question_Type_ID=1 AND  QM.Question_ID=0 AND QM.ID IN (Select Question_ID FROM tbl_SurveyAssignQuestion WHERE Survey_ID =?) ORDER BY QM.ID `, [this.Language_ID, this.Survey_ID])
				.then(res => {
					this._List = [];
					this.Question = res.rows.item(0).Question;
					this.OtherLanguage = res.rows.item(0).HQuestion
					var i = 0;
					this.Question_Index = 1;
					this.QIndex = res.rows.item(0).QIndex == 9999 ? 1 : res.rows.item(0).QIndex
					this._List.push({
						QuestionID: res.rows.item(i).ID,
						Question: res.rows.item(i).Question,
						value: 1,
						text: res.rows.item(i).Option1,
						IsShow: res.rows.item(i).Option1 != '' ? true : false,
						OtherLanguage: res.rows.item(i).HOption1,
						QIndex: res.rows.item(i).QIndex == 9999 ? 1 : res.rows.item(i).QIndex
					});
					//2
					this._List.push({
						QuestionID: res.rows.item(i).ID,
						Question: res.rows.item(i).Question,
						value: 2,
						text: res.rows.item(i).Option2,
						IsShow: res.rows.item(i).Option2 != '' ? true : false,
						OtherLanguage: res.rows.item(i).HOption2,
						QIndex: res.rows.item(i).QIndex == 9999 ? 1 : res.rows.item(i).QIndex

					});
					//3
					this._List.push({
						QuestionID: res.rows.item(i).ID,
						Question: res.rows.item(i).Question,
						value: 3,
						text: res.rows.item(i).Option3,
						IsShow: res.rows.item(i).Option3 != '' ? true : false,
						OtherLanguage: res.rows.item(i).HOption3,
						QIndex: res.rows.item(i).QIndex == 9999 ? 1 : res.rows.item(i).QIndex

					})
					//4

					this._List.push({
						QuestionID: res.rows.item(i).ID,
						Question: res.rows.item(i).Question,
						value: 4,
						text: res.rows.item(i).Option4,
						IsShow: res.rows.item(i).Option4 != '' ? true : false,
						OtherLanguage: res.rows.item(i).HOption4,
						QIndex: res.rows.item(i).QIndex == 9999 ? 1 : res.rows.item(i).QIndex

					})
					//5

					this._List.push({
						QuestionID: res.rows.item(i).ID,
						Question: res.rows.item(i).Question,
						value: 5,
						text: res.rows.item(i).Option5,
						IsShow: res.rows.item(i).Option5 != '' ? true : false,
						OtherLanguage: res.rows.item(i).HOption5,
						QIndex: res.rows.item(i).QIndex == 9999 ? 1 : res.rows.item(i).QIndex

					});
					//6

					this._List.push({
						QuestionID: res.rows.item(i).ID,
						Question: res.rows.item(i).Question,
						value: 6,
						text: res.rows.item(i).Option6,
						IsShow: res.rows.item(i).Option6 != '' ? true : false,
						OtherLanguage: res.rows.item(i).HOption6,
						QIndex: res.rows.item(i).QIndex == 9999 ? 1 : res.rows.item(i).QIndex

					});

					//7

					this._List.push({
						QuestionID: res.rows.item(i).ID,
						Question: res.rows.item(i).Question,
						value: 7,
						text: res.rows.item(i).Option7,
						IsShow: res.rows.item(i).Option7 != '' ? true : false,
						OtherLanguage: res.rows.item(i).HOption7,
						QIndex: res.rows.item(i).QIndex == 9999 ? 1 : res.rows.item(i).QIndex

					});
					//8

					this._List.push({
						QuestionID: res.rows.item(i).ID,
						Question: res.rows.item(i).Question,
						value: 8,
						text: res.rows.item(i).Option8,
						IsShow: res.rows.item(i).Option8 != '' ? true : false,
						OtherLanguage: res.rows.item(i).HOption8,
						QIndex: res.rows.item(i).QIndex == 9999 ? 1 : res.rows.item(i).QIndex

					});

					//9

					this._List.push({
						QuestionID: res.rows.item(i).ID,
						Question: res.rows.item(i).Question,
						value: 9,
						text: res.rows.item(i).Option9,
						IsShow: res.rows.item(i).Option9 != '' ? true : false,
						OtherLanguage: res.rows.item(i).HOption9,
						QIndex: res.rows.item(i).QIndex == 9999 ? 1 : res.rows.item(i).QIndex

					})

					//10

					this._List.push({
						QuestionID: res.rows.item(i).ID,
						Question: res.rows.item(i).Question,
						value: 10,
						text: res.rows.item(i).Option10,
						IsShow: res.rows.item(i).Option10 != '' ? true : false,
						OtherLanguage: res.rows.item(i).HOption10,
						QIndex: res.rows.item(i).QIndex == 9999 ? 1 : res.rows.item(i).QIndex

					})



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



	async	BindNextQuestion(QuestionID, ResponseID) {
		//  this.user.presentLoadingCustom();
		this.sqlite.create({
			name: 'surveydb.db',
			location: 'default'
		}).then((db: SQLiteObject) => {

			//db.executeSql(`select G.ID, G.Question,G.Option1,G.Option2,G.Option3,G.Option4,G.Option5,LR.Regional_Language  from 
			//tbl_Question AS G 
			//INNER JOIN tbl_QuestionResponse QN  ON G.ID=QN.Next_Question_ID
			//Left Join tbl_LanguageRegional AS LR ON G.ID=LR.Question_ID AND LR.Language_ID = ? 
			//WHERE QN.OptionID=? AND QN.Question_ID=? AND G.Survey_ID=?`, [this.Language_ID, ResponseID, QuestionID, this.Survey_ID])
			db.executeSql(`Select QM.ID, QM.Question,QM.Option1,QM.Option2,QM.Option3,QM.Option4,QM.Option5
,QM1.Question AS HQuestion,QM1.Option1 AS HOption1,QM1.Option2 AS HOption2,QM1.Option3 AS HOption3,QM1.Option4 AS HOption4,QM1.Option5 AS HOption5,
QM.Option6,QM.Option7,QM.Option8,QM.Option9,QM.Option10
,QM1.Option6 AS HOption6,QM1.Option7 AS HOption7,QM1.Option8 AS HOption8,QM1.Option9 AS HOption9,QM1.Option10 AS HOption10 
,SQ.QIndex QIndex
From tbl_QuestionMaster QM 
INNER JOIN tbl_SurveyAssignQuestion SQ ON SQ.Question_ID=QM.ID
INNER JOIN tbl_QuestionResponse QN  ON QM.ID=QN.Next_Question_ID
LEFT JOIN tbl_QuestionMaster QM1 ON QM.ID=QM1.Question_ID AND QM1.Language_ID=?
WHERE  SQ.Status=1 AND QM.Question_Type_ID=1 AND QM.Status =1 AND QN.OptionID=? AND QM.Question_ID=0 AND QN.Question_ID=? AND QM.ID IN (Select Question_ID FROM tbl_SurveyAssignQuestion WHERE Survey_ID =?) AND QM.ID >? ORDER BY QM.ID`,
				[this.Language_ID, ResponseID, QuestionID, this.Survey_ID, QuestionID])
				.then(res => {
					this._List = [];
					this.Question = '';
					this.OtherLanguage = '';
					var i = 0;
					if (res.rows.length > 0) {
						this.Question = res.rows.item(0).Question;
						this.OtherLanguage = res.rows.item(0).HQuestion
						this.Question_Index = this.Question_Index + 1;
						this.QIndex = res.rows.item(0).QIndex == 9999 ? 1 : res.rows.item(0).QIndex
						this.IsNextQuestion = true;
					}
					else {
						this.IsNextQuestion = false;
						return;
					}


					this._List.push({
						QuestionID: res.rows.item(i).ID,
						Question: res.rows.item(i).Question,
						value: 1,
						text: res.rows.item(i).Option1,
						IsShow: res.rows.item(i).Option1 != '' ? true : false,
						OtherLanguage: res.rows.item(i).HOption1,
						QIndex: res.rows.item(i).QIndex == 9999 ? this.Question_Index : res.rows.item(i).QIndex
					})
					//2
					this._List.push({
						QuestionID: res.rows.item(i).ID,
						Question: res.rows.item(i).Question,
						value: 2,
						text: res.rows.item(i).Option2,
						IsShow: res.rows.item(i).Option2 != '' ? true : false,
						OtherLanguage: res.rows.item(i).HOption2,
						QIndex: res.rows.item(i).QIndex == 9999 ? this.Question_Index : res.rows.item(i).QIndex

					});
					//3
					this._List.push({
						QuestionID: res.rows.item(i).ID,
						Question: res.rows.item(i).Question,
						value: 3,
						text: res.rows.item(i).Option3,
						IsShow: res.rows.item(i).Option3 != '' ? true : false,
						OtherLanguage: res.rows.item(i).HOption3,
						QIndex: res.rows.item(i).QIndex == 9999 ? this.Question_Index : res.rows.item(i).QIndex

					})
					//4

					this._List.push({
						QuestionID: res.rows.item(i).ID,
						Question: res.rows.item(i).Question,
						value: 4,
						text: res.rows.item(i).Option4,
						IsShow: res.rows.item(i).Option4 != '' ? true : false,
						OtherLanguage: res.rows.item(i).HOption4,
						QIndex: res.rows.item(i).QIndex == 9999 ? this.Question_Index : res.rows.item(i).QIndex
					})
					//5
					this._List.push({
						QuestionID: res.rows.item(i).ID,
						Question: res.rows.item(i).Question,
						value: 5,
						text: res.rows.item(i).Option5,
						IsShow: res.rows.item(i).Option5 != '' ? true : false,
						OtherLanguage: res.rows.item(i).HOption5,
						QIndex: res.rows.item(i).QIndex == 9999 ? this.Question_Index : res.rows.item(i).QIndex

					});
					//6

					this._List.push({
						QuestionID: res.rows.item(i).ID,
						Question: res.rows.item(i).Question,
						value: 6,
						text: res.rows.item(i).Option6,
						IsShow: res.rows.item(i).Option6 != '' ? true : false,
						OtherLanguage: res.rows.item(i).HOption6,
						QIndex: res.rows.item(i).QIndex == 9999 ? this.Question_Index : res.rows.item(i).QIndex

					});

					//7

					this._List.push({
						QuestionID: res.rows.item(i).ID,
						Question: res.rows.item(i).Question,
						value: 7,
						text: res.rows.item(i).Option7,
						IsShow: res.rows.item(i).Option7 != '' ? true : false,
						OtherLanguage: res.rows.item(i).HOption7,
						QIndex: res.rows.item(i).QIndex == 9999 ? this.Question_Index : res.rows.item(i).QIndex

					});
					//8

					this._List.push({
						QuestionID: res.rows.item(i).ID,
						Question: res.rows.item(i).Question,
						value: 8,
						text: res.rows.item(i).Option8,
						IsShow: res.rows.item(i).Option8 != '' ? true : false,
						OtherLanguage: res.rows.item(i).HOption8,
						QIndex: res.rows.item(i).QIndex == 9999 ? this.Question_Index : res.rows.item(i).QIndex

					});

					//9

					this._List.push({
						QuestionID: res.rows.item(i).ID,
						Question: res.rows.item(i).Question,
						value: 9,
						text: res.rows.item(i).Option9,
						IsShow: res.rows.item(i).Option9 != '' ? true : false,
						OtherLanguage: res.rows.item(i).HOption9,
						QIndex: res.rows.item(i).QIndex == 9999 ? this.Question_Index : res.rows.item(i).QIndex

					})

					//10

					this._List.push({
						QuestionID: res.rows.item(i).ID,
						Question: res.rows.item(i).Question,
						value: 10,
						text: res.rows.item(i).Option10,
						IsShow: res.rows.item(i).Option10 != '' ? true : false,
						OtherLanguage: res.rows.item(i).HOption10,
						QIndex: res.rows.item(i).QIndex == 9999 ? this.Question_Index : res.rows.item(i).QIndex

					})


				})
				.catch(e => {
					console.log(e);
					//	alert(JSON.stringify(e));
				})
				.catch(e => {
					//	alert(JSON.stringify(e));
					//console.log(e);

				});
		});
	}


	async	BindNextQuestionSN(QuestionID, ResponseID) {
		//  this.user.presentLoadingCustom();
		this.sqlite.create({
			name: 'surveydb.db',
			location: 'default'
		}).then((db: SQLiteObject) => {

			db.executeSql(`Select QM.ID, QM.Question,QM.Option1,QM.Option2,QM.Option3,QM.Option4,QM.Option5
 ,QM1.Question AS HQuestion,QM1.Option1 AS HOption1,QM1.Option2 AS HOption2,QM1.Option3 AS HOption3,QM1.Option4 AS HOption4,QM1.Option5 AS HOption5,
 QM.Option6,QM.Option7,QM.Option8,QM.Option9,QM.Option10
 ,QM1.Option6 AS HOption6,QM1.Option7 AS HOption7,QM1.Option8 AS HOption8,QM1.Option9 AS HOption9,QM1.Option10 AS HOption10 
 ,SQ.QIndex QIndex
 From tbl_QuestionMaster QM 
INNER JOIN tbl_SurveyAssignQuestion SQ ON SQ.Question_ID=QM.ID
LEFT JOIN tbl_QuestionMaster QM1 ON QM.ID=QM1.Question_ID AND QM1.Language_ID=?
WHERE  QM.Question_Type_ID=1 AND QM.Status =1 AND QM.Question_ID=0 AND QM.ID IN (Select Question_ID FROM tbl_SurveyAssignQuestion 
WHERE SQ.Status=1 AND Survey_ID =?) AND QM.ID >? ORDER BY QM.ID`, [this.Language_ID, this.Survey_ID, QuestionID,])
				.then(res => {
					this._List = [];
					this.Question = '';
					this.OtherLanguage = '';
					var i = 0;
					if (res.rows.length > 0) {
						this.Question = res.rows.item(0).Question;
						this.OtherLanguage = res.rows.item(0).HQuestion
						this.Question_Index = this.Question_Index + 1;
						this.QIndex = res.rows.item(0).QIndex == 9999 ? 1 : res.rows.item(0).QIndex
						this.IsNextQuestion = true;
					}
					else {
						this.IsNextQuestion = false;
						return;
					}


					this._List.push({
						QuestionID: res.rows.item(i).ID,
						Question: res.rows.item(i).Question,
						value: 1,
						text: res.rows.item(i).Option1,
						IsShow: res.rows.item(i).Option1 != '' ? true : false,
						OtherLanguage: res.rows.item(i).HOption1,
						QIndex: res.rows.item(i).QIndex == 9999 ? this.Question_Index : res.rows.item(i).QIndex
					})
					//2
					this._List.push({
						QuestionID: res.rows.item(i).ID,
						Question: res.rows.item(i).Question,
						value: 2,
						text: res.rows.item(i).Option2,
						IsShow: res.rows.item(i).Option2 != '' ? true : false,
						OtherLanguage: res.rows.item(i).HOption2,
						QIndex: res.rows.item(i).QIndex == 9999 ? this.Question_Index : res.rows.item(i).QIndex
					});
					//3
					this._List.push({
						QuestionID: res.rows.item(i).ID,
						Question: res.rows.item(i).Question,
						value: 3,
						text: res.rows.item(i).Option3,
						IsShow: res.rows.item(i).Option3 != '' ? true : false,
						OtherLanguage: res.rows.item(i).HOption3,
						QIndex: res.rows.item(i).QIndex == 9999 ? this.Question_Index : res.rows.item(i).QIndex

					})
					//4

					this._List.push({
						QuestionID: res.rows.item(i).ID,
						Question: res.rows.item(i).Question,
						value: 4,
						text: res.rows.item(i).Option4,
						IsShow: res.rows.item(i).Option4 != '' ? true : false,
						OtherLanguage: res.rows.item(i).HOption4,
						QIndex: res.rows.item(i).QIndex == 9999 ? this.Question_Index : res.rows.item(i).QIndex
					})
					//5
					this._List.push({
						QuestionID: res.rows.item(i).ID,
						Question: res.rows.item(i).Question,
						value: 5,
						text: res.rows.item(i).Option5,
						IsShow: res.rows.item(i).Option5 != '' ? true : false,
						OtherLanguage: res.rows.item(i).HOption5,
						QIndex: res.rows.item(i).QIndex == 9999 ? this.Question_Index : res.rows.item(i).QIndex

					});
					//6

					this._List.push({
						QuestionID: res.rows.item(i).ID,
						Question: res.rows.item(i).Question,
						value: 6,
						text: res.rows.item(i).Option6,
						IsShow: res.rows.item(i).Option6 != '' ? true : false,
						OtherLanguage: res.rows.item(i).HOption6,
						QIndex: res.rows.item(i).QIndex == 9999 ? this.Question_Index : res.rows.item(i).QIndex

					});

					//7

					this._List.push({
						QuestionID: res.rows.item(i).ID,
						Question: res.rows.item(i).Question,
						value: 7,
						text: res.rows.item(i).Option7,
						IsShow: res.rows.item(i).Option7 != '' ? true : false,
						OtherLanguage: res.rows.item(i).HOption7,
						QIndex: res.rows.item(i).QIndex == 9999 ? this.Question_Index : res.rows.item(i).QIndex

					});
					//8

					this._List.push({
						QuestionID: res.rows.item(i).ID,
						Question: res.rows.item(i).Question,
						value: 8,
						text: res.rows.item(i).Option8,
						IsShow: res.rows.item(i).Option8 != '' ? true : false,
						OtherLanguage: res.rows.item(i).HOption8,
						QIndex: res.rows.item(i).QIndex == 9999 ? this.Question_Index : res.rows.item(i).QIndex

					});

					//9

					this._List.push({
						QuestionID: res.rows.item(i).ID,
						Question: res.rows.item(i).Question,
						value: 9,
						text: res.rows.item(i).Option9,
						IsShow: res.rows.item(i).Option9 != '' ? true : false,
						OtherLanguage: res.rows.item(i).HOption9,
						QIndex: res.rows.item(i).QIndex == 9999 ? this.Question_Index : res.rows.item(i).QIndex

					})

					//10
					this._List.push({
						QuestionID: res.rows.item(i).ID,
						Question: res.rows.item(i).Question,
						value: 10,
						text: res.rows.item(i).Option10,
						IsShow: res.rows.item(i).Option10 != '' ? true : false,
						OtherLanguage: res.rows.item(i).HOption10,
						QIndex: res.rows.item(i).QIndex == 9999 ? this.Question_Index : res.rows.item(i).QIndex
					})

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


	UpdateSurveyData_OtherFields(QResponse, value, SN, Survey_ID) {
		this.sqlite.create({
			name: 'surveydb.db',
			location: 'default'
		}).then((db: SQLiteObject) => {

			db.executeSql('UPDATE SurveyData SET  ' + QResponse + ' = ? ,IsActive=1  Where RowID = ? AND Survey_ID = ?', [value, SN, Survey_ID])
				.then(res => {


				}).catch(e => {
					//	alert(e);
					console.log(e)
				});

		}).catch(e => {
			//alert(e);
			console.log(e)
		}
		);
	}
	async BindNextPage() {
		this.sqlite.create({
			name: 'surveydb.db',
			location: 'default'
		}).then((db: SQLiteObject) => {

			db.executeSql('select Name FROM tbl_PageMaster WHERE ID > 2 AND Status = 1 ORDER BY ID ASC LIMIT 1 ', [])
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
