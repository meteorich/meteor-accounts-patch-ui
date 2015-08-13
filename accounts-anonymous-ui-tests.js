Tinytest.addAsync('AccountsAnonymousUi - accounts-ui loginButtons shows Sign In when anonymous', function (test, done) {
  test.isNotUndefined(Template.loginButtons, 'Template.loginButtons');
  if (!Template.loginButtons) return done();
  Meteor.logout(function (err) {
    test.isUndefined(err, 'No logout error');
    var actualHtml = Blaze.toHTML(Template.loginButtons);
    test.include(actualHtml, 'Sign in', 'Shows "Sign in" when not signed in');
    AccountsAnonymous.login(function (err) {
      test.isUndefined(err, 'No login error');
      var actualHtml = Blaze.toHTML(Template.loginButtons);
      test.include(actualHtml, 'Sign in', 'Shows "Sign in" when anonymous');
      done();
    });
  });
});

Tinytest.addAsync('AccountsAnonymousUi - useraccounts:core atNavButton shows Sign In when anonymous', function (test, done) {
  test.isNotUndefined(Template.atNavButton, 'Template.atNavButton');
  if (!Template.atNavButton) return done();
  Meteor.logout(function (err) {
    test.isUndefined(err, 'No logout error');
    var actualHtml = Blaze.toHTML(Template.atNavButton);
    test.include(actualHtml, 'Sign In', 'Shows "Sign In" when not signed in');
    AccountsAnonymous.login(function (err) {
      test.isUndefined(err, 'No login error');
      var actualHtml = Blaze.toHTML(Template.atNavButton);
      test.include(actualHtml, 'Sign In', 'Shows "Sign In" when anonymous');
      done();
    });
  });
});

// PhantomJS needs hash paths.
if (window.callPhantom) {
  Iron.Location.configure({useHashPaths: true});
}
Router.configure({
  layoutTemplate: 'myLayout',
  autoRender: false,
});
Router.route('/', function () {
  this.render('myLayout');
});
AccountsTemplates.configure({
  defaultLayout: 'myLayout',
});
AccountsTemplates.configureRoute('signIn');

Tinytest.addAsync('AccountsAnonymousUi - useraccounts:iron-routing routes anonymous like logged out', function (test, done) {
  Meteor.logout(function (err) {
    test.isUndefined(err, 'No logout error');
    AccountsTemplates.setState('hide');
    Router.go('atSignIn');
    Meteor.setTimeout(function () {
      test.equal(AccountsTemplates.getState(), 'signIn', 'Logged out user routed to sign in');
      AccountsAnonymous.login(function (err) {
        test.isUndefined(err, 'No login error');
        AccountsTemplates.setState('hide');
        Router.go('atSignIn');
        Meteor.setTimeout(function () {
          test.equal(AccountsTemplates.getState(), 'signIn', 'Anonymous user routed to sign in');
          done();
        }, 100);
      });
    }, 100);
  });
});
