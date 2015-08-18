"use strict";
/* globals AccountsAnonymousUi: true */

AccountsAnonymousUi = {};

// Remember the official Meteor versions of the functions we will be
// monkey patching.
var meteorUserIdFunc = Meteor.userId;

// A version of Meteor.userId() that returns null for anonymous users.
var noAnonUserIdFunc = function() {
  var meteorUserId = meteorUserIdFunc.call(Meteor);
  if (!meteorUserId) {
    return null;
  }
  var user = Meteor.users.findOne(meteorUserId);
  if (!user) {
    // Meteor.userId() was not null, but the userId wasn't found locally. That
    // only happens before startup has finished and the Meteor.users
    // subscription is not yet ready. So, just act like regular Meteor.userId()
    // in this case (i.e. assume the user is not anonymous).
    return meteorUserId;
  }
  // If the user has a username, a profile.name, or at least one email address,
  // then they aren't anonymous, so return them.
  if (typeof(user.username) === 'string' ||
    user.profile && typeof(user.profile.name) === 'string' ||
    (user.emails && user.emails.length > 0 &&
      typeof(user.emails[0].address) === 'string')) {
    return user._id;
  }
  // The user is anonymous, so return null
  return null;
};

// A version of Meteor.user() that returns null for anonymous users.
var noAnonUserFunc = function() {
  var userId = noAnonUserIdFunc.call(Meteor);
  if (!userId) {
    return null;
  }
  var user = Meteor.users.findOne(userId);
  return (user ? user : null);
};

/** Returns a function that will execute the passed function with a version
 * `Meteor.userId()` and `Meteor.user()` that return null for anonymous users.
 * @param {Function} func - the function to wrap.
 * @returns {Function} - the wrapped function
 */
AccountsAnonymousUi.wrapWithNoAnon = function(func) {
  return function( /*arguments*/ ) {
    var savedUserIdFunc = Meteor.userId;
    var savedUserFunc = Meteor.user;
    Meteor.userId = noAnonUserIdFunc;
    Meteor.user = noAnonUserFunc;
    try {
      return func.apply(this, arguments);
    } finally {
      Meteor.userId = savedUserIdFunc;
      Meteor.user = savedUserFunc;
    }
  };
};
