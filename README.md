Indexed DB
==========

IndexedDB wrapper for dialog projects

Installation
------------

```
yarn add @dlghq/indexed-db
```
or
```
npm install @dlghq/indexed-db
```

Usage
-----

```js
import Database, { type IDBDatabase } from '@dlghq/indexed-db';

const db = new Database({
  name: 'dialog',
  version: 1,
  onUpgrade(db: IDBDatabase, oldVersion: number, newVersion: ?number) {
    
  }
});

db.read(['users'], (trx) => {
  const users = trx.getStore('users');
  
  return users.get(123);
}).then((user) => {
  console.log(user);
});
```

License
-------
[Apache-2.0](LICENSE)
