# rpcinterface #

Build a rpc interface in your webapp or node app. Requires jQuery for promises on
the web (via browserify).

### Usage (with browserify/node) ###

```JS
var rpc = require('rpcinterface');
```

## RPCInterface Methods ##

### rpc = new RPCInterface() ###

Creates a new RPCInterface instance. Should be done at application start up.

### rpc.addMethod(name, params, handler) ###
### rpc.addMethod(name, handler) ###
### rpc.addMethod(name, options) ###

Adds a new handler for method `name`. `options` should be an object that has
`handler` and `params` keys. `handler` is a callback that is called with
(parameters, deferred) when a new call is made for this method name. If
`params` are not defined then no parameter checking is done.

`params` should be a hash like this example:
```JS
{
    email: {type: 'string', optional: false},
    password: {type: 'string', optional: false},
    name: {type: 'string', optional: false},
    phone: {type: 'number', optional: true}
}
```

### rpc.removeMethod(name) ###

Removes the handler for method `name`.

### rpc.setPreProcessor(func) ###

Sets the pre-processor, which is called before the handler but after the request is
validated. The `func` is sent (method, params, dfd). `method` is the string method
name being called and `params` is the parameters object sent by the caller.

### rpc.call(method[, params]) ###

Calls a method added by `addMethod` and sends along the passed params. Returns a
deferred. Throws if `params` are invalid/missing for the method being called or if
the method wasn't added. `params` can also be an array where the order of the values
is based on the defined order when `addMethod` was called.
