Package.describe({
  name: 'brettle:accounts-anonymous-ui',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Monkey patches accounts UI packages to treat anonymous users like logged out users so that they can sign up and sign in.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/brettle/meteor-accounts-anonymous-ui.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.4.1');
  api.use('blaze', 'client');
  api.use('templating', 'client');
  api.use('underscore', 'client');
  api.use('twbs:bootstrap', 'client', {weak: true});
  api.use('useraccounts:bootstrap', 'client', {weak: true});
  api.use('useraccounts:iron-routing', 'client', {weak: true});
  api.use('accounts-ui-unstyled', 'client', {weak: true});
  api.addFiles('accounts-anonymous-ui.js', 'client');
  api.addFiles('patch-accounts-ui-unstyled.html', 'client');
  api.addFiles('patch-accounts-ui-unstyled.js', 'client');
  api.addFiles('patch-useraccounts.js', 'client');
});

Package.onTest(function(api) {
  api.versionsFrom('1.0.4.1');
  api.use('tinytest');
  api.use('accounts-ui-unstyled');
  api.use('templating', 'client');
  api.use('accounts-password');
  api.use('twbs:bootstrap');
  api.use('useraccounts:bootstrap@1.12.0');
  api.use('brettle:accounts-anonymous');
  api.use('brettle:accounts-anonymous-ui');
  api.addFiles('accounts-anonymous-ui-tests.js', 'client');
});
