var assert = require('assert');
var path = require('path');
var fs = require('fs');
var eee = require('../');
var jsdom = require('mocha-jsdom');

describe('EEE with jsdom', function() {
	jsdom();
	it('should work with empty spec', function() {
		document.body.innerHTML = '<h1>Hello</h1>';
		var result = eee(window.document, {});
	    assert.equal(Object.keys(result).length, 0);
	});
	it('should extract text', function() {
		document.body.innerHTML = '<h1>Hello</h1>';
	    var result = eee(window.document,
	    	{ text: { selector: 'h1' } });
	    assert.equal(result.text, 'Hello');
	});
	it('should extract attribute', function() {
		document.body.innerHTML = '<h1 id="hello">Hello</h1>';
		var result = eee(window.document,
			{ attr: { selector: 'h1', attribute: 'id' } });
		assert.equal(result.attr, 'hello');
	});
	it('should extract property', function() {
		document.body.innerHTML = '<a href="/test">Test</a>';
		var result = eee(window.document,
			{ prop: { selector: 'a', property: 'href' } });
		assert.equal(result.prop, '/test');
	});
	it('should extract array', function() {
		document.body.innerHTML = '<ul><li>item1</li><li>item2</li></ul>';
		var result = eee(window.document,
			{
				items: {
					selector: 'li',
					type: 'collection',
					extract: { text: { selector: ':self' } }
				}
			});
		assert.equal(result.items.length, 2);
	});
	it('should extract array with filter', function() {
		document.body.innerHTML = '<ul><li>item1</li><li>item2 <span>with span</span></li></ul>';
		var result = eee(window.document,
			{
				items: {
					selector: 'li',
					type: 'collection',
					extract: { text: { selector: ':self' } },
					filter: { exists: 'span' }
				}
			});
		assert.equal(result.items.length, 1);
	});
});
