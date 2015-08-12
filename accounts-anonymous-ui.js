AccountsAnonymousUi = {};

AccountsAnonymousUi.meteorUserId = Meteor.userId;
AccountsAnonymousUi.meteorUser = Meteor.user;

AccountsAnonymousUi.userId = function () {
  var meteorUserId = AccountsAnonymousUi.meteorUserId();
  if (! meteorUserId) {
    return null;
  }
  var user = Meteor.users.findOne(meteorUserId);
  if (! user) {
    return null;
  }
  // If the user has a username, a profile.name, or at least one email address,
  // then they aren't anonymous, so return them.
  if (typeof(user.username) === 'string'
      || user.profile && typeof(user.profile.name) === 'string'
      || (user.emails && user.emails.length > 0
          && typeof(user.emails[0].address) === 'string')) {
    return user._id;
  }
  // The user is anonymous, so return null
  return null;
};

AccountsAnonymousUi.user = function () {
  var userId = AccountsAnonymousUi.userId();
  if (userId == null) {
    return null;
  }
  return Meteor.users.findOne(userId);
};

AccountsAnonymousUi.withFakedUser = function (func) {
  return function (/*arguments*/) {
    var meteorUserId = Meteor.userId;
    var meteorUser = Meteor.user;
    Meteor.userId = AccountsAnonymousUi.userId;
    Meteor.user = AccountsAnonymousUi.user;
    try {
       return func.apply(this, arguments);
    } finally {
      Meteor.userId = meteorUserId;
      Meteor.user = meteorUser;
    }
  };
}
