# brettle:accounts-patch-ui

[![Build Status](https://travis-ci.org/brettle/meteor-accounts-patch-ui.svg?branch=master)](https://travis-ci.org/brettle/meteor-accounts-patch-ui)

Monkey patches accounts UI packages to:

  - treat users that have logged in but not signed up (e.g. guests or anonymous
  users) like logged out users so that they can sign up and sign in.
  
  - suppress the error message that some packages display when adding a password
  service to an existing user.

This package is part of the `brettle:accounts-*` suite of packages. See
[`brettle:accounts-deluxe`](https://atmospherejs.com/brettle/accounts-deluxe)
for an overview of the suite and a live demo.

## Features

- Designed to support `accounts-ui` and `useraccounts:*` packages.

- Provides utility functions to help monkey patch other packages

## Installation
```sh
meteor add brettle:accounts-patch-ui
```

## Basic Usage

For `accounts-ui`, `ian:accounts-ui-bootstrap-3`, and `useraccounts:bootstrap`
with either `useraccounts:iron-routing` or `useraccounts:flow-routing`, it has
been tested and should just work once installed. It has been designed to work
with other `accounts-ui-unstyled` derivatives and `useraccounts:*` packages, but
it has not been tested. Please report bugs.

## Patching Other Packages

To patch other packages, use `AccountsPatchUi.wrapWithSignedUp(originalFunc)` and `AccountsPatchUi.wrapWithMergedErrorSuppressed(originalFunc)`. 

To treat guest/anonymous users like logged out users, you'll
need to figure out which of their functions use `Meteor.userId()` or
`Meteor.user()` to detect signed out users, and then wrap those functions using
`AccountsPatchUi.wrapWithSignedUp(originalFunc)`. While `originalFunc` is
running, `Meteor.userId()` and `Meteor.user()` will return `null` if the current
user is not signed up according to
[`LoginState.signedUp()`](http://github.com/brettle/meteor-accounts-login-state).
For example, if you wanted to override the global `currentUser` helper so that
it returns `null` if the current us is not signed up, you'd do:

```js
Template.registerHelper("currentUser", 
  AccountsPatchUi.wrapWithSignedUp(function () {
    return Meteor.user();
  })
);
```

To suppress the error that a client-side call to a login method (e.g.
`Meteor.loginWith*()`, or `Accounts.createUser()`) returns when the
`brettle:accounts-add-service` package adds a service to the current user,
you'll need to figure out which of the UI packages' functions call a login
method when adding a service to an existing user, and wrap those functions using
`AccountsPatchUi.wrapWithMergedErrorSuppressed(originalFunc)`. While
`originalFunc` is running, calls to login methods that would return the
aforementioned error, will instead succeed (though `Accounts.onLoginFailure()`
handlers will still run).

## Testing

Because this package patches multiple accounts UI packages, it isn't possible to
test them all simultaneously. Instead, when running `meteor test-packages ./`,
you need to set the `UI` environment variable to indicate which accounts UI
system to test. The choices are:

  * `accounts-ui` for the accounts UI package included with Meteor core
  * `iron-routing` for `useraccounts` with `useraccounts:iron-routing`
  * `flow-routing` for `useraccounts` with `useraccounts:flow-routing`
  
If the `UI` environment variable is not set, the tests will fail with a message
saying to set it.

To support testing on Travis-CI, `./run-tests-in-console.sh` runs the tests with
each of the different UI values. Note that console-based testing requires
PhantomJS 2.

## TODO

- Test support for other `useraccounts` flavors.
