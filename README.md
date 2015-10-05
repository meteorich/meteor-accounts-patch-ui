# brettle:accounts-patch-ui

[![Build Status](https://travis-ci.org/brettle/meteor-accounts-patch-ui.svg?branch=master)](https://travis-ci.org/brettle/meteor-accounts-patch-ui)

Monkey patches accounts UI packages to treat users that have logged in but not
signed up (e.g. guests or anonymous users) like logged out users so that they
can sign up and sign in.

This package is part of the `brettle:accounts-*` suite of packages. See
[`brettle:accounts-deluxe`](https://atmospherejs.com/brettle/accounts-deluxe)
for an overview of the suite and a live demo.

## Features

- Designed to support `accounts-ui` and `useraccounts:*` packages.

- Provides a utility function to help monkey patch other packages

## Installation
```sh
meteor add brettle:accounts-patch-ui
```

## Usage

For `accounts-ui`, `ian:accounts-ui-bootstrap-3`, and `useraccounts:bootstrap`,
it has been tested and should just work. It has been designed to work with other
`accounts-ui-unstyled` derivatives and `useraccounts:*` packages, but it has not
been tested. Please report bugs.

For other packages, you'll need to figure out which of their functions use
`Meteor.userId()` or `Meteor.user()` to detect signed out users, and then wrap
those functions using `AccountsPatchUi.wrapWithSignedUp(originalFunc)`. While
`originalFunc` is running, `Meteor.userId()` and `Meteor.user()` will return
`null` if the current user is not signed up according to
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

## TODO

- Test support for `useraccounts` flavors other than `useraccounts:bootstrap`
