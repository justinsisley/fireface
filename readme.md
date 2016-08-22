# Fireface

[![licence mit](https://img.shields.io/badge/licence-MIT-blue.svg)](https://github.com/justinsisley/fireface/blob/master/LICENSE)

> A convenient interface for [Firebase](https://firebase.google.com/) developers.

## Purpose

Firebase is an excellent tool to have in the developer's kit, and while its standard interface is robust, it can be helpful to have some simple abstractions for common patterns, such as fetching data one time, setting and updating records, and performing queries against your database.

Fireface is designed to work with your Node.js server, and is configured using a service account, meaning your API doesn't need any special rules to access your Firebase database. Note that this also means Fireface and read, write, and delete any data, so you'll need to manage your own access control logic on your server.

> Warning: don't use this library in a client-side web application. It's too exploitable.

## Installation

Install as a local dependency:

```bash
npm install -S fireface
```

## Setup

Fireface requires you to set up a [Firebase project](https://console.firebase.google.com/) and a [service account](https://firebase.google.com/docs/server/setup). When setting up your service account, make sure to download the credentials as a JSON file.

Once your project and account are set up, put your credentials JSON into your project, for example `config/firebase/credentials.json`. It's recommended that you add this file to your .gitignore, since this file contains sensitive account information. If you need per-environment configuration, [Marshall](https://github.com/justinsisley/marshall) can help.

## Usage

```javascript
const ff = require('fireface');

// Initialize Fireface/Firebase
ff.initializeApp({
  serviceAccount: path.join(__dirname, '../config/firebase/credentials.json'),
  databaseURL: 'https://my-firebase-database.firebaseio.com',
});

// Get a ref
ff.get('users/1234')
.then(user => {
  console.log(user);
});

// Create a ref
// WARNING: this will overwrite the entire ref.
ff.post('users/1234', {
  name: 'bob',
  admin: true,
}).then(() => {
  console.log('user 1234 created');
}).catch(err => {
  console.log('failed to create user 1234', err);
});

// Update a ref
ff.put('users/1234', {
  name: 'bobby',
}).then(() => {
  console.log('user 1234 updated');
}).catch(err => {
  console.log('failed to update user 1234', err);
});

// Delete a ref
ff.delete('users/1234').then(() => {
  console.log('user 1234 deleted');
});

// Get a new unique ID for a ref
const newUserId = ff.getKey('users');
// Create a user with the new ID
ff.post(`users/${newUserId}`, {
  id: newUserId,
  name: 'mary',
  admin: false,
}).then(() => {
  console.log('created new user');
});

// Perform a query on a ref
ff.find('users', { name: 'mary' })
.then(result => {
  console.log('found', result);
});

// Update multiple refs at one time
ff.update({
  'users/1234': { admin: false },
  `users/${newUserId}`: { admin: true },
}).then(() => {
  console.log('updated multiple users');
});
```

## Versioning

To keep better organization of releases this project follows the [Semantic Versioning 2.0.0](http://semver.org/) guidelines.

## Contributing
Want to contribute? [Follow these recommendations](https://github.com/justinsisley/fireface/blob/master/CONTRIBUTING.md).

## License
[MIT License](https://github.com/justinsisley/fireface/blob/master/LICENSE.md) © [Justin Sisley](http://justinsisley.com/)