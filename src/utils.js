/*
 * Copyright 2017 dialog LLC <info@dlg.im>
 * @flow
 */

import type { IDBDatabase, IDBFactory, IDBRequest, IDBOpenDBRequest } from './types';

export type UpgradeCallback = (db: IDBDatabase, oldVersion: number, newVersion: ?number) => void;

const indexedDB: IDBFactory = self.indexedDB || self.mozIndexedDB || self.webkitIndexedDB || self.msIndexedDB;

export function promisifyRequest<V>(request: IDBRequest<V>): Promise<V> {
  return new Promise((resolve, reject) => {
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function promisifyOpenRequest(request: IDBOpenDBRequest): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export function connect(name: string, version: number, onUpgrade: UpgradeCallback): Promise<IDBDatabase> {
  return Promise.resolve().then(() => {
    const request = indexedDB.open(name, version);

    request.onupgradeneeded = (event) => {
      onUpgrade(
        request.result,
        event.oldVersion,
        event.newVersion
      );
    };

    return promisifyOpenRequest(request);
  });
}

export function deleteDatabase(name: string): Promise<IDBDatabase> {
  return promisifyOpenRequest(indexedDB.deleteDatabase(name));
}

export function once<T: Function>(callback: T) {
  let isCalled = false;
  return (...args: Array<*>) => {
    if (!isCalled) {
      try {
        callback.apply(null, args);
      } finally {
        isCalled = true;
      }
    }
  };
}
