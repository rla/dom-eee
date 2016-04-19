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
