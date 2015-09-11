var _EMPTY_OBJECT_ = {},
    isArray;

if (Array.isArray) {
    isArray = function(arr) {
        return Array.isArray(arr);
    };
} else {
    //from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray#Polyfill
    isArray = function(arr) {
        return Object.prototype.toString.call(arr) === '[object Array]';
    };
}

module.exports = function(createDeferred, deferredPromise, deferredPending) {
    function RPCInterface() {
        this.methods = {};
        this.preProcessor = null;
        this.addMethod('rpc.describe', {
            handler: this._describeSelfHandler.bind(this),
            internal: true
        });
    }

    RPCInterface.prototype.addMethod = function(name, parameters, handler) {
        var obj = null,
            internal = false,
            params = parameters,
            description, errors, n;
        if (arguments.length === 2) {
            if (typeof params === 'function') {
                handler = params;
                params = {};
            } else {
                obj = params;
                handler = obj.handler;
                params = obj.params; //undefined ok
                description = obj.description;
                errors = obj.errors;
                internal = obj.internal;
            }
        }
        if (typeof handler !== 'function') {
            throw new TypeError('Invalid handler method sent to addMethod for ' + name);
        }
        if (typeof params !== 'object') {
            params = _EMPTY_OBJECT_;
        } else if (params === null) {
            //ignore null and let it stay null
        } else {
            for (n in params) {
                if (!params.hasOwnProperty(n)) {
                    continue;
                }
                if (typeof params[n] === 'string') {
                    params[n] = {
                        type: params[n],
                        optional: false
                    };
                } else if (!params[n]) {
                    throw new TypeError('Invalid param sent to addMethod for param ' + n);
                }
            }
        }
        this.methods[name] = {
            params: params,
            handler: handler,
            description: description,
            errors: errors,
            internal: internal
        };
    };

    RPCInterface.prototype.removeMethod = function(name) {
        if (this.methods.hasOwnProperty(name)) {
            delete this.methods[name];
        }
    };

    RPCInterface.prototype.setPreProcessor = function(func) {
        if (func === null) {
            this.preProcessor = null;
            return;
        }
        if (typeof func !== 'function') {
            throw new TypeError('Invalid function sent to setPreProcessor');
        }
        this.preProcessor = func;
    };

    RPCInterface.prototype.call = function(method, params) {
        var parameters = params || {},
            methodDetail = null,
            paramsIsArray = isArray(parameters),
            paramsToSend = parameters,
            i = 0,
            dfd, preDfd,
            k, pk, t, v;
        if (typeof method !== 'string') {
            throw new TypeError('Invalid method passed to rpcInterface.call');
        }
        if (typeof parameters !== 'object') {
            throw new TypeError('Invalid params passed to rpcInterface.call');
        }
        if (!this.methods.hasOwnProperty(method)) {
            throw new TypeError('Method passed to rpcInterface.call not found. Method must be added with addMethod first');
        }

        if (paramsIsArray) {
            paramsToSend = {};
        }
        methodDetail = this.methods[method];
        if (methodDetail.params === null) {
            paramsToSend = {};
        } else {
            for (k in methodDetail.params) {
                if (!methodDetail.params.hasOwnProperty(k)) {
                    continue;
                }
                v = methodDetail.params[k];
                pk = paramsIsArray ? i++ : k;
                t = typeof parameters[pk];
                if (v.type === 'array' && t === 'object' && isArray(parameters[pk])) {
                    t = 'array';
                }
                if (v.type !== '*' && t !== v.type && (!v.optional || t !== 'undefined')) {
                    throw new TypeError('Invalid/missing param ' + k + ' sent to ' + method);
                }
                //copy over in the event that parameters is an array
                paramsToSend[k] = parameters[pk];
            }
        }

        dfd = createDeferred();

        if (this.preProcessor !== null && methodDetail.internal !== true) {
            preDfd = this.preProcessor(method, paramsToSend, dfd);
            if (preDfd && typeof preDfd.done === 'function') {
                 preDfd[typeof dfd.done === 'function' ? 'done' : 'then'](function() {
                    if (deferredPending(dfd)) {
                        return;
                    }
                    methodDetail.handler(paramsToSend, dfd);
                });
                return deferredPromise(dfd);
            }
            //check if the preprocessor already resolved the dfd
            if (deferredPending(dfd)) {
                return deferredPromise(dfd);
            }
        }
        methodDetail.handler(paramsToSend, dfd);
        return deferredPromise(dfd);
    };

    RPCInterface.prototype._describeSelfHandler = function(params, dfd) {
        var result = {},
            n;
        for (n in this.methods) {
            if (this.methods[n].internal === true) {
                continue;
            }
            result[n] = {
                description: this.methods[n].description,
                params: this.methods[n].params || {},
                errors: this.methods[n].errors
            };
        }
        dfd.resolve(result);
    };

    return RPCInterface;
};
