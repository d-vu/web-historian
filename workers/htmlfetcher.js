// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');
var httpHelper = require('../web/http-helpers');

exports.htmlfetch = function () {
  archive.readListOfUrls(archive.downloadUrls);
};