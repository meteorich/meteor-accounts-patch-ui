if (Package['accounts-ui-unstyled']) {
  Template.registerHelper("AccountsAnonymousUi_isSignedIn",
    AccountsAnonymousUi.wrapWithNoAnon(function () {
      return (Meteor.userId() != null);
    })
  );
  var loginButtonsTemplate = Template.loginButtons;
  if (loginButtonsTemplate) {
    Template.loginButtons = Template.accountsAnonymousUiLoginButtons;
  }
}
