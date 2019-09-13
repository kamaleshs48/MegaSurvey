import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events } from 'ionic-angular';

import { User } from '../../providers/user/user';
import { Camera } from '@ionic-native/camera';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThrowStmt } from '@angular/compiler/src/output/output_ast';
import { Settings } from '../../providers';
/**
 * Generated class for the MyProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var navigator: any;
@IonicPage()
@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
})
export class MyProfilePage {

  authForm: FormGroup;
  u: { FirstName: string, LastName: string, MobileNo: string,
     Email: string, password: string, UID: number, ImagePath: string 
     ,Address:string,AlternateMobileNo: string
     ,
    } =
    {
      FirstName: '',
      LastName: '',
      Email: '',
      MobileNo: '',
      password: '',
      UID: 0,
      ImagePath: '',
      Address:'',
      AlternateMobileNo:''



    }

  Name: any;
  UID: any;
  Email: any;
  OEmail: any;
  MobileNo: any;
  form: FormGroup;
  FaceBook: any;
  LinkedIn: any;
  profilePic: any;
  IMG: any;
  PPValue: number;
  PAN: string;
  TotalRide: number = 0;
  @ViewChild('fileInput') fileInput;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public settings: Settings, public camera: Camera, formBuilder: FormBuilder,
    public users: User,
    public toastCtrl: ToastController,
    private events: Events,

  ) {
    this.PPValue = 0;

    this.authForm = formBuilder.group({
      FirstName: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)])],
      LastName: [''],
      Email: [''],
      MobileNo: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      Address: [''],
      AlternateMobileNo: [''],

    });


    this.settings.load().then(() => {
      this.settings.getValue('UID').then(r => {
        this.UID = r;
        this.u.UID = r;
      });
      this.settings.getValue('MobileNo').then(r => {
        this.u.MobileNo = r;
      });
      this.settings.getValue('FName').then(r => {
        this.u.FirstName = r;
      });
      this.settings.getValue('LName').then(r => {
        this.u.LastName = r;
      });
      this.settings.getValue('Email').then(r => {
        this.u.Email = r;
      });
      this.settings.getValue('ImagePath').then(r => {
        this.profilePic = r;
      });
      this.settings.getValue('Address').then(r => {
        this.u.Address = r;
      });
      this.settings.getValue('MobileNo1').then(r => {
        this.u.AlternateMobileNo = r;
      });
      this.Name = this.u.FirstName + ' ' + this.u.LastName;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyProfilePage');
  }

  getPicture() {
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 96,
        targetHeight: 96
      }).then((data) => {
        this.profilePic = 'data:image/jpg;base64,' + data;
        this.IMG = data;
        // this.form.patchValue({ 'profilePic': 'data:image/jpg;base64,' + data });
      }, (err) => {
        alert('Unable to take photo');
      })
    } else {
      this.fileInput.nativeElement.click();
    }
  }
  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {

      let imageData = (readerEvent.target as any).result;
      this.profilePic = imageData;
      this.IMG = imageData.split(',')[1];
      //this.form.patchValue({ 'profilePic': imageData });
    };

    reader.readAsDataURL(event.target.files[0]);
  }
  ProfileUpdate() {




    if (this.u.FirstName == '') {
      this.users.ShowAlert('Please enter Name.');
      return;
    }
    if (this.u.Email == '') {
      this.users.ShowAlert('Please enter Email.');
      return;
    }

    var networkState = navigator.connection.type;
    if (networkState == 'none') {
      this.users.ShowAlert('Please check your internet connection')
      return;
    };


    /* this.users.ShowAlert(this.UID,this.Name,this.MobileNo,
      this.Email,this.OEmail,this.FaceBook,this.LinkedIn,this.IMG,this.PAN,this.PPValue)
     this.users.ShowTostMessage('Profile updated successfully.')
    this. UpdateProfilePercentage() */



    this.u.ImagePath = this.IMG;
    this.users.UpdateUserProfile(this.u).subscribe((resp: any) => {
      if (resp.status == 'success') {
        this.events.publish('username:changed', resp);
        this.events.publish('username:changed', resp);
        this.users.ShowAlert('Profile Updated Successfully');
      }
      else {
        this.users.ShowAlert('Oops! Something went wrong, please try again');
      }
    });
  }
  ChangePassword()
  {
     this.navCtrl.push('ChangePasswordPage');
  }

}