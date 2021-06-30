import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { BiometricProvider } from '../../providers/biometric/biometric';
import { DatabaseProvider } from '../../providers/database/database.provider';
import { User } from '../../providers';
import { MainPage } from '../';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { account: string, password: string } = {
    account: '',
    password: ''
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public biometricProvider: BiometricProvider,
    public databaseProvider: DatabaseProvider
  ) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  // Attempt to login in through our User service
  doLogin() {
    return this.loginValidation()
    .then((res) => {
      if (res) {
        this.navCtrl.push(MainPage);
      } else {
        let toast = this.toastCtrl.create({
          message: this.loginErrorString,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
    })
  }

  biometricLogin() {
    this.biometricProvider.checkBiometricEnable() // check if device support biometric
    .then((res) => {
      if (res === true) {
        return this.biometricProvider.validateByBiometric();
      } else {
        return Promise.resolve(false);
      }
    })
    .then((res) => {
      if (res === true) {
        this.navCtrl.push(MainPage);
      }
    })
  }

  loginValidation() {
    let obj = {
      Account: this.account.account,
      Password: this.account.password
    }
    return this.databaseProvider.queryUserInfo(obj)
    .then((res) => {
      if (res.rows.length > 0) {
        return Promise.resolve(true);
      } else {
        return Promise.resolve(false);
      }
    })
  }

}
