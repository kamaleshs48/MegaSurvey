import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, ModalController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { User, Settings } from '../../providers';
import { Geolocation } from '@ionic-native/geolocation';
import { Platform } from '../../../node_modules/ionic-angular/platform/platform';
/**
 * Generated class for the Survey1Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-survey',
	templateUrl: 'survey.html',
})


export class SurveyPage {
	PresentLimit: any = 0;
	MaxLimit: Number = 0;
	SN: any = 1;
	height: any;
	PartyList: any = [];
	SurveyDate: String = "";
	Coordinate: any = "";
	User_ID: any = 0;
	Language_ID = 0;
	platformHeight = 0;
	Street: '';
	Party_ID: any; Survey_ID: any; State_ID: any; LokSabha_ID: any; VidhanSabha_ID: any;
	Word_ID: any; Booth_ID: any; Area_ID: any; OtherArea: any;
	Survey_For: any;
	NextPage: any;
	Survey_Type_ID = 0;
	constructor(public navCtrl: NavController, public navParams: NavParams,
		private sqlite: SQLite,
		public toastCtrl: ToastController,
		public user: User,
		private geolocation: Geolocation,
		private platform: Platform,
		private settings: Settings,
		private alertCtrl: AlertController,
		public modalCtrl: ModalController,
	) {


		this.User_ID = navParams.get('User_ID') || 0;
		this.Survey_ID = navParams.get('Survey_ID') || 0;
		this.State_ID = navParams.get('StateID') || 0;
		this.LokSabha_ID = navParams.get('LokSabhaID') || 0;
		this.VidhanSabha_ID = navParams.get('VidhanSabhaID') || 0;
		this.Word_ID = navParams.get('WordID') || 0;
		this.Booth_ID = navParams.get('BoothID') || 0;
		this.Area_ID = navParams.get('AreaID') || 0;
		this.OtherArea = navParams.get('AreaOther') || '';
		this.Survey_For = navParams.get('Survey_For') || '';
		this.PresentLimit = parseInt(navParams.get('PresentLimit')) || 0;
		this.Street = navParams.get('Street') || '';
		this.MaxLimit = navParams.get('MaxLimit') || '';
		this.Survey_Type_ID = navParams.get('Survey_Type_ID');

		platform.ready().then(() => {
			this.platformHeight = platform.height();
			this.height = ((this.platformHeight / 7.7) - 3).toString() + 'px';
			this.settings.load().then(() => {

				this.settings.getValue('Language_ID').then(r => {

					this.Language_ID = r;
				}).catch();


				this.settings.getValue('Row_ID').then(r => {


					this.GetLocation()
				})

			});



			setTimeout(() => {
				this.GetSurveyPresentLimit(this.Survey_ID, this.User_ID);
			}, 500)

			setTimeout(() => {
				this.BindNextPage();
			}, 300);
		});

	}
	ionViewDidLoad() {
		this.GetLocation();
		/*  let watch = this.geolocation.watchPosition();
		 watch.subscribe((data) => {
		   // data can be a set of coordinates, or an error (if an error occurred).
		   // data.coords.latitude
		   // data.coords.longitude
		   this.Coordinate = data.coords.latitude.toString() + data.coords.longitude.toString()
		 });
		 console.log('ionViewDidLoad Survey1Page'); */

		setTimeout(() => {
			this.BindPartiList();
		}, 1000);

		setTimeout(() => {
			this.GetSurveyPresentLimit(this.Survey_ID, this.User_ID);
			this.GetLocation();
		}, 500)
	}
	SaveSurvey(Party_ID, Survey_ID, PersonID) {

		this.SurveyDate = new Date().toISOString();
		this.GetLocation();
		this.sqlite.create({
			name: 'surveydb.db',
			location: 'default'
		}).then((db: SQLiteObject) => {
			//RowID ,Party_ID ,Survey_ID  ,State_ID  ,LokSabha_ID ,VidhanSabha_ID
			//  ,Word_ID  ,Booth_ID,Area_ID,OtherArea,GPSCoordinate ,SurveyDate ,User_ID 
			db.executeSql(`INSERT INTO SurveyData VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
        ,?,?,?,?,?,?,?,?,?,?
        ,?,?,?,?,?,?,?,?,?,?,?,?
        )`,
				[
					this.SN,
					Party_ID,
					this.Survey_ID,
					this.State_ID,
					this.LokSabha_ID,
					this.VidhanSabha_ID,
					this.Word_ID,
					this.Booth_ID,
					this.Area_ID,
					this.OtherArea,
					this.Coordinate,
					this.SurveyDate,
					this.User_ID,
					PersonID,
					this.Street,
					0, 0, 0, 0, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''
					, '', '', '', '', '', '', '', '', '', '', '', 0
				])
				.then(res => {
					this.PresentLimit = parseInt(this.PresentLimit) + 1;
					//	this.SN = parseInt(this.SN) + 1;
					this.user.UpdateSurveyPresentLimit(this.Survey_ID, this.User_ID, this.SN);
					//this.user.ShowAlert('Thanks For Your View')
					if (this.NextPage) {
						let contactModal = this.modalCtrl.create(this.NextPage, { Language_ID: this.Language_ID, Survey_ID: this.Survey_ID, SN: parseInt(this.SN), Survey_Type_ID: this.Survey_Type_ID })
						contactModal.present();
					}



					setTimeout(() => {
						this.SN = parseInt(this.SN) + 1;
						//	this.GetSurveyPresentLimit(this.Survey_ID, this.User_ID);
					}, 500)



					// SHow Page After message


				})
				.catch(e => {
					alert(JSON.stringify(e))
					console.log(e);
				})
				.catch(e => {
					alert(JSON.stringify(e))
					console.log(e);
				});
		});
		//alert('THIS');
	}
	BindPartiList() {
		//  this.user.presentLoadingCustom();
		this.sqlite.create({
			name: 'surveydb.db',
			location: 'default'
		}).then((db: SQLiteObject) => {

			db.executeSql(`SELECT P.ID,P.Survey_ID,P.Name,P.Icons,P.PersonName,P.PersonImage,P.Survey_Type_ID,P.PersonID,
      LR.Regional_Language FROM PartyMaster P Left Join tbl_LanguageRegional AS LR ON P.ID=LR.Party_ID AND LR.Language_ID=?  WHERE Survey_ID=? `, [this.Language_ID, this.Survey_ID])
				.then(res => {
					this.PartyList = [];
					for (var i = 0; i < res.rows.length; i++) {
						this.PartyList.push({
							ID: res.rows.item(i).ID, Survey_ID: res.rows.item(i).Survey_ID,
							PartyName: res.rows.item(i).Name, IconsName: res.rows.item(i).Icons,
							height: ((this.platformHeight / 6) - 3).toString() + 'px',
							HindiName: res.rows.item(i).Regional_Language,
							PersonName: res.rows.item(i).PersonName,
							PersonImage: res.rows.item(i).PersonImage,
							Survey_Type_ID: res.rows.item(i).Survey_Type_ID,
							PersonID: res.rows.item(i).PersonID
						})
					}



				})
				.catch(e => {

					console.log(e);
				})

				.catch(e => {
					console.log(e);

				});
		});
	}

	GetLocation() {
		this.geolocation.getCurrentPosition().then((data) => {
			// resp.coords.latitude
			// resp.coords.longitude
			this.Coordinate = data.coords.latitude.toString() + "," + data.coords.longitude.toString()
		}).catch((error) => {
			console.log('Error getting location', error);
		});
	}


	GetSurveyPresentLimit(SurveyID, UserID) {
		var PresentLimit: any = 0;
		this.sqlite.create({
			name: 'surveydb.db',
			location: 'default'
		}).then((db: SQLiteObject) => {

			db.executeSql('SELECT Max(RowID) AS PresentLimit FROM SurveyData  ', [])
				.then(res => {
					if (res.rows.length > 0) {

						// alert('PresentLimit' + this.PresentLimit);
						if (res.rows.item(0).PresentLimit) {
							this.SN = res.rows.item(0).PresentLimit;
							this.SN = parseInt(this.SN) + 1;
						}

					}

				}
				).catch(e => {

					console.log(e)
				})

		}).catch(e => {

			console.log(e)
		});

	}

	BindNextPage() {

		this.sqlite.create({
			name: 'surveydb.db',
			location: 'default'
		}).then((db: SQLiteObject) => {

			db.executeSql('select Name FROM tbl_PageMaster WHERE Status = 1 ORDER BY ID ASC LIMIT 1', [])
				.then(res => {
					if (res.rows.length > 0) {
						this.NextPage = res.rows.item(0).Name
					}

				})
				.catch(e => {


				})
				.catch(e => {


				});
		});
	}

	Home() {
		this.navCtrl.setRoot('ListMasterPage');
	}
	CloseApp() {

		let alert1 = this.alertCtrl.create({
			title: '',
			mode: 'ios',
			message: 'Are you sure you want to exit?',
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
						this.platform.exitApp();
					}
				}
			]
		});
		alert1.present();

	}

}
