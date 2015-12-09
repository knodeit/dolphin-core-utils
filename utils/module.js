/**
 * Created by Vadim on 12/7/15.
 */
'use strict';

var glob = require('glob');
var Q = require('q');
var path = require('path');
var fs = require('fs');

exports.findModules = function () {
    var deferred = Q.defer();
    // async
    Q.all([
        _findModules(path.join(process.cwd(), 'packages/**/module.js')),
        _findModules(path.join(process.cwd(), 'node_modules/dolphin-**-package/module.js')),
        _findModules(path.join(process.cwd(), 'node_modules/dolphin-**-package/packages/**/module.js'))
    ]).then(function (result) {
        var files = [];
        for (var i in result) {
            files = files.concat(result[i]);
        }
        deferred.resolve(files);
    });
    return deferred.promise;
};

function _findModules(modulePath, options) {
    var deferred = Q.defer();
    // async
    glob(modulePath, options, function (err, files) {
        //deferred.resolve(files);
        var funcs = [];
        for (var i in files) {
            funcs.push(checkModuleFolder(files[i]));
        }
        Q.all(funcs).then(function (files) {
            files = files.filter(function (item) {
                return item ? item : null;
            });

            files = files.map(function (file) {
                return {
                    file: file,
                    source: file.replace('/module.js', '')
                };
            });
            deferred.resolve(files);
        });
    });
    return deferred.promise;
}

function checkModuleFolder(file) {
    var deferred = Q.defer();
    var folder = file.replace('/module.js', '');
    fs.exists(path.join(folder, 'package.json'), function (exists) {
        deferred.resolve(exists ? file : null);
    });
    return deferred.promise;
}