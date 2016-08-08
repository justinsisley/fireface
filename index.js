const firebase = require('firebase');

const fireface = {
  initialized: false,

  /**
   * Ensure Fireface/Firebase has been initialized before allowing calls
   */
  validateInitialization() {
    if (!this.initialized) {
      throw new Error('Fireface not initialized');
    }
  },

  /**
   * Initialize Fireface/Firebase
   */
  initializeApp(options) {
    if (!options.serviceAccount) {
      throw new Error('Missing serviceAccount');
    }

    if (!options.databaseURL) {
      throw new Error('Missing databaseURL');
    }

    // Establish firebase connection
    firebase.initializeApp(options);

    this.initialized = true;
  },

  /**
   * Helpers
   */
  getRef(ref) {
    return firebase.database().ref(ref);
  },
  getValue(ref) {
    return this.getRef(ref).once('value');
  },

  /**
   * Read from a specific ref one time
   * Similar to a get
   *
   * @param  {String} ref  The ref. E.g. 'posts/52'
   * Example:
   * get('users/12345').then(...)
   */
  get(ref) {
    this.validateInitialization();

    return new Promise((resolve, reject) => {
      this.getValue(ref)
      .then(snapshot => resolve(snapshot.val()))
      .catch(reject);
    });
  },

  /**
   * Set the value of a specific ref
   * Similar to a post or put
   *
   * @param  {String} ref  The ref. E.g. 'posts/52'
   * @param  {Object} body The new value of the ref
   * @return {Promise}     A promise
   *
   * Example:
   * post('users/12345', { year: '1952', make: 'human' }).then(...)
   */
  post(ref, body) {
    this.validateInitialization();

    return new Promise((resolve, reject) => {
      this.getRef(ref)
      .set(body)
      .then(resolve)
      .catch(reject);
    });
  },

  /**
   * Update many fields at once using an object
   * Similar to a post or put
   *
   * @param  {Object} updates  Key/value pairs of updates: { ref, value }
   * @return {Promise}         A promise
   *
   * Example:
   * update({
   *   '/posts/' + newPostKey: postData,
   *   '/user-posts/' + uid + '/' + newPostKey: postData,
   * }).then(...)
   */
  update(updates) {
    this.validateInitialization();

    return new Promise((resolve, reject) => {
      firebase.database()
      .ref()
      .update(updates)
      .then(resolve)
      .catch(reject);
    });
  },

  /**
   * Delete a specific ref
   * Similar to a delete
   *
   * @param  {String} ref  The ref. E.g. 'posts/52'
   * Example:
   * delete('posts/52').then(...)
   */
  delete(ref) {
    this.validateInitialization();

    return new Promise((resolve, reject) => {
      this.getRef(ref)
      .remove()
      .then(resolve)
      .catch(reject);
    });
  },

  /**
   * Get a new unique key for a given child.
   *
   * @param  {String} child Name of list ref to generate a new item for
   * @return {String}       A new unique key for the specified child ref
   *
   * Example:
   * const newPostKey = getKey('posts');
   */
  getKey(child) {
    this.validateInitialization();

    return firebase.database()
    .ref()
    .child(child)
    .push()
    .key;
  },

  /**
   * Perform a query against a specified ref
   * Similar to a get
   *
   * @param  {String} ref    The ref. E.g. 'users'
   * @param  {Object} query  Key/value pair query: { ref, value }
   * Example:
   * find('users', { email: 'bob@gmail.com' }).then(...)
   */
  find(ref, query) {
    this.validateInitialization();

    const queryKey = Object.keys(query)[0];
    const queryValue = query[queryKey];

    return new Promise((resolve, reject) => {
      this.getRef(ref)
      .orderByChild(queryKey)
      .equalTo(queryValue)
      .once('value')
      .then(snapshot => resolve(snapshot.val()))
      .catch(reject);
    });
  },
};

module.exports = fireface;
