# Helper to extract data from DOM

[![Build Status](https://travis-ci.org/rla/dom-eee.svg)](https://travis-ci.org/rla/dom-eee)

Supported environments:

 * Browsers
 * PhantomJS
 * Cheerio
 * jsdom

## Example

This example uses Cheerio:

```javascript
var cheerio = require('cheerio');
var eee = require('eee');
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
```

Prints:

```
{ items: [ { text: 'item2 with span' } ] }
```

## Extraction expressions

The system works by evaluating an object-formatted DSL
expression. The syntax of the DSL and its semantics is
described below.

ObjectExpression:

```javascript
{
    "prop1": Expression,
    "prop2": Expression
}
```

ObjectExpression returns an object with given properties.
Property values are described by further Expressions.

Expression is either CollectionExpression or
SingleExpression, returning a value described by it.

CollectionExpression:

```javascript
{
    "type": "collection",
    "selector": CSSSelector,
    "extract": ObjectExpression,
    "filter": FilterExpression
}
```

CollectionExpression returns an array of items. Items are extracted
by applying `extract` expression to each element matched by the
`selector` CSS rule. If the rule matches no elements then an empty
array is returned.

Optionally, the `filter` property might be set. Then the array of
raw elements is first filtered through the FilterExpression.

SingleExpression:

```javascript
{
    "type": "single",
    "selector": CSSSelector,
    "property": String,
    "attribute": String
}
```

Properties `property` and `attribute` are optional. If present
the extracted value is either a property or an attribute of the
node matched by the `selector`. If `selector` matches nothing then
null is returned.

Property `type` is optional. When not set, `single` is assumed as
the default.

FilterExpression:

```javascript
{
    "exists": CSSSelector
}
```

An element passes a FilterExpression if it has elements that match
the CSS rule in the `exists` property.

## Testing

Run `npm test`.

## License

The MIT License.
