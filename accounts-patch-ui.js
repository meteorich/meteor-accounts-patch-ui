"use strict";
/* globals AccountsPatchUi: true, LoginState */

// Remember the official Meteor versions of the functions we will be
// monkey patching.
var meteorUserIdFunc = Meteor.userId;
var meteorUserFunc = Meteor.user;

// A version of Meteor.userId() that returns null for users who have not signed
// up
var signedUpUserIdFunc = function() {
  var meteorUserId = meteorUserIdFunc.call(Meteor);
  if (!meteorUserId) {
    return null;
  }
  var user = Meteor.users.findOne(meteorUserId);
  if (!user) {
    // Meteor.userId() was not null, but the userId wasn't found locally. That
    // only happens before startup has finished and the Meteor.users
    // subscription is not yet ready. So, just act like regular Meteor.userId()
    // in this case (i.e. assume the user is signed up).
    return meteorUserId;
  }
  if (LoginState.signedUp()) {
    return meteorUserId;
  }
  return null;
};

// A version of Meteor.user() that returns null for user who have not signed up
var signedUpUserFunc = function() {
  if (LoginState.signedUp()) {
    return meteorUserFunc.call(Meteor);
  }
  return null;
};

function AccountsPatchUiConstructor() {
}

_.extend(AccountsPatchUiConstructor.prototype, {
  /** Returns a function that will execute the passed function with a version
   * `Meteor.userId()` and `Meteor.user()` that return null for users who have not
   * signed up.
   * @param {Function} func - the function to wrap.
   * @returns {Function} - the wrapped function
   */
  wrapWithSignedUp: function(func) {
    return function( /*arguments*/ ) {
      var savedUserIdFunc = Meteor.userId;
      var savedUserFunc = Meteor.user;
      Meteor.userId = signedUpUserIdFunc;
      Meteor.user = signedUpUserFunc;
      try {
        return func.apply(this, arguments);
      } finally {
        Meteor.userId = savedUserIdFunc;
        Meteor.user = savedUserFunc;
      }
    };
  },

  _signedUpUser: signedUpUserFunc,

  _wrapTemplateWithSignedUp: function(template) {
    var self = this;
    if (! template) {
      return;
    }
    self._wrapMethodsWithSignedUp(template.__helpers);
    if (! _.isArray(template.__eventMaps)) {
      throw new TypeError('__eventMaps not an Array');
    }
    _.each(template.__eventMaps, function(value, index, eventMaps) {
      self._wrapMethodsWithSignedUp(eventMaps[index]);
    });
  },

  _wrapMethodsWithSignedUp: function(obj) {
    if (obj === undefined) {
      return;
    }
    if (! _.isObject(obj)) {
      throw new TypeError('Not an object');
    }
    _.each(obj, function(value, key) {
      if (_.isFunction(value)) {
        obj[key] = AccountsPatchUi.wrapWithSignedUp(value);
      }
    });
  }
});

AccountsPatchUi = new AccountsPatchUiConstructor();
