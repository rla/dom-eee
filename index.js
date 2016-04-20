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
