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

To test against new versions `blaze`, `useraccounts`, `kadira:flow-router`, or
`iron:router`, update the following lines in `package.js`:

```js
// Set versions to test against below.
var blazeVersion = '2.1.8';
var useraccountsVersion = '1.14.2';
var ironRouterVersion = '1.0.13';
var kadiraFlowRouterVersion = '2.12.1';
```

You will probably also need to add those versions to the list of compatible
versions in the following lines, again in `package.js`:

```js
// Use specific versions of the following packages because we rely on or
// monkey patch their internals. Those internals could change even in a patch
// release. So as new releases of these packages are published, we need to
// re-test this package with the new release, and add the supported version
// below.

// We monkey patch the _helpers and _eventMaps Template properties blaze
// manages.
api.use('blaze@=2.1.5 || =2.1.4 || =2.1.3 || =2.1.2 || =2.1.1 || =2.1.0' +
  ' || =2.1.6 || =2.1.7 || =2.1.8',
  'client');
// Among other things, we assume that the hooks in the options object are used
// directly, not copied.
api.use('iron:router@=1.0.13 || 1.0.12 || =1.0.11 || =1.0.10 || =1.0.9', 
  'client', { weak: true });
// Among other things, we use the internal _routesMap and _action properties.
// Also need the stop() function passed to triggers which was added in 2.5.0.
api.use('kadira:flow-router' +
  '@=2.12.1 || =2.10.1 || =2.9.0 || =2.8.0 || =2.7.0 || =2.6.2 || =2.5.0', 
  'client', { weak: true });

// We don't rely on the internals of these packages, but we do rely on
// Router.routes and FlowRouter.routes which are undocumented, so we
// should watch them closely.
api.use('useraccounts:iron-routing@1.12.1', 'client', { weak: true });
api.use('useraccounts:flow-routing@1.12.0', 'client', { weak: true });
```

To support testing on Travis-CI, `./run-tests-in-console.sh` runs the tests with
each of the different UI values. Note that console-based testing requires
PhantomJS 2.

## TODO

- Test support for other `useraccounts` flavors.
