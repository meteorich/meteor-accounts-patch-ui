"use strict";
/* globals AccountsAnonymousUi */

if (Package['accounts-ui-unstyled']) {
  if (Template.loginButtons) {
    // Override global currentUser to hide anonymous users just for this
    // template.
    Template.loginButtons.helpers({
      currentUser: function () {
        return AccountsAnonymousUi._noAnonUser();
      }
    });
  }
}
