# Change Log
This file documents all notable changes to this project. 
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [0.1.7] 2016-02-28

### Fixed

Fixed [bug #3](https://github.com/brettle/meteor-accounts-patch-ui/issues/3) checking when callback passed to monkey patched
`callLoginMethod` was not passed an error. Thanks to [blackslate](https://github.com/blackslate) for finding
and fixing the problem!

## [0.1.6] 2015-12-13

### Fixed

Moved the fix for brettle/meteor-accounts-deluxe#1 (Red text error message when
adding password account) into this package from `brettle:workaround-issue-5110`
(used by `brettle:accounts-add-service`).

[Unreleased]: https://github.com/brettle/meteor-accounts-patch-ui/compare/v0.1.7...HEAD
[0.1.7]: https://github.com/brettle/meteor-accounts-patch-ui/compare/v0.1.6...v0.1.7
[0.1.6]: https://github.com/brettle/meteor-accounts-patch-ui/compare/v0.1.5...v0.1.6
