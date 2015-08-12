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
