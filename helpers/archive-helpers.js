var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var httpHelp = require('../web/http-helpers');
var request = require('request');

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
  exports.readListOfUrls(function(list) {
    for (var i = 0; i < list.length && !found; i++ ) {
      if (list[i] === target) {
        found = true;
      }
    }
    someCallback(found);
  });
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
  fs.readdir(exports.paths.archivedSites, function(err, files) {
    if (err) {
      console.log(err);
    }
    files.forEach(function(item) {
      if (url === item) {
        found = true;
      }
    });
    cb(found);
  });
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
  var requestBody = '';
  req.on('data', function(data) {
    requestBody += data;
  });
  req.on('end', function() {
    var url = requestBody.slice(4);
    exports.isUrlArchived(url, function(isArchived) {
      // site is saved
      if (isArchived) {
        httpHelp.serveAssets(res, exports.paths.archivedSites + '/' + url);
      } else {
        // sites to be saved
        exports.isUrlInList(url, function(isInList) {
            // site is in the list of urls
          if (isInList) {
            res.writeHead(302, {
              'Location': exports.paths.siteAssets + '/loading.html',
              'Content-Type': 'text/html'
            });
            res.end();
            // site is not in the list of urls
          } else {
            exports.addUrlToList(url, function() {
              res.writeHead(302, {
                'Location': exports.paths.siteAssets + '/loading.html',
                'Content-Type': 'text/html'
              });
              res.end();
            });
          }
        });

      }
    });
  });

};







//   req.on('end', function() {
//     console.log(requestBody);
//     exports.isUrlArchived(requestBody.slice(4), function(boolean) {
//       if (boolean) {
//         httpHelp.serveAssets(res, exports.paths.archivedSites + '/' + requestBody.slice(4));
//       } else {
//         exports.isUrlInList(requestBody.slice(4), function(bool) { 
//           if (bool) {
//             console.log('Reroute to loading page');
//             // Todo: change path back to web/loader
//             httpHelp.serveAssets(res, exports.paths.siteAssets + '/loading.html');


//           } else {
//             console.log('something');
//             exports.addUrlToList(requestBody.slice(4), function() {}); 
//             res.writeHead(302, {
//               'Location': exports.paths.archivedSites + '/' + requestBody.slice(4),
//               'Content-Type': 'text/html'
//             });
//             res.end();
//           }
//         });
//       }
//     });
//   });
// };

