var filePath = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var requestBody;

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, filePath, callback) {

  fs.exists(filePath, function(exists) {
    if (!exists) {
      res.writeHead(404, exports.headers);
      res.end(); 
    }
  });


  fs.readFile(filePath, 'utf8', function(error, data) {
    if (error) {
      console.log(error);
    } else {
      //console.log(data);
      res.writeHead(200, exports.headers);
      res.write(data);
      res.end();
    }
  });
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
};




// As you progress, keep thinking about what helper functions you can put here!
