var assert = require('assert');
var cheerio = require('cheerio');
var eee = require('../');

describe('EEE with Cheerio', function() {
	it('should work with empty spec', function() {
		var $ = cheerio.load('<h1>Hello</h1>');
		var result = eee($.root(), {}, { env: 'cheerio', cheerio: $ });
		assert.equal(Object.keys(result).length, 0);
	});
	it('should extract text', function() {
		var $ = cheerio.load('<h1>Hello</h1>');
		var result = eee($.root(),
			{ text: { selector: 'h1' } },
			{ env: 'cheerio', cheerio: $ });
		assert.equal(result.text, 'Hello');
	});
	it('should extract attribute', function() {
		var $ = cheerio.load('<h1 id="hello">Hello</h1>');
		var result = eee($.root(),
			{ attr: { selector: 'h1', attribute: 'id' } },
			{ env: 'cheerio', cheerio: $ });
		assert.equal(result.attr, 'hello');
	});
	it('should extract property', function() {
		var $ = cheerio.load('<a href="/test">Test</a>');
		var result = eee($.root(),
			{ prop: { selector: 'a', property: 'href' } },
			{ env: 'cheerio', cheerio: $ });
		assert.equal(result.prop, '/test');
	});
	it('should extract array', function() {
		var $ = cheerio.load('<ul><li>item1</li><li>item2</li></ul>');
		var result = eee($.root(),
			{
				items: {
					selector: 'li',
					type: 'collection',
					extract: { text: { selector: ':self' } }
				}
			},
			{ env: 'cheerio', cheerio: $ });
		assert.equal(result.items.length, 2);
	});
	it('should extract array with filter', function() {
		var $ = cheerio.load('<ul><li>item1</li><li>item2 <span>with span</span></li></ul>');
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
		assert.equal(result.items.length, 1);
	});
	it('should extract html', function() {
		var $ = cheerio.load('<h1>Hello</h1>');
		var result = eee($.root(),
			{ text: { selector: 'h1', html: true } },
			{ env: 'cheerio', cheerio: $ });
		assert.equal(result.text, '<h1>Hello</h1>');
	});
	it('should try extract mismatched element property', function() {
		var $ = cheerio.load('<a href="/test">Test</a>');
		var result = eee($.root(),
			{ prop: { selector: 'span', property: 'href' } },
			{ env: 'cheerio', cheerio: $ });
		assert.equal(result.prop, null);
	});
});
