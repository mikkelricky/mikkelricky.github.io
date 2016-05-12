(function() {
	var debug = function() {
		if ((typeof(console) != 'undefined') && (typeof(console.debug) == 'function')) {
			;;; console.debug.apply(console, arguments);
		}
	},

	trim = function(s) {
		if (s) {
			return s.replace(/^\s+/, '').replace(/\s+$/, '');
		}
	},

	normalize = function(s) {
		if (s) {
			return s.replace(/\s+/g, ' ');
		}
	},

	urlencode = function(value) {
		return escape(value);
	},

	urldecode = function(value) {
		return unescape(value);
	},

	lastMath = null;

	update = function() {
		var math = trim($('#input').val()),
		normalizedMath = normalize(math);

		if (math) {
			if (typeof window.history.pushState == 'function') {
				history.replaceState({}, '', '#'+(math ? urlencode(math) : ''));
			} else {
				document.location.hash = '#'+(math ? urlencode(math) : '');
			}

			if (normalizedMath && (normalizedMath != lastMath)) {
				lastMath = normalizedMath;
				$('#display').html(normalizedMath);
				MathJax.Hub.Queue([ 'Typeset', MathJax.Hub, 'display' ]);
				$('#link, #display').show();
			} else {
				// $('#link, #display').hide();
			}
		}
	}

	$(document).ready(function() {
		var math = urldecode(document.location.hash.replace(/^#/, ''));
		if (math) {
			$('#input').val(math);
		}
		$('#input').bind('keyup', update);
		update();
	});
}());
