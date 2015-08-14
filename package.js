Package.describe({
  name: 'brettle:accounts-anonymous-ui',
  version: '0.2.0',
  // Brief, one-line summary of the package.
  summary: 'Monkey patches accounts UI packages so anonymous users can sign up and sign in.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/brettle/meteor-accounts-anonymous-ui.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.4');
  api.use('underscore', 'client');
  api.use('accounts-base', 'client');
  api.use('templating', 'client');

  // Whater UI variation is being used, it needs to load first so that
  // we can monkey patch it's atNav and atForm templates.
  // Tested:
  api.use('useraccounts:bootstrap@1.12.0', 'client', { weak: true });
  // Untested but probably work:
  api.use('useraccounts:foundation@1.12.0', 'client', { weak: true });
  api.use('useraccounts:ionic@1.12.0', 'client', { weak: true });
  api.use('useraccounts:materialize@1.12.0', 'client', { weak: true });
  api.use('useraccounts:polymer@1.12.0', 'client', { weak: true });
  api.use('useraccounts:ratchet@1.12.0', 'client', { weak: true });
  api.use('useraccounts:semantic-ui@1.12.0', 'client', { weak: true });
  api.use('useraccounts:unstyled@1.12.0', 'client', { weak: true });

  // Use specific versions of the following packages because we rely on or
  // monkey patch their internals. Those internals could change even in a patch
  // release. So as new releases of these packages are published, we need to
  // re-test this package with the new release, and add the supported version
  // below.
  // We monkey patch the _helpers and _eventMaps Template properties blaze manages.
  api.use('blaze@=2.1.2 || =2.1.1 || =2.1.0', 'client');
  // We copied and modifed the loginButtons template which refers to
  // _loginButtons* templates.
  api.use('accounts-ui-unstyled@=1.1.7', 'client', { weak: true });
  // Among other things, we assume that the hooks in the options object are used
  // directly, not copied.
  api.use('iron:router@=1.0.9', 'client', { weak: true });
  // Among other things, we use the internal _routesMap and _action properties.
  api.use('kadira:flow-router@=2.2.0', 'client', { weak: true });

  // We don't rely on the internals of these packages, but we do rely on
  // Router.routes and FlowRouter.routes which are undocumented, so we
  // should watch them closely.
  api.use('useraccounts:iron-routing@1.12.1', 'client', { weak: true });
  api.use('useraccounts:flow-routing@1.12.0', 'client', { weak: true });

  api.addFiles('accounts-anonymous-ui.js', 'client');
  api.addFiles('patch-accounts-ui-unstyled.html', 'client');
  api.addFiles('patch-accounts-ui-unstyled.js', 'client');
  api.addFiles('patch-useraccounts.js', 'client');
});

Package.onTest(function(api) {
  api.versionsFrom('1.0.4');
  api.use('tinytest');
  api.use('accounts-ui-unstyled');
  api.use('templating', 'client');
  api.use('accounts-password');
  api.use('twbs:bootstrap');
  api.use('useraccounts:bootstrap@1.12.0');

  // Uncomment one of the following two lines to depending on which useraccounts
  // routing package you want to test:
  //  api.use('useraccounts:iron-routing@1.12.0');
  api.use('useraccounts:flow-routing@1.12.0');

  api.use('brettle:accounts-anonymous');
  api.use('brettle:accounts-anonymous-ui');
  api.addFiles('accounts-anonymous-ui-tests.html', 'client');
  api.addFiles('accounts-anonymous-ui-tests.js', 'client');
});
