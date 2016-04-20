(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.eee = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var environments = require('./lib/env');

// Turns collection into a value.

function collection(env, element, spec, options) {
    if (typeof spec.selector === 'undefined') {
        throw new Error('Selector must be set, context: ' + spec);
    }
    var items = env.collection(element, spec.selector);
    if (typeof spec.extract === 'undefined') {
        throw new Error('Extractor must be set.');
    }
    if (typeof spec.filter === 'object') {
        var filter = spec.filter;
        if (typeof filter.exists === 'string') {
            items = items.filter(function(item) {
                return env.collection(item, filter.exists).length > 0;
            });
        }
    }
    return items.map(function(item) {
        return evaluate(env, item, spec.extract, options);
    });
}

// Turns singular element into a value.

function single(env, element, spec) {
    if (typeof spec.selector === 'undefined') {
        throw new Error('Selector must be set, context: ' + spec);
    }
    var dom = spec.selector === ':self' ? element :
        env.single(element, spec.selector);
    if (dom) {
        if (spec.attribute) {
            // Extracts attribute value.
            return env.attribute(dom, spec.attribute);
        } else if (spec.property) {
            return env.property(dom, spec.property);
        } else {
            return env.text(dom).trim().replace(/\s+/g, ' ');
        }
    } else {
        return null;
    }
}

// Toplevel recursive evaluation function.

function evaluate(env, element, spec, options) {
    // TODO check that element is set.
    var ret = {};
    Object.keys(spec).forEach(function(key) {
        var object = spec[key];
        if (object.type !== 'collection' &&
            object.type !== 'single' &&
            typeof object.type !== 'undefined') {
            throw new Error('Type must be collection or single.');
        }
        if (object.type === 'collection') {
            // Extract a collection of items.
            ret[key] = collection(env, element, object, options);
        } else {
            // Assume it's singular.            
            ret[key] = single(env, element, object, options);
        }
    });
    return ret;
}

// Sets up environment (browser, cheerio).

module.exports = function(root, spec, options) {
    if (typeof options === 'undefined') {
        options = {};
    }
    if (typeof options.env === 'undefined') {
        options.env = 'browser';
    }
    var env = environments[options.env];
    if (!env) {
        throw new Error('Unknown environment: ' + options.env);
    }
    var instance = null;
    if (options.env === 'cheerio') {
        if (typeof options.cheerio === 'undefined') {
            throw new Error('Cheerio context not set.');
        } else {
            // Cheerio-specific instance.
            instance = env(options.cheerio);
        }
    } else {
        // New generic environment instance.
        instance = env();
    }
    return evaluate(instance, root, spec, options);
};

},{"./lib/env":4}],2:[function(require,module,exports){
// Helper to extract data from browser context.

module.exports = function() {
    return {
        single: function(element, selector) {
            return element.querySelector(selector);
        },
        collection: function(element, selector) {
            return Array.prototype.slice.call(
                element.querySelectorAll(selector), 0);
        },
        attribute: function(element, attribute) {
            return element.getAttribute(attribute);
        },
        property: function(element, property) {
            return element[property];
        },
        text: function(element) {
            return element.textContent;
        },
    };
};

},{}],3:[function(require,module,exports){
// Helper to extract data from Cheerio context.

module.exports = function($) {
    return {
        single: function(element, selector) {
            return $(selector, element);
        },
        collection: function(element, selector) {
            return $(selector, element).toArray();
        },
        attribute: function(element, attribute) {
            return $(element).attr(attribute);
        },
        property: function(element, property) {
            return $(element).prop(property);
        },
        text: function(element) {
            return $(element).text();
        }
    };
};

},{}],4:[function(require,module,exports){
var browser = require('./browser');
var cheerio = require('./cheerio');

module.exports = {
    browser: browser,
    cheerio: cheerio
};

},{"./browser":2,"./cheerio":3}]},{},[1])(1)
});