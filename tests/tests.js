var RPCInterface = require('../node-index.js');

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
    var rpc = new RPCInterface(),
        called = false;
    rpc.addMethod('test', {
        handler: function(params, dfd) {
            test.equal(typeof params, 'object');
            test.equal(params.test, 'test');
            called = true;
            dfd.resolve();
        },
        params: {
            test: {type: 'string', optional: false}
        }
    });
    rpc.call('test', {test: 'test'});
    test.ok(called);
    test.done();
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
