# Change Log
This file documents all notable changes to this project. 
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [0.1.10] 2016-03-06

### Fixed

Updated to reflect compatibility with flow-router <= 2.10.1.

## [0.1.9] 2016-03-02

### Fixed

Fixed [bug #5](https://github.com/brettle/meteor-accounts-patch-ui/issues/5) by
monkey patching the route hooks to postpone/reload the route until after the
page has finished loading to so that we can reliably detect anonymous users.

## [0.1.8] 2016-02-29

### Fixed

Fixed [bug #2](https://github.com/brettle/meteor-accounts-patch-ui/issues/2) by
monkey patching the social button helpers so that the correct text is displayed
to anonymous users.

## [0.1.7] 2016-02-28

### Fixed

Fixed [bug #3](https://github.com/brettle/meteor-accounts-patch-ui/issues/3) by checking when callback passed to monkey patched
`callLoginMethod` was not passed an error. Thanks to [blackslate](https://github.com/blackslate) for finding
and fixing the problem!

## [0.1.6] 2015-12-13

### Fixed

Moved the fix for brettle/meteor-accounts-deluxe#1 (Red text error message when
adding password account) into this package from `brettle:workaround-issue-5110`
(used by `brettle:accounts-add-service`).

[Unreleased]: https://github.com/brettle/meteor-accounts-patch-ui/compare/v0.1.10...HEAD
[0.1.10]: https://github.com/brettle/meteor-accounts-patch-ui/compare/v0.1.9...v0.1.10
[0.1.9]: https://github.com/brettle/meteor-accounts-patch-ui/compare/v0.1.8...v0.1.9
[0.1.8]: https://github.com/brettle/meteor-accounts-patch-ui/compare/v0.1.7...v0.1.8
[0.1.7]: https://github.com/brettle/meteor-accounts-patch-ui/compare/v0.1.6...v0.1.7
[0.1.6]: https://github.com/brettle/meteor-accounts-patch-ui/compare/v0.1.5...v0.1.6
