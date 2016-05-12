var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var httpHelp = require('../web/request-handler');

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

exports.downloadUrls = function(urlArray) {
  fs.readdir(exports.paths.archivedSites, function(err, files) {
    urlArray.forEach(function(item) {
      if (files.indexOf(item) === -1) {
        fs.writeFile(exports.paths.archivedSites + '/' + item, exports.extractHtml(item), function(err) {
          if (err) {
            console.log(err);
          } 
          
        });
      }
    }); 
  });
};

exports.extractHtml = function(url) {
  var options = {
    host: url,
    port: 80,
  };

  http.get(options, function(res) {
    console.log('Got a response:' + res.statusCode);

  }).on('error', function(e) {
    console.log('got an error: ' + e.message);
  });
 
};

exports.createAssets = function(req, res, filePath) {
  req.on('data', function(data) {
    requestBody = '';
    requestBody += data;
  });
  req.on('end', function() {
    requestBody = JSON.parse(requestBody).url;
    exports.addUrlToList(requestBody.slice(4), function() {}); //url=www.google.com
    // append to list
    // write list

    // fs.writeFile(filePath, requestBody.url.slice(4) + '\n', function(err) {
    //   if (err) {
    //     console.log(err);
    //   }
    // });
    res.writeHead(302, httpHelp.headers);
    res.end();
  });
};

