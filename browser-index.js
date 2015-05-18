var $ = require('jquery'),
    createDeferred = function() {
        return $.Deferred();
    },
    deferredPending = function(dfd) {
        return dfd.state() === 'pending';
    },
    deferredPromise = function(dfd) {
        return dfd.promise();
    };

module.exports = require('./rpc.js')(createDeferred, deferredPromise, deferredPending);
