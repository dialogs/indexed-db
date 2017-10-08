/*
 * Copyright 2017 dialog LLC <info@dlg.im>
 * @flow
 */

import type {
  IDBDatabase,
  IDBTransaction,
  IDBObjectStore,
  IDBIndex,
  IDBKeyRange,
  IDBCursor,
  IDBCursorWithValue
} from './types';
import Database from './Database';
import ObjectStore from './ObjectStore';
import Transaction from './Transaction';

export type {
  IDBDatabase,
  IDBTransaction,
  IDBObjectStore,
  IDBIndex,
  IDBKeyRange,
  IDBCursor,
  IDBCursorWithValue
};

export default Database;

export { ObjectStore, Transaction };
