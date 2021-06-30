import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database.provider';
import { User } from '../../providers';
import { MainPage } from '../';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { name: string, account: string, password: string, email: string } = {
    name: '',
    account: '',
    password: '',
    email: ''
  };

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public databaseProvider: DatabaseProvider
  ) {
  }

  doSignup() {
    return this.saveRegisterInfo()
    .then((res) => {
      this.navCtrl.push(MainPage);
    })
  }

  saveRegisterInfo() {
    let obj = {
      Account: this.account.account,
      Email: this.account.email,
      UserName: this.account.name,
      Password: this.account.password
    }
    return this.databaseProvider.insertUserInfo(obj);
  }
}
