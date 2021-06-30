import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject, SQLiteDatabaseConfig } from '@ionic-native/sqlite';
import { CommonProvider } from '../common/common.provider';
export let SQLObj: any = new Object();

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {
  myAppDatabase: SQLiteObject;
  private dbConfig: SQLiteDatabaseConfig = {
    name: 'demo.db',
    location: 'default',
  };

  constructor(
    public http: HttpClient,
    public sqlite: SQLite,
    public commonProvider: CommonProvider
  ) {
    console.log('Hello DatabaseProvider Provider');
  }

  private init(): Promise<any> {
    let thisArea = this;
    let deviceFlag = this.commonProvider.checkDevice();
    if (deviceFlag) {
      return this.sqlite.create(thisArea.dbConfig).then((db) => {
        thisArea.myAppDatabase = db;
        return Promise.resolve(db);
      });
    } else {
      let thisArea = this;
      return new Promise((resolve, reject) => {
        if (thisArea.myAppDatabase == null) {
          thisArea.sqlite
            .create(thisArea.dbConfig)
            .then(
              (db: SQLiteObject) => {
                thisArea.myAppDatabase = db;
                return thisArea.createTables();
              },
              (error) => {
                console.log('ERROR: ', error);
                reject();
              }
            )
            .then(() => {
              resolve(true);
            });
        } else {
          resolve(false);
        }
      });
    }
  }

  public dbTransation(transactionList: Array<TransationDBDto>): Promise<any> {
    let deviceFlag = this.commonProvider.checkDevice();
    if (deviceFlag) {
      return this.init().then((db: SQLiteObject) => {
        return db.transaction((tx) => {
          transactionList.forEach((myTransition: TransationDBDto) => {
            if (myTransition.params.length > 0) {
              tx.executeSql(myTransition.sql, myTransition.params);
            } else {
              tx.executeSql(myTransition.sql);
            }
          });
        });
      });
    } else {
      return this.batchSqlOnBrowser(transactionList);
    }
  }

  public executeSql(transaction: TransationDBDto): Promise<any> {
    let deviceFlag = this.commonProvider.checkDevice();
    if (deviceFlag) {
      let promise: Promise<any> = this.init().then((db: SQLiteObject) => {
        return db.executeSql(transaction.sql, transaction.params);
      });
      return promise;
    } else {
      return this.executeSqlOnBrowser(transaction);
    }
  }

  private batchSqlOnBrowser(transationList: Array<TransationDBDto>) {
    let thisArea = this;
    return this.executeSqlOnBrowser({ sql: 'BEGIN TRANSACTION;', params: [] })
      .then(() => {
        let promiseArray: Array<Promise<any>> = [];
        transationList.forEach((transaction) => {
          if (transaction.params.length > 0) {
            promiseArray.push(thisArea.myAppDatabase.executeSql(transaction.sql, transaction.params));
          } else {
            promiseArray.push(thisArea.myAppDatabase.executeSql(transaction.sql));
          }
        });
        return Promise.all(promiseArray);
      })
      .then(() => {
        return thisArea.executeSqlOnBrowser({ sql: 'COMMIT;', params: [] });
      })
      .catch((err) => {
        console.error(err);
        console.error('ERRROR SQL:' + transationList[0].sql);
        thisArea.executeSqlOnBrowser({ sql: 'ROLLBACK;', params: [] });
        return Promise.reject(err);
      });
  }

  private executeSqlOnBrowser(transaction: TransationDBDto): Promise<any> {
    let thisArea = this;
    return this.init().then(() => {
      if (transaction.params.length > 0) {
        return thisArea.myAppDatabase.executeSql(transaction.sql, transaction.params);
      } else {
        return thisArea.myAppDatabase.executeSql(transaction.sql);
      }
    });
  }

  public exportDB() {
    if (!this.commonProvider.checkDevice()) {
      var binaryArray = SQLObj.SQLObj.db.export();
      var buffer = new Buffer(binaryArray);
      var blob = new Blob([buffer]);
      var a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = 'demo.db';
      a.onclick = function () {
        setTimeout(function () {
          window.URL.revokeObjectURL(a.href);
        }, 1500);
      };
    a.click();
    }
  }

  public createTables() {
    let transactionList: Array<TransationDBDto> = [];
    let createSql: string;
    let transactionObj: TransationDBDto;
    
    createSql =
      ' CREATE TABLE \n' +
      ' IF NOT EXISTS user ( \n' +
      "	'ID' INTEGER, \n" +
      "	'Account' varchar, \n" +
      "	'Email' varchar, \n" +
      "	'UserName' varchar, \n" +
      "	'Password' varchar, \n" +
      "	PRIMARY KEY ('ID') \n" +
      ' );';
    transactionObj = {
      sql: createSql,
      params: [],
    };
    transactionList.push(transactionObj);
    return this.dbTransation(transactionList);
  }

  insertUserInfo(userInfo) {
    let sql =
        ' INSERT INTO user \n' +
        ' ( \n' +
        ' Account, \n' +
        ' Email, \n' +
        ' UserName, \n' +
        ' Password \n' +
        ' ) \n' +
        ' VALUES \n' +
        ' (?,?,?,?)';
      let params = [
        userInfo.Account,
        userInfo.Email,
        userInfo.UserName,
        userInfo.Password
      ];
      let transactionObj = {
        sql: sql,
        params: params,
      };
      return this.executeSql(transactionObj);
  }

  queryUserInfo(userInfo) {
    let sql =
      ' SELECT * FROM user WHERE Account = ? AND Password = ?';

    let param = [
      userInfo.Account,
      userInfo.Password
    ];
    let transactionObj = {
      sql: sql,
      params: param,
    };
    return this.executeSql(transactionObj);
  }

}
