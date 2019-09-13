import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';

import { Api } from '../api/api';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { HttpHeaders } from "@angular/common/http";
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { ToastController, AlertController } from 'ionic-angular';
import { Settings } from '../settings/settings'
@Injectable()
export class User {
	_user: any;
	_db: SQLiteObject;
	headers = new HttpHeaders()
		.set("Access-Control-Allow-Origin", "*")
		.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
		.set('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
		.set('Content-Type', 'applic')
		.set('Access-Control-Allow-Credentials', 'true');


	constructor(public api: Api, public loadingCtrl: LoadingController, public toastCtrl: ToastController,
		public alertCtrl: AlertController, private sqlite: SQLite, private webStorage: Settings


	) {

	}



	/**
	 * Send a POST request to our login endpoint with the data
	 * the user entered on the form.
	 */
	login(accountInfo: any) {
		//this._loggedIn(u);
		//return u;
		/* this._Loading.present(); */
		let seq = this.api.get('login?email=' + accountInfo.email + '&password=' + accountInfo.password + '&DeviceID=' + accountInfo.DeviceID).share();
		seq.subscribe((res: any) => {

			// If the API returned a successful response, mark the user as logged in
			if (res.status == 'success') {

				this.webStorage.setValue('UID', res.users.UID);
				this.webStorage.setValue('MobileNo', res.users.MobileNo);
				this.webStorage.setValue('FName', res.users.FirstName);
				this.webStorage.setValue('LName', res.users.LastName);
				this.webStorage.setValue('Email', res.users.Email);
				this.webStorage.setValue('ServeyHistry', '');
				this.webStorage.setValue('ImagePath', res.users.ImagePath);

				this.webStorage.setValue('MobileNo1', res.users.MobileNo1);
				this.webStorage.setValue('Address', res.users.Address);
				this.webStorage.setValue('Password', res.users.Password);


				/* this.settings.setValue('ImagePath', resp.users.ImagePath);
				 this.settings.setValue('alpha2Code', resp.users.alpha2Code);
				 this.settings.setValue('password', this.account.password); */
				this.webStorage.setValue('Row_ID', 0);
				this.webStorage.setValue('username', res);
				this._loggedIn(res);
				console.log(res);
			} else {
			}
		}, err => {

			console.error('ERROR', err);
		});
		/* this._Loading.dismiss(); */
		return seq;
	}


	GetDemoUser() {
		//this._loggedIn(u);
		//return u;
		/* this._Loading.present(); */
		let seq = this.api.get('GetDemoUser').share();

		/* this._Loading.dismiss(); */
		return seq;
	}



	GetUserProfile(UserID: any) {
		/* this._Loading.present(); */
		let seq = this.api.post('signup', UserID).share();

		seq.subscribe((res: any) => {
			// If the API returned a successful response, mark the user as logged in
			if (res.status == 'success') {
				this._loggedIn(res);
			}
		}, err => {
			console.error('ERROR', err);
		});

		return seq;
	}


	SendFeedBack(UserID: any, MobileNo: any, FeedBack: any) {
		/* this._Loading.present(); */


		let seq = this.api.get('SendFeedBack?FeedBack=' + FeedBack + '&MobileNo=' + MobileNo + '&UserID=' + UserID).share();

		seq.subscribe((res: any) => {
			// If the API returned a successful response, mark the user as logged in
			if (res.status == 'success') {

			}
		}, err => {
			console.error('ERROR', err);
		});

		return seq;
	}



	DemoUserRegister(accountInfo: any) {
		//this._loggedIn(u);
		//return u;

		/* this._Loading.present(); */
		let seq = this.api.get('DemoUserRegister?FirstName=' + accountInfo.FirstName + '&LastName=' + accountInfo.LastName +
			'&Mobile1=' + accountInfo.Mobile1 + '&Email=' + accountInfo.Email + '&Mobile2=' + accountInfo.Mobile2 + '&Address=' + accountInfo.Address).share();
		seq.subscribe((res: any) => {

			// If the API returned a successful response, mark the user as logged in
			if (res.status == 'success') {
				this.webStorage.setValue('IsVerify', 1)
				this.webStorage.setValue('MobileNo', accountInfo.Mobile1)

				//this.webStorage.setValue('UID', res.users.UID);
			} else {

			}
		}, err => {

			console.error('ERROR', err);
		});
		/* this._Loading.dismiss(); */
		return seq;
	}



	DemoMobileVerify(MobileNo: any) {
		//this._loggedIn(u);
		//return u;

		/* this._Loading.present(); */
		let seq = this.api.get('SendDemoUserOTP?MobileNo=' + MobileNo).share();
		seq.subscribe((res: any) => {

			// If the API returned a successful response, mark the user as logged in
			if (res.status == 'Success') {

				//this.webStorage.setValue('UID', res.users.UID);
			} else {

			}
		}, err => {

			console.error('ERROR', err);
		});
		/* this._Loading.dismiss(); */
		return seq;
	}





	UserRegister(accountInfo: any) {
		//this._loggedIn(u);
		//return u;

		/* this._Loading.present(); */
		let seq = this.api.get('Register?FirstName=' + accountInfo.FirstName + '&LastName=' + accountInfo.LastName +
			'&MobileNo=' + accountInfo.MobileNo + '&Email=' + accountInfo.Email + '&password=' + accountInfo.password + '').share();
		seq.subscribe((res: any) => {

			// If the API returned a successful response, mark the user as logged in
			if (res.status == 'success') {

				this.webStorage.setValue('UID', res.users.UID);


				this.webStorage.setValue('MobileNo', res.users.MobileNo);
				this.webStorage.setValue('FName', res.users.FirstName);
				this.webStorage.setValue('LName', res.users.LastName);
				this.webStorage.setValue('Email', res.users.Email);
				this.webStorage.setValue('MobileNo1', res.users.MobileNo1);
				this.webStorage.setValue('Address', res.users.Address);
				this.webStorage.setValue('Password', res.users.Password);

				this.webStorage.setValue('ServeyHistry', '');
				this.webStorage.setValue('ImagePath', res.users.ImagePath);




				this.webStorage.setValue('ServeyHistry', '');
				/*  this.settings.setValue('ImagePath', resp.users.ImagePath);
				 this.settings.setValue('alpha2Code', resp.users.alpha2Code);
				 this.settings.setValue('password', this.account.password); */
				this.webStorage.setValue('Row_ID', 0);
				this.webStorage.setValue('username', res);
				this._loggedIn(res);
				console.log(res);
			} else {

			}
		}, err => {

			console.error('ERROR', err);
		});
		/* this._Loading.dismiss(); */
		return seq;
	}




	/**
	 * Send a POST request to our signup endpoint with the data
	 * the user entered on the form.
	 */
	signup(accountInfo: any) {
		let seq = this.api.post('signup', accountInfo).share();

		seq.subscribe((res: any) => {
			// If the API returned a successful response, mark the user as logged in
			if (res.status == 'success') {
				this._loggedIn(res);
			}
		}, err => {
			console.error('ERROR', err);
		});

		return seq;
	}

	/**
	 * Log the user out, which forgets the session
	 */


	/**
	 * Process a login/signup response to store user data
	 */
	_loggedIn(resp) {
		this._user = resp.user;
	}


	async LoadMasterData1(UID: any) {


		await this.LoadMasterData(UID);


	}
	ForgotPassword(MobileNo: any) {
		/* this._Loading.present(); */
		let Qry: string
		Qry = 'ForgotPassword?MobileNo=' + MobileNo;
		let seq = this.api.get(Qry).share();
		seq.subscribe((res: any) => {

		}, err => {
			console.error('ERROR', err);
		});
		/* this._Loading.dismiss(); */
		return seq;
	}


	ChangePassword(Password: any, UserID) {
		/* this._Loading.present(); */
		let Qry: string
		Qry = 'ChangePassword?Password=' + Password + '&UserID=' + UserID;
		let seq = this.api.get(Qry).share();
		seq.subscribe((res: any) => {

		}, err => {
			console.error('ERROR', err);
		});
		/* this._Loading.dismiss(); */
		return seq;
	}


	ResendOTP(OTP: any, MobileNo: any) {
		/* this._Loading.present(); */
		let Qry: string
		Qry = 'ResendOTP?MobileNo=' + MobileNo + '&OTP=' + OTP;
		let seq = this.api.get(Qry).share();
		seq.subscribe((res: any) => {

		}, err => {
			console.error('ERROR', err);
		});
		/* this._Loading.dismiss(); */
		return seq;
	}


	VerifyMobileNo(MobileNo: any) {
		/* this._Loading.present(); */
		let Qry: string
		Qry = 'VerifyMobileNo?MobileNo=' + MobileNo;
		let seq = this.api.get(Qry).share();
		seq.subscribe((res: any) => {
			this.webStorage.setValue('IsVerify', 1);
		}, err => {
			console.error('ERROR', err);
		});
		/* this._Loading.dismiss(); */
		return seq;
	}

	LogOut(MobileNo: any) {
		/* this._Loading.present(); */
		//alert(MobileNo);
		let Qry: string
		Qry = 'LogOut?MobileNo=' + MobileNo;
		let seq = this.api.get(Qry).share();
		seq.subscribe((res: any) => {
			if (res == 'success') {

				this.webStorage.setValue('UID', 0);
				this.webStorage.setValue('IsVerify', 0);

				this.webStorage.setValue('ServeyHistry', '');

			}

		}, err => {
			console.error('ERROR', err);
		});
		/* this._Loading.dismiss(); */
		return seq;
	}

	LoadMasterData(UID: any) {

		const loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		loading.present();
		let Qry: string
		Qry = 'LoadData?UserID=' + UID
		let seq = this.api.get(Qry).share();
		seq.subscribe((res: any) => {
			/* State Master */
			/* Drop Table If Exist DROP TABLE [IF EXISTS] [schema_name.]table_name; */
			this.sqlite.create({
				name: 'surveydb.db',
				location: 'default'
			}).then((db: SQLiteObject) => {
				/* State Master */
				db.executeSql('CREATE TABLE IF NOT EXISTS StateMaster(ID INTEGER ,PID INTEGER,  Name TEXT, Code TEXT)', [])
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();
					});

				/* Drop Table If Exist DROP TABLE [IF EXISTS] [schema_name.]table_name; */
				let _Qry = 'DROP TABLE IF EXISTS LokSabhaMaster;'
					+ ' DROP TABLE IF EXISTS VidhanSabhaMaster;'
					+ ' DROP TABLE IF EXISTS WordMaster;'
					+ ' DROP TABLE IF EXISTS BoothMaster;'
					+ ' DROP TABLE IF EXISTS AreaCityMaster;'
					+ ' DROP TABLE IF EXISTS SurveyMaster;'
					+ ' DROP TABLE IF EXISTS PartyMaster;';
				db.executeSql('DROP TABLE IF EXISTS PartyMaster', [])
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();
						this.ShowAlert('Error in DB Create');

					});


				db.executeSql('DROP TABLE IF EXISTS SurveyData', [])
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();
						this.ShowAlert('Error in DB Create');

					});


