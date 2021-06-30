import { ENV } from '../../environments/environment'
/*
  SQLite
  ionic cordova plugin add cordova-sqlite-storage
  npm install --save @ionic-native/sqlite@^4.20.0
*/
import { SQLite, SQLiteDatabaseConfig } from '@ionic-native/sqlite';
/*
  sql.js install on developer mode
  npm install @types/sql.js@^1.0.3 --save-dev
  npm install sql.js --save-dev
  go to node_modules/sql.js/dist, copy sql-wasm.wasm to assets folder
  npm install @types/node@12.12.6 --save-dev
*/
import * as initSqlJs from 'sql.js';
import { SqlJs } from 'sql.js/module';
import * as SQLObj from '../providers/database/database.provider';


export function SqliteMockFactory() {
  if (ENV.cordova_dependence) {
    console.log('Get Native SQLITe Mode plugin');
    return new SQLite();
  } else {
    console.log('Get Mock SQLITe Mode plugin');
    return new SQLiteMock();
  }
}

export class SQLiteMock {
  public create(_config: SQLiteDatabaseConfig): Promise<SQLiteObject> {
    var config = {
      locateFile: (_filename) => `assets/sql-wasm.wasm`,
    };
    return initSqlJs(config).then(function (SQL) {
      var db = new SQL.Database();
      SQLObj.SQLObj.db = db;
      return new SQLiteObject(db);
    });
  }
}

class SQLiteObject {
  _objectInstance: SqlJs.Database;

  constructor(_objectInstance: SqlJs.Database) {
    this._objectInstance = _objectInstance;
  }

  executeSql(statement: string, params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        if (params && params.length) {
          for (var i = 0; i < params.length; i++) {
            if (params[i] === undefined) {
              params[i] = '';
            }
          }
        }
        var stmt: SqlJs.Statement = this._objectInstance.prepare(statement, params);
        var rows: Array<any> = [];
        while (stmt.step()) {
          var row = stmt.getAsObject();
          rows.push(row);
        }
        var payload = {
          rows: {
            item: function (i) {
              return rows[i];
            },
            length: rows.length,
          },
          rowsAffected: this._objectInstance.getRowsModified() || 0,
          raw: rows,
        };
        resolve(payload);
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });
  }
}
