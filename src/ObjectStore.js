/*
 * Copyright 2017 dialog LLC <info@dlg.im>
 * @flow
 */

import type { IDBObjectStore } from './types';
import { promisifyRequest } from './utils';

class ObjectStore<K, V> {
  store: IDBObjectStore<K, V>;

  constructor(store: IDBObjectStore<K, V>) {
    this.store = store;
  }

  get(key: K): Promise<?V> {
    return promisifyRequest(this.store.get(key));
  }

  add(value: V, key?: ?K): Promise<void> {
    return promisifyRequest(this.store.add(value, key));
  }

  put(value: V, key?: K): Promise<void> {
    return promisifyRequest(this.store.put(value, key));
  }

  clear(): Promise<void> {
    return promisifyRequest(this.store.clear());
  }

  delete(key: K): Promise<void> {
    return promisifyRequest(this.store.delete(key));
  }

  deleteIn(keys: K[]): Promise<void[]> {
    return Promise.all(keys.map((key) => this.delete(key)));
  }

  deleteAllByIndex(indexName: string, key: K): Promise<void> {
    return new Promise((resolve, reject) => {
      const index = this.store.index(indexName);
      const request = index.openCursor(key);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        const cursor = request.result;

        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
    });
  }

  updateIfExists(key: K, update: $Shape<V>): Promise<void> {
    return this.get(key).then((value: ?V) => {
      if (value) {
        Object.assign(value, update);
        return this.put(value);
      }
    });
  }
}

export default ObjectStore;
