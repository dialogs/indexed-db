/*
 * Copyright 2017 dialog LLC <info@dlg.im>
 * @flow
 */

import type { IDBDatabase } from './types';
import type { UpgradeCallback } from './utils';
import Transaction from './Transaction';
import { once, connect, deleteDatabase } from './utils';

type Config = {
  name: string,
  version: number,
  onUpgrade: UpgradeCallback
};

type TransactionMode = 'readonly' | 'readwrite';
type Executor<T> = (trx: Transaction) => Promise<T>;

class Database {
  name: string;
  connection: Promise<IDBDatabase>

  constructor(config: Config) {
    this.name = config.name;
    this.connection = connect(config.name, config.version, config.onUpgrade);
  }

  ready(): Promise<IDBDatabase> {
    return this.connection;
  }

  transaction<T>(
    mode: TransactionMode,
    storeNames: string[],
    callback: Executor<T>
  ): Promise<?T> {
    return this.ready().then((db) => {
      return new Promise((resolve, _reject) => {
        const reject = once(_reject);

        const trx = db.transaction(storeNames, mode);

        let result: ?T = null;
        let isFinished = false;

        trx.onerror = () => reject(trx.error);
        trx.onabort = () => reject(trx.error);
        trx.oncomplete = () => {
          if (isFinished) {
            resolve(result);
          } else {
            reject(new Error('Transaction completed but not finished'));
          }
        };

        callback(new Transaction(trx)).then((_result) => {
          isFinished = true;
          result = _result;
        }, (error) => {
          reject(error);
        });
      });
    });
  }

  read<T>(storeNames: string[], callback: Executor<T>): Promise<?T> {
    return this.transaction('readonly', storeNames, callback);
  }

  write<T>(storeNames: string[], callback: Executor<T>): Promise<?T> {
    return this.transaction('readwrite', storeNames, callback);
  }

  delete(): Promise<IDBDatabase> {
    return this.ready().then((db) => {
      db.close();

      return deleteDatabase(this.name);
    });
  }
}

export default Database;
