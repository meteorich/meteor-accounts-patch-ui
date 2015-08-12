if (Package['accounts-ui-unstyled']) {
  Template.registerHelper("AccountsAnonymousUi_isSignedIn", function () {
    return (AccountsAnonymousUi.userId() != null);
  });
  var loginButtonsTemplate = Template.loginButtons;
  if (loginButtonsTemplate) {
    Template.loginButtons = Template.accountsAnonymousUiLoginButtons;
  }
}
