# brettle:accounts-anonymous-ui

[![Build Status](https://travis-ci.org/brettle/meteor-accounts-anonymous-ui.svg?branch=master)](https://travis-ci.org/brettle/meteor-accounts-anonymous-ui)

Monkey patches accounts UI packages to treat anonymous users like logged out
users so that they can sign up and sign in.

## Features

- Supports `accounts-ui` derivatives and `useraccounts:bootstrap` when using
  `useraccounts:iron-routing`

- Provides a utility function to help monkey patch other packages

## Installation
```sh
meteor add brettle:accounts-anonymous-ui
```

## Usage

For `accounts-ui` derivatives and `useraccounts:bootstrap`, it should just work
once it is installed.

For other packages, you'll need to figure out which of their functions use
`Meteor.userId()` or `Meteor.user()` to detemine whether a user is logged in,
and then wrap those functions using
`AccountsAnonymousUi.wrapWithNoAnon(originalFunc)`. While `originalFunc` is
running, `Meteor.userId()` and `Meteor.user()` will return `null` if the current
user is anonymous.

## TODO

- Test support for `useraccounts` flavors other than `useraccounts:bootstrap`

- Make `isSignedUp()` part of the API and configurable.
