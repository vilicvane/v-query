/*

V-Query v0.1

A simple selector.

MIT lisenced.

By VILIC VANE
www.vilic.info


V-Query only supports some basic selectors, they are "#", ".", ">" and "tag name"
(* is OK), it's lite, but you can use them freely. Like:
#id1.cls1.cls2 a .cls3 > input#id2

BUT NOTICE! Sometimes the function returns an array of elements, while sometimes
it returns an element. The way to decide the results is simple, and it's totally
by the selectors you write. If your selectors are not for a unique element, the
function will return an array, such as "#id .cls", cause ".cls" means a group of
elements. However, if you write it like this, "#id.cls", the value returned will
be an element or sometimes undefined;

*/

var query = function () {
	var selectors = [
            {
            	key: ' #',
            	unique: true,
            	get: function (rel, id) {
            		var ele = document.getElementById(id);
            		var eles = rel.getElementsByTagName('*');
            		for (var i = 0; i < eles.length; i++)
            			if (ele == eles[i])
            				return [ele];
            		return [];
            	}
            },
            {
            	key: ' .',
            	unique: false,
            	get: function (rel, className) {
            		var eles = rel.getElementsByTagName('*');
            		var rst = [];
            		for (var i = 0, ele; ele = eles[i]; i++)
            			if (containsClass(ele, className))
            				rst.push(ele);
            		return rst;
            	}
            },
            {
            	key: '>#',
            	unique: true,
            	get: function (rel, id) {
            		var eles = rel.childNodes;
            		for (var i = 0, ele; ele = eles[i]; i++)
            			if (ele.id == id)
            				return [ele];
            		return [];
            	}
            },
            {
            	key: '>.',
            	unique: false,
            	get: function (rel, className) {
            		var eles = rel.childNodes;
            		var rst = [];
            		for (var i = 0, ele; ele = eles[i]; i++)
            			if (containsClass(ele, className))
            				rst.push(ele);
            		return rst;
            	}
            },
            {
            	key: '#',
            	unique: true,
            	get: function (rel, id) {
            		if (rel.id == id)
            			return [rel];
            		else return [];
            	}
            },
            {
            	key: '.',
            	get: function (rel, className) {
            		if (containsClass(rel, className))
            			return [rel];
            		else return [];
            	}
            },
            {
            	key: ' ',
            	unique: false,
            	get: function (rel, tagName) {
            		return rel.getElementsByTagName(tagName);
            	}
            },
            {
            	key: '>',
            	allowSpace: true,
            	unique: false,
            	get: function (rel, tagName) {
            		var eles = rel.childNodes;
            		var rst = [];
            		for (var i = 0, ele; ele = eles[i]; i++)
            			if (ele.tagName == tagName.toUpperCase())
            				rst.push(ele);
            		return rst;
            	}
            }
        ];

	return function (selector, rel) {
		selector = ' ' + trim(selector).replace(/\s+/g, ' ');

		for (var i = 0, s; s = selectors[i]; i++)
			if (s.allowSpace)
				selector = selector.replace(new RegExp(' ?(\\' + s.key.split('').join('\\') + ') ?', 'i'), '$1');

		var rels = rel ? ('length' in rel ? rel : [rel]) : [document];
		var unique;

		var eles = getEles(selector, rels);

		if (unique) return eles[0];
		else return eles;

		function getEles(selector, rels) {
			var eles = [];

			var re = /^([\w-]+|\*)/i;
			for (var i = 0, s; s = selectors[i]; i++) {
				var key = s.key;
				if (selector.indexOf(key) == 0) {
					selector = selector.substr(key.length);
					var word = (selector.match(re) || [])[0];
					if (!word) return [];
					selector = selector.substr(word.length);

					for (var j = 0, rel; rel = rels[j]; j++)
						append(eles, s.get(rel, word));

					if (s.unique != undefined)
						unique = s.unique;

					break;
				}
			}

			return selector ? getEles(selector, eles) : eles;
		}
	};

	function append(arr, items) {
		main:
		for (var i = 0; i < items.length; i++) {
			for (var j = 0; j < arr.length; j++)
				if (items[i] == arr[j])
					continue main;
			arr.push(items[i]);
		}
	}

} ();