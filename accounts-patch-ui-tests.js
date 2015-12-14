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

Template.loginButtons && Tinytest.add(
  'AccountsPatchUi - accounts-ui - loginButtons is clickable',
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

Template.loginButtons && Tinytest.addAsync(
  'AccountsPatchUi - accounts-ui - loginButtons shows Sign In when anonymous',
  function(test, done) {
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

Tinytest.add('AccountsPatchUi - an accounts UI can be tested', 
  function (test) {
    test.isNotUndefined(Template.loginButtons || routerPkgName,
      'UI env var must be set to ' + 
      '"acoounts-ui", "iron-routing", or "flow-routing"');
});
  

routerPkgName && Tinytest.addAsync(
  'AccountsPatchUi - useraccounts - atNavButton shows Sign In when anonymous',
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

routerPkgName && AccountsTemplates.configureRoute('signIn');

routerPkgName && Tinytest.addAsync(
  'AccountsPatchUi - ' + routerPkgName + ' - routes anon like logged out',
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

var div;

routerPkgName && testAsyncMulti(
  'AccountsPatchUi - ' + routerPkgName + ' - no error adding password service',
  [
    function (test, expect) {
      Meteor.logout(expect());
    },
    function (test, expect) {
      AccountsAnonymous.login(expect());
    },
    function (test, expect) {
      AccountsTemplates.setState('signUp');
      div = renderToDiv(Template.atForm);
      document.body.appendChild(div);
      Tracker.flush();
    },
    function (test, expect) {
      Meteor.setTimeout(expect(function() {}), 0);      
    },
    function (test, expect) {
      DomUtils.setElementValue(div.querySelector('#at-field-email'), 
      Random.id() + "@example.com");
      DomUtils.setElementValue(div.querySelector('#at-field-password'),
        'password');
      DomUtils.setElementValue(div.querySelector('#at-field-password_again'),
        'password');
      clickElement(div.querySelector('#at-btn'));
      var stopper = Accounts.onLoginFailure(expect(function (error) {
        stopper.stop();
        Tracker.flush();
      }));
    },
    function (test, expect) {
      Meteor.setTimeout(expect(function() {}), 0);      
    },
    function (test, expect) {
      var errorMessageElem = div.querySelector('.at-error');
      test.isNull(errorMessageElem, 'There should not be an error message');
      document.body.removeChild(div);      
    }    
  ]
);

Template.loginButtons && testAsyncMulti(
  'AccountsPatchUi - accounts-ui - no error adding password service',
  [
    function (test, expect) {
      Meteor.logout(expect());
    },
    function (test, expect) {
      AccountsAnonymous.login(expect());
    },
    function (test, expect) {
      div = renderToDiv(Template.loginButtons);
      document.body.appendChild(div);
      Tracker.flush();
      clickElement(div.querySelector('#login-sign-in-link'));
      Tracker.flush();
      var signUpLink = div.querySelector('#signup-link');
      if (signUpLink) {
        clickElement(signUpLink);
      }
      DomUtils.setElementValue(div.querySelector('#login-email'),
        Random.id() + "@example.com");
      DomUtils.setElementValue(div.querySelector('#login-password'),
        'password');
      clickElement(div.querySelector('#login-buttons-password'));
      var stopper = Accounts.onLoginFailure(expect(function (error) {
        stopper.stop();
        Tracker.flush();
      }));
    },
    function (test, expect) {
      Meteor.setTimeout(expect(function() {}), 0);      
    },
    function (test, expect) {
      var errorMessageElem = div.querySelector('.error-message');
      test.isNull(errorMessageElem, 'There should not be an error message');
      var loginDropdownListElem = div.querySelector('#login-dropdown-list');
      test.isNull(loginDropdownListElem, 'The dropdown should be closed');
      document.body.removeChild(div);      
    }    
  ]
);
