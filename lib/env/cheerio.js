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