				db.executeSql('DROP TABLE IF EXISTS tbl_LanguageRegional', [])
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();
					});

				db.executeSql('DROP TABLE IF EXISTS tbl_QuestionMaster', [])
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();
					});
				db.executeSql('DROP TABLE IF EXISTS tbl_QuestionResponse', [])
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();
					});
				db.executeSql('DROP TABLE IF EXISTS tbl_SurveyAssignQuestion', [])
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();
					});

				db.executeSql('DROP TABLE IF EXISTS tbl_MQuestionResponse', [])
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();
					});

				db.executeSql('DROP TABLE IF EXISTS PartyMaster', [])
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();


					});

				/* Create Lock Sabha */
				db.executeSql('CREATE TABLE IF NOT EXISTS LokSabhaMaster(ID INTEGER ,PID INTEGER,  Name TEXT, Code TEXT)', [])
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();
						//this.ShowAlert(e);

					});
				/* Vidhan Sabha */
				db.executeSql('CREATE TABLE IF NOT EXISTS VidhanSabhaMaster(ID INTEGER ,PID INTEGER,  Name TEXT, Code TEXT)', [])
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();
						//this.ShowAlert(e);

					});
				/* Word */
				db.executeSql('CREATE TABLE IF NOT EXISTS WordMaster(ID INTEGER ,PID INTEGER,  Name TEXT, Code TEXT)', [])
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();
						//	this.ShowAlert(e);

					});
				/* Booth Master */
				db.executeSql('CREATE TABLE IF NOT EXISTS BoothMaster(ID INTEGER ,PID INTEGER,  Name TEXT, Code TEXT)', [])
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();
						//this.ShowAlert(e);

					});

				/* Area City */
				db.executeSql('CREATE TABLE IF NOT EXISTS AreaCityMaster(ID INTEGER ,PID INTEGER,  Name TEXT, Code TEXT)', [])
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();


					});

				/* Survey List */
				db.executeSql('CREATE TABLE IF NOT EXISTS SurveyMaster(ID INTEGER ,PID INTEGER,  Name TEXT, Code TEXT,State_ID INTEGER,Loksabha_ID INTEGER,Vidhansabha_ID INTEGER,WardBlock_ID INTEGER,UserID INTEGER,MaxLimit INTEGER,PresentLimit INTEGER,Survey_For TEXT,ExpDate TEXT,ExpDate1 TEXT,WardLevelName TEXT)', [])
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();


					});

				/* Party List */
				db.executeSql('CREATE TABLE IF NOT EXISTS PartyMaster(ID INTEGER ,Survey_ID INTEGER,  Name TEXT, Icons TEXT,HindiName TEXT,PersonName TEXT,PersonImage TEXT,Survey_Type_ID INTEGER,PersonID INTEGER,IsActive INTEGER )', [])
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();


					});
				db.executeSql(`CREATE TABLE IF NOT EXISTS SurveyData(RowID INTEGER ,Party_ID INTEGER,Survey_ID INTEGER ,State_ID INTEGER ,LokSabha_ID INTEGER,VidhanSabha_ID INTEGER ,Word_ID INTEGER ,Booth_ID INTEGER ,Area_ID INTEGER ,OtherArea TEXT  ,GPSCoordinate TEXT ,SurveyDate TEXT ,User_ID INTEGER,PersonID INTEGER,Street TEXT,
          Gender_ID INTEGER,Age_Group_ID INTEGER,Religion_ID INTEGER,Caste_ID INTEGER,
          Education_ID INTEGER,
          Profession_ID INTEGER,
          Name TEXT ,
          Mobile1 TEXT ,
          Mobile2 TEXT ,
          Email TEXT ,
		  QResponse1 TEXT Null,
		  QResponse2 TEXT Null,
		  QResponse3 TEXT Null,
		  QResponse4 TEXT Null,
		  QResponse5 TEXT Null,
		  QResponse6 TEXT Null,
		  QResponse7 TEXT Null,
		  QResponse8 TEXT Null,
		  QResponse9 TEXT Null,
		  QResponse10 TEXT Null,
		  QResponse11 TEXT Null,
		  QResponse12 TEXT Null,
		  QResponse13 TEXT Null,
		  QResponse14 TEXT Null,
		  QResponse15 TEXT Null,
		  QResponse16 TEXT Null,
		  QResponse17 TEXT Null,
		  QResponse18 TEXT Null,
		  QResponse19 TEXT Null,
		  QResponse20 TEXT Null,
		  QResponse21 TEXT Null,
		  QResponse22 TEXT Null,
		  QResponse23 TEXT Null,
		  QResponse24 TEXT Null,
		  QResponse25 TEXT Null,
		  QResponse26 TEXT Null,
		  QResponse27 TEXT Null,
		  QResponse28 TEXT Null,
		  QResponse29 TEXT Null,
		  QResponse30 TEXT Null,
		  QMResponse TEXT,
		  IsActive INTEGER

		  )`, [])
					.then(res => console.log('Executed SQL'))
					.catch(e => {

						loading.dismiss();


					});



				/* Table Language */

				db.executeSql('CREATE TABLE IF NOT EXISTS tbl_Language(ID INTEGER ,  Name TEXT, Icons TEXT,Status INTEGER)', [])
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();
					});
				/* Table Gender */

				db.executeSql('CREATE TABLE IF NOT EXISTS tbl_Gender(ID INTEGER ,  Name TEXT, Icons TEXT,Status INTEGER)', [])
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();
					});

				/* Table AgeGroup */
				db.executeSql('CREATE TABLE IF NOT EXISTS tbl_AgeGroup(ID INTEGER ,  Name TEXT, Icons TEXT,Status INTEGER,Survey_ID INTEGER )', [])
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();
					});
				/* Table Religion */

				db.executeSql('CREATE TABLE IF NOT EXISTS tbl_Religion(ID INTEGER ,  Name TEXT, Icons TEXT,Status INTEGER)', [])
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();
					});
				/* Table SubCaste */

				db.executeSql('CREATE TABLE IF NOT EXISTS tbl_SubCaste(ID INTEGER , Religion_ID INTEGER, Name TEXT, Icons TEXT,Status INTEGER)', [])
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();
					});
				/* Table SubCaste */



				/* Table LanguageRegional */

				db.executeSql(`CREATE TABLE IF NOT EXISTS tbl_LanguageRegional(
       ID INTEGER
      ,Language_ID INTEGER
      ,Regional_Language TEXT
      ,Party_ID INTEGER
      ,Person_ID INTEGER
      ,Gender_ID INTEGER
      ,Age_Group_ID INTEGER
      ,Religion_ID INTEGER
      ,Caste_ID INTEGER
      ,Education_ID INTEGER
	  ,Profession_ID INTEGER
	  ,Question_ID INTEGER
      ,Status INTEGER
     )`, [])
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();
					});

				/* tbl_Education */
				db.executeSql('CREATE TABLE IF NOT EXISTS tbl_Education(ID INTEGER ,  Name TEXT, Icons TEXT,Status INTEGER)', [])
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();
					});
				/* tbl_Profession */
				db.executeSql('CREATE TABLE IF NOT EXISTS tbl_Profession(ID INTEGER ,  Name TEXT, Icons TEXT,Status INTEGER)', [])
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();
					});

				/* tbl_PageMaster */
				db.executeSql('CREATE TABLE IF NOT EXISTS tbl_PageMaster(ID INTEGER ,  Name TEXT, Title TEXT,Status INTEGER)', [])
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();
					});


				/* tbl_QuestionMaster */
				db.executeSql(`CREATE TABLE IF NOT EXISTS tbl_QuestionMaster(
					ID INTEGER ,
					Question TEXT,
					Language_ID INTEGER,
					Question_ID INTEGER,
					Option1 TEXT,
					Option2 TEXT,
					Option3 TEXT,
					Option4 TEXT,
					Option5 TEXT,
					Option6 TEXT,
					Option7 TEXT,
					Option8 TEXT,
					Option9 TEXT,
					Option10 TEXT,
					Option11 TEXT,
					Option12 TEXT,
					Option13 TEXT,
					Option14 TEXT,
					Option15 TEXT,
					Option16 TEXT,
					Option17 TEXT,
					Option18 TEXT,
					Option19 TEXT,
					Option20 TEXT,
					Option21 TEXT,
					Option22 TEXT,
					Option23 TEXT,
					Option24 TEXT,
					Option25 TEXT,
					Option26 TEXT,
					Option27 TEXT,
					Option28 TEXT,
					Option29 TEXT,
					Option30 TEXT,
					Question_Type_ID INTEGER,
					Status INTEGER,
					Survey_ID INTEGER
					)`, [])
					.then(res => console.log('Executed SQL'))
					.catch(e => {

						loading.dismiss();
					});



				/* tbl_QuestionResponse */
				db.executeSql(`CREATE TABLE IF NOT EXISTS tbl_QuestionResponse(
Question_ID INTEGER ,
OptionID INTEGER,
Next_Question_ID INTEGER,
Survey_ID INTEGER ,
Status INTEGER)`, [])
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();
					});


				/* tbl_SurveyAssignQuestion */
				db.executeSql(`CREATE TABLE IF NOT EXISTS tbl_SurveyAssignQuestion(
Question_ID INTEGER ,
Survey_ID INTEGER,
Survey_Name TEXT,
Status INTEGER,
QIndex INTEGER
)`, [])
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();
					});


				/* tbl_MQuestionResponse */
				db.executeSql(`CREATE TABLE IF NOT EXISTS tbl_MQuestionResponse(
		Question_ID INTEGER ,
		SN INTEGER ,
		QResponse TEXT,
		Survey_ID INTEGER)`, [])
					.then(res => console.log('Executed SQL'))
					.catch(e => {

						loading.dismiss();
					});






				// Clear Data
				db.executeSql('DELETE FROM StateMaster')
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();


					});
				db.executeSql('DELETE FROM LokSabhaMaster')
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();

					});
				db.executeSql('DELETE FROM VidhanSabhaMaster')
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();


					});
				db.executeSql('DELETE FROM WordMaster')
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();


					});
				db.executeSql('DELETE FROM AreaCityMaster')
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();


					});
				db.executeSql('DELETE FROM BoothMaster')
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();


					});
				db.executeSql('DELETE FROM SurveyMaster')
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();


					});

				/* Delete Tbale */
				db.executeSql('DELETE FROM tbl_Language')
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();
					});
				db.executeSql('DELETE FROM tbl_Gender')
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();
					});
				db.executeSql('DELETE FROM tbl_AgeGroup')
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();
					});
				db.executeSql('DELETE FROM tbl_Religion')
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();
					});
				db.executeSql('DELETE FROM tbl_SubCaste')
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();
					});

				db.executeSql('DELETE FROM tbl_Education')
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();
					});
				db.executeSql('DELETE FROM tbl_Profession')
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();
					});

				db.executeSql('DELETE FROM tbl_PageMaster')
					.then(res => console.log('Executed SQL'))
					.catch(e => {
						loading.dismiss();
					});




				var _i: number = 0;
				/* State Master */
				for (var l in res.State) {
					db.executeSql('INSERT INTO StateMaster VALUES(?,?,?,?)', [res.State[_i].ID,
					res.State[_i].PID,
					res.State[_i].Name,
					res.State[_i].Code])
						.then(res => {
							console.log('Save');
						})
						.catch(e => {
							//	this.ShowAlert(e);
						});
					_i = _i + 1;
				}
				/* LOck Sabha */
				_i = 0;
				for (var l in res.LokSabha) {
					db.executeSql('INSERT INTO LokSabhaMaster VALUES(?,?,?,?)', [res.LokSabha[_i].ID,
					res.LokSabha[_i].PID,
					res.LokSabha[_i].Name,
					res.LokSabha[_i].Code])
						.then(res => {
							console.log('Save');
						})
						.catch(e => {
							loading.dismiss();
							//	this.ShowAlert(e);
							console.log(e);
						});
					_i = _i + 1;
				}
				/* VidhanSabhaMaster */
				_i = 0;
				for (var l in res.VidhanSabha) {
					db.executeSql('INSERT INTO VidhanSabhaMaster VALUES(?,?,?,?)', [res.VidhanSabha[_i].ID,
					res.VidhanSabha[_i].PID,
					res.VidhanSabha[_i].Name,
					res.VidhanSabha[_i].Code])
						.then(res => {
							console.log('Save');
						})
						.catch(e => {
							this.ShowAlert('Something wrong, Please try again after some time');
							loading.dismiss();
						});
					_i = _i + 1;
				}
				/* WordMaster */
				_i = 0;
				for (var l in res.Word) {
					db.executeSql('INSERT INTO WordMaster VALUES(?,?,?,?)', [res.Word[_i].ID,
					res.Word[_i].PID,
					res.Word[_i].Name,
					res.Word[_i].Code])
						.then(res => {
							console.log('Save');
						})
						.catch(e => {
							loading.dismiss();
							this.ShowAlert(e);
							console.log(e);
						});
					_i = _i + 1;
				}
				/* AreaCityMaster */
				_i = 0;
				for (var l in res.Area) {
					db.executeSql('INSERT INTO AreaCityMaster VALUES(?,?,?,?)', [res.Area[_i].ID,
					res.Area[_i].PID,
					res.Area[_i].Name,
					res.Area[_i].Code])
						.then(res => {
							console.log('Save');
						})
						.catch(e => {
							loading.dismiss();
							//	this.ShowAlert(e);
							console.log(e);
						});
					_i = _i + 1;
				}

				/* BoothMaster */
				_i = 0;
				for (var l in res.Booth) {
					db.executeSql('INSERT INTO BoothMaster VALUES(?,?,?,?)', [res.Booth[_i].ID,
					res.Booth[_i].PID,
					res.Booth[_i].Name,
					res.Booth[_i].Code])
						.then(res => {
							console.log('Save');
						})
						.catch(e => {
							loading.dismiss();
							//	this.ShowAlert(e);
							console.log(e);
						});
					_i = _i + 1;
				}


				/* Survey Name */
				_i = 0;
				var _SurveyList: any = JSON.parse(res.SurveyList);
				for (var l in _SurveyList) {
					db.executeSql('INSERT INTO SurveyMaster VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [_SurveyList[_i].ID,
					_SurveyList[_i].Survey_Type_ID,
					_SurveyList[_i].NAME,
						'',
					_SurveyList[_i].State_ID,
					_SurveyList[_i].Loksabha_ID,
					_SurveyList[_i].Vidhansabha_ID,
					_SurveyList[_i].WardBlock_ID,
						UID,
					_SurveyList[_i].MaxLimit,
					_SurveyList[_i].PresentLimit,
					_SurveyList[_i].Survey_For,
					_SurveyList[_i].ExpDate,
					_SurveyList[_i].ExpDate1,
					_SurveyList[_i].WardLevelName
					])
						.then(res => {
							console.log('Save');
						})
						.catch(e => {
							loading.dismiss();
							//	this.ShowAlert(e);
							console.log(e);
						});
					_i = _i + 1;
				}
				/* Survey Party Name */
				_i = 0;
				var _PartyList = JSON.parse(res.PartyList);
				for (var l in _PartyList) {
					db.executeSql('INSERT INTO PartyMaster VALUES(?,?,?,?,?,?,?,?,?,?)', [
						_PartyList[_i].ID,
						_PartyList[_i].Survey_ID,
						_PartyList[_i].PartyName,
						_PartyList[_i].IconsName,
						_PartyList[_i].HindiName,
						_PartyList[_i].PersonName,
						_PartyList[_i].PersonImage,
						_PartyList[_i].Survey_Type_ID,
						_PartyList[_i].PersonID,
						1
					]
					)
						.then(res => {
							console.log('Save');
						})
						.catch(e => {
							console.log(e);
						});
					_i = _i + 1;
				}

				/* tbl_Language */
				_i = 0;
				var _LanguageList = JSON.parse(res.Language);
				for (var l in _LanguageList) {
					db.executeSql('INSERT INTO tbl_Language VALUES(?,?,?,?)', [
						_LanguageList[_i].ID,
						_LanguageList[_i].NAME,
						_LanguageList[_i].Icons,
						1,
					]
					)
						.then(res => {
							console.log('Save');
						})
						.catch(e => {
							console.log(e);
						});
					_i = _i + 1;
				}
				/* tbl_Gender */
				_i = 0;
				var _GenderList = JSON.parse(res.Gender);
				for (var l in _GenderList) {
					db.executeSql('INSERT INTO tbl_Gender VALUES(?,?,?,?)', [
						_GenderList[_i].ID,
						_GenderList[_i].NAME,
						_GenderList[_i].Icons,
						1,
					]
					)
						.then(res => {
							console.log('Save');
						})
						.catch(e => {
							console.log(e);
						});
					_i = _i + 1;
				}
				/* tbl_AgeGroup */
				_i = 0;
				var _AgeGroupList = JSON.parse(res.AgeGroup);
				for (var l in _AgeGroupList) {
					db.executeSql('INSERT INTO tbl_AgeGroup VALUES(?,?,?,?,?)', [
						_AgeGroupList[_i].ID,
						_AgeGroupList[_i].NAME,
						_AgeGroupList[_i].Icons,
						1,
						_AgeGroupList[_i].Survey_ID,
					]
					)
						.then(res => {
							console.log('Save');
						})
						.catch(e => {
							console.log(e);
						});
					_i = _i + 1;
				}

				/* tbl_Religion */
				_i = 0;
				var _ReligionList = JSON.parse(res.Religion);
				for (var l in _ReligionList) {
					db.executeSql('INSERT INTO tbl_Religion VALUES(?,?,?,?)', [
						_ReligionList[_i].ID,
						_ReligionList[_i].NAME,
						_ReligionList[_i].Icons,
						1,
					]
					)
						.then(res => {
							console.log('Save');
						})
						.catch(e => {
							console.log(e);
						});
					_i = _i + 1;
				}
				/* tbl_SubCaste */
				_i = 0;
				var _SubCasteList = JSON.parse(res.SubCaste);
				for (var l in _SubCasteList) {
					db.executeSql('INSERT INTO tbl_SubCaste VALUES(?,?,?,?,?)', [
						_SubCasteList[_i].ID,
						_SubCasteList[_i].Religion_ID,
						_SubCasteList[_i].NAME,
						_SubCasteList[_i].Icons,
						1,
					]
					)
						.then(res => {
							console.log('Save');
						})
						.catch(e => {
							console.log(e);
						});
					_i = _i + 1;
				}
				/* tbl_LanguageRegional */
				_i = 0;
				var _LanguageRegionalList = JSON.parse(res.LanguageRegional);
				for (var l in _LanguageRegionalList) {
					db.executeSql('INSERT INTO tbl_LanguageRegional VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)', [
						_LanguageRegionalList[_i].ID,
						_LanguageRegionalList[_i].Language_ID,
						_LanguageRegionalList[_i].Regional_Language,
						_LanguageRegionalList[_i].Party_ID,
						_LanguageRegionalList[_i].Person_ID,
						_LanguageRegionalList[_i].Gender_ID,
						_LanguageRegionalList[_i].Age_Group_ID,
						_LanguageRegionalList[_i].Religion_ID,
						_LanguageRegionalList[_i].Caste_ID,
						_LanguageRegionalList[_i].Education_ID,
						_LanguageRegionalList[_i].Profession_ID,
						_LanguageRegionalList[_i].Question_ID,
						1,
					]
					)
						.then(res => {
							console.log('Save');
						})
						.catch(e => {
							console.log(e);
						});
					_i = _i + 1;
				}


				/* tbl_Education */
				_i = 0;
				var _EducationList = JSON.parse(res.Education);
				for (var l in _EducationList) {
					db.executeSql('INSERT INTO tbl_Education VALUES(?,?,?,?)', [
						_EducationList[_i].ID,
						_EducationList[_i].NAME,
						_EducationList[_i].Icons,
						1,
					]
					)
						.then(res => {
							console.log('Save');
						})
						.catch(e => {
							console.log(e);
						});
					_i = _i + 1;
				}
				/* tbl_Profession */
				_i = 0;
				var _ProfessionList = JSON.parse(res.Profession);
				for (var l in _ProfessionList) {
					db.executeSql('INSERT INTO tbl_Profession VALUES(?,?,?,?)', [
						_ProfessionList[_i].ID,
						_ProfessionList[_i].NAME,
						_ProfessionList[_i].Icons,
						1,
					]
					)
						.then(res => {
							console.log('Save');
						})
						.catch(e => {
							console.log(e);
						});
					_i = _i + 1;
				}

				/* tbl_PageMaster */
				_i = 0;
				var _PageMasterList = JSON.parse(res.PageMaster);
				for (var l in _PageMasterList) {
					db.executeSql('INSERT INTO tbl_PageMaster VALUES(?,?,?,?)', [
						_PageMasterList[_i].ID,
						_PageMasterList[_i].NAME,
						_PageMasterList[_i].Title,
						1,
					]
					)
						.then(res => {
							// this.ShowAlert(res);
							console.log('Save');
						})
						.catch(e => {
							// this.ShowAlert(e);

							console.log(e);
						});
					_i = _i + 1;
				}
				/* tbl_QuestionMaster */
				_i = 0;
				var _QuestionList = JSON.parse(res.QuestionMaster);
				for (var l in _QuestionList) {
					db.executeSql(`INSERT INTO tbl_QuestionMaster VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,
						?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [
							_QuestionList[_i].ID,
							_QuestionList[_i].Question,
							_QuestionList[_i].Language_ID,
							_QuestionList[_i].Question_ID,
							_QuestionList[_i].Option1,
							_QuestionList[_i].Option2,
							_QuestionList[_i].Option3,
							_QuestionList[_i].Option4,
							_QuestionList[_i].Option5,
							_QuestionList[_i].Option6,
							_QuestionList[_i].Option7,
							_QuestionList[_i].Option8,
							_QuestionList[_i].Option9,
							_QuestionList[_i].Option10,
							_QuestionList[_i].Option11,
							_QuestionList[_i].Option12,
							_QuestionList[_i].Option13,
							_QuestionList[_i].Option14,
							_QuestionList[_i].Option15,
							_QuestionList[_i].Option16,
							_QuestionList[_i].Option17,
							_QuestionList[_i].Option18,
							_QuestionList[_i].Option19,
							_QuestionList[_i].Option20,
							_QuestionList[_i].Option21,
							_QuestionList[_i].Option22,
							_QuestionList[_i].Option23,
							_QuestionList[_i].Option24,
							_QuestionList[_i].Option25,
							_QuestionList[_i].Option26,
							_QuestionList[_i].Option27,
							_QuestionList[_i].Option28,
							_QuestionList[_i].Option29,
							_QuestionList[_i].Option30,
							_QuestionList[_i].Question_Type_ID,
							1,
							0
							
						]).then(res => {
							console.log('Save');
						}).catch(e => {
							//alert(JSON.stringify(e))
							console.log(e);
						});
					_i = _i + 1;
				}

				/* tbl_QuestionResponse */
				_i = 0;
				var _QuestionResponseList = JSON.parse(res.QuestionResponse);
				for (var l in _QuestionResponseList) {
					db.executeSql('INSERT INTO tbl_QuestionResponse VALUES(?,?,?,?,?)', [
						_QuestionResponseList[_i].Question_ID,
						_QuestionResponseList[_i].OptionID,
						_QuestionResponseList[_i].Next_Question_ID,
						_QuestionResponseList[_i].Survey_ID,
						1
					])
						.then(res => {
							console.log('Save');
						})
						.catch(e => {
							//alert(JSON.stringify(e))
							console.log(e);
						});
					_i = _i + 1;
				}



				/* tbl_SurveyAssignQuestion */
				_i = 0;
				var _SurveyAssignQuestionList = JSON.parse(res.SurveyAssignQuestion);
				for (var l in _SurveyAssignQuestionList) {
					db.executeSql('INSERT INTO tbl_SurveyAssignQuestion VALUES(?,?,?,?,?)', [
						_SurveyAssignQuestionList[_i].Question_ID,
						_SurveyAssignQuestionList[_i].Survey_ID,
						_SurveyAssignQuestionList[_i].Survey_Name,
						1,
						9999
					])
						.then(res => {
							console.log('Save');
						})
						.catch(e => {

							console.log(e);
						});
					_i = _i + 1;
				}






			}
				, err => {
					loading.dismiss();
					this.ShowAlert('Something wrong, Please try again after some time');

				});


			this.webStorage.setValue("IsLoadData", "T");
			loading.dismiss();
			this.ShowAlert('Data Imported Successfully.');


		});

		return seq;



		/* this.sqlite.create({
		  name: 'surveydb.db',
		  location: 'default'
		}).then((db: SQLiteObject) => {
		  this._db=db;
		 }).catch(e => console.log(e));
		 this._db.executeSql('CREATE TABLE IF NOT EXISTS StateMaster(ID INTEGER PRIMARY KEY, Name TEXT)')
		 .then(res => console.log('Executed SQL'))
		 .catch(e => console.log(e));
	  
	  
	  
		this._db.executeSql('CREATE TABLE IF NOT EXISTS StateMaster(ID INTEGER PRIMARY KEY, Name TEXT)') */

	}
	GetStateList(UID: any) {
		var stateList: any = [];
		this.sqlite.create({
			name: 'surveydb.db',
			location: 'default'
		}).then((db: SQLiteObject) => {
			db.executeSql('CREATE TABLE IF NOT EXISTS StateMaster(ID INTEGER ,PID INTEGER,  Name TEXT, Code TEXT)', [])
				.then(res => console.log('Executed SQL'))
				.catch(e => console.log(e));
			db.executeSql('SELECT * FROM StateMaster ORDER BY ID ASC', [])
				.then(res => {
					stateList = [];
					//  alert(res.rows.length);
					//  alert('ID'+ res.rows.item(0).ID);
					//  alert('PID'+ res.rows.item(0).PID);
					//  alert('Name'+ res.rows.item(0).Name);
					//  alert('Code'+ res.rows.item(0).Code);
					for (var i = 0; i < res.rows.length; i++) {
						stateList.push({ ID: res.rows.item(i).ID, PID: res.rows.item(i).PID, Name: res.rows.item(i).Name, Code: res.rows.item(i).Code })
					}
					//return stateList;
				})
				.catch(e => {
					console.log(e);

				});
		}).catch(e => console.log(e));

		return stateList.share();
	}
	ShowAlert(Message: string, Title?: any) {
		let alert = this.alertCtrl.create({
			title: Title,
			message: Message,
			buttons: ['OK']
		});

		alert.present();
	}
	presentLoadingCustom() {
		let loading = this.loadingCtrl.create({

			content: '',
			duration: 5000
		});

		loading.onDidDismiss(() => {
			console.log('Dismissed loading');
		});

		loading.present();
	}
	HideLoadingCustom() {

	}

	SaveSurveyData(pkg) {

		//	alert(JSON.stringify(pkg));

		const loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		loading.present();
		let seq = this.api.post('PostData', JSON.stringify(pkg), this.headers).share();
		seq.subscribe(res => {

			loading.dismiss();

		},
			err => {

				loading.dismiss();
				//	this.ShowAlert(JSON.stringify(err));
				this.ShowAlert('Oops! Something went wrong, please try again');
			}

		)
		return seq;

	}


	UpdateUserProfile(pkg) {

		//	alert(JSON.stringify(pkg));

		const loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		loading.present();
		let seq = this.api.post('UpdateUserProfile', JSON.stringify(pkg), this.headers).share();
		seq.subscribe((res: any) => {

			if (res.status == 'success') {


				this.webStorage.setValue('MobileNo', res.users.MobileNo);
				this.webStorage.setValue('FName', res.users.FirstName);
				this.webStorage.setValue('LName', res.users.LastName);
				this.webStorage.setValue('Email', res.users.Email);

				this.webStorage.setValue('ImagePath', res.users.ImagePath);

				this.webStorage.setValue('MobileNo1', res.users.MobileNo1);
				this.webStorage.setValue('Address', res.users.Address);
				this.webStorage.setValue('Password', res.users.Password);
				this.webStorage.setValue('username', res);

			}

			loading.dismiss();

		},
			err => {

				loading.dismiss();
				//this.ShowAlert(JSON.stringify(err));
				this.ShowAlert('Oops! Something went wrong, please try again');
			}

		)
		return seq;

	}




	GetSurveyMaxLimit(SurveyID, UserID) {

		var MaxLimit: any = 0;
		this.sqlite.create({
			name: 'surveydb.db',
			location: 'default'
		}).then((db: SQLiteObject) => {

			db.executeSql('SELECT MaxLimit FROM SurveyMaster WHERE UserID = ' + UserID + ' AND ID = ' + SurveyID, [])
				.then(res => {
					if (res.rows.length > 0) {
						MaxLimit = res.rows.item(0).MaxLimit;
						alert('MaxLimit' + MaxLimit);
						return MaxLimit;
					}

				})

		}).catch(e => console.log(e));

		return MaxLimit;
	}
	GetSurveyPresentLimit(SurveyID, UserID) {
		var PresentLimit: any = 0;
		this.sqlite.create({
			name: 'surveydb.db',
			location: 'default'
		}).then((db: SQLiteObject) => {

			db.executeSql('SELECT PresentLimit FROM SurveyMaster WHERE UserID = ' + UserID + ' AND ID = ' + SurveyID, [])
				.then(res => {
					if (res.rows.length > 0) {
						PresentLimit = res.rows.item(0).PresentLimit;
						alert('PresentLimit' + PresentLimit);
						return PresentLimit;
					}

				})
		}).catch(e => {
			alert(e);
			console.log(e)
		});
		return PresentLimit;
	}
	UpdateSurveyPresentLimit(SurveyID, UserID, PresentLimit) {

		this.sqlite.create({
			name: 'surveydb.db',
			location: 'default'
		}).then((db: SQLiteObject) => {

			db.executeSql('UPDATE SurveyMaster SET PresentLimit = PresentLimit + ?  WHERE UserID = ? AND ID = ?', [PresentLimit, UserID, SurveyID])
				.then(res => {


				})

		}).catch(e => {
			//alert(e);
			console.log(e)
		}
		);



	}


	UpdateSurveyData_OtherFields(FiledsName, FiledsValue, MaxID) {

		this.sqlite.create({
			name: 'surveydb.db',
			location: 'default'
		}).then((db: SQLiteObject) => {

			db.executeSql('SELECT MAX(RowID) AS MaxID FROM SurveyData', [])
				.then(res => {
					if (res.rows.length > 0) {

						alert(res.rows.item(0).MaxID);

						setTimeout(() => {

						}, 200);

					}

				})
		}).catch(e => {
			alert(e);
			console.log(e)
		});




	}





}


