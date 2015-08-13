wrapTemplateWithNoAnon = function (template) {
  if (! template) {
    return;
  }
  wrapMethodsWithNoAnon(template.__helpers);
  if (! _.isArray(template.__eventMaps)) {
    throw new TypeError('__eventMaps not an Array');
  }
  _.each(template.__eventMaps, function (value, index, eventMaps) {
    wrapMethodsWithNoAnon(eventMaps[index]);
  });
};

function wrapMethodsWithNoAnon(obj) {
  if (obj === undefined) {
    return;
  }
  if (! _.isObject(obj)) {
    throw new TypeError('Not an object');
  }
  _.each(obj, function(value, key) {
    if (_.isFunction(value)) {
      obj[key] = AccountsAnonymousUi.wrapWithNoAnon(value);
    }
  });
};

function wrapRouteHooksWithNoAnon(route) {
  _.each(Iron.Router.HOOK_TYPES, function (hookType) {
    if (_.isFunction(route.options[hookType])) {
      route.options[hookType] = AccountsAnonymousUi.wrapWithNoAnon(route.options[hookType]);
    }
  });
}

wrapTemplateWithNoAnon(Template.atNavButton);
wrapTemplateWithNoAnon(Template.atForm);

var AccountsTemplates = Package['useraccounts:core'] && Package['useraccounts:iron-routing'] && Package['useraccounts:core'].AccountsTemplates;
var Router = Package['iron:router'] && Package['iron:router'].Router;
if (AccountsTemplates && AccountsTemplates.routes && Router) {
  _.each(AccountsTemplates.routes, function (r, key) {
    var route = Router.routes[r.name];
    wrapRouteHooksWithNoAnon(route);
  });
}

if (AccountsTemplates && AccountsTemplates.configureRoute && Router) {
  var origConfigureRoute = AccountsTemplates.configureRoute;
  AccountsTemplates.configureRoute = function (routeCode, options) {
    var ret = origConfigureRoute.call(this, routeCode, options);
    var route = Router.routes[AccountsTemplates.routes[routeCode].name];
    wrapRouteHooksWithNoAnon(route);
    return ret;
  };

  var origEnsureSignedIn = AccountsTemplates.ensureSignedIn;
  AccountsTemplates.ensureSignedIn = AccountsAnonymousUi.wrapWithNoAnon(origEnsureSignedIn);

  var origEnsureSignedInPlugin = Iron.Router.plugins.ensureSignedIn;
  Iron.Router.plugins.ensureSignedIn = function (router, options) {
    var origMethods = {};
    _.each(['onBeforeAction', 'onAfterAction', 'onRerun', 'onRun', 'onStop'], function (methodName) {
      if (_.isFunction(router[methodName])) {
        origMethods[methodName] = router[methodName];
        router[methodName] = function (hook, options) {
          return origMethods[methodName].call(router, AccountsAnonymousUi.wrapWithNoAnon(hook), options);
        }
      }
    });
    try {
      var ret = origEnsureSignedInPlugin(router, options);
    } finally {
      _.each(_.keys(origMethods), function (methodName) {
        router[methodName] = origMethods[methodName];
      });
    }
    return ret;
  }
}
