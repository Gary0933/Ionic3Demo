import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from "ionic-angular";

/*
  Finger And Face validate
  ionic cordova plugin add cordova-plugin-fingerprint-aio@^3.0.1
  npm install --save @ionic-native/fingerprint-aio@^4.20.0
*/
import { FingerprintAIO } from "@ionic-native/fingerprint-aio";


@Injectable()
export class BiometricProvider {

  constructor(
    public http: HttpClient,
    public faio: FingerprintAIO,
    public platform: Platform
  ) {
    console.log('Hello TouchProvider Provider');
  }

  public checkBiometricEnable() {
    if (this.platform.is("cordova")) {
      return this.faio
        .isAvailable()
        .then((res) => {
          if (res === "finger" || res === "face" || res === "biometric") {
            return Promise.resolve(true);
          } else {
            return Promise.resolve(false);
          }
        })
        .catch((error) => {
          console.log("Check Biometric Enable Failed : " + error);
          return Promise.resolve(false);
        });
    } else {
      return Promise.resolve(false);
    }
  }

  public validateByBiometric() {
    let obj = {
      clientId: "MyApp",
      clientSecret: "test", //Only necessary for Android
      disableBackup: true, //Only for Android(optional)
      localizedFallbackTitle: "Use Pin", //Only for iOS
      localizedReason: "Please Authenticate", //Only for iOS
    };
    return this.faio
      .show(obj)
      .then((res) => {
        if (res == "Success") {
          return Promise.resolve(true);
        } else {
          return Promise.resolve(false);
        }
      })
      .catch((error) => {
        console.log("Validate Biometric Failed : " + error);
        return Promise.resolve(false);
      });
  }

}
