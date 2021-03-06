var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var async = require('async');
var resultUrls = [];
var concurrency = 5;


var queue = async.queue(function scrapePage(url, next) {
    if (!url || resultUrls.indexOf(url) !== -1) return next(null);
    request(url, function(err, response, body){
        if (err) return next(err);
        console.log(url);
        resultUrls.push(url);
        var $ = cheerio.load(body);
        var hyperLinks = $('a');
        for(var i=0; i < hyperLinks.length;i++){
            queue.push($(hyperLinks[i]).attr('href'));
        }
        next(null);
    });
}, concurrency);

queue.push('https://reddit.com');
queue.drain = function () {
    //called at the end
    var output = resultUrls[0];
    for(var i=1; i<resultUrls.length;i++){
        output += "\n"+resultUrls[i]
    }
    fs.writeFile('output.csv',output, function (err, resp) {
        console.log('done');
    })
};
