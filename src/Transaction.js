/*
 * Copyright 2017 dialog LLC <info@dlg.im>
 * @flow
 */

import type { IDBTransaction } from './types';
import ObjectStore from './ObjectStore';

class Transaction {
  trx: IDBTransaction;

  constructor(trx: IDBTransaction) {
    this.trx = trx;
  }

  getStore<K, V>(storeName: string): ObjectStore<K, V> {
    return new ObjectStore(this.trx.objectStore(storeName));
  }
}

export default Transaction;
