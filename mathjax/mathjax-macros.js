MathJax.Hub.Register.StartupHook('TeX Jax Ready', function() {
	var debug = function() {
		if ((typeof(console) != 'undefined') && (typeof(console.debug) == 'function')) {
			;;; console.debug.apply(console, arguments);
		}
	}

	var TEX = MathJax.InputJax.TeX,
	TEXDEF = TEX.Definitions;

  // Use comma as decimal separator and period as thousands separator
	TEXDEF.digit = /[0-9,]/;
	TEXDEF.number = /^(?:[0-9]+(?:\{\.\}[0-9]{3})*(?:,[0-9]+)*|,[0-9]+)/;

	MathJax.Hub.Insert(TEXDEF, {
    macros: {
      degree: [ 'Macro', '{^\\circ}' ],
      degreeC: [ 'Macro', '{^\\circ}\\mathrm{C}' ],
      degreeF: [ 'Macro', '{^\\circ}\\mathrm{F}' ],
      permil: [ 'Macro', '‰' ],
			unit: 'unitsHandler',
			unitfrac: 'unitsHandler',
			nuclide: 'nuclide'
		}
	});

	TEX.Parse.Augment({
		unitsHandler: function(name) {
			try {
				var dim = this.GetBrackets(name),
				num = this.GetArgument(name),
				den = (name == '\\unitfrac') ? this.GetArgument(name) : null,
				matches,
				tex = '';
				if (dim && dim.replace(/\s+/, '')) {
					// Add space after non-empty dimension
					tex += dim+'\\,';
				}

				/*
				// Wrap \text{} around leading letters in numerator, i.e. "m^2" becomes "\text{m}^2"
				matches = new RegExp('([a-z]*)(.*)').exec(num);
				if (matches) {
					tex += '\\text{'+matches[1]+'}'+matches[2];
				} else {
					tex += '\\text{'+num+'}';
				}
				if (den !== null) {
					// @TODO this can be handled in a much better way (cf. nicefrac.sty)
					tex += '/';
					matches = new RegExp('([a-z]+)(.*)').exec(den);
					if (matches) {
						tex += '\\text{'+matches[1]+'}'+matches[2];
					} else {
						tex += '\\text{'+den+'}';
					}
				}
				//*/

				tex += '\\mathrm{';
				if (den === null) {
					tex += num;
				} else {
					// tex += num;
					// tex += '/';
					// tex += den;
					tex += '\\frac{';
					tex += num;
					tex += '}{';
					tex += den;
					tex += '}';
				}
				tex += '}';

				// ;;; debug(this.i, this.string.substring(0, this.i), '->', tex, this.string.slice(this.i));

				this.string = tex+this.string.slice(this.i);

				this.i = 0;
			} catch (ex) {
				// ;;; debug('ex', ex);
			}
		},

		nuclide: function(name) {
			var massNo = this.GetBrackets(name),
			atomicNo = this.GetBrackets(name),
			symbol = this.GetArgument(name),
			tex = '';

			if (massNo) {
				tex += '^{'+massNo+'}';
			}
			if (atomicNo) {
				tex += '_{'+atomicNo+'}';
			}
			// if (massNo || atomicNo) {
			// 	tex += '\\mspace{1mu}';
			// }
			tex += '\\mathrm{'+symbol+'}';

			this.string = tex+this.string.slice(this.i);
			this.i = 0;
			;;; debug([ name, massNo, atomicNo, symbol ]);
		}
	});
});
