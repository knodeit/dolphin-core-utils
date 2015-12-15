/**
 * Created by Vadim on 12/9/15.
 */
'use strict';

var glob = require('glob');
var Q = require('q');

exports.readDir = function (pattern, options) {
    var deferred = Q.defer();
    glob(pattern, options, function (err, files) {
        if (err) {
            return deferred.reject(err);
        }
        deferred.resolve(files);
    });
    return deferred.promise;
};

exports.readDirSync = function (pattern, options) {
    return glob.sync(pattern, options);
};