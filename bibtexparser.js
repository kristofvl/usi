pdfLoc = "pdf/";
doiLoc = "http://api.crossref.org/works/";
doiLoc2 = "/transform/application/x-bibtex";
gscholarLoc = "http://scholar.google.com/scholar?as_q=";

function BibtexParser() {
	(this.pos = 0),
		(this.input = ""),
		(this.es = {}),
		(this.strings = {
			JAN: "January",
			FEB: "February",
			MAR: "March",
			APR: "April",
			MAY: "May",
			JUN: "June",
			JUL: "July",
			AUG: "August",
			SEP: "September",
			OCT: "October",
			NOV: "November",
			DEC: "December",
		}),
		(this.currentKey = ""),
		(this.currentEntry = ""),
		(this.setInput = function (a) {
			this.input = a;
		}),
		(this.isWhitespace = function (a) {
			return " " == a || "\r" == a || "\t" == a || "\n" == a;
		}),
		(this.match = function (a) {
			if (
				(this.skipWhitespace(),
				this.input.substring(this.pos, this.pos + a.length) != a)
			)
				throw (
					"Token mismatch, expected " +
					a +
					", found " +
					this.input.substring(this.pos)
				);
			(this.pos += a.length), this.skipWhitespace();
		}),
		(this.tryMatch = function (a) {
			return (
				this.skipWhitespace(),
				this.input.substring(this.pos, this.pos + a.length) == a
			);
		}),
		(this.skipWhitespace = function () {
			for (; this.isWhitespace(this.input[this.pos]); ) this.pos++;
			if ("%" == this.input[this.pos]) {
				for (; "\n" != this.input[this.pos]; ) this.pos++;
				this.skipWhitespace();
			}
		}),
		(this.value_braces = function () {
			var a = 0;
			this.match("{");
			for (var b = this.pos; ; ) {
				if ("}" == this.input[this.pos] && "\\" != this.input[this.pos - 1]) {
					if (!(a > 0)) {
						var c = this.pos;
						return this.match("}"), this.input.substring(b, c);
					}
					a--;
				} else if ("{" == this.input[this.pos]) a++;
				else if (this.pos == this.input.length - 1) throw "Unterminated value";
				this.pos++;
			}
		}),
		(this.value_quotes = function () {
			this.match('"');
			for (var a = this.pos; ; ) {
				if ('"' == this.input[this.pos] && "\\" != this.input[this.pos - 1]) {
					var b = this.pos;
					return this.match('"'), this.input.substring(a, b);
				}
				if (this.pos == this.input.length - 1)
					throw "Unterminated value:" + this.input.substring(a);
				this.pos++;
			}
		}),
		(this.single_value = function () {
			var a = this.pos;
			if (this.tryMatch("{")) return this.value_braces();
			if (this.tryMatch('"')) return this.value_quotes();
			return this.key();
		}),
		(this.value = function () {
			var a = [];
			for (a.push(this.single_value()); this.tryMatch("#"); )
				this.match("#"), a.push(this.single_value());
			return a.join("");
		}),
		(this.key = function () {
			for (var a = this.pos; ; ) {
				if (this.pos == this.input.length) throw "Runaway key";
				if (!this.input[this.pos].match("[a-zA-Z0-9_:\\./-]"))
					return this.input.substring(a, this.pos).toUpperCase();
				this.pos++;
			}
		}),
		(this.key_equals_value = function () {
			var a = this.key();
			if (this.tryMatch("=")) {
				this.match("=");
				var b = this.value();
				return [a, b];
			}
			throw (
				"... = value expected, equals sign missing:" +
				this.input.substring(this.pos)
			);
		}),
		(this.key_value_list = function () {
			var a = this.key_equals_value();
			for (
				this.es[this.currentEntry][a[0]] = a[1];
				this.tryMatch(",") && (this.match(","), !this.tryMatch("}"));

			)
				(a = this.key_equals_value()),
					(this.es[this.currentEntry][a[0]] = a[1]);
		}),
		(this.entry_body = function () {
			(this.currentEntry = this.key()),
				(this.es[this.currentEntry] = new Object()),
				this.match(","),
				this.key_value_list(),
				(this.es[this.currentEntry].EKEY = this.currentEntry);
		}),
		(this.directive = function () {
			return this.match("@"), "@" + this.key();
		}),
		(this.string = function () {
			var a = this.key_equals_value();
			this.strings[a[0].toUpperCase()] = a[1];
		}),
		(this.preamble = function () {
			this.value();
		}),
		(this.comment = function () {
			this.value();
		}),
		(this.entry = function () {
			this.entry_body();
		}),
		(this.btex = function () {
			for (; this.tryMatch("@"); ) {
				var a = this.directive().toUpperCase();
				this.match("{"),
					"@STRING" == a
						? this.string()
						: "@PREAMBLE" == a
							? this.preamble()
							: "@COMMENT" == a
								? this.comment()
								: this.entry(),
					this.match("}");
			}
		});
}

