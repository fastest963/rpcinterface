var Deferred = require('deferred'),
    createDeferred = function() {
        return new Deferred();
    },
    deferredPending = function(dfd) {
        return dfd.resolved;
    },
    deferredPromise = function(dfd) {
        return dfd.promise;
    };

module.exports = require('./rpc.js')(createDeferred, deferredPromise, deferredPending);
