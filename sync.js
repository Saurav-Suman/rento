var request = require('request');
var cheerio = require('cheerio');
function scrapePage(arg, callback) {
    request(arg, function(err, response, body){
        if(body){
            var $ = cheerio.load(body);
            var hyperLinks = $('a');
            for(var i=0; i<hyperLinks.length;i++){
                
                if($(hyperLinks[i]).attr('href')){
                    //console.log($(hyperLinks[i]).attr('href'));
                    if($(hyperLinks[i]).attr('href')!='#content')
                    items.push($(hyperLinks[i]).attr('href'));
                }
            }
            setTimeout(function() {
                launcher();
                callback(null);
            }, 1000);
        }
    });
    // console.log('do something with \''+arg+'\', return 1 sec later');
}
function final() { console.log('Done', results); }

var items = [ 'https://reddit.com'];
var results = [];
var running = 0;
var limit = 1;

function launcher() {
    console.log(items);
    while(running < limit && items.length > 0) {
        var item = items.shift();
        console.log(item);
        scrapePage(item, function(result) {
            results.push(item);
            running--;
            if(items.length > 0) {
                launcher();
            } else if(running == 0) {
                final();
            }
        });
        running++;
    }
}

launcher();
