var Deferred = require('deferred'),
    RPCInterface = require('../node-index.js');

exports.createRPC = function(test) {
    var rpc = new RPCInterface();
    test.ok(true);
    test.done();
};

exports.addMethod = function(test) {
    var rpc = new RPCInterface();
    rpc.addMethod('test', function(params) {});
    test.ok(true);
    test.done();
};

exports.addMethodOptions = function(test) {
    var rpc = new RPCInterface();
    rpc.addMethod('test', {
        handler: function(){}
    });
    test.ok(true);
    test.done();
};

exports.addMethodInvalidParams = function(test) {
    test.expect(1);
    var rpc = new RPCInterface();
    test.throws(function() {
        rpc.addMethod('test', {
            handler: function() {},
            params: {
                test: null
            }
        });
    });
    test.done();
};

exports.addMethodStringParam = function(test) {
    test.expect(1);
    var rpc = new RPCInterface();
    rpc.addMethod('test', {
        handler: function(params, dfd) {
            test.equal(typeof params.test, 'string');
            dfd.resolve();
        },
        params: {
            test: 'string'
        }
    });
    rpc.call('test', {test: 'test'});
    test.done();
};

exports.handleTestRequest = function(test) {
    var rpc = new RPCInterface(),
        called = false;
    rpc.addMethod('test', {
        test: {type: 'string', optional: false}
    }, function(params, dfd) {
        test.equal(typeof params, 'object');
        test.equal(params.test, 'test');
        called = true;
        dfd.resolve();
    });
    rpc.call('test', {test: 'test'});
    test.ok(called);
    test.done();
};

exports.handleTestRequestMissing = function(test) {
    var rpc = new RPCInterface();
    rpc.addMethod('test', {
        test: {type: 'string', optional: false}
    }, function() {
        test.fail();
    });
    test.throws(function() {
        rpc.call('test', {});
    });
    test.done();
};

exports.handleTestRequestOptions = function(test) {
    test.expect(3);
    var rpc = new RPCInterface();
    rpc.addMethod('test', {
        handler: function(params, dfd) {
            test.equal(typeof params, 'object');
            test.equal(params.test, 'test');
            dfd.resolve({success: true});
        },
        params: {
            test: {type: 'string', optional: false}
        }
    });
    rpc.call('test', {test: 'test'}).then(function(result) {
        test.ok(result.success);
        test.done();
    });
};

exports.callNoParams = function(test) {
    var rpc = new RPCInterface(),
        called = false;
    rpc.addMethod('test', {
        handler: function(params, dfd) {
            called = true;
            dfd.resolve();
        }
    });
    rpc.call('test');
    test.ok(called);
    test.done();
};

exports.callNoParamsOptional = function(test) {
    var rpc = new RPCInterface(),
        called = false;
    rpc.addMethod('test', {
        handler: function(params, dfd) {
            called = true;
            dfd.resolve();
        },
        params: {
            test: {type: 'string', optional: true}
        }
    });
    rpc.call('test');
    test.ok(called);
    test.done();
};

exports.callNoParamsRequired = function(test) {
    var rpc = new RPCInterface();
    rpc.addMethod('test', {
        handler: function(params, dfd) {
            dfd.resolve();
            test.fail();
        },
        params: {
            test: {type: 'string', optional: false}
        }
    });
    test.throws(function() {
        rpc.call('test');
    });
    test.done();
};

exports.preProcessor = function(test) {
    var rpc = new RPCInterface(),
        called = false;
    rpc.addMethod('test', function() {
        test.fail();
    });
    rpc.setPreProcessor(function(method, params, dfd) {
        test.equal(method, 'test');
        called = true;
        dfd.resolve();
    });
    rpc.call('test', {test: 'test'});
    test.ok(called);
    test.done();
};

exports.preProcessorResolved = function(test) {
    var rpc = new RPCInterface(),
        called = false;
    rpc.addMethod('test', function() {
        called = true;
    });
    rpc.setPreProcessor(function(method, params, dfd) {
        dfd.resolve();
    });
    rpc.call('test', {test: 'test'});
    test.equal(called, false);
    test.done();
};

exports.preProcessorDeferred = function(test) {
    var rpc = new RPCInterface(),
        dfd = new Deferred(),
        called = false;
    rpc.addMethod('test', function(params, dfd) {
        called = true;
        dfd.resolve();
    });
    rpc.setPreProcessor(function() {
        return dfd.promise;
    });
    rpc.call('test', {test: 'test'});
    test.equal(called, false);
    dfd.resolve();
    test.equal(called, true);
    test.done();
};

exports.preProcessorResolvedDeferred = function(test) {
    var rpc = new RPCInterface(),
        dfd = new Deferred(),
        called = false;
    rpc.addMethod('test', function() {
        called = true;
    });
    rpc.setPreProcessor(function(method, params, dfd) {
        dfd.resolve();
        return dfd.promise;
    });
    rpc.call('test', {test: 'test'});
    dfd.resolve();
    test.equal(called, false);
    test.done();
};

exports.callTestArray = function(test) {
    test.expect(1);
    var rpc = new RPCInterface();
    rpc.addMethod('test', {
        handler: function(params, dfd) {
            dfd.resolve({success: true});
        },
        params: {
            test: {type: 'array', optional: false}
        }
    });
    rpc.call('test', {test: []}).then(function(result) {
        test.ok(result.success);
        test.done();
    });
};

exports.callTestNotArray = function(test) {
    test.expect(1);
    var rpc = new RPCInterface();
    rpc.addMethod('test', {
        handler: function() {
            test.fail();
        },
        params: {
            test: {type: 'array', optional: false}
        }
    });
    test.throws(function() {
        rpc.call('test', {test: {}});
    });
    test.done();
};

exports.callTestResolveNull = function(test) {
    test.expect(1);
    var rpc = new RPCInterface();
    rpc.addMethod('test', {
        handler: function(params, dfd) {
            dfd.resolve(null);
        },
        params: {
            test: {type: 'array', optional: false}
        }
    });
    rpc.call('test', {test: []}).then(function(result) {
        test.strictEqual(result, null);
        test.done();
    });
};

exports.callTestResolveUndefined = function(test) {
    test.expect(1);
    var rpc = new RPCInterface();
    rpc.addMethod('test', {
        handler: function(params, dfd) {
            dfd.resolve();
        },
        params: {
            test: {type: 'array', optional: false}
        }
    });
    rpc.call('test', {test: []}).then(function(result) {
        test.strictEqual(result, undefined);
        test.done();
    });
};
