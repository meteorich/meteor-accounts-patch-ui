"use strict";
/* globals AccountsAnonymous, AccountsTemplates, FlowRouter, Iron, 
   AccountsPatchUi */
Tinytest.addAsync(
  'AccountsPatchUi - wrapWithSignedUp() does not exceed call stack size',
  function(test, done) {
    Meteor.logout(function(err) {
      test.isUndefined(err, 'No logout error');
      AccountsAnonymous.login(function(err) {
        var userId = Meteor.userId();
        var user = Meteor.user();
        test.isUndefined(err, 'No login error');
        _.wrap(
          AccountsPatchUi.wrapWithSignedUp(function () {
            test.isNull(Meteor.userId(), 'Meteor.userId() should return null');
            test.isNull(Meteor.user(), 'Meteor.user() should return null');
          }),
          function (func) {
            var origFindOne = Meteor.users.findOne;
            Meteor.users.findOne = function (/*arguments*/) {
              var savedFindOne = Meteor.users.findOne;
              Meteor.users.findOne = origFindOne;
              try {
                test.equal(Meteor.userId(), userId, 'Meteor.userId() correct');
                test.equal(Meteor.user(), user, 'Meteor.user() correct');
                return origFindOne.apply(Meteor.users, arguments);
              } finally {
                Meteor.users.findOne = savedFindOne;
              }
            };
            var retval = func.apply(this, _.rest(_.toArray(arguments)));
            Meteor.users.findOne = origFindOne;
            return retval;
          })();
        done();
      });
    });
  }
);

Tinytest.add(
  'AccountsPatchUi - accounts-ui loginButtons is clickable',
  function (test) {
    var mapWithClickEvent =
      _.find(Template.loginButtons.__eventMaps, function (map) {
        return _.find(_.keys(map), function (selector) {
          var re = /^click/;
          return re.test(selector);
        });
      }
    );

    test.isNotUndefined(mapWithClickEvent, 'No click event found');
  }
);

Tinytest.addAsync(
  'AccountsPatchUi - accounts-ui loginButtons shows Sign In when anonymous',
  function(test, done) {
    test.isNotUndefined(Template.loginButtons, 'Template.loginButtons');
    if (!Template.loginButtons) { return done(); }
    Meteor.logout(function(err) {
      test.isUndefined(err, 'No logout error');
      var actualHtml = Blaze.toHTML(Template.loginButtons);
      test.include(actualHtml, 'Sign in', 'Shows "Sign in" when not signed in');
      AccountsAnonymous.login(function(err) {
        test.isUndefined(err, 'No login error');
        var actualHtml = Blaze.toHTML(Template.loginButtons);
        test.include(actualHtml, 'Sign in', 'Shows "Sign in" when anonymous');
        done();
      });
    });
  }
);

Tinytest.addAsync(
  'AccountsPatchUi - useraccounts atNavButton shows Sign In when anonymous',
  function(test, done) {
    test.isNotUndefined(Template.atNavButton, 'Template.atNavButton');
    if (!Template.atNavButton) { return done(); }
    Meteor.logout(function(err) {
      test.isUndefined(err, 'No logout error');
      var actualHtml = Blaze.toHTML(Template.atNavButton);
      test.include(actualHtml, 'Sign In', 'Shows "Sign In" when not signed in');
      AccountsAnonymous.login(function(err) {
        test.isUndefined(err, 'No login error');
        var actualHtml = Blaze.toHTML(Template.atNavButton);
        test.include(actualHtml, 'Sign In', 'Shows "Sign In" when anonymous');
        done();
      });
    });
  }
);

var theRouter;
var routerPkgName;
if (Package['useraccounts:iron-routing']) {
  routerPkgName = 'useraccounts:iron-routing';
  theRouter = Router;
  // PhantomJS needs hash paths.
  if (window.callPhantom) {
    Iron.Location.configure({
      useHashPaths: true
    });
  }
  Router.configure({
    layoutTemplate: 'aputIronLayout',
    autoRender: false,
  });
  theRouter.route('/', function() {
    this.render('aputIronLayout');
  });
  AccountsTemplates.configure({
    defaultLayout: 'aputIronLayout',
  });
} else if (Package['useraccounts:flow-routing']) {
  routerPkgName = 'useraccounts:flow-routing';
  theRouter = FlowRouter;
  theRouter.route('/', function() {
    this.render('aputFlowLayout');
  });
  AccountsTemplates.configure({
    defaultLayout: 'aputFlowLayout',
    defaultLayoutRegions: {},
    defaultContentRegion: 'main'
  });
}

AccountsTemplates.configureRoute('signIn');

Tinytest.addAsync(
  'AccountsPatchUi - ' + routerPkgName + ' routes anon like logged out',
  function(test, done) {
    Meteor.logout(function(err) {
      test.isUndefined(err, 'No logout error');
      // Need to start at a path that isn't handled by the
      // useraccounts:*-routing to ensure that going to an accounts-related
      // route triggers a change in state. Important for
      // useraccounts:flow-routing in particular. Might be a bug in
      // useraccounts:flow-routing or kadira:flow-router.
      theRouter.go('/');
      AccountsTemplates.setState('hide');
      theRouter.go('/sign-in');
      Tracker.flush();
      test.equal(AccountsTemplates.getState(), 'signIn',
        'Logged out user routed to sign in');
      AccountsAnonymous.login(function(err) {
        test.isUndefined(err, 'No login error');
        theRouter.go('/'); // See above for why this is needed.
        AccountsTemplates.setState('hide');
        theRouter.go('/sign-in');
        Tracker.flush();
        test.equal(AccountsTemplates.getState(), 'signIn',
          'Anonymous user routed to sign in');
        done();
      });
    });
  }
);