bibtex = function () {
	function if_has_a(fld, innerH, hRf, pre = "[", pst = "]") {
		if (Object.hasOwn(c.es[ff], fld)) {
			if (pre) yDiv.innerHTML += pre;
			var tSpan = document.createElement("a");
			tSpan.className = "btn";
			tSpan.innerHTML = innerH;
			if (hRf) tSpan.setAttribute("href", hRf);
			yDiv.appendChild(tSpan);
			if (pst) yDiv.innerHTML += pst;
		}
	}
	var bib = document.getElementById("bibtex_input");
	var a = bib.innerHTML;
	bib.remove();
	var bibct = document.getElementById("bt");
	var c = new BibtexParser();
	c.setInput(a), c.btex();
	for (var ff in c.es) {
		var yDiv = document.createElement("p");
		yDiv.className = "be";
		if (Object.hasOwn(c.es[ff], "Y")) {
			var ySpan = document.createElement("span");
			(ySpan.className = "y"), (ySpan.innerHTML = c.es[ff].Y);
			yDiv.appendChild(ySpan);
		} else {
			if (Object.hasOwn(c.es[ff], "TITLE")) {
				var tSpan = document.createElement("a");
				tSpan.className = "url";
				if (Object.hasOwn(c.es[ff], "DOI"))
					tSpan.setAttribute("href", "http://dx.doi.org/" + c.es[ff].DOI);
				tSpan.innerHTML = c.es[ff].TITLE;
				yDiv.appendChild(tSpan);
				yDiv.innerHTML += ", ";
			}
			if (Object.hasOwn(c.es[ff], "AUTHOR"))
				yDiv.innerHTML += c.es[ff].AUTHOR + ", ";
			if (Object.hasOwn(c.es[ff], "BOOKTITLE")) {
				yDiv.innerHTML += "In ";
				var tSpan = document.createElement("a");
				tSpan.className = "ttl";
				tSpan.innerHTML = c.es[ff].BOOKTITLE;
				if (Object.hasOwn(c.es[ff], "BOOKURL"))
					tSpan.setAttribute("href", c.es[ff].BOOKURL);
				yDiv.appendChild(tSpan);
				yDiv.innerHTML += ", ";
			}
			if (Object.hasOwn(c.es[ff], "JOURNAL")) {
				yDiv.innerHTML += "In ";
				var tSpan = document.createElement("a");
				(tSpan.className = "ttl"), (tSpan.innerHTML = c.es[ff].JOURNAL);
				if (Object.hasOwn(c.es[ff], "JOURNALURL"))
					tSpan.setAttribute("href", c.es[ff].JOURNALURL);
				yDiv.appendChild(tSpan);
				yDiv.innerHTML += ", ";
			}
			if (Object.hasOwn(c.es[ff], "VOLUME")) {
				yDiv.innerHTML += "vol." + c.es[ff].VOLUME;
				if (Object.hasOwn(c.es[ff], "NUMBER"))
					yDiv.innerHTML += "(" + c.es[ff].NUMBER + ")";
				else yDiv.innerHTML += ", ";
			}
			if (Object.hasOwn(c.es[ff], "ARCHIVEPREFIX"))
				yDiv.innerHTML += c.es[ff].ARCHIVEPREFIX + " ";
			if (Object.hasOwn(c.es[ff], "EPRINT"))
				yDiv.innerHTML += c.es[ff].EPRINT + ", ";
			if (Object.hasOwn(c.es[ff], "PAGES"))
				yDiv.innerHTML += "p." + c.es[ff].PAGES + ", ";
			if (Object.hasOwn(c.es[ff], "YEAR"))
				yDiv.innerHTML += c.es[ff].YEAR + ". ";
			if (Object.hasOwn(c.es[ff], "ABSTRACT")) {
				yDiv.innerHTML += "[";
				var tSpan = document.createElement("a");
				(tSpan.className = "abs"), (tSpan.innerHTML = "abstract");
				var ttip = document.createElement("span"),
					abs = document.createElement("span");
				ttip.className = "ttip";
				(abs.className = "abstract"), (abs.innerHTML = c.es[ff].ABSTRACT);
				ttip.appendChild(abs);
				tSpan.appendChild(ttip);
				yDiv.appendChild(tSpan);
				yDiv.innerHTML += "]";
			}
			if_has_a("EKEY", "pdf", pdfLoc + c.es[ff].EKEY.toLowerCase() + ".pdf");
			if_has_a("TITLE", "scholar", gscholarLoc + c.es[ff].TITLE);
			if_has_a("DOI", "bibtex", doiLoc + c.es[ff].DOI + doiLoc2);
			if (Object.hasOwn(c.es[ff], "NOTE")) {
				yDiv.innerHTML += " ";
				var tSpan = document.createElement("a");
				(tSpan.className = "note"), (tSpan.innerHTML = c.es[ff].NOTE);
				yDiv.appendChild(tSpan);
			}
		}
		bibct.appendChild(yDiv);
	}
};
