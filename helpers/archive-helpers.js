var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var httpHelp = require('../web/http-helpers');
var request = require('request');

var requestBody;

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

var list = exports.readListOfUrls(function() {}) || [];

exports.isUrlInList = function(target, someCallback) {
  var found = false;
  //check readListOfUrls with target
  var list = exports.readListOfUrls(function(urlArray) {
    return urlArray;
  });
  for (var i = 0; i < list.length && !found; i++ ) {
    if (list[i] === target) {
      found = true;
    }
  }
  someCallback(found);
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

exports.downloadUrls = function(urlArray) {
  fs.readdir(exports.paths.archivedSites, function(err, files) {
    urlArray.forEach(function(item) {
      if (files.indexOf(item) === -1) {
        exports.extractHTML(item);
      }
    }); 
  });
};

exports.extractHTML = function(url) {
  var options = {
    url: 'http://' + url,
    port: 80,
    method: 'GET'
  };
  request(options, function(err, res, body) {
    if (err) {
      console.log(err);
    }
    fs.writeFile(exports.paths.archivedSites + '/' + url, body, function(err) {
      if (err) {
        console.log('write file error', err);
      }
    });
  });
};

exports.createAssets = function(req, res, filePath) {
  req.on('data', function(data) {
    requestBody = '';
    requestBody += data;
  });
  req.on('end', function() {
    requestBody = requestBody.slice(4);
    var found = exports.isUrlArchived(requestBody, function(boolean) { return boolean; });
    if (found) {
      httpHelp.serveAssets(res, exports.paths.archivedSites + '/' + requestBody);
    } else {
      exports.addUrlToList(requestBody, function() {}); 
      res.writeHead(302, httpHelp.headers);
      res.end();
    }
  });
};

