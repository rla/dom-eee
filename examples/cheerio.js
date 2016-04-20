var cheerio = require('cheerio');
var eee = require('../');
var html = '<ul><li>item1</li><li>item2 <span>with span</span></li></ul>';
var $ = cheerio.load(html);
var result = eee($.root(),
    {
        items: {
            selector: 'li',
            type: 'collection',
            extract: { text: { selector: ':self' } },
            filter: { exists: 'span' }
        }
    },
    { env: 'cheerio', cheerio: $ });
console.log(result);
