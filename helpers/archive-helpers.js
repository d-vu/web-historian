var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var list = [];

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(cb) {
  fs.readFile(exports.paths.list, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      var body = '';
      body += data;
      list = body.split('\n');
      cb(list);
    }
  });
};

exports.isUrlInList = function(target, someCallback) {
  someCallback(exports.readListOfUrls(function(list) {
    return list;
  }));
};

exports.addUrlToList = function(url, cb) {
  list.push(url);
  fs.writeFile(exports.paths.list, list.join('\n'), function(err) {
    if (err) {
      console.log(err);
    }
  });
  cb();
};

exports.isUrlArchived = function(url, cb) {
  var found = false;
  list.forEach(function(item) {
    if (url === item) {
      found = true;
    } 
  });
  return cb(found);
};

exports.downloadUrls = function() {
};
