var path = require('path');
var archive = require('../helpers/archive-helpers');
var helper = require('./http-helpers');
var url = require('url');
var htmlFetch = require('../workers/htmlfetcher');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);

  if (req.method === 'GET') {
    if (url.parse(req.url).pathname === '/') {
      var filePath = archive.paths.siteAssets + '/index.html';
      helper.serveAssets(res, filePath);
    } else {
      // var filePath = archive.paths.archivedSites + url.parse(req.url).pathname;
      var filePath = url.parse(req.url).pathname;
      helper.serveAssets(res, filePath);
    } 
  } else if (req.method === 'POST') {
    archive.createAssets(req, res, archive.paths.list);
  }
};
